package system

import (
	"time"

	"sun-panel/api/api_v1/common/apiReturn"
	"sun-panel/api/api_v1/common/base"
	"sun-panel/global"
	"sun-panel/lib/otp"
	"sun-panel/models"

	"github.com/gin-gonic/gin"
	"github.com/gin-gonic/gin/binding"
)

// isTrustedDevice 判断某设备是否处于信任期内
func isTrustedDevice(userId uint, deviceId string) bool {
	d := models.TrustedDevice{}
	err := global.Db.Where("user_id=? AND device_id=?", userId, deviceId).First(&d).Error
	if err != nil {
		return false
	}
	return d.IsValid()
}

// storeTrustedDevice 记录受信任设备（30 天）
func storeTrustedDevice(userId uint, deviceId string, c *gin.Context) {
	ua := c.Request.UserAgent()
	name := ua
	if len(name) > 100 {
		name = name[:100]
	}
	now := time.Now()
	d := models.TrustedDevice{}
	global.Db.Where("user_id=? AND device_id=?", userId, deviceId).First(&d)
	if d.ID == 0 {
		d = models.TrustedDevice{
			UserId:      userId,
			DeviceId:    deviceId,
			Name:        name,
			Browser:     ua,
			IP:          c.ClientIP(),
			TrustedUntil: now.Add(30 * 24 * time.Hour),
		}
		global.Db.Create(&d)
	} else {
		d.TrustedUntil = now.Add(30 * 24 * time.Hour)
		d.IP = c.ClientIP()
		global.Db.Save(&d)
	}
}

// OtpBind 首次登录绑定 OTP：校验动态码，开启 OTP 后下发正式会话
func (l LoginApi) OtpBind(c *gin.Context) {
	var req struct {
		BindToken string `json:"bindToken"`
		Otp       string `json:"otp"`
		DeviceId  string `json:"deviceId"`
	}
	if err := c.ShouldBindBodyWith(&req, binding.JSON); err != nil {
		apiReturn.ErrorParamFomat(c, err.Error())
		return
	}
	userId, ok := otp.ConsumeBindToken(req.BindToken)
	if !ok {
		apiReturn.ErrorCode(c, 1010, "绑定凭证已失效，请重新登录", nil)
		return
	}
	mUser := models.User{}
	info, err := mUser.GetUserInfoByUid(userId)
	if err != nil {
		apiReturn.ErrorDataNotFound(c)
		return
	}
	if !otp.VerifyTOTP(info.OtpSecret, req.Otp, time.Now()) {
		apiReturn.ErrorCode(c, 1009, "动态验证码错误", nil)
		return
	}
	// 开启 OTP
	mUser.UpdateUserInfoByUserId(info.ID, map[string]interface{}{"otp_enabled": 1})
	info.OtpEnabled = true
	issueSession(c, &mUser, &info, req.DeviceId, false)
}

// OtpStatus 查询当前用户 OTP 是否已开启
func (l LoginApi) OtpStatus(c *gin.Context) {
	userInfo, _ := base.GetCurrentUserInfo(c)
	apiReturn.SuccessData(c, gin.H{"enabled": userInfo.OtpEnabled})
}

// OtpSetup 已登录用户发起 OTP 绑定：生成密钥并返回 otpauth URI
func (l LoginApi) OtpSetup(c *gin.Context) {
	userInfo, _ := base.GetCurrentUserInfo(c)
	mUser := models.User{}
	info, err := mUser.GetUserInfoByUid(userInfo.ID)
	if err != nil {
		apiReturn.ErrorDataNotFound(c)
		return
	}
	if info.OtpSecret == "" {
		info.OtpSecret = otp.GenerateSecret()
		mUser.UpdateUserInfoByUserId(info.ID, map[string]interface{}{"otp_secret": info.OtpSecret})
	}
	otpAuth := otp.BuildOtpAuthURL("Sun-Panel", info.Username, info.OtpSecret)
	apiReturn.SuccessData(c, gin.H{"otpAuth": otpAuth, "enabled": info.OtpEnabled})
}

// OtpConfirm 确认 OTP 绑定（输入正确动态码后开启）
func (l LoginApi) OtpConfirm(c *gin.Context) {
	var req struct {
		Otp string `json:"otp"`
	}
	if err := c.ShouldBindBodyWith(&req, binding.JSON); err != nil {
		apiReturn.ErrorParamFomat(c, err.Error())
		return
	}
	userInfo, _ := base.GetCurrentUserInfo(c)
	mUser := models.User{}
	info, err := mUser.GetUserInfoByUid(userInfo.ID)
	if err != nil {
		apiReturn.ErrorDataNotFound(c)
		return
	}
	if !otp.VerifyTOTP(info.OtpSecret, req.Otp, time.Now()) {
		apiReturn.ErrorCode(c, 1009, "动态验证码错误", nil)
		return
	}
	mUser.UpdateUserInfoByUserId(info.ID, map[string]interface{}{"otp_enabled": 1})
	apiReturn.Success(c)
}

// OtpDisable 关闭 OTP
func (l LoginApi) OtpDisable(c *gin.Context) {
	userInfo, _ := base.GetCurrentUserInfo(c)
	mUser := models.User{}
	if err := mUser.UpdateUserInfoByUserId(userInfo.ID, map[string]interface{}{
		"otp_enabled": 0,
		"otp_secret":  "",
	}); err != nil {
		apiReturn.ErrorDatabase(c, err.Error())
		return
	}
	apiReturn.Success(c)
}

// DeviceList 列出受信任设备
func (l LoginApi) DeviceList(c *gin.Context) {
	userInfo, _ := base.GetCurrentUserInfo(c)
	var list []models.TrustedDevice
	if err := global.Db.Where("user_id=?", userInfo.ID).Order("created_at desc").Find(&list).Error; err != nil {
		apiReturn.ErrorDatabase(c, err.Error())
		return
	}
	apiReturn.SuccessData(c, list)
}

// DeviceDelete 撤销某受信任设备（踢下线）
func (l LoginApi) DeviceDelete(c *gin.Context) {
	id := c.Param("id")
	userInfo, _ := base.GetCurrentUserInfo(c)
	if err := global.Db.Where("user_id=? AND id=?", userInfo.ID, id).Delete(&models.TrustedDevice{}).Error; err != nil {
		apiReturn.ErrorDatabase(c, err.Error())
		return
	}
	apiReturn.Success(c)
}
