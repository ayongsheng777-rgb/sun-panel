package system

import (
	"sun-panel/api/api_v1/common/apiData/systemApiStructs"
	"sun-panel/api/api_v1/common/apiReturn"
	"sun-panel/api/api_v1/common/base"
	"sun-panel/global"
	"sun-panel/lib/cmn"
	"sun-panel/models"

	"github.com/gin-gonic/gin"
	"github.com/gin-gonic/gin/binding"
)

type UserApi struct{}

func (a *UserApi) GetInfo(c *gin.Context) {
	userInfo, _ := base.GetCurrentUserInfo(c)
	apiReturn.SuccessData(c, gin.H{
		"userId":    userInfo.ID,
		"id":        userInfo.ID,
		"headImage": userInfo.HeadImage,
		"name":      userInfo.Name,
		"role":      userInfo.Role,
		// "token":     userInfo.Token,

	})
}

func (a *UserApi) GetAuthInfo(c *gin.Context) {
	userInfo, _ := base.GetCurrentUserInfo(c)
	visitMode := base.GetCurrentVisitMode(c)
	user := models.User{}
	user.ID = userInfo.ID
	user.HeadImage = userInfo.HeadImage
	user.Name = userInfo.Name
	user.Role = userInfo.Role
	user.Username = userInfo.Username
	user.AiAdmin = userInfo.AiAdmin
	apiReturn.SuccessData(c, gin.H{
		"user":      user,
		"visitMode": visitMode,
	})
}

// 修改资料
func (a *UserApi) UpdateInfo(c *gin.Context) {
	userInfo, _ := base.GetCurrentUserInfo(c)
	type UpdateUserInfoStruct struct {
		HeadImage string `json:"headImage"`
		Name      string `json:"name" validate:"max=15,min=3,required"`
	}
	params := UpdateUserInfoStruct{}

	err := c.ShouldBindBodyWith(&params, binding.JSON)
	if err != nil {
		apiReturn.ErrorParamFomat(c, err.Error())
		return
	}

	if errMsg, err := base.ValidateInputStruct(&params); err != nil {
		apiReturn.ErrorParamFomat(c, errMsg)
		return
	}

	mUser := models.User{}
	err = mUser.UpdateUserInfoByUserId(userInfo.ID, map[string]interface{}{
		"head_image": params.HeadImage,
		"name":       params.Name,
	})
	// 删除缓存
	global.UserToken.Delete(userInfo.Token)
	if err != nil {
		apiReturn.ErrorDatabase(c, err.Error())
	}
	apiReturn.Success(c)
}

// 修改密码
func (a *UserApi) UpdatePasssword(c *gin.Context) {
	type UpdatePasssStruct struct {
		OldPassword string `json:"oldPassword"`
		NewPassword string `json:"newPassword"`
	}

	params := UpdatePasssStruct{}

	err := c.ShouldBindBodyWith(&params, binding.JSON)
	if err != nil {
		apiReturn.ErrorParamFomat(c, err.Error())
		return
	}
	userInfo, _ := base.GetCurrentUserInfo(c)
	mUser := models.User{}
	if v, err := mUser.GetUserInfoByUid(userInfo.ID); err != nil {
		apiReturn.ErrorParamFomat(c, err.Error())
		return
	} else {
		if v.Password != cmn.PasswordEncryption(params.OldPassword) {
			// 旧密码不正确
			apiReturn.ErrorByCode(c, 1007)
			return
		}
	}
	res := global.Db.Model(&models.User{}).Where("id", userInfo.ID).Updates(map[string]interface{}{
		"password": cmn.PasswordEncryption(params.NewPassword),
		"token":    "",
	})
	if res.Error != nil {
		apiReturn.ErrorDatabase(c, res.Error.Error())
		return
	}
	// 删除token
	global.UserToken.Delete(userInfo.Token)
	apiReturn.Success(c)
}

// 获取推荐码
func (a *UserApi) GetReferralCode(c *gin.Context) {
	currentUserInfo, _ := base.GetCurrentUserInfo(c)
	mUser := models.User{}
	userInfo, err := mUser.GetUserInfoByUid(currentUserInfo.ID)
	if err != nil {
		apiReturn.ErrorDatabase(c, err.Error())
		return
	}

	// 为空生成一个
	if userInfo.ReferralCode == "" {
		for {
			referralCode := cmn.BuildRandCode(8, cmn.RAND_CODE_MODE2)
			global.Logger.Debug("referralCode:", referralCode)

			// 查询是否有重复的
			if row := global.Db.Find(&userInfo, "referral_code=?", referralCode).RowsAffected; row != 0 {
				apiReturn.ErrorDatabase(c, err.Error())
				continue
			}

			// 创建新的邀请码
			if err := global.Db.Model(&models.User{}).Where("id=?", userInfo.ID).Update("referral_code", referralCode).Error; err != nil {
				apiReturn.ErrorDatabase(c, err.Error())
				return
			} else {
				userInfo.ReferralCode = referralCode
				break
			}
		}
	}

	apiReturn.SuccessData(c, systemApiStructs.GetReferralCodeResp{ReferralCode: userInfo.ReferralCode})
}

// 基础版权限清单：列出所有账号及其 AI 管理员权限（仅管理员可访问）
func (a *UserApi) GetAdminUserList(c *gin.Context) {
	userInfo, _ := base.GetCurrentUserInfo(c)
	if userInfo.Role != 1 {
		apiReturn.ErrorNoAccess(c)
		return
	}
	// 确保管理员默认拥有 AI 管理权限（幂等）
	global.Db.Model(&models.User{}).Where("role = ? AND ai_admin = ?", 1, 0).Update("ai_admin", 1)

	var users []models.User
	if err := global.Db.Order("id asc").Find(&users).Error; err != nil {
		apiReturn.ErrorDatabase(c, err.Error())
		return
	}
	list := make([]gin.H, 0, len(users))
	for _, u := range users {
		list = append(list, gin.H{
			"id":         u.ID,
			"username":   u.Username,
			"name":       u.Name,
			"role":       u.Role,
			"aiAdmin":    u.AiAdmin,
			"otpEnabled": u.OtpEnabled,
		})
	}
	apiReturn.SuccessData(c, list)
}

// 切换某个账号的 AI 管理员权限（仅管理员可访问）
func (a *UserApi) UpdateUserAiPermission(c *gin.Context) {
	userInfo, _ := base.GetCurrentUserInfo(c)
	if userInfo.Role != 1 {
		apiReturn.ErrorNoAccess(c)
		return
	}
	var req struct {
		UserId  uint `json:"userId"`
		AiAdmin bool `json:"aiAdmin"`
	}
	if err := c.ShouldBindBodyWith(&req, binding.JSON); err != nil {
		apiReturn.ErrorParamFomat(c, err.Error())
		return
	}
	if req.UserId == 0 {
		apiReturn.ErrorParamFomat(c, "userId 不能为空")
		return
	}
	// 防止管理员误关自己的 AI 管理权限导致锁死
	if req.UserId == userInfo.ID && !req.AiAdmin {
		apiReturn.ErrorCode(c, 1011, "不能关闭自己的 AI 管理权限", nil)
		return
	}
	mUser := models.User{}
	if err := mUser.UpdateUserInfoByUserId(req.UserId, map[string]interface{}{"ai_admin": req.AiAdmin}); err != nil {
		apiReturn.ErrorDatabase(c, err.Error())
		return
	}
	apiReturn.Success(c)
}
