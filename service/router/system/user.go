package system

import (
	"sun-panel/api/api_v1"
	"sun-panel/api/api_v1/middleware"

	"github.com/gin-gonic/gin"
)

func InitUserRouter(router *gin.RouterGroup) {
	api := api_v1.ApiGroupApp.ApiSystem.UserApi
	r := router.Group("", middleware.LoginInterceptor)
	r.POST("/user/getInfo", api.GetInfo)
	r.POST("/user/updatePassword", api.UpdatePasssword)
	r.POST("/user/updateInfo", api.UpdateInfo)
	r.POST("/user/getReferralCode", api.GetReferralCode)

	// OTP 双因素认证 + 设备管理（初版规格书第 9-13 章）
	loginApi := api_v1.ApiGroupApp.ApiSystem.LoginApi
	r.POST("/user/otp-status", loginApi.OtpStatus)
	r.POST("/user/otp-setup", loginApi.OtpSetup)
	r.POST("/user/otp-confirm", loginApi.OtpConfirm)
	r.POST("/user/otp-disable", loginApi.OtpDisable)
	r.GET("/user/devices", loginApi.DeviceList)
	r.DELETE("/user/devices/:id", loginApi.DeviceDelete)

	// 基础版权限清单（仅管理员可用，handler 内校验 role）
	r.POST("/user/admin/list", api.GetAdminUserList)
	r.POST("/user/admin/ai-permission", api.UpdateUserAiPermission)

	// 公开模式
	rPublic := router.Group("", middleware.PublicModeInterceptor)
	{
		rPublic.POST("/user/getAuthInfo", api.GetAuthInfo)
	}
}
