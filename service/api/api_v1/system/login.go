package system

import (
	"strconv"
	"strings"
	"time"
	"sun-panel/api/api_v1/common/apiReturn"
	"sun-panel/api/api_v1/common/base"
	"sun-panel/global"
	"sun-panel/lib/cmn"
	"sun-panel/lib/cmn/systemSetting"
	"sun-panel/lib/otp"
	"sun-panel/models"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"gorm.io/gorm"
)

type LoginApi struct {
}

// 登录输入验证
type LoginLoginVerify struct {
	Username    string `json:"username" validate:"required"`
	Password    string `json:"password" validate:"required,max=50"`
	VCode       string `json:"vcode" validate:"max=6"`
	Email       string `json:"email"`
	Otp         string `json:"otp"`         // 动态验证码（已绑定 OTP 时必填）
	DeviceId    string `json:"deviceId"`    // 设备指纹，用于「信任此设备」
	TrustDevice bool   `json:"trustDevice"` // 是否信任此设备（30 天免 OTP）
}

// @Summary 登录账号
// @Accept application/json
// @Produce application/json
// @Param LoginLoginVerify body LoginLoginVerify true "登陆验证信息"
// @Tags user
// @Router /login [post]
func (l LoginApi) Login(c *gin.Context) {
	param := LoginLoginVerify{}
	if err := c.ShouldBindJSON(&param); err != nil {
		apiReturn.ErrorParamFomat(c, err.Error())
		return
	}

	if errMsg, err := base.ValidateInputStruct(param); err != nil {
		apiReturn.ErrorParamFomat(c, errMsg)
		return
	}

	settings := systemSetting.ApplicationSetting{}
	global.SystemSetting.GetValueByInterface("system_application", &settings)

	mUser := models.User{}
	param.Username = strings.TrimSpace(param.Username)
	info, err := mUser.GetUserInfoByUsernameAndPassword(param.Username, cmn.PasswordEncryption(param.Password))
	if err != nil {
		if err == gorm.ErrRecordNotFound {
			apiReturn.ErrorByCode(c, 1003)
			return
		}
		apiReturn.Error(c, err.Error())
		return
	}

	// 停用或未激活
	if info.Status != 1 {
		apiReturn.ErrorByCode(c, 1004)
		return
	}

	// ===== OTP 双因素认证（强制所有账号）=====
	if info.OtpEnabled {
		// 受信任设备：30 天内免动态码
		if param.DeviceId != "" && isTrustedDevice(info.ID, param.DeviceId) {
			issueSession(c, &mUser, &info, param.DeviceId, param.TrustDevice)
			return
		}
		if strings.TrimSpace(param.Otp) == "" {
			apiReturn.ErrorCode(c, 1008, "需要输入动态验证码", nil)
			return
		}
		if !otp.VerifyTOTP(info.OtpSecret, param.Otp, time.Now()) {
			apiReturn.ErrorCode(c, 1009, "动态验证码错误", nil)
			return
		}
		issueSession(c, &mUser, &info, param.DeviceId, param.TrustDevice)
		return
	}

	// 尚未绑定 OTP：首次登录强制引导绑定
	if info.OtpSecret == "" {
		info.OtpSecret = otp.GenerateSecret()
		mUser.UpdateUserInfoByUserId(info.ID, map[string]interface{}{"otp_secret": info.OtpSecret})
	}
	bindToken := otp.IssueBindToken(info.ID)
	otpAuth := otp.BuildOtpAuthURL("Sun-Panel", info.Username, info.OtpSecret)
	// 暂不下发正式会话，前端扫码绑定后再换取
	apiReturn.SuccessData(c, gin.H{
		"needBind":  true,
		"bindToken": bindToken,
		"otpAuth":   otpAuth,
		"username":  info.Username,
	})
}

// issueSession 生成并下发会话 token（cToken），按需记录受信任设备
func issueSession(c *gin.Context, mUser *models.User, info *models.User, deviceId string, trustDevice bool) {
	bToken := info.Token
	if info.Token == "" {
		buildTokenOver := false
		for !buildTokenOver {
			bToken = cmn.BuildRandCode(32, cmn.RAND_CODE_MODE2)
			if _, err := mUser.GetUserInfoByToken(bToken); err != nil {
				mUser.UpdateUserInfoByUserId(info.ID, map[string]interface{}{"token": bToken})
				buildTokenOver = true
			}
		}
		info.Token = bToken
	}
	info.Password = ""
	info.ReferralCode = ""

	cToken := uuid.NewString() + "-" + cmn.Md5(cmn.Md5("userId"+strconv.Itoa(int(info.ID))))
	global.CUserToken.SetDefault(cToken, bToken)

	// 信任此设备：写入受信任设备表（30 天）
	if trustDevice && deviceId != "" {
		storeTrustedDevice(info.ID, deviceId, c)
	}

	c.Set("userInfo", *info)
	info.Token = cToken // 重要 采用cToken,隐藏真实token
	apiReturn.SuccessData(c, info)
}

// 安全退出
func (l *LoginApi) Logout(c *gin.Context) {
	cToken := c.GetHeader("token")
	global.CUserToken.Delete(cToken)
	apiReturn.Success(c)
}
