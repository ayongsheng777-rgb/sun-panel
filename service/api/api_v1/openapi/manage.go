package openapi

import (
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
func buildApiUrl(c *gin.Context) string {
	scheme := "http"
	host := c.Request.Host
	if host == "" {
		host = "127.0.0.1:3002"
	}
	if c.Request.TLS != nil || strings.EqualFold(c.GetHeader("X-Forwarded-Proto"), "https") {
		scheme = "https"
	}
	return scheme + "://" + host + "/api/openapi/v1"
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

	apiUrl := cfg.ApiUrl
	if apiUrl == "" {
		apiUrl = buildApiUrl(c)
	}

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
		"apiUrl":    cfg.ApiUrl,
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
		"apiUrl":  cfg.ApiUrl,
	})
}
