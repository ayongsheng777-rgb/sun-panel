package tools

import (
	"fmt"
	"strings"
)

// OverviewTools 面板概览（只读）
func OverviewTools() []Tool {
	return []Tool{overviewTool{}}
}

type overviewTool struct{}

func (overviewTool) Name() string           { return "panel.overview" }
func (overviewTool) Permission() Permission { return PermissionRead }
func (overviewTool) Description() string {
	return "查看面板概况：有哪些分组、每个分组多少个网址、总数"
}
func (overviewTool) ParamsSchema() map[string]string { return map[string]string{} }

func (overviewTool) Execute(ec *ExecContext) (Result, error) {
	groups, err := LoadGroups(ec.UserId)
	if err != nil {
		return Result{}, err
	}
	items, err := LoadItems(ec.UserId)
	if err != nil {
		return Result{}, err
	}
	count := map[int]int{}
	for _, it := range items {
		count[it.ItemIconGroupId]++
	}
	payload := make([]map[string]any, 0, len(groups))
	var sb strings.Builder
	sb.WriteString(fmt.Sprintf("面板共有 %d 个分组、%d 个网址：", len(groups), len(items)))
	for _, g := range groups {
		n := count[int(g.ID)]
		sb.WriteString(fmt.Sprintf("\n· %s（%d 个）", g.Title, n))
		payload = append(payload, map[string]any{"title": g.Title, "count": n, "icon": g.Icon})
	}
	orphan := 0
	for _, it := range items {
		found := false
		for _, g := range groups {
			if int(g.ID) == it.ItemIconGroupId {
				found = true
				break
			}
		}
		if !found {
			orphan++
		}
	}
	if orphan > 0 {
		sb.WriteString(fmt.Sprintf("\n（另有 %d 个网址没有归属分组）", orphan))
	}
	return Result{
		Kind:  "data",
		Reply: sb.String(),
		Data:  map[string]any{"groups": payload, "totalItems": len(items), "orphanItems": orphan},
	}, nil
}
