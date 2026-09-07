package panel

import (
	"sun-panel/api/api_v1"
	"sun-panel/api/api_v1/middleware"

	"github.com/gin-gonic/gin"
)

// InitGlobalSettingRouter 站点全局设置：品牌信息 + 在线自定义 CSS/JS。
func InitGlobalSettingRouter(router *gin.RouterGroup) {
	api := api_v1.ApiGroupApp.ApiPanel.GlobalSettingApi

	// 品牌与自定义代码属于高危设置，仅管理员可改
	rAdmin := router.Group("", middleware.LoginInterceptor, middleware.AdminInterceptor)
	{
		rAdmin.POST("panel/globalSetting/getSiteStting", api.GetSiteStting)
		rAdmin.POST("panel/globalSetting/saveSiteStting", api.SaveSiteStting)
		rAdmin.POST("panel/globalSetting/uploadFaviconImage", api.UploadFaviconImage)
		rAdmin.POST("panel/globalSetting/uploadLoginBackgroundImage", api.UploadLoginBackgroundImage)
		rAdmin.POST("panel/globalSetting/getCustomStylePath", api.GetCustomStylePath)
		rAdmin.POST("panel/globalSetting/getCustomJsAndCssCode", api.GetCustomJsAndCssCode)
		rAdmin.POST("panel/globalSetting/saveCustomJsAndCssCode", api.SaveCustomJsAndCssCode)
	}

	// 开放接口管理
	openApi := api_v1.ApiGroupApp.ApiOpenApi.Manage
	rOpenApiAdmin := router.Group("", middleware.LoginInterceptor, middleware.AdminInterceptor)
	{
		rOpenApiAdmin.POST("panel/openApi/getInfo", openApi.GetInfo)
		rOpenApiAdmin.POST("panel/openApi/refreshToken", openApi.RefreshToken)
		rOpenApiAdmin.POST("panel/openApi/setEnable", openApi.SetEnable)
	}
}
