package tools

import (
	"net/http"
	"net/url"
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
