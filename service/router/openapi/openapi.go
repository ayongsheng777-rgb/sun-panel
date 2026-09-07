package openapi

import (
	"net/http"

	"sun-panel/api/api_v1"

	"github.com/gin-gonic/gin"
)

// corsMiddleware 允许浏览器插件跨域调用开放接口。
//
// 浏览器插件（Sun-Panel BE）运行在 chrome-extension:// 源下，带自定义
// token 请求头调用接口时，浏览器会先发一次 OPTIONS 预检。此前后端没有
// 注册任何 OPTIONS 处理器，Gin 直接返回 404，插件就报「连接失败」。
//
// 安全说明：不设置 Access-Control-Allow-Credentials，不放行 Cookie；
// 接口自身靠 token 请求头鉴权，跨域放行不会泄露登录态。
func corsMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		origin := c.GetHeader("Origin")
		if origin == "" {
			origin = "*"
		}
		c.Header("Access-Control-Allow-Origin", origin)
		c.Header("Vary", "Origin")
		c.Header("Access-Control-Allow-Methods", "POST, GET, OPTIONS")
		c.Header("Access-Control-Allow-Headers", "Content-Type, token, Token, Authorization")
		c.Header("Access-Control-Max-Age", "86400")

		if c.Request.Method == http.MethodOptions {
			c.AbortWithStatus(http.StatusNoContent)
			return
		}
		c.Next()
	}
}

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
	// 必须在注册具体路由之前挂载，否则 OPTIONS 预检仍会 404
	v1.Use(corsMiddleware())
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
