package openapi

import (
	"strings"

	"sun-panel/api/api_v1/common/apiReturn"
	"sun-panel/biz"

	"github.com/gin-gonic/gin"
)

// VersionApi 开放接口：版本号探测。
//
// 浏览器插件（Sun-Panel BE）在「测试连接」时会调这个接口，
// 拿到的 version 必须 ≥ 1.7.0 才认为插件与该面板版本兼容。
// 路径挂在根路径（不带 /api 前缀），鉴权走 OpenAPI token 头。
type VersionApi struct{}

// Info 浏览器插件期望的版本信息结构。
type Info struct {
	Version     string `json:"version"`
	VersionCode int    `json:"versionCode"`
}

// currentPanelVersion / currentPanelVersionCode 当前 Sun-Panel 自报版本。
// 插件按官方规则做版本判断，Version 必须 ≥ 1.7.0 才能让插件认为「支持测试连接」。
// 取一个看起来真实合理的版本号即可，versionCode 用数字便于按版本号比较。
const (
	currentPanelVersion     = "1.8.1"
	currentPanelVersionCode = 18001
)

// GetVersion 版本探测接口。
//
// token 有效则返 code 0 + 版本信息；无效返 1005 让插件显示「连接测试失败」。
// 不在这里做版本比较——版本比较由插件前端自己做。
func (a VersionApi) GetVersion(c *gin.Context) {
	token := strings.TrimSpace(c.GetHeader("token"))
	if token == "" {
		token = strings.TrimSpace(c.GetHeader("Token"))
	}
	if token == "" {
		apiReturn.ErrorByCode(c, 1005)
		return
	}

	if _, ok := biz.VerifyOpenApiToken(token); !ok {
		apiReturn.ErrorByCode(c, 1005)
		return
	}

	apiReturn.SuccessData(c, Info{
		Version:     currentPanelVersion,
		VersionCode: currentPanelVersionCode,
	})
}
