package openapi

import (
	"net/http"
	"strings"

	"sun-panel/api/api_v1"

	"github.com/gin-gonic/gin"
)

// CorsMiddleware 允许浏览器插件跨域调用开放接口。
//
// 浏览器插件（Sun-Panel BE）运行在 chrome-extension:// 源下，带自定义
// token 请求头调用接口时，浏览器会先发一次 OPTIONS 预检。此前后端没有
// 注册任何 OPTIONS 处理器，Gin 直接返回 404，插件就报「连接失败」。
//
// 关键：必须挂在**全局**（Engine.Use）而不是分组上——分组中间件只对匹配到
// 该分组路由的请求生效，而 OPTIONS 预检匹配不到任何 POST 路由，
// 挂分组里根本不会执行，预检依旧 404。
//
// 安全说明：仅对 /openapi/ 前缀生效；不设置 Access-Control-Allow-Credentials，
// 不放行 Cookie；接口自身靠 token 请求头鉴权，跨域放行不会泄露登录态。
func CorsMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		if !strings.HasPrefix(c.Request.URL.Path, "/openapi/") {
			c.Next()
			return
		}
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
	// 跨域预检由全局中间件 CorsMiddleware 处理（见 A_ENTER.go），
	// 挂在这里对 OPTIONS 无效：预检匹配不到任何 POST 路由，分组中间件不会执行。
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
