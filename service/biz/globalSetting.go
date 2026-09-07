package biz

import (
	"errors"
	"os"
	"path/filepath"
	"strings"

	"sun-panel/global"
	"sun-panel/lib/cmn/systemSetting"
)

const (
	// SystemGlobalSiteSetting 站点品牌设置在系统设置表中的键名。
	SystemGlobalSiteSetting = "global_site_setting"

	// CustomDir 自定义样式与脚本的存放目录（放在 conf 下，重新发版不会被清掉）。
	CustomDir = "conf/custom"

	// CustomJsFileName 自定义脚本文件名，与 index.html 中引用的名称保持一致。
	CustomJsFileName = "index.js"
	// CustomCssFileName 自定义样式文件名，与 index.html 中引用的名称保持一致。
	CustomCssFileName = "index.css"

	// LegacyCustomDir 旧版本存放位置，启动时会自动迁移到 CustomDir。
	LegacyCustomDir = "web/custom"
)

// GlobalSettingSiteSetting 站点品牌设置。
type GlobalSettingSiteSetting struct {
	// FaviconUrl 站点图标地址
	FaviconUrl string `json:"faviconUrl"`
	// Title 站点标题
	Title string `json:"title"`
	// LoginBackgroundUrl 登录页背景图地址
	LoginBackgroundUrl string `json:"loginBackgroundUrl"`
	// IsEnableLoginCaptcha 登录时是否要求输入图形验证码
	IsEnableLoginCaptcha bool `json:"isEnableLoginCaptcha"`
	// IsDisableItemCardCache 是否禁用卡片缓存
	IsDisableItemCardCache bool `json:"isDisableItemCardCache"`
}

// GetSiteSetting 读取站点品牌设置，记录不存在时返回零值。
func GetSiteSetting() (GlobalSettingSiteSetting, error) {
	setting := GlobalSettingSiteSetting{}
	if err := global.SystemSetting.GetValueByInterface(SystemGlobalSiteSetting, &setting); err != nil {
		// 记录不存在属于正常情况，返回零值让调用方走默认逻辑
		return GlobalSettingSiteSetting{}, err
	}
	return setting, nil
}

// SaveSiteSetting 保存站点品牌设置。
func SaveSiteSetting(setting GlobalSettingSiteSetting) error {
	if global.SystemSetting == nil {
		return errors.New("system setting not initialized")
	}
	return global.SystemSetting.Set(SystemGlobalSiteSetting, setting)
}

// IsLoginCaptchaEnabled 登录是否需要图形验证码。
//
// 兼容两套开关：早期版本存在 system_application 里的 loginCaptcha，
// 与本 Fork 站点设置里的 isEnableLoginCaptcha，任意一个打开即生效。
func IsLoginCaptchaEnabled() bool {
	if global.SystemSetting == nil {
		return false
	}

	appSetting := systemSetting.ApplicationSetting{}
	if err := global.SystemSetting.GetValueByInterface(systemSetting.SYSTEM_APPLICATION, &appSetting); err == nil {
		if appSetting.LoginCaptcha {
			return true
		}
	}

	siteSetting, err := GetSiteSetting()
	if err == nil && siteSetting.IsEnableLoginCaptcha {
		return true
	}
	return false
}

// SafeCustomPath 校验自定义文件名，防止 "../../" 之类的路径穿越。
func SafeCustomPath(base, name string) (string, error) {
	cleanName := filepath.Clean(filepath.Join("/", name))
	target := filepath.Join(base, cleanName)

	baseAbs, err := filepath.Abs(base)
	if err != nil {
		return "", err
	}
	targetAbs, err := filepath.Abs(target)
	if err != nil {
		return "", err
	}

	if targetAbs != baseAbs && !strings.HasPrefix(targetAbs, baseAbs+string(os.PathSeparator)) {
		return "", errors.New("invalid path")
	}
	return targetAbs, nil
}

// EnsureCustomDir 确保自定义目录存在，并把旧版 web/custom 里的文件迁移过来。
func EnsureCustomDir() (string, error) {
	if err := os.MkdirAll(CustomDir, 0755); err != nil {
		return CustomDir, err
	}
	migrateLegacyCustomCode()
	return CustomDir, nil
}

// migrateLegacyCustomCode 把 web/custom 下旧文件搬到 conf/custom，只补不覆盖。
func migrateLegacyCustomCode() {
	for _, name := range []string{CustomJsFileName, CustomCssFileName} {
		legacyPath := filepath.Join(LegacyCustomDir, name)
		targetPath := filepath.Join(CustomDir, name)

		if _, err := os.Stat(targetPath); err == nil {
			continue // 新位置已有文件，不覆盖
		}
		content, err := os.ReadFile(legacyPath)
		if err != nil {
			continue
		}
		_ = os.WriteFile(targetPath, content, 0644)
	}
}

// GetCustomCode 读取自定义 JS 与 CSS 内容，文件不存在时返回空字符串。
func GetCustomCode() (jsContent string, cssContent string, err error) {
	dir, err := EnsureCustomDir()
	if err != nil {
		return "", "", err
	}

	jsBytes, jsErr := os.ReadFile(filepath.Join(dir, CustomJsFileName))
	if jsErr == nil {
		jsContent = string(jsBytes)
	}
	cssBytes, cssErr := os.ReadFile(filepath.Join(dir, CustomCssFileName))
	if cssErr == nil {
		cssContent = string(cssBytes)
	}

	// 两个文件都不存在才算错误，单个缺失按空内容处理
	if jsErr != nil && cssErr != nil {
		return jsContent, cssContent, jsErr
	}
	return jsContent, cssContent, nil
}

// SaveCustomCode 写入自定义 JS 与 CSS。
func SaveCustomCode(jsContent, cssContent string) error {
	dir, err := EnsureCustomDir()
	if err != nil {
		return err
	}

	jsPath, err := SafeCustomPath(dir, CustomJsFileName)
	if err != nil {
		return err
	}
	cssPath, err := SafeCustomPath(dir, CustomCssFileName)
	if err != nil {
		return err
	}

	if err := os.WriteFile(jsPath, []byte(jsContent), 0644); err != nil {
		return err
	}
	return os.WriteFile(cssPath, []byte(cssContent), 0644)
}
