package router

import (
	"os"
	"path/filepath"

	"sun-panel/biz"
	"sun-panel/global"
	"sun-panel/router/docker"
	"sun-panel/router/openapi"
	"sun-panel/router/openness"
	"sun-panel/router/panel"
	"sun-panel/router/system"

	"github.com/gin-gonic/gin"
)

// 初始化总路由
func InitRouters(addr string) error {
	router := gin.Default()
	// 开放接口的跨域预检必须挂在全局：OPTIONS 匹配不到任何 POST 路由，
	// 分组中间件不会执行，预检会一直 404（浏览器插件因此报连接失败）。
	router.Use(openapi.CorsMiddleware())
	rootRouter := router.Group("/")
	routerGroup := rootRouter.Group("api")

	// 接口
	system.Init(routerGroup)
	panel.Init(routerGroup)
	openness.Init(routerGroup)
	docker.Init(routerGroup)

	// 开放接口：挂在根路径，地址形如 http://域名:端口/openapi/v1
	openapi.Init(rootRouter)

	// 自定义 CSS / JS：改到 conf/custom 下，重新发版前端不会被清掉
	customDir := biz.CustomDir
	if _, err := biz.EnsureCustomDir(); err != nil {
		global.Logger.Errorf("自定义样式目录创建失败: %v", err)
	}
	if abs, err := filepath.Abs(customDir); err == nil {
		customDir = abs
	}
	_ = os.MkdirAll(customDir, 0755)

	// WEB文件服务
	{
		webPath := "./web"
		router.StaticFile("/", webPath+"/index.html")
		router.Static("/assets", webPath+"/assets")
		router.Static("/custom", customDir)
		router.StaticFile("/favicon.ico", webPath+"/favicon.ico")
		router.StaticFile("/favicon.svg", webPath+"/favicon.svg")
	}

	// 上传的文件
	sourcePath := global.Config.GetValueString("base", "source_path")
	router.Static(sourcePath[1:], sourcePath)

	global.Logger.Info("Sun-Panel is Started.  Listening and serving HTTP on ", addr)
	return router.Run(addr)
}
