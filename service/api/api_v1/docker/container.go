package docker

import (
	"strings"

	"sun-panel/api/api_v1/common/apiReturn"
	"sun-panel/biz"
	"sun-panel/global"
	dockerLib "sun-panel/lib/docker"

	"github.com/gin-gonic/gin"
	"github.com/gin-gonic/gin/binding"
)

// Container 容器管理接口。
//
// 安全约定：只开放"查看 + 启停重启"四个动作，不提供任意命令执行，
// 也不把 docker.sock 暴露给浏览器——所有操作都由后端代为完成。
type Container struct{}

// newClient 创建 Docker 客户端，套接字路径可在 conf.ini 的 [docker] socket_path 配置。
func newClient() *dockerLib.Client {
	socketPath := ""
	if global.Config != nil {
		socketPath = global.Config.GetValueStringOrDefault("docker", "socket_path")
	}
	return dockerLib.NewClient(socketPath)
}

// GetList 容器列表。
func (a Container) GetList(c *gin.Context) {
	if !biz.FeatureEnabled(biz.FeatureDocker) {
		apiReturn.ErrorNoAccess(c)
		return
	}

	client := newClient()
	if err := client.Ping(); err != nil {
		apiReturn.Error(c, "Docker daemon unavailable")
		return
	}

	all := strings.TrimSpace(c.Query("all")) != "0"
	list, err := client.ListContainers(all)
	if err != nil {
		apiReturn.Error(c, err.Error())
		return
	}
	apiReturn.SuccessData(c, gin.H{"list": list})
}

// GetContainerStates 批量查询容器状态，前端定时刷新用。
func (a Container) GetContainerStates(c *gin.Context) {
	if !biz.FeatureEnabled(biz.FeatureDocker) {
		apiReturn.ErrorNoAccess(c)
		return
	}

	param := struct {
		ContainerIds []string `json:"containerIds"`
	}{}
	_ = c.ShouldBindBodyWith(&param, binding.JSON)

	client := newClient()
	if err := client.Ping(); err != nil {
		apiReturn.Error(c, "Docker daemon unavailable")
		return
	}

	states := map[string]string{}
	for _, id := range param.ContainerIds {
		id = strings.TrimSpace(id)
		if id == "" {
			continue
		}
		info, err := client.GetContainerState(id)
		if err != nil {
			states[id] = "unknown"
			continue
		}
		states[id] = info.State
	}
	apiReturn.SuccessData(c, gin.H{"states": states})
}

// GetContainerIDByName 按容器名查 ID。
func (a Container) GetContainerIDByName(c *gin.Context) {
	if !biz.FeatureEnabled(biz.FeatureDocker) {
		apiReturn.ErrorNoAccess(c)
		return
	}

	param := struct {
		Name string `json:"name"`
	}{}
	if err := c.ShouldBindBodyWith(&param, binding.JSON); err != nil {
		apiReturn.ErrorParamFomat(c, err.Error())
		return
	}

	client := newClient()
	if err := client.Ping(); err != nil {
		apiReturn.Error(c, "Docker daemon unavailable")
		return
	}

	id, err := client.GetContainerIDByName(param.Name)
	if err != nil {
		apiReturn.Error(c, err.Error())
		return
	}
	apiReturn.SuccessData(c, gin.H{"containerId": id})
}

// ExecSwitchActionByContainerID 对容器执行 start / stop / restart。
func (a Container) ExecSwitchActionByContainerID(c *gin.Context) {
	if !biz.FeatureEnabled(biz.FeatureDocker) {
		apiReturn.ErrorNoAccess(c)
		return
	}

	param := struct {
		ContainerId string `json:"containerId"`
		Action      string `json:"action"`
	}{}
	if err := c.ShouldBindBodyWith(&param, binding.JSON); err != nil {
		apiReturn.ErrorParamFomat(c, err.Error())
		return
	}

	client := newClient()
	if err := client.Ping(); err != nil {
		apiReturn.Error(c, "Docker daemon unavailable")
		return
	}

	if err := client.ExecAction(param.ContainerId, param.Action); err != nil {
		apiReturn.Error(c, err.Error())
		return
	}
	apiReturn.Success(c)
}

// RestartContainer 重启容器。
func (a Container) RestartContainer(c *gin.Context) {
	if !biz.FeatureEnabled(biz.FeatureDocker) {
		apiReturn.ErrorNoAccess(c)
		return
	}

	param := struct {
		ContainerId string `json:"containerId"`
	}{}
	if err := c.ShouldBindBodyWith(&param, binding.JSON); err != nil {
		apiReturn.ErrorParamFomat(c, err.Error())
		return
	}

	client := newClient()
	if err := client.Ping(); err != nil {
		apiReturn.Error(c, "Docker daemon unavailable")
		return
	}

	if err := client.ExecAction(param.ContainerId, "restart"); err != nil {
		apiReturn.Error(c, err.Error())
		return
	}
	apiReturn.Success(c)
}
