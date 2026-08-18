package ai

import (
	"context"
	"encoding/json"
	"fmt"
	"regexp"
	"strings"
	"sync"
	"time"

	"sun-panel/lib/ai/tools"
)

// ---------- 删除流程编排（含重复项选择性删除 + 清空确认） ----------

type itemRef struct {
	ID    uint   `json:"id"`
	Title string `json:"title"`
	URL   string `json:"url"`
	Group string `json:"group"`
}

type groupRef struct {
	ID    uint   `json:"id"`
	Title string `json:"title"`
	Count int64  `json:"count"`
}

type pendingDelete struct {
	Kind       string    // "items" | "group" | "groups"
	Items      []itemRef
	Groups     []groupRef
	GroupId    uint
	GroupTitle string
	ItemCount  int64
	At         time.Time
}

var (
	pMu    sync.Mutex
	pState = map[uint]*pendingDelete{}
)

func storePending(userId uint, p *pendingDelete) {
	pMu.Lock()
	defer pMu.Unlock()
	p.At = time.Now()
	pState[userId] = p
}

func loadPending(userId uint) *pendingDelete {
	pMu.Lock()
	defer pMu.Unlock()
	p := pState[userId]
	if p == nil {
		return nil
	}
	if time.Since(p.At) > 10*time.Minute {
		delete(pState, userId)
		return nil
	}
	return p
}

func clearPending(userId uint) {
	pMu.Lock()
	defer pMu.Unlock()
	delete(pState, userId)
}

// tryResolvePendingDelete 处理「上一步列出清单后的选择/确认」续对话。命中返回 true 与结果。
func (e *Engine) tryResolvePendingDelete(userId uint, prompt string) (AgentResult, bool) {
	p := loadPending(userId)
	if p == nil {
		return AgentResult{}, false
	}
	low := strings.ToLower(prompt)

	switch p.Kind {
	case "items":
		if strings.Contains(low, "全删") || strings.Contains(low, "全部删除") || strings.Contains(low, "都删") || strings.Contains(low, "全删除") || strings.Contains(low, "删除全部") {
			deleted := 0
			for _, it := range p.Items {
				if err := tools.DeleteItemById(userId, it.ID); err == nil {
					deleted++
				}
			}
			clearPending(userId)
			tools.LogOp(userId, "delete_item", fmt.Sprintf("AI 选择性删除 %d 个网址", deleted), "", "")
			return AgentResult{Kind: "changed", Reply: fmt.Sprintf("已删除 %d 个网址。", deleted), Changed: true}, true
		}
		idxs := parseSelectionIndices(prompt)
		if len(idxs) == 0 {
			return AgentResult{}, false
		}
		var done []string
		for _, i := range idxs {
			if i < 1 || i > len(p.Items) {
				continue
			}
			it := p.Items[i-1]
			if err := tools.DeleteItemById(userId, it.ID); err == nil {
				done = append(done, it.Title)
			}
		}
		clearPending(userId)
		if len(done) == 0 {
			return AgentResult{Kind: "reply", Reply: "没有可删除的项，已取消。"}, true
		}
		tools.LogOp(userId, "delete_item", fmt.Sprintf("AI 选择性删除 %d 个网址", len(done)), "", "")
		return AgentResult{Kind: "changed", Reply: fmt.Sprintf("已删除：%s", strings.Join(done, "、")), Changed: true}, true

	case "groups":
		idxs := parseSelectionIndices(prompt)
		valid := idxs[:0]
		for _, i := range idxs {
			if i >= 1 && i <= len(p.Groups) {
				valid = append(valid, i)
			}
		}
		if len(valid) == 0 {
			return AgentResult{}, false
		}
		g := p.Groups[valid[0]-1]
		storePending(userId, &pendingDelete{Kind: "group", GroupId: g.ID, GroupTitle: g.Title, ItemCount: g.Count})
		return AgentResult{Kind: "reply", Reply: fmt.Sprintf("确认清空分组「%s」及其下 %d 个网址？回复「确认」即可执行（回复其他内容取消）。", g.Title, g.Count)}, true

	case "group":
		if strings.Contains(low, "确认") || strings.Contains(low, "确定") || strings.Contains(low, "yes") || strings.Contains(low, "执行") || strings.Contains(low, "好") {
			title := p.GroupTitle
			if err := tools.DeleteGroupById(userId, p.GroupId); err != nil {
				clearPending(userId)
				return AgentResult{}, false
			}
			clearPending(userId)
			tools.LogOp(userId, "delete_group", "AI删除分组「"+title+"」", "", "")
			return AgentResult{Kind: "changed", Reply: fmt.Sprintf("已删除分组「%s」及其下所有网址。", title), Changed: true}, true
		}
		return AgentResult{Kind: "reply", Reply: fmt.Sprintf("确认清空分组「%s」及其下 %d 个网址？回复「确认」即可执行（回复其他内容取消）。", p.GroupTitle, p.ItemCount)}, true
	}
	return AgentResult{}, false
}

// handleDelete 编排删除工具：单个直接删；多个列出让用户选；清空分组先确认。
func (e *Engine) handleDelete(ctx context.Context, userId uint, prompt string, intent Intent) (AgentResult, error) {
	groups, _ := tools.LoadGroups(userId)
	groupTitleOf := func(id int) string {
		for _, g := range groups {
			if int(g.ID) == id {
				return g.Title
			}
		}
		return ""
	}

	switch intent.Tool {
	case "panel.delete_item":
		var p struct {
			ItemTitle string `json:"itemTitle"`
		}
		_ = json.Unmarshal(intent.Params, &p)
		name := strings.TrimSpace(p.ItemTitle)
		if name == "" {
			name = strings.TrimSpace(tools.ExtractKeyword(prompt))
		}
		if name == "" {
			return AgentResult{Kind: "reply", Reply: "请告诉我要删除哪个网址（名称或域名）"}, nil
		}
		matches, err := tools.FindItemsByNameAll(userId, name, 0)
		if err != nil {
			return AgentResult{}, err
		}
		if len(matches) == 0 {
			return AgentResult{Kind: "reply", Reply: fmt.Sprintf("找不到网址「%s」", name)}, nil
		}
		if len(matches) == 1 {
			it := matches[0]
			if err := tools.DeleteItemById(userId, it.ID); err != nil {
				return AgentResult{}, err
			}
			tools.LogOp(userId, "delete_item", "AI删除网址「"+it.Title+"」", "", "")
			return AgentResult{Kind: "changed", Reply: fmt.Sprintf("已删除网址「%s」", it.Title), Changed: true}, nil
		}
		refs := make([]itemRef, 0, len(matches))
		var sb strings.Builder
		sb.WriteString(fmt.Sprintf("找到 %d 个匹配的网址，请告诉我删哪个（回复「删第2个」或「全删」）：\n", len(matches)))
		for i, it := range matches {
			refs = append(refs, itemRef{ID: it.ID, Title: it.Title, URL: it.Url, Group: groupTitleOf(it.ItemIconGroupId)})
			sb.WriteString(fmt.Sprintf("%d. %s（%s，分组：%s）\n", i+1, it.Title, it.Url, groupTitleOf(it.ItemIconGroupId)))
		}
		storePending(userId, &pendingDelete{Kind: "items", Items: refs})
		return AgentResult{Kind: "reply", Reply: strings.TrimSpace(sb.String())}, nil

	case "panel.delete_group":
		var p struct {
			GroupTitle string `json:"groupTitle"`
		}
		_ = json.Unmarshal(intent.Params, &p)
		name := strings.TrimSpace(p.GroupTitle)
		if name == "" {
			name = strings.TrimSpace(tools.ExtractKeyword(prompt))
		}
		if name == "" {
			return AgentResult{Kind: "reply", Reply: "请告诉我要删除哪个分组"}, nil
		}
		matches, err := tools.FindGroupsByNameAll(userId, name)
		if err != nil {
			return AgentResult{}, err
		}
		if len(matches) == 0 {
			return AgentResult{Kind: "reply", Reply: fmt.Sprintf("找不到分组「%s」，当前分组有：%s", name, tools.JoinGroupTitles(groups))}, nil
		}
		if len(matches) == 1 {
			g := matches[0]
			cnt, _ := tools.CountItemsInGroup(userId, uint(g.ID))
			storePending(userId, &pendingDelete{Kind: "group", GroupId: uint(g.ID), GroupTitle: g.Title, ItemCount: cnt})
			return AgentResult{Kind: "reply", Reply: fmt.Sprintf("确认清空分组「%s」及其下 %d 个网址？回复「确认」即可执行（回复其他内容取消）。", g.Title, cnt)}, nil
		}
		refs := make([]groupRef, 0, len(matches))
		var sb strings.Builder
		sb.WriteString(fmt.Sprintf("找到 %d 个匹配的分组，要删哪个？回复「删第2个」：\n", len(matches)))
		for i, g := range matches {
			cnt, _ := tools.CountItemsInGroup(userId, uint(g.ID))
			refs = append(refs, groupRef{ID: uint(g.ID), Title: g.Title, Count: cnt})
			sb.WriteString(fmt.Sprintf("%d. %s（%d 个网址）\n", i+1, g.Title, cnt))
		}
		storePending(userId, &pendingDelete{Kind: "groups", Groups: refs})
		return AgentResult{Kind: "reply", Reply: strings.TrimSpace(sb.String())}, nil

	case "panel.wipe_all":
		res, err := e.registry.Execute("panel.wipe_all", &tools.ExecContext{Ctx: ctx, UserId: userId, Prompt: prompt, LLM: e.llm()})
		if err != nil {
			return AgentResult{}, err
		}
		return AgentResult{Kind: res.Kind, Reply: res.Reply, Changed: res.Changed}, nil
	}
	return AgentResult{Kind: "reply", Reply: "不支持的删除操作"}, nil
}

// parseSelectionIndices 从「删第2个」「删第1和第3个」「删 1 2」中解析出 1-based 序号
func parseSelectionIndices(prompt string) []int {
	var out []int
	re := regexp.MustCompile(`第\s*(\d+)\s*个`)
	for _, m := range re.FindAllStringSubmatch(prompt, -1) {
		if n, err := atoiSafe(m[1]); err == nil {
			out = append(out, n)
		}
	}
	if len(out) > 0 {
		return out
	}
	if strings.Contains(prompt, "删") || strings.Contains(prompt, "第") {
		numRe := regexp.MustCompile(`\d+`)
		for _, m := range numRe.FindAllString(prompt, -1) {
			if n, err := atoiSafe(m); err == nil {
				out = append(out, n)
			}
		}
	}
	return out
}

func atoiSafe(s string) (int, error) {
	n := 0
	for _, c := range s {
		if c < '0' || c > '9' {
			return 0, fmt.Errorf("not a number")
		}
		n = n*10 + int(c-'0')
	}
	if n == 0 {
		return 0, fmt.Errorf("zero")
	}
	return n, nil
}
