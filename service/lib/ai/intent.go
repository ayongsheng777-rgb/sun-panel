package ai

import (
	"encoding/json"
	"errors"
	"strings"
)

// IntentType 用户意图分类（实施文档 V2.0 §9）
type IntentType string

const (
	IntentChat           IntentType = "chat"            // 纯对话/咨询
	IntentLocalSearch    IntentType = "local_search"     // 搜面板里的网址
	IntentWebSearch      IntentType = "web_search"       // 联网查资料
	IntentRealtime       IntentType = "realtime"         // 天气/时间等实时数据
	IntentPanelAction    IntentType = "panel_action"     // 面板增改（分组/网址）
	IntentSettingsAction IntentType = "settings_action"  // 面板外观设置
	IntentOrganize       IntentType = "organize"         // 整理/重复分析/重新分类
	IntentRejected       IntentType = "rejected"         // 被安全策略拒绝（如删除）
)

// Intent 路由结果
type Intent struct {
	Type   IntentType      `json:"intent"`
	Tool   string          `json:"tool"`
	Params json.RawMessage `json:"params"`
	Reply  string          `json:"reply"`
}

// wipeAllPatterns 「清空全部」类操作的特征串：命中且未确认时，要求一句确认后才放行。
// 仅作防误删的最后一道提示，不做删除阻断式拦截；普通删除（单个/按名称）不受影响。
var wipeAllPatterns = []string{
	"清空全部", "清空所有", "清空一切",
	"删除全部", "删除所有", "删除一切",
	"移除全部", "移除所有",
	"清空全部网址", "清空所有网址",
	"删除全部网址", "删除所有网址",
	"清空所有分组", "删除所有分组",
	"清空整个面板", "清空导航", "清空面板",
}

// DeleteGuard 仅对「清空全部」类危险操作做确认拦截：
//   - 命中特征串但未带「确认/确定」→ 返回确认提示，不进入删除流程；
//   - 已带确认词 → 放行，路由到 panel.wipe_all 执行。
// 普通删除（单个/按名称/按分组）不走此拦截，由引擎编排直接执行或先问一句。
func DeleteGuard(prompt string) (bool, string) {
	low := strings.ToLower(prompt)
	for _, p := range wipeAllPatterns {
		if strings.Contains(low, p) {
			if strings.Contains(low, "确认") || strings.Contains(low, "确定") {
				return false, ""
			}
			return true, "⚠️ 这将清空全部网址（不可恢复），确认请回复「确认清空全部」。"
		}
	}
	return false, ""
}

// parseIntent 容错解析 LLM 的路由输出
func parseIntent(raw string) (Intent, error) {
	start := strings.Index(raw, "{")
	end := strings.LastIndex(raw, "}")
	if start == -1 || end == -1 || end <= start {
		return Intent{}, errors.New("invalid ai json response")
	}
	var it Intent
	if err := json.Unmarshal([]byte(raw[start:end+1]), &it); err != nil {
		return Intent{}, err
	}
	it.Tool = strings.TrimSpace(it.Tool)
	if it.Type == "" && it.Tool == "" {
		return Intent{}, errors.New("empty ai intent")
	}
	if it.Type == "" {
		it.Type = IntentPanelAction
	}
	return it, nil
}

// intentOfTool 由工具名反推意图（用于日志与前端展示）
func intentOfTool(tool string) IntentType {
	switch {
	case tool == "":
		return IntentChat
	case tool == "panel.search":
		return IntentLocalSearch
	case strings.HasPrefix(tool, "realtime."):
		return IntentRealtime
	case strings.HasPrefix(tool, "web."):
		return IntentWebSearch
	case strings.HasPrefix(tool, "settings."):
		return IntentSettingsAction
	case tool == "panel.organize_plan", tool == "panel.apply_organize",
		tool == "panel.analyze_duplicates", tool == "panel.merge_duplicates":
		return IntentOrganize
	case tool == "panel.delete_item", tool == "panel.delete_group":
		return IntentPanelAction
	default:
		return IntentPanelAction
	}
}
