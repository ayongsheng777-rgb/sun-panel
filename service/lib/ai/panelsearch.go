package ai

import (
	"fmt"
	"strings"

	"sun-panel/lib/ai/tools"
)

// panelSearchTool 面板内网址检索工具（panel.search）。
//
// 之所以放在 ai 包而不是 tools 包：它需要复用 AISearch/CandidateRecall 的两阶段检索能力，
// 而 tools 包按设计不允许反向依赖 ai 包。这里由 ai 包实现 tools.Tool 接口后注册进注册表。
type panelSearchTool struct {
	cfg AIConfig
}

func (t panelSearchTool) Name() string { return "panel.search" }

func (t panelSearchTool) Description() string {
	return "在用户面板已有的网址（书签）里做语义检索，回答「我有没有 XX」「找一下 XX 的网址」这类问题。不联网。"
}

func (t panelSearchTool) ParamsSchema() map[string]string {
	return map[string]string{
		"query": "字符串，检索关键词或自然语言描述（必填）",
	}
}

func (t panelSearchTool) Permission() tools.Permission { return tools.PermissionRead }

func (t panelSearchTool) Execute(ec *tools.ExecContext) (tools.Result, error) {
	var p struct {
		Query string `json:"query"`
	}
	ec.Bind(&p)
	query := strings.TrimSpace(p.Query)
	if query == "" {
		query = strings.TrimSpace(ec.Prompt)
	}
	if query == "" {
		return tools.Result{Kind: "reply", Reply: "你想找什么？说个关键词就行。"}, nil
	}

	items, err := tools.LoadItems(ec.UserId)
	if err != nil {
		return tools.Result{}, err
	}
	if len(items) == 0 {
		return tools.Result{Kind: "reply", Reply: "你的面板里还没有网址。"}, nil
	}

	ids, serr := AISearch(ec.Ctx, t.cfg, items, query)
	if serr != nil || len(ids) == 0 {
		// AI 排序失败或没命中：降级本地关键词过滤
		ids = ids[:0]
		for _, it := range LocalFilter(items, query, MaxResults) {
			ids = append(ids, it.ID)
		}
	}
	if len(ids) == 0 {
		return tools.Result{
			Kind:  "reply",
			Reply: "面板里没找到和「" + query + "」相关的网址。要我联网帮你找并添加进来吗？",
		}, nil
	}
	return tools.Result{
		Kind:    "items",
		Reply:   fmt.Sprintf("为你找到 %d 个相关内容", len(ids)),
		ItemIds: ids,
	}, nil
}
