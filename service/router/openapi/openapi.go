package openapi

import (
	"sun-panel/api/api_v1"

	"github.com/gin-gonic/gin"
)

// Init 开放接口路由。
//
// 注意：这里挂在根路径（不带 /api 前缀），
// 因为官方浏览器插件要求的接口地址格式是 http://域名:端口/openapi/v1。
// 鉴权走请求头 token，不经过登录拦截器。
func Init(rootRouter *gin.RouterGroup) {
	itemApi := api_v1.ApiGroupApp.ApiOpenApi.Item
	groupApi := api_v1.ApiGroupApp.ApiOpenApi.ItemGroup
	versionApi := api_v1.ApiGroupApp.ApiOpenApi.Version

	v1 := rootRouter.Group("openapi/v1")
	{
		v1.POST("item/create", itemApi.Create)
		v1.POST("item/update", itemApi.Update)
		v1.POST("item/batchUpdate", itemApi.BatchUpdate)
		v1.POST("item/getInfoByOnlyName", itemApi.GetInfoByOnlyName)

		v1.POST("itemGroup/getList", groupApi.GetList)
		v1.POST("itemGroup/create", groupApi.Create)

		// 版本探测：浏览器插件「测试连接」必调
		v1.POST("version", versionApi.GetVersion)
	}
}
