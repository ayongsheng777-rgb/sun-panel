package models

import "time"

// TrustedDevice 受信任设备（初版规格书第 12-13 章）
// 用户在登录时勾选「信任此设备」后记录，30 天内来自同设备的登录可跳过 OTP。
type TrustedDevice struct {
	BaseModel
	UserId      uint      `gorm:"index;type:int" json:"userId"`        // 所属用户
	DeviceId    string    `gorm:"type:varchar(64);index" json:"deviceId"` // 设备指纹
	Name        string    `gorm:"type:varchar(100)" json:"name"`       // 设备名（如 Chrome on Windows）
	Browser     string    `gorm:"type:varchar(100)" json:"browser"`    // 浏览器
	IP          string    `gorm:"type:varchar(64)" json:"ip"`          // 登录 IP
	TrustedUntil time.Time `gorm:"type:datetime" json:"trustedUntil"`  // 信任到期时间
}

// IsValid 是否在信任期内
func (d *TrustedDevice) IsValid() bool {
	return d.ID != 0 && d.TrustedUntil.After(time.Now())
}
