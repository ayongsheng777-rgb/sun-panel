package docker

import (
	"sun-panel/api/api_v1"
	"sun-panel/api/api_v1/middleware"

	"github.com/gin-gonic/gin"
)

// Init Docker 容器管理路由。
//
// 容器启停属于高危操作，全部要求登录 + 管理员权限；
// 后端只开放列表、状态、启停重启，不提供任意命令执行。
func Init(routerGroup *gin.RouterGroup) {
	containerApi := api_v1.ApiGroupApp.ApiDocker.Container

	rAdmin := routerGroup.Group("", middleware.LoginInterceptor, middleware.AdminInterceptor)
	{
		rAdmin.GET("docker/container/getList", containerApi.GetList)
		rAdmin.POST("docker/container/getContainerStates", containerApi.GetContainerStates)
		rAdmin.POST("docker/container/getContainerIDByName", containerApi.GetContainerIDByName)
		rAdmin.POST("docker/container/execSwitchActionByContainerID", containerApi.ExecSwitchActionByContainerID)
		rAdmin.POST("docker/container/restartContainer", containerApi.RestartContainer)
	}
}
