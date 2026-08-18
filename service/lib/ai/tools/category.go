package tools

// 网址分类（规格书第 8 章）—— 全系统唯一来源，lib/ai 也引用此处常量
const (
	CategoryAITools    = "AI工具"
	CategoryDevTools   = "开发工具"
	CategoryServer     = "服务器"
	CategoryNAS        = "NAS"
	CategoryFinance    = "金融"
	CategoryNews       = "新闻"
	CategoryMedia      = "影音"
	CategoryOffice     = "办公"
	CategoryLife       = "生活"
	CategoryStudy      = "学习"
	CategoryAppNav     = "APP导航"
	CategoryOther      = "其他"
)

// orderedCategories 固定顺序（用于 Prompt 展示，避免 map 随机序导致模型输出漂移）
var orderedCategories = []string{
	CategoryAITools, CategoryDevTools, CategoryServer, CategoryNAS,
	CategoryFinance, CategoryNews, CategoryMedia, CategoryOffice,
	CategoryLife, CategoryStudy, CategoryAppNav, CategoryOther,
}

// ValidCategories 分类白名单，AI 输出不在其中即归「其他」
var ValidCategories = func() map[string]bool {
	m := make(map[string]bool, len(orderedCategories))
	for _, c := range orderedCategories {
		m[c] = true
	}
	return m
}()

// CategoryList 固定顺序的分类列表
func CategoryList() []string {
	out := make([]string, len(orderedCategories))
	copy(out, orderedCategories)
	return out
}

// CategoryIcon 分类默认图标（新建分组时用）
var categoryIcon = map[string]string{
	CategoryAITools:  "material-symbols:auto-awesome",
	CategoryDevTools: "material-symbols:code",
	CategoryServer:   "material-symbols:dns-outline",
	CategoryNAS:      "material-symbols:hard-drive-2-outline",
	CategoryFinance:  "material-symbols:trending-up",
	CategoryNews:     "material-symbols:newspaper",
	CategoryMedia:    "material-symbols:movie-outline",
	CategoryOffice:   "material-symbols:work-outline",
	CategoryLife:     "material-symbols:coffee",
	CategoryStudy:    "material-symbols:school-outline",
	CategoryAppNav:   "material-symbols:apps",
	CategoryOther:    "material-symbols:folder-outline",
}

// CategoryIcon 取分类默认图标
func CategoryIcon(category string) string {
	if v, ok := categoryIcon[category]; ok {
		return v
	}
	return "material-symbols:ad-group-outline"
}
