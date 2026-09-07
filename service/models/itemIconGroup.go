package models

import (
	"gorm.io/gorm"
)

type ItemIconGroup struct {
	BaseModel
	Icon        string `json:"icon"`
	Title       string `gorm:"type:varchar(50)" json:"title"`
	Description string `gorm:"type:varchar(1000)" json:"description"`
	Sort        int    `gorm:"type:int(11)" json:"sort"`
	// OnlyName 分组唯一标识，供 OpenAPI / 浏览器插件定位分组
	OnlyName string `gorm:"type:varchar(50);index" json:"onlyName"`
	UserId   uint   `json:"userId"`
	User     User   `json:"user"`
}

func (m *ItemIconGroup) DeleteByUserId(db *gorm.DB, userId uint) (err error) {
	err = db.Delete(&ItemIconGroup{}, "user_id = ?", userId).Error
	return
}
