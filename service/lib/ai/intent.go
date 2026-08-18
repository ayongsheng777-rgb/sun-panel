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

// deleteVerbs 明确的删除动词（第 4 层防线：业务层关键词兜底）
var deleteVerbs = []string{
	"删除", "删掉", "删了", "删除掉", "移除", "清空", "清除", "干掉", "去掉",
	"delete", "remove", "drop ",
}

// DeleteGuard 判断这条指令是否在要求删除。
// 命中即由引擎直接拒绝，永不进入工具执行链。
func DeleteGuard(prompt string) (bool, string) {
	low := strings.ToLower(prompt)
	hit := false
	for _, v := range deleteVerbs {
		if strings.Contains(low, v) {
			hit = true
			break
		}
	}
	if !hit {
		return false, ""
	}
	// 重复项相关的「删除」引导到合并流程，避免用户无路可走
	if strings.Contains(prompt, "重复") {
		return true, "删除操作不支持由 AI 执行。不过我可以帮你「合并重复项」——把多余地址并进主项目、重复条目挪到「" +
			"待清理（重复）」分组，你确认后手动删除即可。要执行吗？"
	}
	return true, "删除操作已被系统永久禁用，AI 不能删除任何分组或网址，请在页面上手动删除。\n" +
		"除删除以外的分组操作我都能做：新建、改名、改图标/描述、调整顺序、移动网址、批量整理。"
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
	default:
		return IntentPanelAction
	}
}
