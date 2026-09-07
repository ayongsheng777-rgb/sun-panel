package panel

import (
	"path/filepath"
	"strings"

	"sun-panel/api/api_v1/common/apiReturn"
	"sun-panel/biz"
	"sun-panel/global"

	"github.com/gin-gonic/gin"
	"github.com/gin-gonic/gin/binding"
)

// BackupApi 备份与迁移。
type BackupApi struct{}

type backupRecoveryReq struct {
	FileName string `json:"fileName"`
	Force    bool   `json:"force"`
}

// Backup 立即创建一个备份包。
func (a BackupApi) Backup(c *gin.Context) {
	if !biz.FeatureEnabled(biz.FeatureBackupMigration) {
		apiReturn.ErrorNoAccess(c)
		return
	}

	zipPath, err := biz.BackupToZip()
	if err != nil {
		apiReturn.Error(c, err.Error())
		return
	}

	apiReturn.SuccessData(c, gin.H{
		"fileName": filepath.Base(zipPath),
	})
}

// GetList 已有备份列表。
func (a BackupApi) GetList(c *gin.Context) {
	if !biz.FeatureEnabled(biz.FeatureBackupMigration) {
		apiReturn.ErrorNoAccess(c)
		return
	}

	list, err := biz.ListBackups()
	if err != nil {
		apiReturn.Error(c, err.Error())
		return
	}
	apiReturn.SuccessData(c, gin.H{"list": list})
}

// DownloadBackupZIPFile 下载备份包。
func (a BackupApi) DownloadBackupZIPFile(c *gin.Context) {
	if !biz.FeatureEnabled(biz.FeatureBackupMigration) {
		apiReturn.ErrorNoAccess(c)
		return
	}

	fileName := filepath.Base(strings.TrimSpace(c.Query("fileName")))
	if fileName == "" || fileName == "." || strings.Contains(fileName, "..") {
		apiReturn.ErrorParamFomat(c, "invalid file name")
		return
	}

	absPath, err := filepath.Abs(filepath.Join(biz.BackupDir, fileName))
	if err != nil {
		apiReturn.Error(c, err.Error())
		return
	}
	c.FileAttachment(absPath, fileName)
}

// UploadZipFile 上传备份包，用于从别的机器迁移过来。
func (a BackupApi) UploadZipFile(c *gin.Context) {
	if !biz.FeatureEnabled(biz.FeatureBackupMigration) {
		apiReturn.ErrorNoAccess(c)
		return
	}

	f, err := c.FormFile("file")
	if err != nil {
		apiReturn.ErrorByCode(c, 1300)
		return
	}
	if strings.ToLower(filepath.Ext(f.Filename)) != ".zip" {
		apiReturn.ErrorByCode(c, 1301)
		return
	}

	savePath := filepath.Join(biz.BackupDir, filepath.Base(f.Filename))
	if err := c.SaveUploadedFile(f, savePath); err != nil {
		apiReturn.Error(c, err.Error())
		return
	}

	apiReturn.SuccessData(c, gin.H{"fileName": filepath.Base(savePath)})
}

// Recovery 从备份包恢复。
func (a BackupApi) Recovery(c *gin.Context) {
	if !biz.FeatureEnabled(biz.FeatureBackupMigration) {
		apiReturn.ErrorNoAccess(c)
		return
	}

	param := backupRecoveryReq{}
	if err := c.ShouldBindBodyWith(&param, binding.JSON); err != nil {
		apiReturn.ErrorParamFomat(c, err.Error())
		return
	}
	if strings.TrimSpace(param.FileName) == "" {
		apiReturn.ErrorParamFomat(c, "fileName is empty")
		return
	}

	resp, err := biz.Recovery(param.FileName, param.Force)
	if err != nil {
		apiReturn.Error(c, err.Error())
		return
	}
	if resp.CompatibilityStatus == biz.CompatibilityMismatch {
		global.Logger.Infof("备份恢复被版本检查拦截：%s", param.FileName)
	}

	apiReturn.SuccessData(c, resp)
}
