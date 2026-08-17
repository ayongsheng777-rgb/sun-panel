package ai

import (
	"bytes"
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"net/http"
	"os"
	"strings"
	"time"
)

// Provider AI 服务商
type Provider string

const (
	ProviderDeepSeek Provider = "deepseek"
	ProviderNvidia   Provider = "nvidia"
	ProviderCustom   Provider = "custom"
)

// Default base url
const (
	DefaultDeepSeekBaseURL = "https://api.deepseek.com"
	DefaultNvidiaBaseURL   = "https://integrate.api.nvidia.com/v1"
)

// ChatMessage 对话消息
type ChatMessage struct {
	Role    string `json:"role"`
	Content string `json:"content"`
}

// AIModel 模型元信息
type AIModel struct {
	Id            string `json:"id"`
	Name          string `json:"name"`
	Provider      string `json:"provider"`
	ContextLength int    `json:"contextLength,omitempty"`
	Available     bool   `json:"available,omitempty"`
}

// ModelTestResult 模型测速结果
type ModelTestResult struct {
	Model       string `json:"model"`
	Success     bool   `json:"success"`
	LatencyMs   int64  `json:"latencyMs"`
	FirstToken  int64  `json:"firstTokenMs,omitempty"`
	TotalMs     int64  `json:"totalMs,omitempty"`
	Error       string `json:"error,omitempty"`
	TestedAt    string `json:"testedAt"`
}

// AIProviderConfig 单个服务商配置（API Key 仅存服务端）
type AIProviderConfig struct {
	Provider Provider `json:"provider"`
	BaseURL  string   `json:"baseUrl"`
	APIKey   string   `json:"apiKey"`
	Model    string   `json:"model"`
	Enabled  bool     `json:"enabled"`
	Timeout  int      `json:"timeout"` // 毫秒
}

// AIConfig 全局 AI 搜索配置（仅服务端保存）
type AIConfig struct {
	Enabled         bool                        `json:"enabled"`
	DefaultProvider Provider                    `json:"defaultProvider"`
	Strategy        string                      `json:"strategy"` // auto | manual
	Providers       map[string]AIProviderConfig `json:"providers"`
}

// AIProviderAdapter 服务商适配器接口
type AIProviderAdapter interface {
	ListModels(ctx context.Context, cfg AIProviderConfig) ([]AIModel, error)
	Chat(ctx context.Context, cfg AIProviderConfig, messages []ChatMessage, wantJSON bool) (string, error)
	TestModel(ctx context.Context, cfg AIProviderConfig, model string) ModelTestResult
}

// OpenAICompatibleProvider 兼容 OpenAI 协议的服务商（DeepSeek / NVIDIA / 自定义）
type OpenAICompatibleProvider struct{}

func (OpenAICompatibleProvider) baseURL(cfg AIProviderConfig) string {
	u := strings.TrimRight(cfg.BaseURL, "/")
	if u == "" {
		u = DefaultDeepSeekBaseURL
	}
	return u
}

func (p OpenAICompatibleProvider) timeout(cfg AIProviderConfig) time.Duration {
	if cfg.Timeout > 0 {
		return time.Duration(cfg.Timeout) * time.Millisecond
	}
	return 15 * time.Second
}

func (p OpenAICompatibleProvider) ListModels(ctx context.Context, cfg AIProviderConfig) ([]AIModel, error) {
	req, err := http.NewRequestWithContext(ctx, http.MethodGet, p.baseURL(cfg)+"/models", nil)
	if err != nil {
		return nil, err
	}
	if cfg.APIKey != "" {
		req.Header.Set("Authorization", "Bearer "+cfg.APIKey)
	}
	client := &http.Client{Timeout: p.timeout(cfg)}
	resp, err := client.Do(req)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()
	body, _ := io.ReadAll(resp.Body)
	if resp.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("list models failed: %s", string(body))
	}
	var parsed struct {
		Data []struct {
			Id            string `json:"id"`
			ContextLength int    `json:"context_length"`
		} `json:"data"`
	}
	if err := json.Unmarshal(body, &parsed); err != nil {
		return nil, err
	}
	models := make([]AIModel, 0, len(parsed.Data))
	for _, m := range parsed.Data {
		models = append(models, AIModel{
			Id:            m.Id,
			Name:          m.Id,
			Provider:      string(cfg.Provider),
			ContextLength: m.ContextLength,
		})
	}
	return models, nil
}

func (p OpenAICompatibleProvider) chatWithFormat(ctx context.Context, cfg AIProviderConfig, messages []ChatMessage, wantJSON bool) (string, error) {
	payload := map[string]any{
		"model":       cfg.Model,
		"messages":    messages,
		"temperature": 0.2,
		"max_tokens": 800,
	}
	if wantJSON {
		payload["response_format"] = map[string]any{"type": "json_object"}
	}
	body, err := json.Marshal(payload)
	if err != nil {
		return "", err
	}
	req, err := http.NewRequestWithContext(ctx, http.MethodPost, p.baseURL(cfg)+"/chat/completions", bytes.NewReader(body))
	if err != nil {
		return "", err
	}
	req.Header.Set("Content-Type", "application/json")
	if cfg.APIKey != "" {
		req.Header.Set("Authorization", "Bearer "+cfg.APIKey)
	}
	client := &http.Client{Timeout: p.timeout(cfg)}
	resp, err := client.Do(req)
	if err != nil {
		return "", err
	}
	defer resp.Body.Close()
	respBody, _ := io.ReadAll(resp.Body)
	if resp.StatusCode != http.StatusOK {
		return "", fmt.Errorf("chat failed [%d]: %s", resp.StatusCode, string(respBody))
	}
	var parsed struct {
		Choices []struct {
			Message struct {
				Content string `json:"content"`
			} `json:"message"`
		} `json:"choices"`
	}
	if err := json.Unmarshal(respBody, &parsed); err != nil {
		return "", err
	}
	if len(parsed.Choices) == 0 {
		return "", errors.New("empty chat response")
	}
	return strings.TrimSpace(parsed.Choices[0].Message.Content), nil
}

func (p OpenAICompatibleProvider) Chat(ctx context.Context, cfg AIProviderConfig, messages []ChatMessage, wantJSON bool) (string, error) {
	out, err := p.chatWithFormat(ctx, cfg, messages, wantJSON)
	if err != nil && wantJSON {
		// 部分模型不支持 response_format，自动降级重试
		if strings.Contains(err.Error(), "response_format") || strings.Contains(err.Error(), "json_object") {
			return p.chatWithFormat(ctx, cfg, messages, false)
		}
	}
	return out, err
}

func (p OpenAICompatibleProvider) TestModel(ctx context.Context, cfg AIProviderConfig, model string) ModelTestResult {
	start := time.Now()
	res := ModelTestResult{Model: model, TestedAt: start.Format(time.RFC3339)}
	cfg.Model = model
	text, err := p.Chat(ctx, cfg, []ChatMessage{{Role: "user", Content: "Reply with OK"}}, false)
	elapsed := time.Since(start)
	res.LatencyMs = elapsed.Milliseconds()
	res.TotalMs = elapsed.Milliseconds()
	if err != nil {
		res.Success = false
		res.Error = err.Error()
		return res
	}
	res.Success = strings.TrimSpace(strings.ToUpper(text)) == "OK" || text != ""
	return res
}

// ProviderManager 服务商管理
type ProviderManager struct{}

func (ProviderManager) GetAdapter(cfg AIProviderConfig) AIProviderAdapter {
	// 所有兼容 OpenAI 协议的服务商统一实现
	return OpenAICompatibleProvider{}
}

func envDefault(key, def string) string {
	if v := os.Getenv(key); v != "" {
		return v
	}
	return def
}
