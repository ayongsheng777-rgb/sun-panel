package tools

import (
	"encoding/json"
	"fmt"
	"net/url"
	"os"
	"path"
	"strings"
	"time"

	"sun-panel/global"
	"sun-panel/lib/cmn"
	"sun-panel/lib/siteFavicon"
	"sun-panel/models"
	"sun-panel/models/datatype"
)

// ===================== 图标补齐 =====================

type fixIconsTool struct{}

func (fixIconsTool) Name() string           { return "panel.fix_icons" }
func (fixIconsTool) Permission() Permission { return PermissionUpdate }
func (fixIconsTool) Description() string {
	return "扫描网址，给缺图标/图标失效的网站自动抓取 favicon 补齐；抓不到时去 Iconify 在线图标库按名称检索匹配。可说：补齐图标 / 补全图标 / 图标缺失 / 把XX分组的图标补齐"
}
func (fixIconsTool) ParamsSchema() map[string]string {
	return map[string]string{
		"group": "可选，分组名或字眼（如「AI」表示所有名字带 AI 的分组）；不填=全部分组",
	}
}

func (fixIconsTool) Execute(ec *ExecContext) (Result, error) {
	var p struct {
		Group string `json:"group"`
	}
	ec.Bind(&p)
	groups, err := SelectGroupsByKeyword(ec.UserId, p.Group)
	if err != nil {
		return Result{}, err
	}
	if len(groups) == 0 {
		return Result{Kind: "reply", Reply: fmt.Sprintf("没有匹配到分组「%s」，当前分组有：%s", p.Group, JoinGroupTitles(mustLoadGroups(ec.UserId)))}, nil
	}
	groupIds := make(map[uint]bool, len(groups))
	names := make([]string, 0, len(groups))
	for _, g := range groups {
		groupIds[g.ID] = true
		names = append(names, g.Title)
	}

	items, err := LoadItems(ec.UserId)
	if err != nil {
		return Result{}, err
	}
	total, faviconOK, iconifyOK, failed := 0, 0, 0, 0
	var failList []string

	for i := range items {
		it := items[i]
		if !groupIds[uint(it.ItemIconGroupId)] {
			continue
		}
		if !itemNeedsIcon(it) {
			continue
		}
		total++
		ok, how := backfillOneIcon(ec, it)
		switch {
		case !ok:
			failed++
			failList = append(failList, it.Title)
		case strings.HasPrefix(how, "iconify"):
			iconifyOK++
		default:
			faviconOK++
		}
	}

	reply := fmt.Sprintf("图标补齐完成（分组：%s）：需处理 %d 个，favicon 补齐 %d 个，Iconify 图标库匹配 %d 个，仍失败 %d 个。",
		strings.Join(names, "、"), total, faviconOK, iconifyOK, failed)
	if len(failList) > 0 {
		reply += "\n仍未匹配到图标的：" + strings.Join(failList, "；")
	}
	return Result{Kind: "changed", Reply: reply, Changed: faviconOK+iconifyOK > 0}, nil
}

// backfillOneIcon 给单个卡片补齐图标，返回是否成功与来源说明。
//
// 顺序：
//  1. 抓站点 favicon 并下载到本地（与手动编辑网站一致）；
//  2. 抓不到时，去 Iconify 在线图标库按域名/标题关键词检索，
//     按图标名字面匹配选最像的一个，直接存图标名（前端原生支持渲染，
//     不必下载图片）。
func backfillOneIcon(ec *ExecContext, it models.ItemIcon) (bool, string) {
	target := iconTargetURL(it)
	if target != "" {
		if localPath, ferr := fetchAndSaveIcon(target, ec.UserId); ferr == nil && localPath != "" {
			icon := datatype.ItemIconIconInfo{ItemType: 2, Src: localPath}
			if uerr := global.Db.Model(&models.ItemIcon{}).
				Where("id=? AND user_id=?", it.ID, ec.UserId).
				Update("icon_json", JSONStr(icon)).Error; uerr == nil {
				LogOp(ec.UserId, "fix_icon", it.Title, "", localPath)
				return true, "favicon"
			}
		}
	}
	// 兜底：Iconify 在线图标库
	kw := IconKeywordOf(it.Title, target)
	if full, ok := PickIconifyIcon(kw); ok {
		icon := datatype.ItemIconIconInfo{ItemType: 3, Text: full}
		if uerr := global.Db.Model(&models.ItemIcon{}).
			Where("id=? AND user_id=?", it.ID, ec.UserId).
			Update("icon_json", JSONStr(icon)).Error; uerr == nil {
			LogOp(ec.UserId, "fix_icon_iconify", it.Title, "", full)
			return true, "iconify:" + full
		}
	}
	return false, ""
}

// itemNeedsIcon 判断该网址当前是否缺可用图标（需要补齐）
func itemNeedsIcon(it models.ItemIcon) bool {
	var info datatype.ItemIconIconInfo
	if strings.TrimSpace(it.IconJson) != "" {
		_ = json.Unmarshal([]byte(it.IconJson), &info)
	}
	switch info.ItemType {
	case 2:
		// 已有图片图标（远程或本地），视为已补齐
		return strings.TrimSpace(info.Src) == ""
	case 3:
		// 占位符（material-symbols:link）
		return true
	case 1:
		// 文字头像类型：前端仅渲染 Text；只要没文字就当缺图标，统一补成图片图标
		return strings.TrimSpace(info.Text) == ""
	default:
		// 无图标 / 未知类型
		return true
	}
}

// iconTargetURL 取网址用于抓图标的地址（优先 url，其次第一个弹性地址）
func iconTargetURL(it models.ItemIcon) string {
	if u := strings.TrimSpace(it.Url); u != "" {
		return u
	}
	for _, a := range it.Addresses {
		if strings.TrimSpace(a.Url) != "" {
			return a.Url
		}
	}
	return ""
}

// fetchAndSaveIcon 抓 favicon 并下载到本地（与手动编辑网站时的逻辑一致），返回本地相对路径
func fetchAndSaveIcon(itemURL string, userId uint) (string, error) {
	rawIcon, err := siteFavicon.GetOneFaviconURL(itemURL)
	if err != nil {
		return "", err
	}
	parsedURL, err := url.Parse(itemURL)
	if err != nil {
		return "", err
	}
	protocol := parsedURL.Scheme
	fullUrl := rawIcon
	if strings.HasPrefix(fullUrl, "//") {
		fullUrl = protocol + "://" + fullUrl[2:]
	} else if !strings.HasPrefix(fullUrl, "http://") && !strings.HasPrefix(fullUrl, "https://") {
		fullUrl = "http://" + fullUrl
	}
	if u, e := url.Parse(fullUrl); e == nil {
		fullUrl = u.Scheme + "://" + u.Host + u.Path
	}

	configUpload := global.Config.GetValueString("base", "source_path")
	savePath := fmt.Sprintf("%s/%d/%d/%d/", configUpload, time.Now().Year(), time.Now().Month(), time.Now().Day())
	if ok, _ := cmn.PathExists(savePath); !ok {
		_ = os.MkdirAll(savePath, os.ModePerm)
	}
	imgInfo, derr := siteFavicon.DownloadImage(fullUrl, savePath, 1024*1024)
	if derr != nil {
		return "", derr
	}
	ext := path.Ext(fullUrl)
	if _, aerr := (&models.File{}).AddFile(userId, parsedURL.Host, ext, imgInfo.Name()); aerr != nil {
		return "", aerr
	}
	// imgInfo.Name() 为绝对路径，去掉开头 '/'
	return imgInfo.Name()[1:], nil
}

func ferrMsg(err error) string {
	if err == nil {
		return ""
	}
	return err.Error()
}
