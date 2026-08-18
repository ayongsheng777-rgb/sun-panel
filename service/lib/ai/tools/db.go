package tools

import (
	"encoding/json"
	"errors"
	"strings"

	"sun-panel/global"
	"sun-panel/models"

	"gorm.io/gorm"
)

// ---------- 面板数据读取 ----------

// LoadGroups 取用户全部分组（按 sort、创建时间）
func LoadGroups(userId uint) ([]models.ItemIconGroup, error) {
	groups := []models.ItemIconGroup{}
	err := global.Db.Order("sort ,created_at").Where("user_id=?", userId).Find(&groups).Error
	return groups, err
}

// LoadItems 取用户全部网址（按 sort）
func LoadItems(userId uint) ([]models.ItemIcon, error) {
	items := []models.ItemIcon{}
	err := global.Db.Order("sort").Where("user_id=?", userId).Find(&items).Error
	if err != nil {
		return items, err
	}
	// 补齐 addresses（列存 JSON）
	for i := range items {
		if strings.TrimSpace(items[i].AddressesJson) != "" {
			_ = json.Unmarshal([]byte(items[i].AddressesJson), &items[i].Addresses)
		}
	}
	return items, nil
}

// ---------- 名称模糊匹配 ----------

// FindGroupByName 按名称匹配分组：先精确，后双向包含模糊匹配
func FindGroupByName(userId uint, name string) (models.ItemIconGroup, error) {
	return FindGroupByNameTx(global.Db, userId, name)
}

// FindGroupByNameTx 事务内版本
func FindGroupByNameTx(tx *gorm.DB, userId uint, name string) (models.ItemIconGroup, error) {
	name = strings.TrimSpace(name)
	groups := []models.ItemIconGroup{}
	if err := tx.Where("user_id=?", userId).Find(&groups).Error; err != nil {
		return models.ItemIconGroup{}, err
	}
	lower := strings.ToLower(name)
	for _, g := range groups {
		if g.Title == name {
			return g, nil
		}
	}
	if lower != "" {
		for _, g := range groups {
			gt := strings.ToLower(g.Title)
			if strings.Contains(gt, lower) || strings.Contains(lower, gt) {
				return g, nil
			}
		}
	}
	return models.ItemIconGroup{}, errors.New("找不到分组「" + name + "」，当前分组有：" + JoinGroupTitles(groups))
}

// JoinGroupTitles 分组名拼接
func JoinGroupTitles(groups []models.ItemIconGroup) string {
	titles := make([]string, 0, len(groups))
	for _, g := range groups {
		titles = append(titles, g.Title)
	}
	return strings.Join(titles, "、")
}

// FindItemByName 按名称匹配网址：groupId<=0 时在全部网址中匹配
func FindItemByName(userId uint, name string, groupId int) (models.ItemIcon, error) {
	return FindItemByNameTx(global.Db, userId, name, groupId)
}

// FindItemByNameTx 事务内版本
func FindItemByNameTx(tx *gorm.DB, userId uint, name string, groupId int) (models.ItemIcon, error) {
	name = strings.TrimSpace(name)
	q := tx.Where("user_id=?", userId)
	if groupId > 0 {
		q = q.Where("item_icon_group_id=?", groupId)
	}
	items := []models.ItemIcon{}
	if err := q.Find(&items).Error; err != nil {
		return models.ItemIcon{}, err
	}
	lower := strings.ToLower(name)
	for _, it := range items {
		if it.Title == name {
			return it, nil
		}
	}
	if lower != "" {
		for _, it := range items {
			itl := strings.ToLower(it.Title)
			if strings.Contains(itl, lower) || strings.Contains(lower, itl) {
				return it, nil
			}
		}
	}
	return models.ItemIcon{}, errors.New("找不到网址「" + name + "」")
}

// FindItemsByNameAll 返回所有匹配（名称或域名）的网址，用于重复项选择性删除。
// 排序：精确名称匹配在前，模糊匹配（双向包含）在后，保持原序。
func FindItemsByNameAll(userId uint, name string, groupId int) ([]models.ItemIcon, error) {
	return FindItemsByNameAllTx(global.Db, userId, name, groupId)
}

func FindItemsByNameAllTx(tx *gorm.DB, userId uint, name string, groupId int) ([]models.ItemIcon, error) {
	name = strings.TrimSpace(name)
	q := tx.Where("user_id=?", userId)
	if groupId > 0 {
		q = q.Where("item_icon_group_id=?", groupId)
	}
	items := []models.ItemIcon{}
	if err := q.Find(&items).Error; err != nil {
		return nil, err
	}
	lower := strings.ToLower(name)
	var exact, fuzzy []models.ItemIcon
	for _, it := range items {
		if it.Title == name {
			exact = append(exact, it)
			continue
		}
		if lower != "" {
			itl := strings.ToLower(it.Title)
			if strings.Contains(itl, lower) || strings.Contains(lower, itl) {
				fuzzy = append(fuzzy, it)
			}
		}
	}
	return append(exact, fuzzy...), nil
}

// FindGroupsByNameAll 返回所有匹配的分组（先精确后模糊）
func FindGroupsByNameAll(userId uint, name string) ([]models.ItemIconGroup, error) {
	name = strings.TrimSpace(name)
	groups := []models.ItemIconGroup{}
	if err := global.Db.Where("user_id=?", userId).Find(&groups).Error; err != nil {
		return nil, err
	}
	lower := strings.ToLower(name)
	var exact, fuzzy []models.ItemIconGroup
	for _, g := range groups {
		if g.Title == name {
			exact = append(exact, g)
			continue
		}
		if lower != "" {
			gt := strings.ToLower(g.Title)
			if strings.Contains(gt, lower) || strings.Contains(lower, gt) {
				fuzzy = append(fuzzy, g)
			}
		}
	}
	return append(exact, fuzzy...), nil
}

// DeleteItemById 按 id 删除单个网址（带 user_id 隔离）
func DeleteItemById(userId, id uint) error {
	return global.Db.Delete(&models.ItemIcon{}, "id=? AND user_id=?", id, userId).Error
}

// DeleteGroupById 删除分组并级联删除其下全部网址（带 user_id 隔离）
func DeleteGroupById(userId, groupId uint) error {
	return global.Db.Transaction(func(tx *gorm.DB) error {
		if err := tx.Delete(&models.ItemIconGroup{}, "id=? AND user_id=?", groupId, userId).Error; err != nil {
			return err
		}
		mitem := models.ItemIcon{}
		if err := mitem.DeleteByItemIconGroupIds(tx, userId, []uint{groupId}); err != nil {
			return err
		}
		return nil
	})
}

// CountItemsInGroup 统计分组下的网址数
func CountItemsInGroup(userId, groupId uint) (int64, error) {
	var c int64
	err := global.Db.Model(&models.ItemIcon{}).Where("item_icon_group_id=? AND user_id=?", groupId, userId).Count(&c).Error
	return c, err
}

// ---------- 审计日志 ----------

// LogOp 写 AI 操作审计日志（失败不影响主流程）
func LogOp(userId uint, action, target, before, after string) {
	_ = global.Db.Create(&models.AiOperationLog{
		UserId:     userId,
		Operator:   "AI",
		Action:     action,
		Target:     target,
		BeforeData: before,
		AfterData:  after,
	}).Error
}

// JSONStr 便捷序列化
func JSONStr(v any) string {
	b, _ := json.Marshal(v)
	return string(b)
}
