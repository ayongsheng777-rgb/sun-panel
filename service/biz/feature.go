// Package biz 存放与具体 HTTP 层无关的业务逻辑。
package biz

import (
	"strings"

	"sun-panel/global"
)

// Feature 功能开关标识。
//
// 原版 Sun-Panel 用 PRO 授权服务控制这些能力，本 Fork 改为本地功能开关：
// 默认全部开启，需要临时关闭某个能力时，往系统设置表写一条
// ConfigName = "feature.<标识>"、ConfigValue = "false" 的记录即可，无需重新编译。
type Feature string

const (
	// FeatureCustomCode 在线自定义 CSS / JS
	FeatureCustomCode Feature = "custom_code"
	// FeatureMultiUser 多账号
	FeatureMultiUser Feature = "multi_user"
	// FeatureBranding 站点品牌信息
	FeatureBranding Feature = "branding"
	// FeatureDocker Docker 容器管理
	FeatureDocker Feature = "docker"
	// FeatureCustomSearch 自定义搜索引擎
	FeatureCustomSearch Feature = "custom_search"
	// FeatureCaptcha 登录图形验证码
	FeatureCaptcha Feature = "captcha"
	// FeatureAccountSwitcher 多账号快速切换
	FeatureAccountSwitcher Feature = "account_switcher"
	// FeaturePublicGallery 公共图库
	FeaturePublicGallery Feature = "public_gallery"
	// FeatureBackupMigration 备份与迁移
	FeatureBackupMigration Feature = "backup_migration"
	// FeatureOpenApi 开放接口（浏览器插件依赖它添加网址）
	FeatureOpenApi Feature = "open_api"
)

// FeatureConfigPrefix 功能开关在系统设置表中的键名前缀。
const FeatureConfigPrefix = "feature."

// DefaultFeatures 各功能的默认开关状态，本 Fork 全部开放。
var DefaultFeatures = map[Feature]bool{
	FeatureCustomCode:      true,
	FeatureMultiUser:       true,
	FeatureBranding:        true,
	FeatureDocker:          true,
	FeatureCustomSearch:    true,
	FeatureCaptcha:         true,
	FeatureAccountSwitcher: true,
	FeaturePublicGallery:   true,
	FeatureBackupMigration: true,
	FeatureOpenApi:         true,
}

// FeatureService 功能开关服务。
type FeatureService struct{}

var featureService = &FeatureService{}

// Enabled 判断某个功能当前是否可用。
//
// 优先级：系统设置表中的开关 > DefaultFeatures 默认值。
// 系统设置读取失败（例如记录不存在）时静默回退到默认值，不因为配置缺失导致功能异常。
func (s *FeatureService) Enabled(feature Feature) bool {
	if global.SystemSetting != nil {
		if value, err := global.SystemSetting.GetValueString(FeatureConfigPrefix + string(feature)); err == nil {
			switch strings.ToLower(strings.TrimSpace(value)) {
			case "false", "0", "off", "no", "disabled":
				return false
			case "true", "1", "on", "yes", "enabled":
				return true
			}
		}
	}

	if enabled, ok := DefaultFeatures[feature]; ok {
		return enabled
	}
	return false
}

// FeatureEnabled 全局快捷判断入口。
func FeatureEnabled(feature Feature) bool {
	return featureService.Enabled(feature)
}
