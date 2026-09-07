package openapi

import (
	"encoding/json"
	"errors"
	"strings"

	"sun-panel/api/api_v1/common/apiReturn"
	"sun-panel/biz"
	"sun-panel/global"
	"sun-panel/lib/cmn"
	"sun-panel/lib/siteFavicon"
	"sun-panel/models"
	"sun-panel/models/datatype"

	"github.com/gin-gonic/gin"
	"github.com/gin-gonic/gin/binding"
)

// ItemApi 图标卡片的开放接口（供浏览器插件添加网址）。
type ItemApi struct{}

// itemReq 官方 OpenAPI v1 的卡片参数，字段名与官方文档保持一致。
type itemReq struct {
	OnlyName          string `json:"onlyName"`
	IconUrl           string `json:"iconUrl"`
	Title             string `json:"title"`
	Url               string `json:"url"`
	LanUrl            string `json:"lanUrl"`
	Description       string `json:"description"`
	ItemGroupID       uint   `json:"itemGroupID"`
	ItemGroupOnlyName string `json:"itemGroupOnlyName"`
	IsSaveIcon        bool   `json:"isSaveIcon"`
}

// Create 创建一个新的项目卡片。
func (a ItemApi) Create(c *gin.Context) {
	userId := currentOpenApiUserId(c)
	if userId == 0 {
		return
	}

	param := itemReq{}
	if err := c.ShouldBindBodyWith(&param, binding.JSON); err != nil {
		apiReturn.ErrorParamFomat(c, err.Error())
		return
	}
	if strings.TrimSpace(param.Url) == "" {
		apiReturn.ErrorParamFomat(c, "url is required")
		return
	}

	groupId, err := resolveGroupId(userId, param.ItemGroupID, param.ItemGroupOnlyName)
	if err != nil {
		apiReturn.ErrorByCode(c, 1202)
		return
	}

	onlyName := strings.TrimSpace(param.OnlyName)
	if onlyName == "" {
		onlyName = "item-" + cmn.BuildRandCode(10, cmn.RAND_CODE_MODE1)
	}

	iconUrl := strings.TrimSpace(param.IconUrl)
	if param.IsSaveIcon && iconUrl == "" {
		if favicon, ok := siteFavicon.GetOneFaviconURLAndUpload(param.Url); ok {
			iconUrl = favicon
		}
	}

	item := models.ItemIcon{
		Title:           strings.TrimSpace(param.Title),
		Url:             strings.TrimSpace(param.Url),
		LanUrl:          strings.TrimSpace(param.LanUrl),
		Description:     strings.TrimSpace(param.Description),
		OpenMethod:      2, // 新窗口打开
		ItemIconGroupId: int(groupId),
		UserId:          userId,
		OnlyName:        onlyName,
		Icon:            datatype.ItemIconIconInfo{ItemType: 2, Src: iconUrl},
		Addresses:       buildAddresses(param.Url, param.LanUrl, 2),
	}

	if iconJson, jsonErr := json.Marshal(item.Icon); jsonErr == nil {
		item.IconJson = string(iconJson)
	}
	if addressJson, jsonErr := json.Marshal(item.Addresses); jsonErr == nil {
		item.AddressesJson = string(addressJson)
	}

	if err := global.Db.Create(&item).Error; err != nil {
		apiReturn.ErrorDatabase(c, err.Error())
		return
	}

	global.Logger.Infof("OpenAPI 创建卡片成功：onlyName=%s userId=%d", onlyName, userId)
	apiReturn.Success(c)
}

// Update 按唯一标识修改项目卡片，未传的字段保持不变。
func (a ItemApi) Update(c *gin.Context) {
	userId := currentOpenApiUserId(c)
	if userId == 0 {
		return
	}

	param := itemReq{}
	if err := c.ShouldBindBodyWith(&param, binding.JSON); err != nil {
		apiReturn.ErrorParamFomat(c, err.Error())
		return
	}
	if strings.TrimSpace(param.OnlyName) == "" {
		apiReturn.ErrorParamFomat(c, "onlyName is required")
		return
	}

	item := models.ItemIcon{}
	if err := global.Db.First(&item, "only_name = ? AND user_id = ?", param.OnlyName, userId).Error; err != nil {
		apiReturn.ErrorByCode(c, 1203)
		return
	}

	if strings.TrimSpace(param.Title) != "" {
		item.Title = strings.TrimSpace(param.Title)
	}
	if strings.TrimSpace(param.Url) != "" {
		item.Url = strings.TrimSpace(param.Url)
	}
	if strings.TrimSpace(param.Description) != "" {
		item.Description = strings.TrimSpace(param.Description)
	}
	if strings.TrimSpace(param.LanUrl) != "" {
		item.LanUrl = strings.TrimSpace(param.LanUrl)
	}
	if strings.TrimSpace(param.IconUrl) != "" {
		item.Icon = datatype.ItemIconIconInfo{ItemType: 2, Src: strings.TrimSpace(param.IconUrl)}
	}
	if param.ItemGroupID > 0 || strings.TrimSpace(param.ItemGroupOnlyName) != "" {
		groupId, err := resolveGroupId(userId, param.ItemGroupID, param.ItemGroupOnlyName)
		if err != nil {
			apiReturn.ErrorByCode(c, 1202)
			return
		}
		item.ItemIconGroupId = int(groupId)
	}
	if strings.TrimSpace(param.Url) != "" || strings.TrimSpace(param.LanUrl) != "" {
		item.Addresses = buildAddresses(item.Url, item.LanUrl, item.OpenMethod)
	}

	if iconJson, jsonErr := json.Marshal(item.Icon); jsonErr == nil {
		item.IconJson = string(iconJson)
	}
	if addressJson, jsonErr := json.Marshal(item.Addresses); jsonErr == nil {
		item.AddressesJson = string(addressJson)
	}

	updateFields := []string{
		"IconJson", "Title", "Url", "LanUrl", "Description", "ItemIconGroupId", "AddressesJson",
	}
	if err := global.Db.Model(&models.ItemIcon{}).
		Where("id = ?", item.ID).
		Select(updateFields).
		Updates(&item).Error; err != nil {
		apiReturn.ErrorDatabase(c, err.Error())
		return
	}

	apiReturn.Success(c)
}

// GetInfoByOnlyName 按唯一标识查询卡片信息。
func (a ItemApi) GetInfoByOnlyName(c *gin.Context) {
	userId := currentOpenApiUserId(c)
	if userId == 0 {
		return
	}

	param := struct {
		OnlyName string `json:"onlyName"`
	}{}
	if err := c.ShouldBindBodyWith(&param, binding.JSON); err != nil {
		apiReturn.ErrorParamFomat(c, err.Error())
		return
	}

	item := models.ItemIcon{}
	if err := global.Db.First(&item, "only_name = ? AND user_id = ?", param.OnlyName, userId).Error; err != nil {
		apiReturn.ErrorByCode(c, 1203)
		return
	}

	group := models.ItemIconGroup{}
	_ = global.Db.First(&group, "id = ?", item.ItemIconGroupId).Error

	apiReturn.SuccessData(c, gin.H{
		"onlyName":          item.OnlyName,
		"title":             item.Title,
		"url":               item.Url,
		"lanUrl":            item.LanUrl,
		"description":       item.Description,
		"iconUrl":           item.Icon.Src,
		"itemGroupID":       item.ItemIconGroupId,
		"itemGroupOnlyName": group.OnlyName,
	})
}

// BatchUpdate 批量修改卡片，单项失败不影响其他项。
func (a ItemApi) BatchUpdate(c *gin.Context) {
	userId := currentOpenApiUserId(c)
	if userId == 0 {
		return
	}

	param := struct {
		Items []itemReq `json:"items"`
	}{}
	if err := c.ShouldBindBodyWith(&param, binding.JSON); err != nil {
		apiReturn.ErrorParamFomat(c, err.Error())
		return
	}
	if len(param.Items) == 0 {
		apiReturn.ErrorParamFomat(c, "items is empty")
		return
	}

	successCount := 0
	failItems := []gin.H{}
	for _, one := range param.Items {
		if strings.TrimSpace(one.OnlyName) == "" {
			failItems = append(failItems, gin.H{"onlyName": one.OnlyName, "error": "onlyName is required"})
			continue
		}

		item := models.ItemIcon{}
		if err := global.Db.First(&item, "only_name = ? AND user_id = ?", one.OnlyName, userId).Error; err != nil {
			failItems = append(failItems, gin.H{"onlyName": one.OnlyName, "error": "item not found"})
			continue
		}

		applyItemUpdate(&item, one, userId)
		if err := global.Db.Model(&models.ItemIcon{}).Where("id = ?", item.ID).
			Select([]string{"IconJson", "Title", "Url", "LanUrl", "Description", "ItemIconGroupId", "AddressesJson"}).
			Updates(&item).Error; err != nil {
			failItems = append(failItems, gin.H{"onlyName": one.OnlyName, "error": err.Error()})
			continue
		}
		successCount++
	}

	apiReturn.SuccessData(c, gin.H{
		"successCount": successCount,
		"failCount":    len(failItems),
		"failItems":    failItems,
	})
}

// applyItemUpdate 把请求里的非空字段套用到已有卡片上。
func applyItemUpdate(item *models.ItemIcon, param itemReq, userId uint) {
	if strings.TrimSpace(param.Title) != "" {
		item.Title = strings.TrimSpace(param.Title)
	}
	if strings.TrimSpace(param.Url) != "" {
		item.Url = strings.TrimSpace(param.Url)
	}
	if strings.TrimSpace(param.Description) != "" {
		item.Description = strings.TrimSpace(param.Description)
	}
	if strings.TrimSpace(param.LanUrl) != "" {
		item.LanUrl = strings.TrimSpace(param.LanUrl)
	}
	iconUrl := strings.TrimSpace(param.IconUrl)
	if iconUrl != "" {
		item.Icon = datatype.ItemIconIconInfo{ItemType: 2, Src: iconUrl}
	}
	if param.ItemGroupID > 0 || strings.TrimSpace(param.ItemGroupOnlyName) != "" {
		if groupId, err := resolveGroupId(userId, param.ItemGroupID, param.ItemGroupOnlyName); err == nil {
			item.ItemIconGroupId = int(groupId)
		}
	}
	item.Addresses = buildAddresses(item.Url, item.LanUrl, item.OpenMethod)

	if iconJson, err := json.Marshal(item.Icon); err == nil {
		item.IconJson = string(iconJson)
	}
	if addressJson, err := json.Marshal(item.Addresses); err == nil {
		item.AddressesJson = string(addressJson)
	}
}

// buildAddresses 把 url / lanUrl 组装成前端使用的多地址结构。
func buildAddresses(url, lanUrl string, openMethod int) []datatype.ItemAddress {
	list := []datatype.ItemAddress{}
	if strings.TrimSpace(url) != "" {
		list = append(list, datatype.ItemAddress{
			Id:         "default-" + cmn.BuildRandCode(6, cmn.RAND_CODE_MODE1),
			Name:       "默认",
			Url:        strings.TrimSpace(url),
			Type:       "https",
			IsDefault:  true,
			Sort:       0,
			Enabled:    true,
			OpenMethod: openMethod,
		})
	}
	if strings.TrimSpace(lanUrl) != "" {
		list = append(list, datatype.ItemAddress{
			Id:         "lan-" + cmn.BuildRandCode(6, cmn.RAND_CODE_MODE1),
			Name:       "局域网",
			Url:        strings.TrimSpace(lanUrl),
			Type:       "lan",
			IsDefault:  false,
			Sort:       1,
			Enabled:    true,
			OpenMethod: openMethod,
		})
	}
	return list
}

// resolveGroupId 确定卡片归属分组：ID 优先，其次唯一标识，都没有则落到插件专用分组。
func resolveGroupId(userId, groupId uint, groupOnlyName string) (uint, error) {
	if groupId > 0 {
		group := models.ItemIconGroup{}
		if err := global.Db.First(&group, "id = ? AND user_id = ?", groupId, userId).Error; err != nil {
			return 0, errors.New("group not found")
		}
		return group.ID, nil
	}

	onlyName := strings.TrimSpace(groupOnlyName)
	if onlyName != "" {
		group := models.ItemIconGroup{}
		if err := global.Db.First(&group, "only_name = ? AND user_id = ?", onlyName, userId).Error; err == nil {
			return group.ID, nil
		}
	}

	// 兜底：取该账号的第一个分组，实在没有就建一个插件专用分组
	first := models.ItemIconGroup{}
	if err := global.Db.Order("sort asc, id asc").First(&first, "user_id = ?", userId).Error; err == nil && first.ID != 0 {
		return first.ID, nil
	}

	created := models.ItemIconGroup{
		Title:    "浏览器插件",
		OnlyName: "browser-plugin",
		Sort:     0,
		UserId:   userId,
	}
	if err := global.Db.Create(&created).Error; err != nil {
		return 0, err
	}
	global.Logger.Infof("OpenAPI 自动创建插件专用分组：id=%d userId=%d", created.ID, userId)
	return created.ID, nil
}

// currentOpenApiUserId 校验请求头里的 token，失败时已写好响应并返回 0。
func currentOpenApiUserId(c *gin.Context) uint {
	token := c.GetHeader("token")
	if token == "" {
		token = c.GetHeader("Token")
	}

	userId, ok := biz.VerifyOpenApiToken(token)
	if !ok {
		apiReturn.ErrorByCode(c, 1005)
		c.Abort()
		return 0
	}
	if !biz.FeatureEnabled(biz.FeatureOpenApi) {
		apiReturn.ErrorNoAccess(c)
		c.Abort()
		return 0
	}
	return userId
}
