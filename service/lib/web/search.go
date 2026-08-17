package web

import (
	"fmt"
	"net/http"
	"net/url"
	"strings"
	"time"

	"github.com/PuerkitoBio/goquery"
)

// SearchResult 搜索结果（联网搜官网）
type SearchResult struct {
	Title       string `json:"title"`
	URL         string `json:"url"`
	Description string `json:"description"`
	Host        string `json:"host"`
}

const userAgent = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36"

// SearchWeb 用必应中国（cn.bing.com，国内可达）搜索，返回前 N 条真实结果。
// 解析 li.b_algo 结果块：h2>a 为标题+真实 URL，cite 为域名，p 为摘要。
func SearchWeb(query string, limit int) ([]SearchResult, error) {
	if limit <= 0 || limit > 10 {
		limit = 5
	}
	searchURL := "https://cn.bing.com/search?q=" + url.QueryEscape(query)
	req, err := http.NewRequest(http.MethodGet, searchURL, nil)
	if err != nil {
		return nil, err
	}
	req.Header.Set("User-Agent", userAgent)
	req.Header.Set("Accept-Language", "zh-CN,zh;q=0.9")

	client := &http.Client{Timeout: 15 * time.Second}
	resp, err := client.Do(req)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()
	if resp.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("search failed: status %d", resp.StatusCode)
	}

	doc, err := goquery.NewDocumentFromReader(resp.Body)
	if err != nil {
		return nil, err
	}

	results := make([]SearchResult, 0, limit)
	doc.Find("li.b_algo").Each(func(i int, s *goquery.Selection) {
		if len(results) >= limit {
			return
		}
		a := s.Find("h2 a").First()
		href, _ := a.Attr("href")
		title := strings.TrimSpace(a.Text())
		desc := strings.TrimSpace(s.Find("p").First().Text())
		if href == "" || title == "" {
			return
		}
		host := ""
		if u, err := url.Parse(href); err == nil {
			host = u.Host
		}
		results = append(results, SearchResult{
			Title:       title,
			URL:         href,
			Description: desc,
			Host:        host,
		})
	})

	if len(results) == 0 {
		return nil, fmt.Errorf("no search results for %q", query)
	}
	return results, nil
}
