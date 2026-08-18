package panel

import (
	"sun-panel/api/api_v1"
	"sun-panel/api/api_v1/middleware"

	"github.com/gin-gonic/gin"
)

func InitSearch(router *gin.RouterGroup) {
	search := api_v1.ApiGroupApp.ApiPanel.Search
	// AI 搜索属于用户功能，需登录鉴权（权限隔离）
	r := router.Group("", middleware.LoginInterceptor)
	{
		r.POST("/panel/search", search.Search)
		r.GET("/panel/ai/config", search.GetAIConfig)
		r.POST("/panel/ai/config", search.SaveAIConfig)
		r.GET("/panel/ai/models", search.ListModels)
		r.POST("/panel/ai/test", search.TestModels)
		r.POST("/panel/ai/auto-best", search.AutoBestModel)
	}
}
