package panel

import (
	"context"
	"encoding/json"
	"strings"
	"time"

	"sun-panel/api/api_v1/common/apiReturn"
	"sun-panel/api/api_v1/common/base"
	"sun-panel/global"
	"sun-panel/lib/ai"
	"sun-panel/models"
	"sun-panel/models/datatype"

	"github.com/gin-gonic/gin"
	"github.com/gin-gonic/gin/binding"
	"github.com/google/uuid"
	"gorm.io/gorm"
)

// AiManage AI 自动维护网址（初版规格书第 2、3 章）
type AiManage struct{}

// AddWebsite AI 自动添加网址：联网搜官网 → 选官网 → 分类 → 建分组 → 保存 → 审计日志。
// AI 只能新增/修改，不提供删除（删除永远由用户手动确认）。
func (a *AiManage) AddWebsite(c *gin.Context) {
	userInfo, _ := base.GetCurrentUserInfo(c)
	var req struct {
		Prompt string `json:"prompt"`
	}
	if err := c.ShouldBindBodyWith(&req, binding.JSON); err != nil {
		apiReturn.ErrorParamFomat(c, err.Error())
		return
	}
	if strings.TrimSpace(req.Prompt) == "" {
		apiReturn.ErrorParamFomat(c, "prompt is empty")
		return
	}

	cfg := ai.LoadConfig(userInfo.ID)
	if !cfg.Enabled {
		apiReturn.Error(c, "AI 未启用，请先在设置中开启 AI 搜索")
		return
	}

	ctx, cancel := context.WithTimeout(c.Request.Context(), 30*time.Second)
	defer cancel()

	pick, results, err := ai.AddWebsite(ctx, cfg, req.Prompt)
	if err != nil {
		apiReturn.Error(c, "AI 添加失败："+err.Error())
		return
	}

	// 找到或创建分类分组
	groupId, err := ensureGroup(userInfo.ID, pick.Category)
	if err != nil {
		apiReturn.ErrorDatabase(c, err.Error())
		return
	}

	// 图标：先用文字图标（标题首字符），智能图标系统后续异步补齐
	firstChar := firstRune(pick.Title)
	if firstChar == "" {
		firstChar = "网"
	}

	addrType := "https"
	if strings.HasPrefix(strings.ToLower(pick.SelectedURL), "http://") {
		addrType = "http"
	}

	item := models.ItemIcon{
		Title:           pick.Title,
		Url:             pick.SelectedURL,
		Description:     pick.Description,
		OpenMethod:      2,
		Sort:            9999,
		ItemIconGroupId: groupId,
		UserId:          userInfo.ID,
		Icon:            datatype.ItemIconIconInfo{ItemType: 1, Text: firstChar},
		Addresses: []datatype.ItemAddress{{
			Id:         uuid.New().String(),
			Name:       "默认",
			Url:        pick.SelectedURL,
			Type:       addrType,
			IsDefault:  true,
			Sort:       0,
			Enabled:    true,
			OpenMethod: 2,
		}},
	}
	if j, err := json.Marshal(item.Icon); err == nil {
		item.IconJson = string(j)
	}
	if j, err := json.Marshal(item.Addresses); err == nil {
		item.AddressesJson = string(j)
	}

	if err := global.Db.Create(&item).Error; err != nil {
		apiReturn.ErrorDatabase(c, err.Error())
		return
	}

	// 审计日志
	afterData, _ := json.Marshal(map[string]interface{}{
		"id": item.ID, "title": item.Title, "url": pick.SelectedURL,
		"groupId": groupId, "category": pick.Category,
	})
	_ = global.Db.Create(&models.AiOperationLog{
		UserId:    userInfo.ID,
		Operator:  "AI",
		Action:    "add",
		Target:    "新增网址 " + pick.Title,
		AfterData: string(afterData),
	}).Error

	// 回填展示字段
	_ = json.Unmarshal([]byte(item.IconJson), &item.Icon)
	_ = json.Unmarshal([]byte(item.AddressesJson), &item.Addresses)

	apiReturn.SuccessData(c, gin.H{
		"item":          item,
		"category":      pick.Category,
		"groupId":       groupId,
		"searchResults": results,
	})
}

// ensureGroup 按分类名查找分组，不存在则自动创建
func ensureGroup(userId uint, category string) (int, error) {
	group := models.ItemIconGroup{}
	err := global.Db.Where("user_id=? AND title=?", userId, category).First(&group).Error
	if err == nil {
		return int(group.ID), nil
	}
	if err != gorm.ErrRecordNotFound {
		return 0, err
	}
	group = models.ItemIconGroup{Title: category, UserId: userId, Sort: 9999}
	if err := global.Db.Create(&group).Error; err != nil {
		return 0, err
	}
	return int(group.ID), nil
}

func firstRune(s string) string {
	for _, r := range s {
		return string(r)
	}
	return ""
}
