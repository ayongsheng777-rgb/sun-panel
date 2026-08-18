package web

import (
	"errors"
	"fmt"
	"net/http"
	"net/url"
	"strings"
	"sync"
	"time"

	"github.com/PuerkitoBio/goquery"
)

// Engine 一个搜索引擎实现
type Engine struct {
	Name string
	Fn   func(query string, limit int) ([]SearchResult, error)
}

// Engines 引擎优先级列表：必应中国（国内可达） → DuckDuckGo（备用）
func Engines() []Engine {
	return []Engine{
		{Name: "bing", Fn: SearchWeb},
		{Name: "duckduckgo", Fn: SearchDuckDuckGo},
	}
}

// SearchManager 分层降级搜索：按优先级逐个引擎尝试，任一成功即返回。
// 返回 (结果, 命中引擎名, error)。全部失败才返回 error，单引擎失败被隔离。
func SearchManager(query string, limit int) ([]SearchResult, string, error) {
	query = strings.TrimSpace(query)
	if query == "" {
		return nil, "", errors.New("搜索关键词为空")
	}
	var lastErr error
	for _, e := range Engines() {
		results, err := e.Fn(query, limit)
		if err == nil && len(results) > 0 {
			return results, e.Name, nil
		}
		if err != nil {
			lastErr = fmt.Errorf("%s: %w", e.Name, err)
		}
	}
	if lastErr == nil {
		lastErr = fmt.Errorf("所有搜索引擎都没有返回结果：%s", query)
	}
	return nil, "", lastErr
}

// SearchAggregate 并发聚合多引擎结果并按 URL 去重。
// 部分引擎失败会被隔离（记入 failed），只要有一个成功就不算失败。
func SearchAggregate(query string, limit int, total time.Duration) ([]SearchResult, []string, []string) {
	query = strings.TrimSpace(query)
	if query == "" {
		return nil, nil, []string{"搜索关键词为空"}
	}
	if total <= 0 {
		total = 20 * time.Second
	}
	engines := Engines()

	type out struct {
		name    string
		results []SearchResult
		err     error
	}
	ch := make(chan out, len(engines))
	var wg sync.WaitGroup
	for _, e := range engines {
		wg.Add(1)
		go func(e Engine) {
			defer wg.Done()
			defer func() {
				// 单引擎 panic 不影响整体
				if r := recover(); r != nil {
					ch <- out{name: e.Name, err: fmt.Errorf("panic: %v", r)}
				}
			}()
			rs, err := e.Fn(query, limit)
			ch <- out{name: e.Name, results: rs, err: err}
		}(e)
	}
	done := make(chan struct{})
	go func() { wg.Wait(); close(done) }()

	collected := make([]out, 0, len(engines))
	timer := time.NewTimer(total)
	defer timer.Stop()
loop:
	for i := 0; i < len(engines); i++ {
		select {
		case o := <-ch:
			collected = append(collected, o)
		case <-timer.C:
			break loop
		}
	}

	seen := map[string]bool{}
	merged := make([]SearchResult, 0, limit)
	okEngines := make([]string, 0, len(engines))
	failed := make([]string, 0, len(engines))
	for _, o := range collected {
		if o.err != nil || len(o.results) == 0 {
			msg := o.name + " 无结果"
			if o.err != nil {
				msg = o.name + ": " + o.err.Error()
			}
			failed = append(failed, msg)
			continue
		}
		okEngines = append(okEngines, o.name)
		for _, r := range o.results {
			key := strings.TrimRight(strings.ToLower(r.URL), "/")
			if key == "" || seen[key] {
				continue
			}
			seen[key] = true
			merged = append(merged, r)
		}
	}
	if limit > 0 && len(merged) > limit {
		merged = merged[:limit]
	}
	return merged, okEngines, failed
}

// SearchDuckDuckGo 用 DuckDuckGo 的 HTML 轻量端点搜索（无需 API Key）
func SearchDuckDuckGo(query string, limit int) ([]SearchResult, error) {
	if limit <= 0 || limit > 10 {
		limit = 5
	}
	endpoint := "https://html.duckduckgo.com/html/?q=" + url.QueryEscape(query)
	req, err := http.NewRequest(http.MethodGet, endpoint, nil)
	if err != nil {
		return nil, err
	}
	req.Header.Set("User-Agent", userAgent)
	req.Header.Set("Accept-Language", "zh-CN,zh;q=0.9,en;q=0.8")

	client := &http.Client{Timeout: 12 * time.Second}
	resp, err := client.Do(req)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()
	if resp.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("duckduckgo status %d", resp.StatusCode)
	}
	doc, err := goquery.NewDocumentFromReader(resp.Body)
	if err != nil {
		return nil, err
	}

	results := make([]SearchResult, 0, limit)
	doc.Find("div.result, div.web-result").EachWithBreak(func(_ int, s *goquery.Selection) bool {
		if len(results) >= limit {
			return false
		}
		a := s.Find("a.result__a").First()
		title := strings.TrimSpace(a.Text())
		href, _ := a.Attr("href")
		href = unwrapDDGLink(href)
		desc := strings.TrimSpace(s.Find(".result__snippet").First().Text())
		if title == "" || href == "" {
			return true
		}
		host := ""
		if u, err := url.Parse(href); err == nil {
			host = u.Host
		}
		results = append(results, SearchResult{Title: title, URL: href, Description: desc, Host: host})
		return true
	})
	if len(results) == 0 {
		return nil, fmt.Errorf("duckduckgo 无结果：%s", query)
	}
	return results, nil
}

// unwrapDDGLink DuckDuckGo 的跳转链接形如 //duckduckgo.com/l/?uddg=<encoded>
func unwrapDDGLink(href string) string {
	if href == "" {
		return ""
	}
	if strings.HasPrefix(href, "//") {
		href = "https:" + href
	}
	u, err := url.Parse(href)
	if err != nil {
		return href
	}
	if real := u.Query().Get("uddg"); real != "" {
		if dec, err := url.QueryUnescape(real); err == nil {
			return dec
		}
		return real
	}
	return href
}
