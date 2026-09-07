package panel

import (
	"sun-panel/api/api_v1"
	"sun-panel/api/api_v1/middleware"

	"github.com/gin-gonic/gin"
)

// InitBackupRouter 备份与迁移，仅管理员可用。
func InitBackupRouter(router *gin.RouterGroup) {
	api := api_v1.ApiGroupApp.ApiPanel.BackupApi

	rAdmin := router.Group("", middleware.LoginInterceptor, middleware.AdminInterceptor)
	{
		rAdmin.POST("panel/backup/backup", api.Backup)
		rAdmin.POST("panel/backup/getList", api.GetList)
		rAdmin.POST("panel/backup/recovery", api.Recovery)
		rAdmin.POST("panel/backup/uploadZipFile", api.UploadZipFile)
		// 下载走 GET，浏览器可直接打开链接
		rAdmin.GET("panel/backup/downloadBackupZIPFile", api.DownloadBackupZIPFile)
	}
}
