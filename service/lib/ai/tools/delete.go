package tools

import (
	"fmt"
	"strings"

	"sun-panel/global"
	"sun-panel/models"

	"gorm.io/gorm"
)

// DeleteTools 删除类工具。
//
// 注意：删除权限 PermissionDelete 被注册表硬性拒绝，因此这里声明为 PermissionUpdate，
// 真正的删除开关放在意图层（intent.DeleteGuard 暗号「泳昇」把关）。工具本身只负责执行。
func DeleteTools() []Tool {
	return []Tool{
		deleteItemTool{},
		deleteGroupTool{},
	}
}

// ===================== 网址：删除 =====================

type deleteItemTool struct{}

func (deleteItemTool) Name() string           { return "panel.delete_item" }
func (deleteItemTool) Permission() Permission { return PermissionUpdate }
func (deleteItemTool) Description() string {
	return "删除一个网址（需用户在指令中带上暗号「泳昇」才被允许执行）"
}
func (deleteItemTool) ParamsSchema() map[string]string {
	return map[string]string{"itemTitle": "要删除的网址名（可模糊匹配）"}
}

func (deleteItemTool) Execute(ec *ExecContext) (Result, error) {
	var p struct {
		ItemTitle string `json:"itemTitle"`
	}
	ec.Bind(&p)
	p.ItemTitle = strings.TrimSpace(p.ItemTitle)
	if p.ItemTitle == "" {
		return Result{Kind: "reply", Reply: "请告诉我要删除哪个网址"}, nil
	}
	it, err := FindItemByName(ec.UserId, p.ItemTitle, 0)
	if err != nil {
		return Result{Kind: "reply", Reply: err.Error()}, nil
	}
	if err := global.Db.Delete(&models.ItemIcon{}, "id=? AND user_id=?", it.ID, ec.UserId).Error; err != nil {
		return Result{}, err
	}
	LogOp(ec.UserId, "delete_item", "AI删除网址「"+it.Title+"」", "", "")
	return Result{Kind: "changed", Reply: fmt.Sprintf("已删除网址「%s」", it.Title), Changed: true}, nil
}

// ===================== 分组：删除 =====================

type deleteGroupTool struct{}

func (deleteGroupTool) Name() string           { return "panel.delete_group" }
func (deleteGroupTool) Permission() Permission { return PermissionUpdate }
func (deleteGroupTool) Description() string {
	return "删除一个分组（会同时删除分组下的所有网址；需用户在指令中带上暗号「泳昇」才被允许执行）"
}
func (deleteGroupTool) ParamsSchema() map[string]string {
	return map[string]string{"groupTitle": "要删除的分组名（可模糊匹配）"}
}

func (deleteGroupTool) Execute(ec *ExecContext) (Result, error) {
	var p struct {
		GroupTitle string `json:"groupTitle"`
	}
	ec.Bind(&p)
	p.GroupTitle = strings.TrimSpace(p.GroupTitle)
	if p.GroupTitle == "" {
		return Result{Kind: "reply", Reply: "请告诉我要删除哪个分组"}, nil
	}
	g, err := FindGroupByName(ec.UserId, p.GroupTitle)
	if err != nil {
		return Result{Kind: "reply", Reply: err.Error()}, nil
	}
	// 至少保留一个分组，防止误删全部
	var count int64
	if err := global.Db.Model(&models.ItemIconGroup{}).Where("user_id=?", ec.UserId).Count(&count).Error; err != nil {
		return Result{}, err
	}
	if count <= 1 {
		return Result{Kind: "reply", Reply: "至少需保留一个分组，无法删除最后一个分组"}, nil
	}
	txErr := global.Db.Transaction(func(tx *gorm.DB) error {
		if err := tx.Delete(&models.ItemIconGroup{}, "id=? AND user_id=?", g.ID, ec.UserId).Error; err != nil {
			return err
		}
		mitem := models.ItemIcon{}
		if err := mitem.DeleteByItemIconGroupIds(tx, ec.UserId, []uint{g.ID}); err != nil {
			return err
		}
		return nil
	})
	if txErr != nil {
		return Result{}, txErr
	}
	LogOp(ec.UserId, "delete_group", "AI删除分组「"+g.Title+"」", "", "")
	return Result{Kind: "changed", Reply: fmt.Sprintf("已删除分组「%s」及其下所有网址", g.Title), Changed: true}, nil
}
