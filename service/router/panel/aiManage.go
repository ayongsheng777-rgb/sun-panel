package panel

import (
	"sun-panel/api/api_v1"
	"sun-panel/api/api_v1/middleware"

	"github.com/gin-gonic/gin"
)

// InitAiManage AI 自动维护网址路由（需登录鉴权，AI 仅增改、不提供删除）
func InitAiManage(router *gin.RouterGroup) {
	aiManage := api_v1.ApiGroupApp.ApiPanel.AiManage
	aiAgent := api_v1.ApiGroupApp.ApiPanel.AiAgent
	r := router.Group("", middleware.LoginInterceptor)
	{
		r.POST("/panel/ai/add-website", aiManage.AddWebsite)
		r.POST("/panel/ai/github-search", aiManage.GithubSearch)
		r.POST("/panel/ai/agent", aiAgent.Execute)
	}
}
