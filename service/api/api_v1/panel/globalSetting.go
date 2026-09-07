package panel

import (
	"errors"
	"fmt"
	"os"
	"path"
	"path/filepath"
	"strings"
	"time"

	"sun-panel/api/api_v1/common/apiReturn"
	"sun-panel/biz"
	"sun-panel/global"
	"sun-panel/lib/cmn"

	"github.com/gin-gonic/gin"
	"github.com/gin-gonic/gin/binding"
)

// GlobalSettingApi 站点全局设置：品牌信息 + 在线自定义 CSS/JS。
type GlobalSettingApi struct{}

// GlobalSettingCustomJsAndCss 自定义脚本与样式的请求体。
type GlobalSettingCustomJsAndCss struct {
	JsContent  string `json:"jsContent"`
	CssContent string `json:"cssContent"`
}

// GetSiteStting 读取站点品牌设置。
func (a GlobalSettingApi) GetSiteStting(c *gin.Context) {
	if !biz.FeatureEnabled(biz.FeatureBranding) {
		apiReturn.ErrorNoAccess(c)
		return
	}

	setting, err := biz.GetSiteSetting()
	if err != nil {
		// 从未设置过，返回空配置让前端按默认值展示
		apiReturn.SuccessData(c, biz.GlobalSettingSiteSetting{})
		return
	}
	apiReturn.SuccessData(c, setting)
}

// SaveSiteStting 保存站点品牌设置。
func (a GlobalSettingApi) SaveSiteStting(c *gin.Context) {
	if !biz.FeatureEnabled(biz.FeatureBranding) {
		apiReturn.ErrorNoAccess(c)
		return
	}

	param := biz.GlobalSettingSiteSetting{}
	if err := c.ShouldBindBodyWith(&param, binding.JSON); err != nil {
		apiReturn.ErrorParamFomat(c, err.Error())
		return
	}

	param.Title = strings.TrimSpace(param.Title)
	if len([]rune(param.Title)) > 50 {
		apiReturn.ErrorParamFomat(c, "title too long")
		return
	}
	// 只允许站点内的相对路径或完整 http(s) 地址，避免引入外部脚本
	param.FaviconUrl = sanitizeSiteUrl(param.FaviconUrl)
	param.LoginBackgroundUrl = sanitizeSiteUrl(param.LoginBackgroundUrl)

	if err := biz.SaveSiteSetting(param); err != nil {
		apiReturn.ErrorDatabase(c, err.Error())
		return
	}
	apiReturn.Success(c)
}

// UploadFaviconImage 上传站点图标。
func (a GlobalSettingApi) UploadFaviconImage(c *gin.Context) {
	if !biz.FeatureEnabled(biz.FeatureBranding) {
		apiReturn.ErrorNoAccess(c)
		return
	}

	url, err := uploadSiteImage(c, "imgfile")
	if err != nil {
		apiReturn.ErrorByCode(c, 1300)
		return
	}
	apiReturn.SuccessData(c, gin.H{"imageUrl": url})
}

// UploadLoginBackgroundImage 上传登录页背景图。
func (a GlobalSettingApi) UploadLoginBackgroundImage(c *gin.Context) {
	if !biz.FeatureEnabled(biz.FeatureBranding) {
		apiReturn.ErrorNoAccess(c)
		return
	}

	url, err := uploadSiteImage(c, "imgfile")
	if err != nil {
		apiReturn.ErrorByCode(c, 1300)
		return
	}
	apiReturn.SuccessData(c, gin.H{"imageUrl": url})
}

// GetCustomStylePath 返回自定义样式目录，供前端展示。
func (a GlobalSettingApi) GetCustomStylePath(c *gin.Context) {
	if !biz.FeatureEnabled(biz.FeatureCustomCode) {
		apiReturn.ErrorNoAccess(c)
		return
	}

	dir, err := biz.EnsureCustomDir()
	if err != nil {
		apiReturn.Error(c, err.Error())
		return
	}
	absPath, _ := filepath.Abs(dir)
	apiReturn.SuccessData(c, gin.H{"path": absPath})
}

// GetCustomJsAndCssCode 读取自定义 JS 与 CSS 内容。
func (a GlobalSettingApi) GetCustomJsAndCssCode(c *gin.Context) {
	if !biz.FeatureEnabled(biz.FeatureCustomCode) {
		apiReturn.ErrorNoAccess(c)
		return
	}

	jsContent, cssContent, err := biz.GetCustomCode()
	if err != nil {
		// 文件还没建过，按空内容返回
		apiReturn.SuccessData(c, gin.H{"jsContent": "", "cssContent": ""})
		return
	}
	apiReturn.SuccessData(c, gin.H{"jsContent": jsContent, "cssContent": cssContent})
}

// SaveCustomJsAndCssCode 保存自定义 JS 与 CSS。
func (a GlobalSettingApi) SaveCustomJsAndCssCode(c *gin.Context) {
	if !biz.FeatureEnabled(biz.FeatureCustomCode) {
		apiReturn.ErrorNoAccess(c)
		return
	}

	param := GlobalSettingCustomJsAndCss{}
	if err := c.ShouldBindBodyWith(&param, binding.JSON); err != nil {
		apiReturn.ErrorParamFomat(c, err.Error())
		return
	}

	if err := biz.SaveCustomCode(param.JsContent, param.CssContent); err != nil {
		apiReturn.Error(c, err.Error())
		return
	}
	apiReturn.Success(c)
}

// uploadSiteImage 保存站点图片（图标 / 登录背景），返回可直接在网页引用的地址。
func uploadSiteImage(c *gin.Context, fieldName string) (string, error) {
	f, err := c.FormFile(fieldName)
	if err != nil {
		return "", err
	}

	fileExt := strings.ToLower(path.Ext(f.Filename))
	agreeExts := []string{".png", ".jpg", ".jpeg", ".gif", ".webp", ".svg", ".ico"}
	if !cmn.InArray(agreeExts, fileExt) {
		return "", errors.New("unsupported file format")
	}

	configUpload := global.Config.GetValueString("base", "source_path")
	saveDir := fmt.Sprintf("%s/site/", strings.TrimRight(configUpload, "/"))
	if exist, _ := cmn.PathExists(saveDir); !exist {
		if err := os.MkdirAll(saveDir, os.ModePerm); err != nil {
			return "", err
		}
	}

	fileName := cmn.Md5(fmt.Sprintf("%s%s", f.Filename, time.Now().String()))
	savePath := saveDir + fileName + fileExt
	if err := c.SaveUploadedFile(f, savePath); err != nil {
		return "", err
	}

	// ./uploads/xxx -> /uploads/xxx
	return strings.TrimPrefix(savePath, "."), nil
}

// sanitizeSiteUrl 只放行站内相对路径与 http(s) 地址，挡掉 javascript: 之类的伪协议。
func sanitizeSiteUrl(raw string) string {
	value := strings.TrimSpace(raw)
	if value == "" {
		return ""
	}
	lower := strings.ToLower(value)
	if strings.HasPrefix(lower, "http://") || strings.HasPrefix(lower, "https://") {
		return value
	}
	if strings.HasPrefix(value, "/") {
		return value
	}
	return ""
}
