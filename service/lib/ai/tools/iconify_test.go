package tools

import (
	"strings"
	"testing"
)

// TestIconKeywordOf 关键词提取：域名主名优先，其次标题里的英文词
func TestIconKeywordOf(t *testing.T) {
	cases := []struct {
		title, rawURL, want string
	}{
		{"可灵AI", "https://klingai.com/", "klingai"},
		{"ChatGPT", "https://chat.openai.com/", "openai"},
		{"GitHub", "https://www.github.com/", "github"},
		{"某个中文站", "", "某个中文站"},
		{"Midjourney", "", "Midjourney"},
	}
	for _, c := range cases {
		got := IconKeywordOf(c.title, c.rawURL)
		if got != c.want {
			t.Errorf("IconKeywordOf(%q,%q) = %q, want %q", c.title, c.rawURL, got, c.want)
		}
	}
}

// TestNormalizeIconToken 归一化：小写并去掉分隔符
func TestNormalizeIconToken(t *testing.T) {
	if got := normalizeIconToken("GitHub-Icon"); got != "githubicon" {
		t.Errorf("normalizeIconToken = %q", got)
	}
	if got := normalizeIconToken("github_icon"); got != "githubicon" {
		t.Errorf("normalizeIconToken = %q", got)
	}
}

// TestSplitIconName 拆分 prefix:name
func TestSplitIconName(t *testing.T) {
	p, n := splitIconName("logos:github-icon")
	if p != "logos" || n != "github-icon" {
		t.Errorf("splitIconName = %q,%q", p, n)
	}
}

// TestPickIconifyIcon 真实调用 Iconify 检索（需要外网，取不到时跳过）
func TestPickIconifyIcon(t *testing.T) {
	if _, err := iconifySearch("github", 5); err != nil {
		t.Skipf("跳过联网用例：%v", err)
	}
	cases := []string{"github", "docker", "kling", "notion"}
	for _, kw := range cases {
		got, ok := PickIconifyIcon(kw)
		if !ok {
			t.Logf("关键词 %q 未匹配到图标（可能被判为不相关）", kw)
			continue
		}
		_, name := splitIconName(got)
		if !strings.Contains(normalizeIconToken(name), normalizeIconToken(kw)) {
			t.Errorf("关键词 %q 匹配到 %q，图标名不含关键词", kw, got)
		}
		t.Logf("关键词 %q -> %s", kw, got)
	}
}

// TestPickIconifyIconRejectsNoise 明显不相关的关键词不应乱配图标
func TestPickIconifyIconRejectsNoise(t *testing.T) {
	if _, err := iconifySearch("zzz", 5); err != nil {
		t.Skipf("跳过联网用例：%v", err)
	}
	if got, ok := PickIconifyIcon("qwertyuiopzxcvbnmmnbvcxz"); ok {
		t.Errorf("乱码关键词不应匹配到图标，但得到 %q", got)
	}
}
