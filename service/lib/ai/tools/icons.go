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

// BackfillTools 图标补齐相关工具
func BackfillTools() []Tool {
	return []Tool{fixIconsTool{}}
}

// ===================== 图标补齐 =====================

type fixIconsTool struct{}

func (fixIconsTool) Name() string           { return "panel.fix_icons" }
func (fixIconsTool) Permission() Permission { return PermissionUpdate }
func (fixIconsTool) Description() string {
	return "扫描全部网址，给缺图标/图标失效的网站自动抓取 favicon 并下载到本地补齐（可说：补齐图标 / 补全图标 / 图标缺失）"
}
func (fixIconsTool) ParamsSchema() map[string]string {
	return map[string]string{}
}

func (fixIconsTool) Execute(ec *ExecContext) (Result, error) {
	items, err := LoadItems(ec.UserId)
	if err != nil {
		return Result{}, err
	}
	total := len(items)
	backfilled, skipped, failed := 0, 0, 0
	var failList []string

	for i := range items {
		it := items[i]
		if !itemNeedsIcon(it) {
			skipped++
			continue
		}
		target := iconTargetURL(it)
		if target == "" {
			skipped++
			continue
		}
		localPath, ferr := fetchAndSaveIcon(target, ec.UserId)
		if ferr != nil || localPath == "" {
			failed++
			failList = append(failList, fmt.Sprintf("「%s」(%s)", it.Title, ferrMsg(ferr)))
			continue
		}
		icon := datatype.ItemIconIconInfo{ItemType: 2, Src: localPath}
		if uerr := global.Db.Model(&models.ItemIcon{}).
			Where("id=? AND user_id=?", it.ID, ec.UserId).
			Update("icon_json", JSONStr(icon)).Error; uerr != nil {
			failed++
			failList = append(failList, fmt.Sprintf("「%s」(写库失败:%s)", it.Title, uerr.Error()))
			continue
		}
		backfilled++
	}

	reply := fmt.Sprintf("图标补齐完成：共 %d 个网址，已补齐 %d 个，跳过 %d 个，失败 %d 个。", total, backfilled, skipped, failed)
	if len(failList) > 0 {
		reply += "\n失败的：" + strings.Join(failList, "；")
	}
	return Result{Kind: "changed", Reply: reply, Changed: backfilled > 0}, nil
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
