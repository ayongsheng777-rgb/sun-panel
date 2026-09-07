package panel

import (
	"errors"
	"fmt"
	"os"
	"path"
	"strings"
	"time"

	"sun-panel/api/api_v1/common/apiReturn"
	"sun-panel/biz"
	"sun-panel/global"
	"sun-panel/lib/cmn"
	"sun-panel/models"

	"github.com/gin-gonic/gin"
	"github.com/gin-gonic/gin/binding"
	"gorm.io/gorm"
)

// 公共图库的文件用途分类。
const (
	PublicGalleryTypeWallpaper = 1 // 壁纸
	PublicGalleryTypeIcon      = 2 // 图标
)

var errUnsupportedFormat = errors.New("unsupported file format")

// PublicGalleryApi 公共图库：管理员维护，所有登录账号都能读取使用。
type PublicGalleryApi struct{}

type publicGalleryListReq struct {
	Type int `json:"type"` // 0 或不传表示全部
	Page int `json:"page"`
	Size int `json:"size"`
}

// GetImagesList 公共图库列表。
func (a PublicGalleryApi) GetImagesList(c *gin.Context) {
	if !biz.FeatureEnabled(biz.FeaturePublicGallery) {
		apiReturn.ErrorNoAccess(c)
		return
	}

	param := publicGalleryListReq{}
	// 列表接口同时支持 GET 与 POST，参数缺失时走默认值
	_ = c.ShouldBindBodyWith(&param, binding.JSON)

	page := param.Page
	if page <= 0 {
		page = 1
	}
	size := param.Size
	if size <= 0 {
		size = 50
	} else if size > 200 {
		size = 200
	}

	db := global.Db.Model(&models.File{}).Where("is_public_gallery = ?", true)
	if param.Type > 0 {
		db = db.Where("type = ?", param.Type)
	}

	var count int64
	if err := db.Count(&count).Error; err != nil {
		apiReturn.ErrorDatabase(c, err.Error())
		return
	}

	list := []models.File{}
	if err := db.Order("created_at desc").Offset((page - 1) * size).Limit(size).Find(&list).Error; err != nil {
		apiReturn.ErrorDatabase(c, err.Error())
		return
	}

	data := make([]map[string]interface{}, 0, len(list))
	for _, v := range list {
		data = append(data, map[string]interface{}{
			"id":              v.ID,
			"src":             strings.TrimPrefix(v.Src, "."),
			"fileName":        v.FileName,
			"type":            v.Type,
			"ext":             v.Ext,
			"isPublicGallery": v.IsPublicGallery,
			"createTime":      v.CreatedAt,
		})
	}
	apiReturn.SuccessListData(c, data, count)
}

// UploadImg 上传图片到公共图库。
func (a PublicGalleryApi) UploadImg(c *gin.Context) {
	if !biz.FeatureEnabled(biz.FeaturePublicGallery) {
		apiReturn.ErrorNoAccess(c)
		return
	}

	imageUrl, savePath, fileExt, fileName, err := saveGalleryUpload(c)
	if err != nil {
		apiReturn.ErrorByCode(c, 1300)
		return
	}

	fileType := 0
	switch strings.TrimSpace(c.PostForm("fileType")) {
	case "wallpaper", "1":
		fileType = PublicGalleryTypeWallpaper
	case "icon", "2":
		fileType = PublicGalleryTypeIcon
	}

	file := models.File{
		FileName:        fileName,
		Src:             savePath,
		Ext:             fileExt,
		Type:            fileType,
		IsPublicGallery: true,
	}
	if err := global.Db.Create(&file).Error; err != nil {
		apiReturn.ErrorDatabase(c, err.Error())
		return
	}

	apiReturn.SuccessData(c, gin.H{"imageUrl": imageUrl, "id": file.ID})
}

// UpdateFileType 批量修改图片用途分类。
func (a PublicGalleryApi) UpdateFileType(c *gin.Context) {
	if !biz.FeatureEnabled(biz.FeaturePublicGallery) {
		apiReturn.ErrorNoAccess(c)
		return
	}

	param := struct {
		Ids  []uint `json:"ids"`
		Type int    `json:"type"`
	}{}
	if err := c.ShouldBindBodyWith(&param, binding.JSON); err != nil {
		apiReturn.ErrorParamFomat(c, err.Error())
		return
	}
	if len(param.Ids) == 0 {
		apiReturn.ErrorParamFomat(c, "ids is empty")
		return
	}

	if err := global.Db.Model(&models.File{}).
		Where("id in ? AND is_public_gallery = ?", param.Ids, true).
		Update("type", param.Type).Error; err != nil {
		apiReturn.ErrorDatabase(c, err.Error())
		return
	}
	apiReturn.Success(c)
}

// Deletes 删除公共图库图片（仅管理员，路由层已拦截）。
func (a PublicGalleryApi) Deletes(c *gin.Context) {
	if !biz.FeatureEnabled(biz.FeaturePublicGallery) {
		apiReturn.ErrorNoAccess(c)
		return
	}

	param := struct {
		Ids []uint `json:"ids"`
	}{}
	if err := c.ShouldBindBodyWith(&param, binding.JSON); err != nil {
		apiReturn.ErrorParamFomat(c, err.Error())
		return
	}
	if len(param.Ids) == 0 {
		apiReturn.ErrorParamFomat(c, "ids is empty")
		return
	}

	err := global.Db.Transaction(func(tx *gorm.DB) error {
		files := []models.File{}
		if err := tx.Where("id in ? AND is_public_gallery = ?", param.Ids, true).Find(&files).Error; err != nil {
			return err
		}
		for _, v := range files {
			_ = os.Remove(v.Src)
		}
		return tx.Delete(&models.File{}, "id in ? AND is_public_gallery = ?", param.Ids, true).Error
	})
	if err != nil {
		apiReturn.ErrorDatabase(c, err.Error())
		return
	}
	apiReturn.Success(c)
}

// saveGalleryUpload 保存上传的图片到 uploads/gallery/，返回网页可访问地址、磁盘路径、扩展名、原始文件名。
func saveGalleryUpload(c *gin.Context) (imageUrl, savePath, fileExt, fileName string, err error) {
	f, formErr := c.FormFile("imgfile")
	if formErr != nil {
		f, formErr = c.FormFile("file")
		if formErr != nil {
			err = formErr
			return
		}
	}

	fileExt = strings.ToLower(path.Ext(f.Filename))
	agreeExts := []string{".png", ".jpg", ".jpeg", ".gif", ".webp", ".svg", ".ico", ".bmp"}
	if !cmn.InArray(agreeExts, fileExt) {
		err = errUnsupportedFormat
		return
	}

	configUpload := strings.TrimRight(global.Config.GetValueString("base", "source_path"), "/")
	saveDir := fmt.Sprintf("%s/gallery/%d/%d/", configUpload, time.Now().Year(), time.Now().Month())
	if exist, _ := cmn.PathExists(saveDir); !exist {
		if mkErr := os.MkdirAll(saveDir, os.ModePerm); mkErr != nil {
			err = mkErr
			return
		}
	}

	fileName = f.Filename
	uniqueName := cmn.Md5(fmt.Sprintf("%s%s", f.Filename, time.Now().String()))
	savePath = saveDir + uniqueName + fileExt
	if err = c.SaveUploadedFile(f, savePath); err != nil {
		return
	}

	// ./uploads/xxx -> /uploads/xxx
	imageUrl = strings.TrimPrefix(savePath, ".")
	return
}
