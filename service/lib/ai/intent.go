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

// secretCode 删除操作暗号：用户指令含此串才放行 AI 删除（防误删）
const secretCode = "泳昇"

// DeleteGuard 判断这条指令是否在要求删除。
// 命中删除词但没暗号 → 直接回复确认「是不是删除网址\分组？」，不询问暗号是什么；
// 命中删除词且含暗号「泳昇」 → 放行，进入工具执行链（由 panel.delete_item / panel.delete_group 实际执行）。
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
	// 暗号验证：包含暗号则放行删除
	if strings.Contains(prompt, secretCode) {
		return false, ""
	}
	// 不含暗号：直接回复确认，不询问暗号是什么
	return true, "是不是删除网址\\分组？"
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
