package openapi

// ApiOpenApi 开放接口集合。
//
// 接口路径与参数沿用 Sun-Panel 官方 OpenAPI v1 约定，
// 这样官方浏览器插件（Sun-Panel BE）可以不加改动地对接本 Fork。
type ApiOpenApi struct {
	Item      ItemApi
	ItemGroup ItemGroupApi
	Manage    Manage
}
