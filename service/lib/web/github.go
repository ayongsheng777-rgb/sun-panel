package web

import (
	"encoding/json"
	"io"
	"net/http"
	"net/url"
	"strconv"
	"time"
)

// GithubRepo GitHub 仓库简况
type GithubRepo struct {
	FullName    string `json:"full_name"`
	Name        string `json:"name"`
	Description string `json:"description"`
	HTMLURL     string `json:"html_url"`
	Homepage    string `json:"homepage"`
	Stars       int    `json:"stargazers_count"`
	Language    string `json:"language"`
	Topics      []string `json:"topics"`
}

// SearchGithub 调用 GitHub 公开 API 搜索仓库（无需鉴权，境内可访问 api.github.com）
func SearchGithub(query string, limit int) ([]GithubRepo, error) {
	if limit <= 0 || limit > 20 {
		limit = 6
	}
	url := "https://api.github.com/search/repositories?q=" + url.QueryEscape(query) + "&sort=stars&order=desc&per_page=" + strconv.Itoa(limit)
	req, err := http.NewRequest("GET", url, nil)
	if err != nil {
		return nil, err
	}
	req.Header.Set("Accept", "application/vnd.github+json")
	req.Header.Set("User-Agent", "sun-panel")
	client := &http.Client{Timeout: 12 * time.Second}
	resp, err := client.Do(req)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()
	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return nil, err
	}
	var parsed struct {
		Items []GithubRepo `json:"items"`
	}
	if err := json.Unmarshal(body, &parsed); err != nil {
		return nil, err
	}
	return parsed.Items, nil
}
