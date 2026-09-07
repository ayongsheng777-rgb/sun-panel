package openapi

import (
	"net/url"
	"strings"

	"sun-panel/api/api_v1/common/apiReturn"
	"sun-panel/api/api_v1/common/base"
	"sun-panel/biz"
	"sun-panel/global"

	"github.com/gin-gonic/gin"
	"github.com/gin-gonic/gin/binding"
)

// Manage 开放接口的开关与令牌管理（走普通登录鉴权 + 管理员权限）。
type Manage struct{}

// buildApiUrl 拼出插件要填的接口地址，前端展示用。
//
// 浏览器插件（Sun-Panel BE）要求 host 字段包含 /openapi/v1 路径
// （参考插件 i18n 文案 guideOpenAPI：「如果地址仅包含域名，还需加路径（路径示例：/openapi/v1）」）。
// 因此这里**不带 /api 前缀**，只保留 /openapi/v1，复制到插件里就能直接用。
func buildApiUrl(c *gin.Context) string {
	scheme := "http"
	host := c.Request.Host
	if host == "" {
		host = "127.0.0.1:3002"
	}
	if c.Request.TLS != nil || strings.EqualFold(c.GetHeader("X-Forwarded-Proto"), "https") {
		scheme = "https"
	}
	return scheme + "://" + host + "/openapi/v1"
}

// normalizeApiUrl 纠正历史遗留的错误地址。
//
// 早期版本把 /api 前缀也写进了存储值（形如 http://host/api/openapi/v1），
// 而插件要求的是根路径 /openapi/v1。存储值一旦落库就不会自动更新，
// 用户没点「刷新令牌」就一直拿到错地址。这里保留用户自定义的域名，
// 只把路径部分规范化成 /openapi/v1。
func normalizeApiUrl(raw string, fallback string) string {
	raw = strings.TrimSpace(raw)
	if raw == "" {
		return fallback
	}
	u, err := url.Parse(raw)
	if err != nil || u.Host == "" {
		return fallback
	}
	scheme := strings.ToLower(u.Scheme)
	if scheme == "" {
		scheme = "http"
	}
	return scheme + "://" + u.Host + "/openapi/v1"
}

// GetInfo 查看当前开放接口状态。
func (a Manage) GetInfo(c *gin.Context) {
	cfg, err := biz.GetOpenApiConfig()
	if err != nil {
		cfg = biz.OpenApiConfig{}
	}

	currentUser, _ := base.GetCurrentUserInfo(c)
	userId := cfg.UserId
	if userId == 0 {
		userId = currentUser.ID
	}

	apiUrl := normalizeApiUrl(cfg.ApiUrl, buildApiUrl(c))

	apiReturn.SuccessData(c, gin.H{
		"enabled":   cfg.Enabled,
		"token":     cfg.Token,
		"apiUrl":    apiUrl,
		"updatedAt": cfg.UpdatedAt,
	})
}

// RefreshToken 重新生成令牌（同时自动启用）。
func (a Manage) RefreshToken(c *gin.Context) {
	currentUser, _ := base.GetCurrentUserInfo(c)

	cfg, err := biz.RefreshOpenApiToken(currentUser.ID, buildApiUrl(c))
	if err != nil {
		apiReturn.ErrorDatabase(c, err.Error())
		return
	}
	global.Logger.Infof("OpenAPI 令牌已刷新：userId=%d", currentUser.ID)

	apiReturn.SuccessData(c, gin.H{
		"enabled":   cfg.Enabled,
		"token":     cfg.Token,
		"apiUrl":    normalizeApiUrl(cfg.ApiUrl, buildApiUrl(c)),
		"updatedAt": cfg.UpdatedAt,
	})
}

// SetEnable 启用 / 停用开放接口。
func (a Manage) SetEnable(c *gin.Context) {
	param := struct {
		Enabled bool `json:"enabled"`
	}{}
	if err := c.ShouldBindBodyWith(&param, binding.JSON); err != nil {
		apiReturn.ErrorParamFomat(c, err.Error())
		return
	}

	currentUser, _ := base.GetCurrentUserInfo(c)
	cfg, err := biz.SetOpenApiEnabled(param.Enabled, currentUser.ID, buildApiUrl(c))
	if err != nil {
		apiReturn.ErrorDatabase(c, err.Error())
		return
	}

	apiReturn.SuccessData(c, gin.H{
		"enabled": cfg.Enabled,
		"token":   cfg.Token,
		"apiUrl":  normalizeApiUrl(cfg.ApiUrl, buildApiUrl(c)),
	})
}
