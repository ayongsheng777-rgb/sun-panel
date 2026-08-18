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
// 注意：删除权限 PermissionDelete 被注册表硬性拒绝（防御性兜底），因此这里声明为 PermissionUpdate，
// 工具本身只负责执行。删除开关的防线：
//   - 单个/精确匹配删除：直接执行；
//   - 命中多个：由引擎列出清单让用户选择（panel.delete_item / panel.delete_group 不再自行挑一个静默删）；
//   - 清空分组/全部：引擎先要求一句确认，确认后才调用 panel.wipe_all。
func DeleteTools() []Tool {
	return []Tool{
		deleteItemTool{},
		deleteGroupTool{},
		wipeAllTool{},
	}
}

// ===================== 网址：删除 =====================

type deleteItemTool struct{}

func (deleteItemTool) Name() string           { return "panel.delete_item" }
func (deleteItemTool) Permission() Permission { return PermissionUpdate }
func (deleteItemTool) Description() string {
	return "删除一个网址（按名称/域名模糊匹配；命中多个时由引擎列出让用户选择；单个直接删除）"
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
	return "删除一个分组（会同时删除其下所有网址）；引擎会在执行前先要求一句确认"
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

// ===================== 全部清空（需确认） =====================

type wipeAllTool struct{}

func (wipeAllTool) Name() string           { return "panel.wipe_all" }
func (wipeAllTool) Permission() Permission { return PermissionUpdate }
func (wipeAllTool) Description() string {
	return "清空全部网址（危险操作，仅当用户明确回复「确认清空全部」后才由引擎放行）"
}
func (wipeAllTool) ParamsSchema() map[string]string { return map[string]string{} }

func (wipeAllTool) Execute(ec *ExecContext) (Result, error) {
	// 删除全部网址
	if err := global.Db.Delete(&models.ItemIcon{}, "user_id=?", ec.UserId).Error; err != nil {
		return Result{}, err
	}
	// 分组保留一个，避免破坏「至少保留一个分组」的不变量
	var groups []models.ItemIconGroup
	if err := global.Db.Order("sort ,created_at").Where("user_id=?", ec.UserId).Find(&groups).Error; err != nil {
		return Result{}, err
	}
	keep := ""
	if len(groups) > 0 {
		keep = groups[0].Title
		delIDs := make([]uint, 0, len(groups)-1)
		for _, g := range groups[1:] {
			delIDs = append(delIDs, g.ID)
		}
		if len(delIDs) > 0 {
			if err := global.Db.Delete(&models.ItemIconGroup{}, "id IN ? AND user_id=?", delIDs, ec.UserId).Error; err != nil {
				return Result{}, err
			}
		}
	}
	LogOp(ec.UserId, "wipe_all", "AI清空全部网址", "", "")
	if keep == "" {
		return Result{Kind: "changed", Reply: "已清空全部网址。", Changed: true}, nil
	}
	return Result{Kind: "changed", Reply: fmt.Sprintf("已清空全部网址，仅保留一个空分组「%s」。", keep), Changed: true}, nil
}
