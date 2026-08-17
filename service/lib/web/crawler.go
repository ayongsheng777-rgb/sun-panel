package web

import (
	"net/http"
	"net/url"
	"strings"
	"time"

	"github.com/PuerkitoBio/goquery"
)

// PageInfo 网页元信息（用于补全网址的标题/描述/图标）
type PageInfo struct {
	Title       string `json:"title"`
	Description string `json:"description"`
	Favicon     string `json:"favicon"`
}

// FetchPageInfo 抓取网页 <title>、<meta name=description>、<link rel=icon>。
// 任何失败都不返回 error（降级为空），由调用方兜底。
func FetchPageInfo(pageURL string) PageInfo {
	info := PageInfo{}
	req, err := http.NewRequest(http.MethodGet, pageURL, nil)
	if err != nil {
		return info
	}
	req.Header.Set("User-Agent", userAgent)
	req.Header.Set("Accept-Language", "zh-CN,zh;q=0.9")

	client := &http.Client{Timeout: 10 * time.Second}
	resp, err := client.Do(req)
	if err != nil {
		return info
	}
	defer resp.Body.Close()
	if resp.StatusCode != http.StatusOK {
		return info
	}

	doc, err := goquery.NewDocumentFromReader(resp.Body)
	if err != nil {
		return info
	}

	info.Title = strings.TrimSpace(doc.Find("title").First().Text())
	doc.Find("meta").Each(func(i int, s *goquery.Selection) {
		if info.Description != "" {
			return
		}
		if name, _ := s.Attr("name"); strings.EqualFold(name, "description") {
			if c, ok := s.Attr("content"); ok {
				info.Description = strings.TrimSpace(c)
			}
		}
	})
	doc.Find("link").Each(func(i int, s *goquery.Selection) {
		if info.Favicon != "" {
			return
		}
		if rel, _ := s.Attr("rel"); strings.Contains(strings.ToLower(rel), "icon") {
			if href, ok := s.Attr("href"); ok && href != "" {
				info.Favicon = ResolveURL(pageURL, href)
			}
		}
	})
	if info.Favicon == "" {
		if u, err := url.Parse(pageURL); err == nil {
			info.Favicon = u.Scheme + "://" + u.Host + "/favicon.ico"
		}
	}
	return info
}

// ResolveURL 把相对路径解析为绝对 URL
func ResolveURL(baseURL, ref string) string {
	if strings.HasPrefix(ref, "//") {
		return "https:" + ref
	}
	if strings.HasPrefix(ref, "http://") || strings.HasPrefix(ref, "https://") {
		return ref
	}
	u, err := url.Parse(baseURL)
	if err != nil {
		return ref
	}
	refURL, err := url.Parse(ref)
	if err != nil {
		return ref
	}
	return u.ResolveReference(refURL).String()
}
