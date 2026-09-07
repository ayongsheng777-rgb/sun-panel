package panel

import (
	"sun-panel/api/api_v1"
	"sun-panel/api/api_v1/middleware"

	"github.com/gin-gonic/gin"
)

// InitPublicGalleryRouter 公共图库：所有登录账号可读，仅管理员可维护。
func InitPublicGalleryRouter(router *gin.RouterGroup) {
	api := api_v1.ApiGroupApp.ApiPanel.PublicGalleryApi

	rLogin := router.Group("", middleware.LoginInterceptor)
	{
		rLogin.POST("panel/publicGallery/getImagesList", api.GetImagesList)
	}

	rAdmin := router.Group("", middleware.LoginInterceptor, middleware.AdminInterceptor)
	{
		rAdmin.POST("panel/publicGallery/uploadImg", api.UploadImg)
		rAdmin.POST("panel/publicGallery/deletes", api.Deletes)
		rAdmin.POST("panel/publicGallery/updateFileType", api.UpdateFileType)
	}
}
