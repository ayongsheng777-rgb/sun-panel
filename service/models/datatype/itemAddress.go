package datatype

// ItemAddress 弹性多地址模型
// 一个图标 = 1 个默认地址 + N 个可选地址
type ItemAddress struct {
	Id         string `json:"id"`         // 前端稳定唯一 ID（UUID/nanoid）
	Name       string `json:"name"`       // 显示名称：官网/局域网/NAS/管理后台...
	Url        string `json:"url"`        // 完整 URL
	Type       string `json:"type"`       // https/http/lan/other
	IsDefault  bool   `json:"isDefault"`  // 是否为默认地址（一个 Item 仅一个 true）
	Sort       int    `json:"sort"`       // 排序
	Enabled    bool   `json:"enabled"`    // 是否显示
	OpenMethod int    `json:"openMethod"` // 打开方式：1当前页 2新窗口 3页内小窗
	Color      string `json:"color,omitempty"`
}
