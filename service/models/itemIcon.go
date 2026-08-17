package models

import (
	"encoding/json"
	"strings"

	"sun-panel/models/datatype"

	"gorm.io/gorm"
)

type ItemIcon struct {
	BaseModel
	IconJson        string                    `gorm:"type:varchar(1000)" json:"-"`
	Icon            datatype.ItemIconIconInfo `gorm:"-" json:"icon"`
	Title           string                    `gorm:"type:varchar(50)" json:"title"`
	Url             string                    `gorm:"type:varchar(1000)" json:"url"`
	LanUrl          string                    `gorm:"type:varchar(1000)" json:"lanUrl"`
	Description     string                    `gorm:"type:varchar(1000)" json:"description"`
	OpenMethod      int                       `gorm:"type:tinyint(1)" json:"openMethod"`
	Sort            int                       `gorm:"type:int(11)" json:"sort"`
	ItemIconGroupId int                       `json:"itemIconGroupId"`
	UserId          uint                      `json:"userId"`
	User            User                      `json:"user"`

	// 弹性多地址：以 JSON 字符串列持久化，兼容旧 url/lanUrl 双地址模型
	AddressesJson string                  `gorm:"type:text" json:"-"`
	Addresses     []datatype.ItemAddress `gorm:"-" json:"addresses"`
}

// MigrateLegacyAddresses 将历史 url/lanUrl 数据一次性迁移为 addresses（幂等：仅处理未迁移行）
func MigrateLegacyAddresses(db *gorm.DB) {
	items := []ItemIcon{}
	if err := db.Find(&items, "addresses_json IS NULL OR addresses_json = '' OR addresses_json = 'null'").Error; err != nil {
		return
	}
	for _, it := range items {
		addresses := buildLegacyAddresses(it)
		if len(addresses) == 0 {
			continue
		}
		if j, err := json.Marshal(addresses); err == nil {
			db.Model(&ItemIcon{}).Where("id = ?", it.ID).Update("addresses_json", string(j))
		}
	}
}

func buildLegacyAddresses(it ItemIcon) []datatype.ItemAddress {
	var list []datatype.ItemAddress
	sort := 0
	if it.Url != "" {
		list = append(list, datatype.ItemAddress{
			Id:         "legacy-default",
			Name:       "默认",
			Url:        it.Url,
			Type:       legacyType(it.Url, "https", "http"),
			IsDefault:  true,
			Sort:       sort,
			Enabled:    true,
			OpenMethod: it.OpenMethod,
		})
		sort++
	}
	if it.LanUrl != "" {
		list = append(list, datatype.ItemAddress{
			Id:         "legacy-lan",
			Name:       "局域网",
			Url:        it.LanUrl,
			Type:       "lan",
			IsDefault:  false,
			Sort:       sort,
			Enabled:    true,
			OpenMethod: it.OpenMethod,
		})
		sort++
	}
	return list
}

func legacyType(url, httpsType, httpType string) string {
	if strings.HasPrefix(strings.ToLower(url), "https://") {
		return httpsType
	}
	return httpType
}

func (m *ItemIcon) DeleteByItemIconGroupIds(db *gorm.DB, userId uint, itemIconGroupIds []uint) (err error) {
	err = db.Delete(&ItemIcon{}, "item_icon_group_id in ? AND user_id=?", itemIconGroupIds, userId).Error
	return
}

func (m *ItemIcon) DeleteByUserId(db *gorm.DB, userId uint) (err error) {
	return db.Delete(&ItemIcon{}, "user_id=?", userId).Error
}
