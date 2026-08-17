package models

import (
	"errors"
)

// 用户表
type User struct {
	BaseModel
	Username     string `gorm:"index:;index:idx_username_password,priority:1;type:varchar(50)" json:"username" validate:"required"` // 账号
	Password     string `gorm:"index:idx_username_password;type:varchar(32)" json:"password" validate:"required"`                   // 密码
	Name         string `gorm:"type:varchar(20)" json:"name"`                                                                       // 名称
	HeadImage    string `gorm:"type:varchar(200)" json:"headImage"`                                                                 // 头像地址
	Status       int    `gorm:"type:tinyint(1)" json:"status"`                                                                      // 状态 1.启用 2.停用 3.未激活
	Role         int    `gorm:"type:int(11)" json:"role"`                                                                           // 角色 1.管理员 2.普通用户
	Mail         string `gorm:"type:varchar(50)" json:"mail"`                                                                       // 邮箱
	ReferralCode string `gorm:"type:varchar(10)" json:"referralCode"`                                                               // 推荐码
	Token        string `gorm:"type:varchar(32)" json:"token"`

	// OTP 双因素认证（初版规格书第 9-11 章）：强制所有账号开启
	OtpEnabled bool   `gorm:"type:tinyint(1);default:0" json:"otpEnabled"` // 是否已绑定 OTP
	OtpSecret  string `gorm:"type:varchar(64)" json:"-"`                   // TOTP 密钥（不外露 JSON）

	// AI 管理员权限（基础版权限清单）：是否可让 AI 自动增改网址 / 使用 AI 管理功能
	AiAdmin bool `gorm:"type:tinyint(1);default:0" json:"aiAdmin"`

	UserId uint `gorm:"-"  json:"userId"`
}

// 获取用户信息
func (m *User) GetUserInfoByUid(uid uint) (User, error) {
	mUser := User{}
	err := Db.Where("id=?", uid).First(&mUser).Error
	return mUser, err
}

// 根据用户名和密码查询用户
func (m *User) GetUserInfoByUsernameAndPassword(username, password string) (User, error) {
	userInfo := User{}
	err := Db.Where("username=?", username).Where("password=?", password).First(&userInfo).Error
	return userInfo, err
}

// 根据用户名查询用户
func (m *User) GetUserInfoByUsername(username string) (User, error) {
	mUser := User{}
	err := Db.Where("username=?", username).First(&mUser).Error
	return mUser, err
}

// 根据邮箱查询用户
func (m *User) GetUserInfoByMail() *User {
	mUser := User{}
	if Db.Where("mail=?", m.Mail).First(&mUser).Error != nil {
		return nil
	}
	return &mUser
}

// 根据token查询用户
func (m *User) GetUserInfoByToken(userToken string) (User, error) {
	mUser := User{}
	err := Db.Where("token=?", userToken).First(&mUser).Error
	return mUser, err
}

// 更新用户基于id
// 支持：name,autograph,header_image,status,role,mail,token,password,username,gender
func (m *User) UpdateUserInfoByUserId(user_id uint, updateInfo map[string]interface{}) error {
	mUser := User{}

	data := map[string]interface{}{}
	if v, ok := updateInfo["name"]; ok {
		data["name"] = v
	}
	if v, ok := updateInfo["head_image"]; ok {
		data["head_image"] = v
	}
	if v, ok := updateInfo["status"]; ok {
		data["status"] = v
	}
	if v, ok := updateInfo["role"]; ok {
		data["role"] = v
	}
	if v, ok := updateInfo["gender"]; ok {
		data["gender"] = v
	}

	if v, ok := updateInfo["mail"]; ok {
		hasUser := User{}
		count := Db.Where("mail=?", updateInfo["mail"]).First(&hasUser).RowsAffected
		if count != 0 && hasUser.ID != user_id {
			return errors.New("the mail already exists")
		}
		data["mail"] = v
	}
	if v, ok := updateInfo["username"]; ok {
		hasUser := User{}
		count := Db.Where("username=?", updateInfo["username"]).First(&hasUser).RowsAffected
		if count != 0 && hasUser.ID != user_id {
			return errors.New("the username already exists")
		}
		data["username"] = v
	}
	if v, ok := updateInfo["token"]; ok {
		data["token"] = v
	}
	if v, ok := updateInfo["password"]; ok {
		data["password"] = v
	}
	if v, ok := updateInfo["otp_enabled"]; ok {
		data["otp_enabled"] = v
	}
	if v, ok := updateInfo["otp_secret"]; ok {
		data["otp_secret"] = v
	}
	if v, ok := updateInfo["ai_admin"]; ok {
		data["ai_admin"] = v
	}

	err := Db.Model(&mUser).Where("id=?", user_id).Updates(data).Error

	return err
}

// 添加一个
func (m *User) CreateOne() (User, error) {
	err := Db.Create(m).Error
	return *m, err
}

// 验证是否有重复的用户名或者邮箱
func (m *User) CheckMailAndUsername(mail, username string) error {
	hasUser := User{}
	count := Db.Where("mail=?", mail).First(&hasUser).RowsAffected
	if count != 0 {
		return errors.New("该邮箱已被注册")
	}

	count = Db.Where("username=?", username).First(&hasUser).RowsAffected
	if count != 0 {
		return errors.New("该用户名已被注册")
	}
	return nil
}

// 验证是否有重复的用户名或者邮箱
func (m *User) CheckMailExist(mail string) (User, error) {
	hasUser := User{}
	count := Db.Where("mail=?", mail).First(&hasUser).RowsAffected
	if count != 0 {
		return hasUser, errors.New("该邮箱已被注册")
	}
	return hasUser, nil
}

// 验证是否有重复的用户名或者邮箱
func (m *User) CheckUsernameExist(username string) (User, error) {
	hasUser := User{}
	count := Db.Where("username=?", username).First(&hasUser).RowsAffected
	if count != 0 {
		return hasUser, errors.New("该用户名已被注册")
	}
	return hasUser, nil
}

// // 根据用户名和密码查询用户
// func (m *User) CreateUser(uid uint) *User {
// 	mUser := User{}
// 	if Db.Where("id=?", uid).First(&mUser).Error != nil {
// 		return nil
// 	} else {
// 		return &mUser
// 	}
// }
