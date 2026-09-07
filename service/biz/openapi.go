package biz

import (
	"errors"
	"strings"
	"time"

	"sun-panel/global"
	"sun-panel/lib/cmn"
)

// errSystemSettingNotReady 系统设置缓存还没初始化完成。
var errSystemSettingNotReady = errors.New("system setting not initialized")

// SystemOpenApiConfig OpenAPI 配置在系统设置表中的键名。
const SystemOpenApiConfig = "openapi_config"

// OpenApiConfig OpenAPI 开关与令牌。
type OpenApiConfig struct {
	// Enabled 是否启用开放接口
	Enabled bool `json:"enabled"`
	// Token 调用接口时放在请求头 token 里的值
	Token string `json:"token"`
	// UserId 通过该令牌创建的卡片归属于哪个账号
	UserId uint `json:"userId"`
	// ApiUrl 面板对外地址，方便前端直接复制给浏览器插件
	ApiUrl string `json:"apiUrl"`
	// UpdatedAt 最近一次生成 / 变更时间
	UpdatedAt string `json:"updatedAt"`
}

// GetOpenApiConfig 读取 OpenAPI 配置，不存在时返回禁用状态。
func GetOpenApiConfig() (OpenApiConfig, error) {
	cfg := OpenApiConfig{}
	if err := global.SystemSetting.GetValueByInterface(SystemOpenApiConfig, &cfg); err != nil {
		return OpenApiConfig{}, err
	}
	return cfg, nil
}

// SaveOpenApiConfig 保存 OpenAPI 配置。
func SaveOpenApiConfig(cfg OpenApiConfig) error {
	if global.SystemSetting == nil {
		return errSystemSettingNotReady
	}
	return global.SystemSetting.Set(SystemOpenApiConfig, cfg)
}

// RefreshOpenApiToken 重新生成令牌并启用开放接口。
func RefreshOpenApiToken(userId uint, apiUrl string) (OpenApiConfig, error) {
	cfg := OpenApiConfig{
		Enabled:   true,
		Token:     cmn.BuildRandCode(32, cmn.RAND_CODE_MODE1),
		UserId:    userId,
		ApiUrl:    apiUrl,
		UpdatedAt: time.Now().Format("2006-01-02 15:04:05"),
	}
	if err := SaveOpenApiConfig(cfg); err != nil {
		return cfg, err
	}
	return cfg, nil
}

// SetOpenApiEnabled 启用 / 停用开放接口。
func SetOpenApiEnabled(enabled bool, userId uint, apiUrl string) (OpenApiConfig, error) {
	cfg, err := GetOpenApiConfig()
	if err != nil {
		// 还没生成过令牌，启用时顺手生成一个
		cfg = OpenApiConfig{UserId: userId, ApiUrl: apiUrl}
	}
	cfg.Enabled = enabled
	cfg.ApiUrl = apiUrl
	if cfg.UserId == 0 {
		cfg.UserId = userId
	}
	if cfg.Token == "" {
		cfg.Token = cmn.BuildRandCode(32, cmn.RAND_CODE_MODE1)
	}
	cfg.UpdatedAt = time.Now().Format("2006-01-02 15:04:05")

	if err := SaveOpenApiConfig(cfg); err != nil {
		return cfg, err
	}
	return cfg, nil
}

// VerifyOpenApiToken 校验令牌，通过则返回该令牌归属的账号 ID。
func VerifyOpenApiToken(token string) (uint, bool) {
	token = strings.TrimSpace(token)
	if token == "" {
		return 0, false
	}

	cfg, err := GetOpenApiConfig()
	if err != nil || !cfg.Enabled || cfg.Token == "" {
		return 0, false
	}
	if cfg.Token != token {
		return 0, false
	}
	if cfg.UserId == 0 {
		return 0, false
	}
	return cfg.UserId, true
}
