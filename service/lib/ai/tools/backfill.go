package tools

import (
	"fmt"
	"strings"

	"sun-panel/global"
	"sun-panel/lib/web"
	"sun-panel/models"
)

// BackfillTools 网址 / 图标补齐相关工具
func BackfillTools() []Tool {
	return []Tool{fixIconsTool{}, backfillURLsTool{}}
}

// ===================== 分组筛选 =====================

// nameTypos 常见输入法串台造成的错字 → 标准说法。
//
// 只收「确定是错字」的组合，避免误伤真实分组名
// （例如真的存在名为「AI动画」的分组，因此这里不把「动画」当错字）。
var nameTypos = []struct{ from, to string }{
	{"动面", "面板"}, {"面版", "面板"}, {"面扳", "面板"}, {"扳面", "面板"},
	{"网扯", "网址"}, {"网子", "网址"}, {"图票", "图标"}, {"途标", "图标"},
}

// FixTypos 纠正已知错字（用于分组/网址名匹配兜底，不修改用户数据）
func FixTypos(s string) string {
	for _, p := range nameTypos {
		s = strings.ReplaceAll(s, p.from, p.to)
	}
	return s
}

// SelectGroupsByKeyword 按分组名或字眼挑选分组。
//
//   - keyword 为空 → 返回全部分组（全扫）；
//   - 否则先精确匹配（忽略大小写），再包含匹配，
//     这样「把带 AI 字眼的分组网址补全」(keyword="AI") 能命中所有名字含 AI 的分组。
//   - 都没命中时，用纠正错字后的说法再试一次（如「动面」→「面板」）。
func SelectGroupsByKeyword(userId uint, keyword string) ([]models.ItemIconGroup, error) {
	groups, err := LoadGroups(userId)
	if err != nil {
		return nil, err
	}
	kw := strings.TrimSpace(keyword)
	if kw == "" {
		return groups, nil
	}
	matched := matchGroups(groups, kw)
	if len(matched) == 0 {
		if fixed := FixTypos(kw); fixed != kw {
			matched = matchGroups(groups, fixed)
		}
	}
	return matched, nil
}

// matchGroups 精确优先，其次包含匹配
func matchGroups(groups []models.ItemIconGroup, kw string) []models.ItemIconGroup {
	lower := strings.ToLower(kw)
	var exact, fuzzy []models.ItemIconGroup
	for _, g := range groups {
		if strings.EqualFold(g.Title, kw) {
			exact = append(exact, g)
			continue
		}
		if lower != "" && strings.Contains(strings.ToLower(g.Title), lower) {
			fuzzy = append(fuzzy, g)
		}
	}
	if len(exact) > 0 {
		return exact
	}
	return fuzzy
}

// demoteItemToGroupTail 把卡片排到它所在分组的最后面。
// 用于「AI 没把握补全」的卡片：不删除、不询问，只是挪到最后方便人工处理。
func demoteItemToGroupTail(userId uint, it models.ItemIcon) error {
	var maxSort int
	if err := global.Db.Model(&models.ItemIcon{}).
		Where("user_id=? AND item_icon_group_id=?", userId, it.ItemIconGroupId).
		Select("COALESCE(MAX(sort),0)").Scan(&maxSort).Error; err != nil {
		return err
	}
	return global.Db.Model(&models.ItemIcon{}).
		Where("id=? AND user_id=?", it.ID, userId).
		Update("sort", maxSort+1).Error
}

// ===================== 网址信息补全 =====================

type backfillURLsTool struct{}

func (backfillURLsTool) Name() string           { return "panel.backfill_urls" }
func (backfillURLsTool) Permission() Permission { return PermissionUpdate }
func (backfillURLsTool) Description() string {
	return "扫描网址卡片，给缺网址（url 为空）的卡片联网搜官网并自动补全，顺带补齐图标；可说：补全网址 / 网址信息补全 / 把带AI字眼的分组网址补全 / 把XX分组的内容补齐。搜不到官网的不询问，直接排到分组最后面"
}
func (backfillURLsTool) ParamsSchema() map[string]string {
	return map[string]string{
		"group": "可选，分组名或字眼（如「AI」表示所有名字带 AI 的分组）；不填=全部分组",
	}
}

func (backfillURLsTool) Execute(ec *ExecContext) (Result, error) {
	var p struct {
		Group string `json:"group"`
	}
	ec.Bind(&p)
	groups, err := SelectGroupsByKeyword(ec.UserId, p.Group)
	if err != nil {
		return Result{}, err
	}
	if len(groups) == 0 {
		return Result{Kind: "reply", Reply: fmt.Sprintf("没有匹配到分组「%s」，当前分组有：%s", p.Group, JoinGroupTitles(mustLoadGroups(ec.UserId)))}, nil
	}
	groupIds := make(map[uint]bool, len(groups))
	names := make([]string, 0, len(groups))
	for _, g := range groups {
		groupIds[g.ID] = true
		names = append(names, g.Title)
	}

	items, err := LoadItems(ec.UserId)
	if err != nil {
		return Result{}, err
	}
	filled, iconFilled, demoted, skipped := 0, 0, 0, 0
	var uncertain []string

	for i := range items {
		it := items[i]
		if !groupIds[uint(it.ItemIconGroupId)] {
			continue
		}
		needURL := itemNeedsURL(it)
		needIcon := itemNeedsIcon(it)
		if !needURL && !needIcon {
			skipped++
			continue
		}
		keyword := strings.TrimSpace(it.Title)
		resolved := !needURL

		if needURL && keyword != "" {
			results, _, serr := web.SearchManager(keyword, 5)
			if serr != nil || len(results) == 0 {
				// 没搜到 → 不确定，排到分组最后
				_ = demoteItemToGroupTail(ec.UserId, it)
				demoted++
				uncertain = append(uncertain, it.Title)
				// 网址没补上，但图标仍尝试用标题去 iconify 兜底
				if needIcon {
					if ok, _ := backfillOneIcon(ec, it); ok {
						iconFilled++
					}
				}
				continue
			}
			pick, perr := pickOfficialSite(ec, keyword, results)
			if perr != nil || !IsSafeHTTPURL(pick.URL) {
				_ = demoteItemToGroupTail(ec.UserId, it)
				demoted++
				uncertain = append(uncertain, it.Title)
				continue
			}
			update := map[string]any{"url": pick.URL}
			if strings.TrimSpace(it.Description) == "" && strings.TrimSpace(pick.Description) != "" {
				update["description"] = TruncateRunes(pick.Description, 100)
			}
			if err := global.Db.Model(&models.ItemIcon{}).
				Where("id=? AND user_id=?", it.ID, ec.UserId).
				Updates(update).Error; err != nil {
				demoted++
				uncertain = append(uncertain, it.Title)
				continue
			}
			LogOp(ec.UserId, "backfill_url", it.Title, "", pick.URL)
			filled++
			items[i].Url = pick.URL
			resolved = true
		}

		if !resolved {
			continue
		}
		// 网址就绪后再补图标（缺图标或图标是占位符）
		if itemNeedsIcon(items[i]) {
			if ok, _ := backfillOneIcon(ec, items[i]); ok {
				iconFilled++
			}
		}
	}

	reply := fmt.Sprintf("网址信息补全完成（分组：%s）：补网址 %d 个，补图标 %d 个，没把握已排到分组最后 %d 个，无需处理 %d 个。",
		strings.Join(names, "、"), filled, iconFilled, demoted, skipped)
	if len(uncertain) > 0 {
		reply += "\n没把握、已排到分组最后的：" + strings.Join(uncertain, "；")
	}
	return Result{Kind: "changed", Reply: reply, Changed: filled+iconFilled+demoted > 0}, nil
}

// itemNeedsURL 判断卡片是否缺网址（url 与弹性地址都没有）
func itemNeedsURL(it models.ItemIcon) bool {
	if strings.TrimSpace(it.Url) != "" {
		return false
	}
	for _, a := range it.Addresses {
		if strings.TrimSpace(a.Url) != "" {
			return false
		}
	}
	return true
}

// mustLoadGroups 取分组（出错时返回空，仅用于报错文案）
func mustLoadGroups(userId uint) []models.ItemIconGroup {
	groups, err := LoadGroups(userId)
	if err != nil {
		return nil
	}
	return groups
}
