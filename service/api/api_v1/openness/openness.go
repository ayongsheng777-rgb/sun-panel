package openness

import (
	"sun-panel/api/api_v1/common/apiReturn"
	"sun-panel/global"
	"sun-panel/lib/cmn/systemSetting"

	"github.com/gin-gonic/gin"
)

type Openness struct {
}

func (a *Openness) LoginConfig(c *gin.Context) {
	cfg := systemSetting.ApplicationSetting{}
	if err := global.SystemSetting.GetValueByInterface(systemSetting.SYSTEM_APPLICATION, &cfg); err != nil {
		apiReturn.Error(c, "配置查询失败："+err.Error())
		return
	}
	apiReturn.SuccessData(c, gin.H{
		"loginCaptcha": cfg.LoginCaptcha,
		"register":     cfg.Register,
	})
}

func (a *Openness) GetDisclaimer(c *gin.Context) {
	if content, err := global.SystemSetting.GetValueString(systemSetting.DISCLAIMER); err != nil {
		global.SystemSetting.Set(systemSetting.DISCLAIMER, "")
		apiReturn.SuccessData(c, "")
		return
	} else {
		apiReturn.SuccessData(c, content)
	}
}

func (a *Openness) GetAboutDescription(c *gin.Context) {
	if content, err := global.SystemSetting.GetValueString(systemSetting.WEB_ABOUT_DESCRIPTION); err != nil {
		global.SystemSetting.Set(systemSetting.WEB_ABOUT_DESCRIPTION, "")
		apiReturn.SuccessData(c, "")
		return
	} else {
		apiReturn.SuccessData(c, content)
	}
}

// ProIsExpired 授权状态探测。
//
// 官方 Sun-Panel 用这个接口返回 PRO 是否过期（连远程授权服务器校验）。
// 本 Fork 已彻底移除 PRO 授权限制，所有功能本地无差别全开，
// 因此这里恒返回 isExpired=false，让仿 VIP 布局的前端显示「已解锁」。
// 保留该路径是为了兼容官方浏览器插件 / 第三方工具对 PRO 状态的探测。
func (a *Openness) ProIsExpired(c *gin.Context) {
	apiReturn.SuccessData(c, gin.H{
		"isExpired": false,
	})
}
