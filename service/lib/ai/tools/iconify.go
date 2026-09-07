package tools

import (
	"encoding/json"
	"errors"
	"fmt"
	"net"
	"net/http"
	"net/url"
	"regexp"
	"strconv"
	"strings"
	"time"
)

// iconifySearchAPI Iconify 官方搜索接口。
// 当站点 favicon 抓不到时，用它按关键词在线检索图标作为兜底。
const iconifySearchAPI = "https://api.iconify.design/search"

// brandPrefixes 品牌 / 服务类图标集合：命中时加权，
// 这类集合里的图标更可能是站点自己的品牌标（如 logos:github-icon）。
var brandPrefixes = map[string]bool{
	"logos": true, "simple-icons": true, "devicon": true, "vscode-icons": true,
	"skill-icons": true, "cib": true, "fa6-brands": true, "arcticons": true,
	"thesvg": true, "thesvg-color": true, "token": true, "token-branded": true,
	"streamline-logos": true, "bxl": true,
}

// iconifyResponse 搜索响应（只取图标名列表）
type iconifyResponse struct {
	Icons []string `json:"icons"`
}

// iconifySearch 按关键词搜索图标，返回候选图标全名（prefix:name）
func iconifySearch(keyword string, limit int) ([]string, error) {
	keyword = strings.TrimSpace(keyword)
	if keyword == "" {
		return nil, errors.New("图标搜索关键词为空")
	}
	if limit <= 0 {
		limit = 64
	}
	reqURL := iconifySearchAPI + "?query=" + url.QueryEscape(keyword) + "&limit=" + strconv.Itoa(limit)
	client := &http.Client{Timeout: 12 * time.Second}
	resp, err := client.Get(reqURL)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()
	if resp.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("iconify 返回 HTTP %d", resp.StatusCode)
	}
	var out iconifyResponse
	if err := json.NewDecoder(resp.Body).Decode(&out); err != nil {
		return nil, err
	}
	return out.Icons, nil
}

// PickIconifyIcon 按关键词挑一个最匹配的图标，返回 Iconify 图标全名（prefix:name）。
//
// 纯字面匹配（不经过模型）：图标名与关键词各自归一化后按
// 完全相等 > 前缀匹配 > 包含 > 反包含 打分，品牌集合加权，
// 名称越短越优先（github 优于 github-fill）。得分过低视为没找到，
// 避免给卡片配上一个不相干的图标。
func PickIconifyIcon(keyword string) (string, bool) {
	icons, err := iconifySearch(keyword, 64)
	if err != nil || len(icons) == 0 {
		return "", false
	}
	key := normalizeIconToken(keyword)
	if key == "" {
		return "", false
	}
	best, bestScore := "", 0
	for _, full := range icons {
		prefix, name := splitIconName(full)
		n := normalizeIconToken(name)
		if n == "" {
			continue
		}
		score := 0
		switch {
		case n == key:
			score = 100
		case strings.HasPrefix(n, key):
			score = 80
		case strings.Contains(n, key):
			score = 60
		case strings.HasPrefix(key, n):
			score = 40
		}
		if score == 0 {
			continue
		}
		if brandPrefixes[prefix] {
			score += 15
		}
		// 名称越短越可能是正主
		bonus := 12 - len(n)/4
		if bonus > 0 {
			score += bonus
		}
		if score > bestScore {
			bestScore, best = score, full
		}
	}
	// 只有包含级以上的匹配才采纳，避免乱配
	if bestScore < 60 {
		return "", false
	}
	return best, true
}

// splitIconName 拆分 "prefix:name" 为前缀与名称
func splitIconName(full string) (string, string) {
	idx := strings.Index(full, ":")
	if idx <= 0 {
		return "", full
	}
	return full[:idx], full[idx+1:]
}

// normalizeIconToken 归一化：小写并去掉 - _ . 空格等分隔符
func normalizeIconToken(s string) string {
	s = strings.ToLower(strings.TrimSpace(s))
	replacer := strings.NewReplacer("-", "", "_", "", ".", "", " ", "")
	return replacer.Replace(s)
}

// alphaNumRe 提取英文/数字词（用于从标题里取可作为图标关键词的部分）
var alphaNumRe = regexp.MustCompile(`[A-Za-z0-9]+`)

// IconKeywordOf 从网址标题与网址里提取用于搜图标的关键词。
// 优先级：域名主名（如 klingai.com -> klingai）> 标题里最长的英文/数字词 > 标题原文。
// 中文标题直接用原文给 Iconify 通常搜不到，所以域名和英文词优先。
func IconKeywordOf(title, rawURL string) string {
	if kw := domainKeyword(rawURL); kw != "" {
		return kw
	}
	if kw := longestASCIIWord(title); kw != "" {
		return kw
	}
	return strings.TrimSpace(title)
}

// domainKeyword 取域名主名。
// 规则：去掉 www/m/app 等前缀段后，取**最长**的一段，平局取靠右的（主域名更靠后）。
// 例：chat.openai.com -> openai，www.github.com -> github，klingai.com -> klingai。
// 纯 IP 地址（内网面板常见）返回空，交给标题兜底。
func domainKeyword(rawURL string) string {
	u := strings.TrimSpace(rawURL)
	if u == "" {
		return ""
	}
	if !strings.Contains(u, "://") {
		u = "http://" + u
	}
	parsed, err := url.Parse(u)
	if err != nil || parsed.Host == "" {
		return ""
	}
	host := parsed.Hostname()
	if net.ParseIP(host) != nil {
		return ""
	}
	skip := map[string]bool{"www": true, "m": true, "app": true, "mobile": true}
	best := ""
	for _, p := range strings.Split(host, ".") {
		if p == "" || skip[p] {
			continue
		}
		if len(p) >= len(best) {
			best = p
		}
	}
	return best
}

// longestASCIIWord 取标题里最长的英文/数字词
func longestASCIIWord(s string) string {
	best := ""
	for _, w := range alphaNumRe.FindAllString(s, -1) {
		if len(w) > len(best) {
			best = w
		}
	}
	return best
}
