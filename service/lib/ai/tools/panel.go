package tools

import (
	"encoding/json"
	"fmt"
	"strings"

	"sun-panel/global"
	"sun-panel/models"
	"sun-panel/models/datatype"

	"gorm.io/gorm"
)

// PanelTools 全部面板管理工具（分组的「除删除以外」全部修改操作 + 网址修改）
func PanelTools() []Tool {
	return []Tool{
		createGroupTool{}, renameGroupTool{}, editGroupTool{}, reorderGroupsTool{},
		moveItemTool{}, reorderItemsTool{}, editItemTool{}, setItemIconTool{},
	}
}

// ===================== 分组：新建 =====================

type createGroupTool struct{}

func (createGroupTool) Name() string           { return "panel.create_group" }
func (createGroupTool) Permission() Permission { return PermissionCreate }
func (createGroupTool) Description() string    { return "新建一个分组" }
func (createGroupTool) ParamsSchema() map[string]string {
	return map[string]string{"title": "分组名称", "icon": "可选，iconify 图标名如 material-symbols:folder-outline", "description": "可选，分组描述"}
}

func (createGroupTool) Execute(ec *ExecContext) (Result, error) {
	var p struct {
		Title       string `json:"title"`
		Icon        string `json:"icon"`
		Description string `json:"description"`
	}
	ec.Bind(&p)
	p.Title = strings.TrimSpace(p.Title)
	if p.Title == "" {
		return Result{Kind: "reply", Reply: "请告诉我要新建的分组名称"}, nil
	}
	if g, err := FindGroupByName(ec.UserId, p.Title); err == nil && strings.EqualFold(g.Title, p.Title) {
		return Result{Kind: "reply", Reply: "分组「" + g.Title + "」已经存在了"}, nil
	}
	icon := strings.TrimSpace(p.Icon)
	if icon == "" {
		icon = "material-symbols:ad-group-outline"
	}
	g := models.ItemIconGroup{
		Title:       p.Title,
		UserId:      ec.UserId,
		Sort:        9999,
		Icon:        icon,
		Description: strings.TrimSpace(p.Description),
	}
	if err := global.Db.Create(&g).Error; err != nil {
		return Result{}, err
	}
	LogOp(ec.UserId, "create_group", "新建分组 "+p.Title, "", JSONStr(map[string]any{"id": g.ID, "title": p.Title, "icon": icon}))
	return Result{Kind: "changed", Reply: fmt.Sprintf("已新建分组「%s」", p.Title), Changed: true}, nil
}

// ===================== 分组：改名 =====================

type renameGroupTool struct{}

func (renameGroupTool) Name() string           { return "panel.rename_group" }
func (renameGroupTool) Permission() Permission { return PermissionUpdate }
func (renameGroupTool) Description() string    { return "把某个分组改名" }
func (renameGroupTool) ParamsSchema() map[string]string {
	return map[string]string{"groupTitle": "原分组名", "newTitle": "新分组名"}
}

func (renameGroupTool) Execute(ec *ExecContext) (Result, error) {
	var p struct {
		GroupTitle string `json:"groupTitle"`
		NewTitle   string `json:"newTitle"`
	}
	ec.Bind(&p)
	p.NewTitle = strings.TrimSpace(p.NewTitle)
	if p.NewTitle == "" {
		return Result{Kind: "reply", Reply: "请告诉我要改成什么名字"}, nil
	}
	g, err := FindGroupByName(ec.UserId, p.GroupTitle)
	if err != nil {
		return Result{Kind: "reply", Reply: err.Error()}, nil
	}
	old := g.Title
	if err := global.Db.Model(&models.ItemIconGroup{}).Where("id=? AND user_id=?", g.ID, ec.UserId).
		Update("title", p.NewTitle).Error; err != nil {
		return Result{}, err
	}
	LogOp(ec.UserId, "rename_group", fmt.Sprintf("分组「%s」改名为「%s」", old, p.NewTitle),
		JSONStr(map[string]any{"title": old}), JSONStr(map[string]any{"title": p.NewTitle}))
	return Result{Kind: "changed", Reply: fmt.Sprintf("已将分组「%s」改名为「%s」", old, p.NewTitle), Changed: true}, nil
}

// ===================== 分组：改图标/描述 =====================

type editGroupTool struct{}

func (editGroupTool) Name() string           { return "panel.edit_group" }
func (editGroupTool) Permission() Permission { return PermissionUpdate }
func (editGroupTool) Description() string    { return "修改分组的图标或描述" }
func (editGroupTool) ParamsSchema() map[string]string {
	return map[string]string{"groupTitle": "分组名", "icon": "可选，iconify 图标名", "description": "可选，分组描述"}
}

func (editGroupTool) Execute(ec *ExecContext) (Result, error) {
	var p struct {
		GroupTitle  string `json:"groupTitle"`
		Icon        string `json:"icon"`
		Description string `json:"description"`
	}
	ec.Bind(&p)
	g, err := FindGroupByName(ec.UserId, p.GroupTitle)
	if err != nil {
		return Result{Kind: "reply", Reply: err.Error()}, nil
	}
	updates := map[string]any{}
	if v := strings.TrimSpace(p.Icon); v != "" {
		updates["icon"] = v
	}
	if v := strings.TrimSpace(p.Description); v != "" {
		updates["description"] = v
	}
	if len(updates) == 0 {
		return Result{Kind: "reply", Reply: "请告诉我要修改分组「" + g.Title + "」的图标还是描述"}, nil
	}
	if err := global.Db.Model(&models.ItemIconGroup{}).Where("id=? AND user_id=?", g.ID, ec.UserId).
		Updates(updates).Error; err != nil {
		return Result{}, err
	}
	LogOp(ec.UserId, "edit_group", "修改分组「"+g.Title+"」",
		JSONStr(map[string]any{"icon": g.Icon, "description": g.Description}), JSONStr(updates))
	return Result{Kind: "changed", Reply: fmt.Sprintf("已更新分组「%s」的信息", g.Title), Changed: true}, nil
}

// ===================== 分组：排序 =====================

type reorderGroupsTool struct{}

func (reorderGroupsTool) Name() string           { return "panel.reorder_groups" }
func (reorderGroupsTool) Permission() Permission { return PermissionUpdate }
func (reorderGroupsTool) Description() string    { return "调整分组的排列顺序（需给出重排后的完整顺序）" }
func (reorderGroupsTool) ParamsSchema() map[string]string {
	return map[string]string{"orderedTitles": "重排后的完整分组名数组"}
}

func (reorderGroupsTool) Execute(ec *ExecContext) (Result, error) {
	var p struct {
		OrderedTitles []string `json:"orderedTitles"`
	}
	ec.Bind(&p)
	if len(p.OrderedTitles) == 0 {
		return Result{Kind: "reply", Reply: "请告诉我要调整后的分组顺序"}, nil
	}
	updated := 0
	err := global.Db.Transaction(func(tx *gorm.DB) error {
		for i, title := range p.OrderedTitles {
			g, ferr := FindGroupByNameTx(tx, ec.UserId, title)
			if ferr != nil {
				continue
			}
			if err := tx.Model(&models.ItemIconGroup{}).Where("id=?", g.ID).Update("sort", i+1).Error; err != nil {
				return err
			}
			updated++
		}
		return nil
	})
	if err != nil {
		return Result{}, err
	}
	if updated == 0 {
		return Result{Kind: "reply", Reply: "没有匹配到任何分组，顺序未调整"}, nil
	}
	LogOp(ec.UserId, "reorder_groups", fmt.Sprintf("调整分组顺序（%d 个）", updated), "", JSONStr(p))
	return Result{Kind: "changed", Reply: fmt.Sprintf("已调整 %d 个分组的排列顺序", updated), Changed: true}, nil
}

// ===================== 网址：移动分组 =====================

type moveItemTool struct{}

func (moveItemTool) Name() string           { return "panel.move_item" }
func (moveItemTool) Permission() Permission { return PermissionUpdate }
func (moveItemTool) Description() string    { return "把某个网址移动到另一个分组" }
func (moveItemTool) ParamsSchema() map[string]string {
	return map[string]string{"itemTitle": "网址名", "toGroupTitle": "目标分组名"}
}

func (moveItemTool) Execute(ec *ExecContext) (Result, error) {
	var p struct {
		ItemTitle    string `json:"itemTitle"`
		ToGroupTitle string `json:"toGroupTitle"`
	}
	ec.Bind(&p)
	it, err := FindItemByName(ec.UserId, p.ItemTitle, 0)
	if err != nil {
		return Result{Kind: "reply", Reply: err.Error()}, nil
	}
	g, err := FindGroupByName(ec.UserId, p.ToGroupTitle)
	if err != nil {
		return Result{Kind: "reply", Reply: err.Error()}, nil
	}
	if it.ItemIconGroupId == int(g.ID) {
		return Result{Kind: "reply", Reply: fmt.Sprintf("「%s」已经在「%s」分组里了", it.Title, g.Title)}, nil
	}
	if err := global.Db.Model(&models.ItemIcon{}).Where("id=? AND user_id=?", it.ID, ec.UserId).
		Update("item_icon_group_id", g.ID).Error; err != nil {
		return Result{}, err
	}
	LogOp(ec.UserId, "move_item", fmt.Sprintf("网址「%s」移动到分组「%s」", it.Title, g.Title),
		JSONStr(map[string]any{"groupId": it.ItemIconGroupId}), JSONStr(map[string]any{"groupId": g.ID}))
	return Result{Kind: "changed", Reply: fmt.Sprintf("已把「%s」移动到「%s」分组", it.Title, g.Title), Changed: true}, nil
}

// ===================== 网址：组内排序 =====================

type reorderItemsTool struct{}

func (reorderItemsTool) Name() string           { return "panel.reorder_items" }
func (reorderItemsTool) Permission() Permission { return PermissionUpdate }
func (reorderItemsTool) Description() string    { return "调整某分组内网址的排列顺序（需给出完整顺序）" }
func (reorderItemsTool) ParamsSchema() map[string]string {
	return map[string]string{"groupTitle": "分组名", "orderedTitles": "重排后的完整网址名数组"}
}

func (reorderItemsTool) Execute(ec *ExecContext) (Result, error) {
	var p struct {
		GroupTitle    string   `json:"groupTitle"`
		OrderedTitles []string `json:"orderedTitles"`
	}
	ec.Bind(&p)
	g, err := FindGroupByName(ec.UserId, p.GroupTitle)
	if err != nil {
		return Result{Kind: "reply", Reply: err.Error()}, nil
	}
	if len(p.OrderedTitles) == 0 {
		return Result{Kind: "reply", Reply: "请告诉我要调整后的网址顺序"}, nil
	}
	updated := 0
	txErr := global.Db.Transaction(func(tx *gorm.DB) error {
		for i, title := range p.OrderedTitles {
			it, ferr := FindItemByNameTx(tx, ec.UserId, title, int(g.ID))
			if ferr != nil {
				continue
			}
			if err := tx.Model(&models.ItemIcon{}).Where("id=?", it.ID).Update("sort", i+1).Error; err != nil {
				return err
			}
			updated++
		}
		return nil
	})
	if txErr != nil {
		return Result{}, txErr
	}
	if updated == 0 {
		return Result{Kind: "reply", Reply: "在「" + g.Title + "」分组里没有匹配到这些网址，顺序未调整"}, nil
	}
	LogOp(ec.UserId, "reorder_items", fmt.Sprintf("调整分组「%s」内网址顺序（%d 个）", g.Title, updated), "", JSONStr(p))
	return Result{Kind: "changed", Reply: fmt.Sprintf("已调整「%s」分组内 %d 个网址的顺序", g.Title, updated), Changed: true}, nil
}

// ===================== 网址：编辑信息 =====================

type editItemTool struct{}

func (editItemTool) Name() string           { return "panel.edit_item" }
func (editItemTool) Permission() Permission { return PermissionUpdate }
func (editItemTool) Description() string    { return "修改网址的名称、链接或描述" }
func (editItemTool) ParamsSchema() map[string]string {
	return map[string]string{"itemTitle": "网址名", "newTitle": "可选，新名称", "url": "可选，新链接", "description": "可选，新描述"}
}

func (editItemTool) Execute(ec *ExecContext) (Result, error) {
	var p struct {
		ItemTitle   string `json:"itemTitle"`
		NewTitle    string `json:"newTitle"`
		Url         string `json:"url"`
		Description string `json:"description"`
	}
	ec.Bind(&p)
	it, err := FindItemByName(ec.UserId, p.ItemTitle, 0)
	if err != nil {
		return Result{Kind: "reply", Reply: err.Error()}, nil
	}
	updates := map[string]any{}
	if v := strings.TrimSpace(p.NewTitle); v != "" {
		updates["title"] = v
	}
	if v := strings.TrimSpace(p.Url); v != "" {
		if !IsSafeHTTPURL(v) {
			return Result{Kind: "reply", Reply: "链接格式不合法（必须是 http/https 开头的公开地址）"}, nil
		}
		updates["url"] = v
	}
	if v := strings.TrimSpace(p.Description); v != "" {
		updates["description"] = v
	}
	if len(updates) == 0 {
		return Result{Kind: "reply", Reply: "请告诉我要修改「" + it.Title + "」的哪些信息（名称/网址/描述）"}, nil
	}
	// 改主链接时同步 addresses 默认地址，保持弹性多地址一致
	if nu, ok := updates["url"].(string); ok {
		if j, ok2 := syncDefaultAddress(it, nu); ok2 {
			updates["addresses_json"] = j
		}
	}
	if err := global.Db.Model(&models.ItemIcon{}).Where("id=? AND user_id=?", it.ID, ec.UserId).
		Updates(updates).Error; err != nil {
		return Result{}, err
	}
	LogOp(ec.UserId, "edit_item", "修改网址「"+it.Title+"」信息",
		JSONStr(map[string]any{"title": it.Title, "url": it.Url, "description": it.Description}), JSONStr(updates))
	return Result{Kind: "changed", Reply: fmt.Sprintf("已修改「%s」的信息", it.Title), Changed: true}, nil
}

// syncDefaultAddress 把新的主 URL 同步到 addresses 的默认地址上
func syncDefaultAddress(it models.ItemIcon, newURL string) (string, bool) {
	addresses := it.Addresses
	if len(addresses) == 0 && strings.TrimSpace(it.AddressesJson) != "" {
		_ = json.Unmarshal([]byte(it.AddressesJson), &addresses)
	}
	if len(addresses) == 0 {
		return "", false
	}
	synced := false
	for i := range addresses {
		if addresses[i].IsDefault {
			addresses[i].Url = newURL
			synced = true
			break
		}
	}
	if !synced {
		addresses[0].Url = newURL
	}
	j, err := json.Marshal(addresses)
	if err != nil {
		return "", false
	}
	return string(j), true
}

// ===================== 网址：改图标 =====================

type setItemIconTool struct{}

func (setItemIconTool) Name() string           { return "panel.set_item_icon" }
func (setItemIconTool) Permission() Permission { return PermissionUpdate }
func (setItemIconTool) Description() string    { return "修改网址的图标（图片地址 / 文字 / iconify 图标名）" }
func (setItemIconTool) ParamsSchema() map[string]string {
	return map[string]string{
		"itemTitle":       "网址名",
		"iconType":        "图标类型：image(图片) / text(文字) / icon(iconify 图标名)",
		"value":           "对应值：图片URL / 显示文字 / iconify 名称如 simple-icons:github",
		"backgroundColor": "可选，背景色如 #4f46e5",
	}
}

func (setItemIconTool) Execute(ec *ExecContext) (Result, error) {
	var p struct {
		ItemTitle       string `json:"itemTitle"`
		IconType        string `json:"iconType"`
		Value           string `json:"value"`
		BackgroundColor string `json:"backgroundColor"`
	}
	ec.Bind(&p)
	it, err := FindItemByName(ec.UserId, p.ItemTitle, 0)
	if err != nil {
		return Result{Kind: "reply", Reply: err.Error()}, nil
	}
	p.Value = strings.TrimSpace(p.Value)
	if p.Value == "" {
		return Result{Kind: "reply", Reply: "请告诉我图标内容（图片地址、显示文字或 iconify 图标名）"}, nil
	}

	icon := datatype.ItemIconIconInfo{}
	if strings.TrimSpace(it.IconJson) != "" {
		_ = json.Unmarshal([]byte(it.IconJson), &icon)
	}
	switch strings.ToLower(strings.TrimSpace(p.IconType)) {
	case "image", "img", "1":
		if !IsSafeHTTPURL(p.Value) && !strings.HasPrefix(p.Value, "/") {
			return Result{Kind: "reply", Reply: "图片地址不合法"}, nil
		}
		icon.ItemType = 1
		icon.Src = p.Value
	case "text", "文字", "2":
		icon.ItemType = 2
		icon.Text = p.Value
	default: // icon / iconify / 3
		icon.ItemType = 3
		icon.Text = p.Value
	}
	if v := strings.TrimSpace(p.BackgroundColor); v != "" {
		icon.BackgroundColor = v
	}
	j, err := json.Marshal(icon)
	if err != nil {
		return Result{}, err
	}
	if err := global.Db.Model(&models.ItemIcon{}).Where("id=? AND user_id=?", it.ID, ec.UserId).
		Update("icon_json", string(j)).Error; err != nil {
		return Result{}, err
	}
	LogOp(ec.UserId, "change_icon", "修改网址「"+it.Title+"」图标", it.IconJson, string(j))
	return Result{Kind: "changed", Reply: fmt.Sprintf("已更新「%s」的图标", it.Title), Changed: true}, nil
}
