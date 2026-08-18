package tools

import (
	"encoding/json"
	"fmt"
	"sort"
	"strconv"
	"strings"

	"sun-panel/global"
	"sun-panel/models"

	"gorm.io/gorm"
)

// SettingsTools 面板外观设置读写（严格白名单）
func SettingsTools() []Tool {
	return []Tool{readSettingsTool{}, writeSettingsTool{}}
}

// settingKind 允许的值类型
type settingKind int

const (
	kindString settingKind = iota
	kindNumber
	kindBool
	kindColor
)

type settingSpec struct {
	Kind settingKind
	Desc string
	Min  float64
	Max  float64
}

// settingsWhitelist 唯一可被 AI 读写的面板设置项。
// 【安全边界】不在此表中的键（登录信息、用户表、搜索引擎密钥等）AI 永远碰不到。
var settingsWhitelist = map[string]settingSpec{
	"logoText":                    {Kind: kindString, Desc: "站点标题文字"},
	"logoImageSrc":                {Kind: kindString, Desc: "站点 Logo 图片地址"},
	"backgroundImageSrc":          {Kind: kindString, Desc: "背景图地址"},
	"backgroundBlur":              {Kind: kindNumber, Desc: "背景模糊度 0-40", Min: 0, Max: 40},
	"backgroundMaskNumber":        {Kind: kindNumber, Desc: "背景遮罩深度 0-1", Min: 0, Max: 1},
	"iconTextColor":               {Kind: kindColor, Desc: "图标文字颜色"},
	"iconTextInfoHideDescription": {Kind: kindBool, Desc: "隐藏图标描述"},
	"iconTextIconHideTitle":       {Kind: kindBool, Desc: "隐藏图标标题"},
	"clockShowSecond":             {Kind: kindBool, Desc: "时钟显示秒"},
	"clockColor":                  {Kind: kindColor, Desc: "时钟颜色"},
	"searchBoxShow":               {Kind: kindBool, Desc: "显示搜索框"},
	"searchBoxSearchIcon":         {Kind: kindBool, Desc: "搜索框显示搜索图标"},
	"marginTop":                   {Kind: kindNumber, Desc: "顶部间距", Min: 0, Max: 500},
	"marginBottom":                {Kind: kindNumber, Desc: "底部间距", Min: 0, Max: 500},
	"marginX":                     {Kind: kindNumber, Desc: "左右间距", Min: 0, Max: 500},
	"maxWidth":                    {Kind: kindNumber, Desc: "内容最大宽度", Min: 0, Max: 10000},
	"footerHtml":                  {Kind: kindString, Desc: "页脚内容"},
	"systemMonitorShow":           {Kind: kindBool, Desc: "显示系统监控"},
	"systemMonitorShowTitle":      {Kind: kindBool, Desc: "系统监控显示标题"},
	"netModeChangeButtonShow":     {Kind: kindBool, Desc: "显示内外网切换按钮"},
}

// ===================== settings.read =====================

type readSettingsTool struct{}

func (readSettingsTool) Name() string           { return "settings.read" }
func (readSettingsTool) Permission() Permission { return PermissionRead }
func (readSettingsTool) Description() string    { return "查看面板外观设置（白名单范围内）" }
func (readSettingsTool) ParamsSchema() map[string]string {
	return map[string]string{"keys": "可选，想查看的设置项名数组；不给则返回全部可读项"}
}

func (readSettingsTool) Execute(ec *ExecContext) (Result, error) {
	var p struct {
		Keys []string `json:"keys"`
	}
	ec.Bind(&p)
	panelCfg, err := loadPanelConfig(ec.UserId)
	if err != nil {
		return Result{Kind: "reply", Reply: "读取面板设置失败：" + err.Error()}, nil
	}
	want := map[string]bool{}
	for _, k := range p.Keys {
		want[strings.TrimSpace(k)] = true
	}
	out := map[string]any{}
	keys := make([]string, 0, len(settingsWhitelist))
	for k := range settingsWhitelist {
		keys = append(keys, k)
	}
	sort.Strings(keys)
	var sb strings.Builder
	sb.WriteString("当前面板设置：")
	for _, k := range keys {
		if len(want) > 0 && !want[k] {
			continue
		}
		v, ok := panelCfg[k]
		if !ok {
			continue
		}
		out[k] = v
		sb.WriteString(fmt.Sprintf("\n· %s（%s）= %v", k, settingsWhitelist[k].Desc, v))
	}
	if len(out) == 0 {
		return Result{Kind: "reply", Reply: "这些设置项目前还是默认值（未保存过）"}, nil
	}
	return Result{Kind: "data", Reply: sb.String(), Data: map[string]any{"settings": out}}, nil
}

// ===================== settings.write =====================

type writeSettingsTool struct{}

func (writeSettingsTool) Name() string           { return "settings.write" }
func (writeSettingsTool) Permission() Permission { return PermissionUpdate }
func (writeSettingsTool) Description() string {
	return "修改面板外观设置（仅白名单项，如站点标题、背景模糊、时钟、间距等）"
}
func (writeSettingsTool) ParamsSchema() map[string]string {
	return map[string]string{"settings": "对象，键为设置项名，值为新值。可用项：" + strings.Join(whitelistKeys(), "/")}
}

func (writeSettingsTool) Execute(ec *ExecContext) (Result, error) {
	var p struct {
		Settings map[string]any `json:"settings"`
	}
	ec.Bind(&p)
	if len(p.Settings) == 0 {
		return Result{Kind: "reply", Reply: "请告诉我要改哪个设置项，可用项：" + strings.Join(whitelistKeys(), "、")}, nil
	}
	panelCfg, err := loadPanelConfig(ec.UserId)
	if err != nil {
		return Result{Kind: "reply", Reply: "读取面板设置失败：" + err.Error()}, nil
	}

	applied := map[string]any{}
	before := map[string]any{}
	rejected := []string{}
	for k, v := range p.Settings {
		k = strings.TrimSpace(k)
		spec, ok := settingsWhitelist[k]
		if !ok {
			rejected = append(rejected, k+"（不在允许范围）")
			continue
		}
		norm, verr := normalizeSettingValue(spec, v)
		if verr != nil {
			rejected = append(rejected, k+"（"+verr.Error()+"）")
			continue
		}
		before[k] = panelCfg[k]
		panelCfg[k] = norm
		applied[k] = norm
	}
	if len(applied) == 0 {
		return Result{Kind: "reply", Reply: "没有可应用的设置：" + strings.Join(rejected, "；")}, nil
	}
	if err := savePanelConfig(ec.UserId, panelCfg); err != nil {
		return Result{}, err
	}
	LogOp(ec.UserId, "settings_write", fmt.Sprintf("修改面板设置（%d 项）", len(applied)), JSONStr(before), JSONStr(applied))

	var sb strings.Builder
	sb.WriteString(fmt.Sprintf("已修改 %d 项面板设置：", len(applied)))
	for k, v := range applied {
		sb.WriteString(fmt.Sprintf("\n· %s → %v", k, v))
	}
	if len(rejected) > 0 {
		sb.WriteString("\n未生效：" + strings.Join(rejected, "；"))
	}
	return Result{Kind: "changed", Reply: sb.String(), Changed: true}, nil
}

// ===================== 内部实现 =====================

func whitelistKeys() []string {
	keys := make([]string, 0, len(settingsWhitelist))
	for k := range settingsWhitelist {
		keys = append(keys, k)
	}
	sort.Strings(keys)
	return keys
}

func normalizeSettingValue(spec settingSpec, v any) (any, error) {
	switch spec.Kind {
	case kindBool:
		switch t := v.(type) {
		case bool:
			return t, nil
		case string:
			b, err := strconv.ParseBool(strings.TrimSpace(t))
			if err != nil {
				return nil, fmt.Errorf("需要 true/false")
			}
			return b, nil
		case float64:
			return t != 0, nil
		}
		return nil, fmt.Errorf("需要 true/false")
	case kindNumber:
		var f float64
		switch t := v.(type) {
		case float64:
			f = t
		case int:
			f = float64(t)
		case string:
			pf, err := strconv.ParseFloat(strings.TrimSpace(t), 64)
			if err != nil {
				return nil, fmt.Errorf("需要数字")
			}
			f = pf
		default:
			return nil, fmt.Errorf("需要数字")
		}
		if spec.Max > 0 && (f < spec.Min || f > spec.Max) {
			return nil, fmt.Errorf("超出范围 %g~%g", spec.Min, spec.Max)
		}
		return f, nil
	case kindColor:
		s, ok := v.(string)
		if !ok {
			return nil, fmt.Errorf("需要颜色字符串")
		}
		s = strings.TrimSpace(s)
		if s == "" {
			return nil, fmt.Errorf("颜色不能为空")
		}
		if len(s) > 32 {
			return nil, fmt.Errorf("颜色值过长")
		}
		return s, nil
	default: // kindString
		s, ok := v.(string)
		if !ok {
			return nil, fmt.Errorf("需要文本")
		}
		s = strings.TrimSpace(s)
		if len(s) > 2000 {
			return nil, fmt.Errorf("内容过长")
		}
		// 禁止脚本注入（footerHtml 等会渲染到页面）
		low := strings.ToLower(s)
		if strings.Contains(low, "<script") || strings.Contains(low, "javascript:") || strings.Contains(low, "onerror=") {
			return nil, fmt.Errorf("包含脚本内容，已拒绝")
		}
		return s, nil
	}
}

func loadPanelConfig(userId uint) (map[string]any, error) {
	cfg := models.UserConfig{}
	err := global.Db.First(&cfg, "user_id=?", userId).Error
	if err != nil {
		if err == gorm.ErrRecordNotFound {
			return map[string]any{}, nil
		}
		return nil, err
	}
	out := map[string]any{}
	if strings.TrimSpace(cfg.PanelJson) != "" {
		if uerr := json.Unmarshal([]byte(cfg.PanelJson), &out); uerr != nil {
			return map[string]any{}, nil
		}
	}
	return out, nil
}

func savePanelConfig(userId uint, panelCfg map[string]any) error {
	j, err := json.Marshal(panelCfg)
	if err != nil {
		return err
	}
	existing := models.UserConfig{}
	if err := global.Db.First(&existing, "user_id=?", userId).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			return global.Db.Create(&models.UserConfig{UserId: userId, PanelJson: string(j)}).Error
		}
		return err
	}
	return global.Db.Model(&models.UserConfig{}).Where("user_id=?", userId).
		Update("panel_json", string(j)).Error
}
