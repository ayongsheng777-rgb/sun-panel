package tools

import (
	"net/http"
	"net/url"
	"regexp"
	"strings"
	"time"
)

// IsSafeHTTPURL 基础链接校验：必须 http/https 且带 host。
// 不做私网拦截——导航面板本身就允许局域网/NAS 地址。
func IsSafeHTTPURL(raw string) bool {
	raw = strings.TrimSpace(raw)
	if raw == "" {
		return false
	}
	u, err := url.Parse(raw)
	if err != nil {
		return false
	}
	if u.Scheme != "http" && u.Scheme != "https" {
		return false
	}
	if strings.TrimSpace(u.Host) == "" {
		return false
	}
	return true
}

// NormalizeURL 补全协议头（用户/模型常给出裸域名）
func NormalizeURL(raw string) string {
	raw = strings.TrimSpace(raw)
	if raw == "" {
		return ""
	}
	if strings.HasPrefix(raw, "http://") || strings.HasPrefix(raw, "https://") {
		return raw
	}
	if strings.HasPrefix(raw, "//") {
		return "https:" + raw
	}
	return "https://" + raw
}

// URLReachable 轻量可达性探测：HEAD 失败再试 GET，任一 <500 视为可达。
// 网络异常一律返回 false，但调用方不应因此阻断（仅作提示）。
func URLReachable(rawURL string, timeout time.Duration) bool {
	if !IsSafeHTTPURL(rawURL) {
		return false
	}
	if timeout <= 0 {
		timeout = 6 * time.Second
	}
	client := &http.Client{
		Timeout: timeout,
		CheckRedirect: func(req *http.Request, via []*http.Request) error {
			if len(via) >= 5 {
				return http.ErrUseLastResponse
			}
			return nil
		},
	}
	for _, method := range []string{http.MethodHead, http.MethodGet} {
		req, err := http.NewRequest(method, rawURL, nil)
		if err != nil {
			continue
		}
		req.Header.Set("User-Agent", "Mozilla/5.0 (compatible; SunPanelBot/1.0)")
		resp, err := client.Do(req)
		if err != nil {
			continue
		}
		_ = resp.Body.Close()
		if resp.StatusCode < 500 {
			return true
		}
	}
	return false
}

// TruncateRunes 按字符（而非字节）截断，中文安全
func TruncateRunes(s string, max int) string {
	r := []rune(s)
	if max <= 0 || len(r) <= max {
		return s
	}
	return string(r[:max]) + "…"
}

// ExtractURLs 从文本中提取所有网址：完整 http(s) 链接、裸域名、IPv4(可带端口)、局域网地址。
// 模型只会挑一个网址，这里在代码层把一条消息里的多个网址全部捞出来，用于批量收藏。
func ExtractURLs(text string) []string {
	var out []string
	seen := map[string]bool{}
	add := func(raw string) {
		u := NormalizeURL(strings.Trim(raw, "，。、）).,!?；;:：\"'“”' \t"))
		if u != "" && IsSafeHTTPURL(u) {
			if !seen[u] {
				seen[u] = true
				out = append(out, u)
			}
		}
	}
	// 1) 完整链接优先
	fullRe := regexp.MustCompile(`https?://[^\s，。、；！!?？（）()【】\[\]"'“”'<>]+`)
	for _, m := range fullRe.FindAllString(text, -1) {
		add(m)
	}
	cleaned := fullRe.ReplaceAllString(text, " ")
	// 2) 裸主机：域名 / IPv4[:port]（含局域网地址）
	tokenRe := regexp.MustCompile(`[^\s，。、；！!?？（）()【】\[\]"'“”'<>]+`)
	ipRe := regexp.MustCompile(`^(?:\d{1,3}\.){3}\d{1,3}(?::\d+)?(?:/[^\s]*)?$`)
	domainRe := regexp.MustCompile(`^(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}(?::\d+)?(?:/[^\s]*)?$`)
	for _, t := range tokenRe.FindAllString(cleaned, -1) {
		t = strings.Trim(t, "，。、）).,")
		if ipRe.MatchString(t) || domainRe.MatchString(t) {
			add(t)
		}
	}
	return out
}

// WantsBulkAdd 判断一条消息是否意在批量收藏多个网址。
// 触发条件：提取到 >=2 个网址，且（含收藏类意图词 / 几乎全是网址清单）。问句不自动加，避免误收藏。
func WantsBulkAdd(prompt string, urls []string) bool {
	if len(urls) < 2 {
		return false
	}
	if strings.ContainsAny(prompt, "？?") {
		return false
	}
	addKw := []string{"收藏", "添加", "保存", "加一下", "存", "这些", "以下", "网址", "链接", "导航", "面板", "都加", "全部加", "归", "整理", "加进"}
	for _, k := range addKw {
		if strings.Contains(prompt, k) {
			return true
		}
	}
	return len(urls) >= 3 // 一堆网址直接当清单
}
