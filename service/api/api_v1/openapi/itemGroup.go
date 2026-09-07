package openapi

import (
	"strings"

	"sun-panel/api/api_v1/common/apiReturn"
	"sun-panel/global"
	"sun-panel/lib/cmn"
	"sun-panel/models"

	"github.com/gin-gonic/gin"
	"github.com/gin-gonic/gin/binding"
)

// ItemGroupApi 分组的开放接口，浏览器插件用它列出可添加到的分组。
type ItemGroupApi struct{}

// GetList 返回该账号下的分组列表。
func (a ItemGroupApi) GetList(c *gin.Context) {
	userId := currentOpenApiUserId(c)
	if userId == 0 {
		return
	}

	list := []models.ItemIconGroup{}
	if err := global.Db.Order("sort asc, id asc").Find(&list, "user_id = ?", userId).Error; err != nil {
		apiReturn.ErrorDatabase(c, err.Error())
		return
	}

	data := make([]gin.H, 0, len(list))
	for _, v := range list {
		data = append(data, gin.H{
			"id":       v.ID,
			"title":    v.Title,
			"onlyName": v.OnlyName,
		})
	}
	apiReturn.SuccessData(c, gin.H{"list": data})
}

// Create 新建分组，已存在同名唯一标识时直接返回已有的。
func (a ItemGroupApi) Create(c *gin.Context) {
	userId := currentOpenApiUserId(c)
	if userId == 0 {
		return
	}

	param := struct {
		Title    string `json:"title"`
		OnlyName string `json:"onlyName"`
	}{}
	if err := c.ShouldBindBodyWith(&param, binding.JSON); err != nil {
		apiReturn.ErrorParamFomat(c, err.Error())
		return
	}
	if strings.TrimSpace(param.Title) == "" {
		apiReturn.ErrorParamFomat(c, "title is required")
		return
	}

	onlyName := strings.TrimSpace(param.OnlyName)
	if onlyName != "" {
		exist := models.ItemIconGroup{}
		if err := global.Db.First(&exist, "only_name = ? AND user_id = ?", onlyName, userId).Error; err == nil {
			apiReturn.SuccessData(c, gin.H{"id": exist.ID, "onlyName": exist.OnlyName})
			return
		}
	} else {
		onlyName = "group-" + cmn.BuildRandCode(10, cmn.RAND_CODE_MODE1)
	}

	group := models.ItemIconGroup{
		Title:    strings.TrimSpace(param.Title),
		OnlyName: onlyName,
		UserId:   userId,
	}
	if err := global.Db.Create(&group).Error; err != nil {
		apiReturn.ErrorDatabase(c, err.Error())
		return
	}
	apiReturn.SuccessData(c, gin.H{"id": group.ID, "onlyName": group.OnlyName})
}
