package ai

import (
	"encoding/json"
	"os"
	"strconv"

	"sun-panel/global"
	"sun-panel/models"
)

// ConfigName moduleConfig 中保存 AI 配置的名称
const ConfigName = "aiSearchConfig"

func envBool(key string, def bool) bool {
	if v := os.Getenv(key); v != "" {
		b, err := strconv.ParseBool(v)
		if err == nil {
			return b
		}
	}
	return def
}

func envInt(key string, def int) int {
	if v := os.Getenv(key); v != "" {
		if n, err := strconv.Atoi(v); err == nil {
			return n
		}
	}
	return def
}

// DefaultConfig 基于环境变量生成默认配置（API Key 仅来自服务端环境变量）
func DefaultConfig() AIConfig {
	return AIConfig{
		Enabled:         envBool("AI_SEARCH_ENABLED", false),
		DefaultProvider: Provider(envDefault("AI_DEFAULT_PROVIDER", string(ProviderDeepSeek))),
		Strategy:        "auto",
		Providers: map[string]AIProviderConfig{
			string(ProviderOpenAI): {
				Provider: ProviderOpenAI,
				BaseURL:  envDefault("OPENAI_BASE_URL", DefaultOpenAIBaseURL),
				APIKey:   os.Getenv("OPENAI_API_KEY"),
				Enabled:  false,
				Timeout:  envInt("AI_SEARCH_TIMEOUT", 8000),
			},
			string(ProviderDeepSeek): {
				Provider: ProviderDeepSeek,
				BaseURL:  envDefault("DEEPSEEK_BASE_URL", DefaultDeepSeekBaseURL),
				APIKey:   os.Getenv("DEEPSEEK_API_KEY"),
				Enabled:  true,
				Timeout:  envInt("AI_SEARCH_TIMEOUT", 8000),
			},
			string(ProviderNvidia): {
				Provider: ProviderNvidia,
				BaseURL:  envDefault("NVIDIA_BASE_URL", DefaultNvidiaBaseURL),
				APIKey:   os.Getenv("NVIDIA_API_KEY"),
				Enabled:  true,
				Timeout:  envInt("AI_SEARCH_TIMEOUT", 8000),
			},
			string(ProviderGemini): {
				Provider: ProviderGemini,
				BaseURL:  envDefault("GEMINI_BASE_URL", DefaultGeminiBaseURL),
				APIKey:   os.Getenv("GEMINI_API_KEY"),
				Enabled:  false,
				Timeout:  envInt("AI_SEARCH_TIMEOUT", 8000),
			},
		},
	}
}

// LoadConfig 读取用户配置（环境变量覆盖 key）
func LoadConfig(userId uint) AIConfig {
	cfg := DefaultConfig()
	val, err := (&models.ModuleConfig{}).GetConfigByUserIdAndName(global.Db, userId, ConfigName)
	if err == nil && val != nil {
		if b, ok := val["enabled"].(bool); ok {
			cfg.Enabled = b
		}
		if s, ok := val["defaultProvider"].(string); ok && s != "" {
			cfg.DefaultProvider = Provider(s)
		}
		if s, ok := val["strategy"].(string); ok && s != "" {
			cfg.Strategy = s
		}
		if s, ok := val["backupProvider"].(string); ok && s != "" {
			cfg.BackupProvider = Provider(s)
		}
		if pm, ok := val["providers"].(map[string]interface{}); ok {
			for k, v := range pm {
				b, _ := json.Marshal(v)
				var pc AIProviderConfig
				if json.Unmarshal(b, &pc) == nil {
					cfg.Providers[k] = pc
				}
			}
		}
	}
	// 环境变量可覆盖 key（避免明文入库时缺失）
	if k := os.Getenv("OPENAI_API_KEY"); k != "" {
		p := cfg.Providers[string(ProviderOpenAI)]
		p.APIKey = k
		cfg.Providers[string(ProviderOpenAI)] = p
	}
	if k := os.Getenv("DEEPSEEK_API_KEY"); k != "" {
		p := cfg.Providers[string(ProviderDeepSeek)]
		p.APIKey = k
		cfg.Providers[string(ProviderDeepSeek)] = p
	}
	if k := os.Getenv("NVIDIA_API_KEY"); k != "" {
		p := cfg.Providers[string(ProviderNvidia)]
		p.APIKey = k
		cfg.Providers[string(ProviderNvidia)] = p
	}
	if k := os.Getenv("GEMINI_API_KEY"); k != "" {
		p := cfg.Providers[string(ProviderGemini)]
		p.APIKey = k
		cfg.Providers[string(ProviderGemini)] = p
	}
	return cfg
}

// SaveConfig 持久化用户配置
func SaveConfig(userId uint, cfg AIConfig) error {
	val := map[string]interface{}{
		"enabled":         cfg.Enabled,
		"defaultProvider": string(cfg.DefaultProvider),
		"backupProvider":  string(cfg.BackupProvider),
		"strategy":        cfg.Strategy,
		"providers":       cfg.Providers,
	}
	mc := models.ModuleConfig{UserId: userId, Name: ConfigName, Value: val}
	return mc.Save(global.Db)
}
