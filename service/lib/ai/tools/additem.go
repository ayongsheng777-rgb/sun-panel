package tools

import (
	"fmt"
	"strings"
	"time"

	"sun-panel/global"
	"sun-panel/lib/web"
	"sun-panel/models"
	"sun-panel/models/datatype"
)

// AddItemTools 添加网址相关工具
func AddItemTools() []Tool {
	return []Tool{addItemTool{}, addGithubItemTool{}}
}

// ===================== panel.add_item =====================

type addItemTool struct{}

func (addItemTool) Name() string           { return "panel.add_item" }
func (addItemTool) Permission() Permission { return PermissionCreate }
func (addItemTool) Description() string {
	return "添加一个网址到面板：用户只给名字时会联网找官网、自动判分类、抓标题图标后入库"
}
func (addItemTool) ParamsSchema() map[string]string {
	return map[string]string{
		"keyword":    "要添加的网站名称/关键词",
		"url":        "可选，用户直接给出的网址",
		"groupTitle": "可选，指定放入哪个分组；不给则按分类自动归类",
		"title":      "可选，指定显示名称",
	}
}

func (addItemTool) Execute(ec *ExecContext) (Result, error) {
	var p struct {
		Keyword    string `json:"keyword"`
		Url        string `json:"url"`
		GroupTitle string `json:"groupTitle"`
		Title      string `json:"title"`
	}
	ec.Bind(&p)
	keyword := strings.TrimSpace(p.Keyword)
	if keyword == "" {
		keyword = ExtractKeyword(ec.Prompt)
	}

	pick := sitePick{Category: CategoryOther}
	if u := NormalizeURL(p.Url); u != "" && IsSafeHTTPURL(u) {
		// 用户直接给了链接：跳过搜索
		pick.URL = u
		pick.Title = strings.TrimSpace(p.Title)
		if keyword == "" {
			keyword = hostOf(u)
		}
	} else {
		if keyword == "" {
			return Result{Kind: "reply", Reply: "请告诉我要添加哪个网站（名称或网址）"}, nil
		}
		results, _, err := web.SearchManager(keyword, 5)
		if err != nil {
			return Result{Kind: "reply", Reply: "联网找官网失败：" + err.Error() + "。你也可以直接把网址发我。"}, nil
		}
		picked, err := pickOfficialSite(ec, keyword, results)
		if err != nil {
			return Result{Kind: "reply", Reply: "没能确定官网，请直接把网址发我"}, nil
		}
		pick = picked
	}

	// URL 合法性 + 可达性校验（不可达只提示，不阻断）
	pick.URL = NormalizeURL(pick.URL)
	if !IsSafeHTTPURL(pick.URL) {
		return Result{Kind: "reply", Reply: "拿到的链接不合法，没有添加"}, nil
	}
	reachable := URLReachable(pick.URL, 6*time.Second)

	// 抓页面信息补全标题/描述/图标
	page := web.FetchPageInfo(pick.URL)
	if strings.TrimSpace(p.Title) != "" {
		pick.Title = strings.TrimSpace(p.Title)
	}
	if pick.Title == "" {
		pick.Title = page.Title
	}
	if pick.Title == "" {
		pick.Title = keyword
	}
	pick.Title = TruncateRunes(strings.TrimSpace(pick.Title), 30)
	if pick.Description == "" {
		pick.Description = page.Description
	}
	if pick.Description == "" {
		pick.Description = pick.URL
	}
	pick.Description = TruncateRunes(pick.Description, 120)
	if pick.Favicon == "" {
		pick.Favicon = page.Favicon
	}

	// 查重：同 URL 或同名已存在则不重复添加
	if dup, ok := findDuplicateItem(ec.UserId, pick.Title, pick.URL); ok {
		return Result{Kind: "reply", Reply: fmt.Sprintf("面板里已经有「%s」了（%s），没有重复添加", dup.Title, dup.Url)}, nil
	}

	// 定位分组：指定优先，否则按分类找/建
	groupTitle := strings.TrimSpace(p.GroupTitle)
	if groupTitle == "" {
		groupTitle = pick.Category
		if groupTitle == "" {
			groupTitle = CategoryOther
		}
	}
	group, err := FindGroupByName(ec.UserId, groupTitle)
	if err != nil {
		group = models.ItemIconGroup{
			Title: groupTitle, UserId: ec.UserId, Sort: 9999, Icon: CategoryIcon(groupTitle),
		}
		if cerr := global.Db.Create(&group).Error; cerr != nil {
			return Result{}, cerr
		}
		LogOp(ec.UserId, "create_group", "为新网址自动新建分组 "+groupTitle, "", JSONStr(map[string]any{"id": group.ID}))
	}

	item, err := createItem(ec.UserId, int(group.ID), pick)
	if err != nil {
		return Result{}, err
	}
	LogOp(ec.UserId, "add_item", "新增网址「"+item.Title+"」到分组「"+group.Title+"」", "",
		JSONStr(map[string]any{"id": item.ID, "url": item.Url, "group": group.Title}))

	reply := fmt.Sprintf("已添加「%s」到「%s」分组\n%s", item.Title, group.Title, item.Url)
	if !reachable {
		reply += "\n（提示：这个地址刚才没探测通，可能是网络问题或站点限制，建议你点开确认一下）"
	}
	return Result{Kind: "changed", Reply: reply, Changed: true}, nil
}

// ===================== panel.add_github_item =====================

type addGithubItemTool struct{}

func (addGithubItemTool) Name() string           { return "panel.add_github_item" }
func (addGithubItemTool) Permission() Permission { return PermissionCreate }
func (addGithubItemTool) Description() string {
	return "在 GitHub 上找开源项目并把它添加到面板"
}
func (addGithubItemTool) ParamsSchema() map[string]string {
	return map[string]string{"query": "项目关键词", "groupTitle": "可选，指定分组"}
}

func (addGithubItemTool) Execute(ec *ExecContext) (Result, error) {
	var p struct {
		Query      string `json:"query"`
		GroupTitle string `json:"groupTitle"`
	}
	ec.Bind(&p)
	q := strings.TrimSpace(p.Query)
	if q == "" {
		q = ExtractKeyword(ec.Prompt)
	}
	if q == "" {
		return Result{Kind: "reply", Reply: "请告诉我要找什么开源项目"}, nil
	}
	repos, err := web.SearchGithub(q, 6)
	if err != nil || len(repos) == 0 {
		return Result{Kind: "reply", Reply: "GitHub 上没找到相关项目"}, nil
	}
	r := repos[0]
	target := r.Homepage
	if strings.TrimSpace(target) == "" {
		target = r.HTMLURL
	}
	pick := sitePick{
		URL:         NormalizeURL(target),
		Title:       r.Name,
		Description: TruncateRunes(r.Description, 120),
		Category:    CategoryDevTools,
	}
	if !IsSafeHTTPURL(pick.URL) {
		return Result{Kind: "reply", Reply: "该项目没有可用的访问地址"}, nil
	}
	if dup, ok := findDuplicateItem(ec.UserId, pick.Title, pick.URL); ok {
		return Result{Kind: "reply", Reply: fmt.Sprintf("面板里已经有「%s」了，没有重复添加", dup.Title)}, nil
	}

	groupTitle := strings.TrimSpace(p.GroupTitle)
	if groupTitle == "" {
		groupTitle = CategoryDevTools
	}
	group, gerr := FindGroupByName(ec.UserId, groupTitle)
	if gerr != nil {
		group = models.ItemIconGroup{Title: groupTitle, UserId: ec.UserId, Sort: 9999, Icon: CategoryIcon(groupTitle)}
		if cerr := global.Db.Create(&group).Error; cerr != nil {
			return Result{}, cerr
		}
	}
	item, err := createItem(ec.UserId, int(group.ID), pick)
	if err != nil {
		return Result{}, err
	}
	LogOp(ec.UserId, "add_item", "新增 GitHub 项目「"+item.Title+"」", "",
		JSONStr(map[string]any{"id": item.ID, "repo": r.FullName, "url": item.Url}))
	return Result{
		Kind: "changed",
		Reply: fmt.Sprintf("已添加 GitHub 项目「%s」（⭐%d，%s）到「%s」分组\n%s",
			r.FullName, r.Stars, r.Language, group.Title, item.Url),
		Changed: true,
	}, nil
}

// ===================== 共用逻辑 =====================

// createItem 落库一条网址（含弹性多地址默认项）
func createItem(userId uint, groupId int, pick sitePick) (models.ItemIcon, error) {
	icon := datatype.ItemIconIconInfo{ItemType: 3, Text: "material-symbols:link"}
	if strings.TrimSpace(pick.Favicon) != "" {
		icon = datatype.ItemIconIconInfo{ItemType: 1, Src: pick.Favicon}
	}
	addr := datatype.ItemAddress{
		Id:         fmt.Sprintf("ai-%d", time.Now().UnixNano()),
		Name:       "默认",
		Url:        pick.URL,
		Type:       schemeOf(pick.URL),
		IsDefault:  true,
		Sort:       0,
		Enabled:    true,
		OpenMethod: 2,
	}
	item := models.ItemIcon{
		Title:           pick.Title,
		Url:             pick.URL,
		Description:     pick.Description,
		OpenMethod:      2,
		Sort:            9999,
		ItemIconGroupId: groupId,
		UserId:          userId,
		IconJson:        JSONStr(icon),
		AddressesJson:   JSONStr([]datatype.ItemAddress{addr}),
	}
	if err := global.Db.Create(&item).Error; err != nil {
		return models.ItemIcon{}, err
	}
	return item, nil
}

// findDuplicateItem 同 URL（忽略末尾斜杠）或完全同名视为重复
func findDuplicateItem(userId uint, title, rawURL string) (models.ItemIcon, bool) {
	items, err := LoadItems(userId)
	if err != nil {
		return models.ItemIcon{}, false
	}
	key := normalizeURLKey(rawURL)
	lowTitle := strings.ToLower(strings.TrimSpace(title))
	for _, it := range items {
		if key != "" && normalizeURLKey(it.Url) == key {
			return it, true
		}
		if lowTitle != "" && strings.ToLower(it.Title) == lowTitle {
			return it, true
		}
	}
	return models.ItemIcon{}, false
}

func normalizeURLKey(raw string) string {
	s := strings.ToLower(strings.TrimSpace(raw))
	s = strings.TrimPrefix(s, "https://")
	s = strings.TrimPrefix(s, "http://")
	s = strings.TrimPrefix(s, "www.")
	return strings.TrimRight(s, "/")
}

func schemeOf(raw string) string {
	if strings.HasPrefix(strings.ToLower(raw), "http://") {
		return "http"
	}
	return "https"
}

func hostOf(raw string) string {
	s := normalizeURLKey(raw)
	if i := strings.Index(s, "/"); i > 0 {
		s = s[:i]
	}
	return s
}

// ExtractKeyword 从自然语言里剥掉「帮我添加…的官网」这类壳，取出核心关键词
func ExtractKeyword(prompt string) string {
	kw := strings.TrimSpace(prompt)
	for _, prefix := range []string{"帮我添加", "请添加", "添加一个", "加一个", "帮我加", "增加", "新增", "添加", "收藏", "把"} {
		kw = strings.TrimPrefix(kw, prefix)
	}
	for _, suffix := range []string{"到面板", "到导航", "的官网", "的网站", "的网址", "官网", "网站", "网址"} {
		kw = strings.TrimSuffix(kw, suffix)
	}
	kw = strings.TrimSpace(kw)
	if kw == "" {
		return strings.TrimSpace(prompt)
	}
	return kw
}
