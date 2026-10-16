package mcp

import (
	"encoding/json"
	"net/http"
	"strconv"
	"strings"

	"sun-panel/biz"
	"sun-panel/global"
	"sun-panel/models"

	"github.com/gin-gonic/gin"
)

// MCP (Model Context Protocol) server for sun-panel bookmarks.
// Exposes bookmarks as MCP tools so AI assistants (Claude, Cursor, etc.)
// can search and retrieve the user's navigation.
//
// Transport: Streamable HTTP (JSON-RPC 2.0 over POST /mcp)
// Auth: Bearer token via Authorization header (same token as OpenAPI)

// JSON-RPC 2.0 structures
type rpcRequest struct {
	JSONRPC string          `json:"jsonrpc"`
	ID      interface{}     `json:"id"`
	Method  string          `json:"method"`
	Params  json.RawMessage `json:"params"`
}

type rpcResponse struct {
	JSONRPC string      `json:"jsonrpc"`
	ID      interface{} `json:"id"`
	Result  interface{} `json:"result,omitempty"`
	Error   *rpcError   `json:"error,omitempty"`
}

type rpcError struct {
	Code    int    `json:"code"`
	Message string `json:"message"`
}

// MCP tool definition
type mcpTool struct {
	Name        string                 `json:"name"`
	Description string                 `json:"description"`
	InputSchema map[string]interface{} `json:"inputSchema"`
}

// MCP tools/list result
type toolsListResult struct {
	Tools []mcpTool `json:"tools"`
}

// MCP tools/call params
type callParams struct {
	Name      string                 `json:"name"`
	Arguments map[string]interface{} `json:"arguments"`
}

// MCP tools/call result
type callResult struct {
	Content []contentItem `json:"content"`
	IsError bool          `json:"isError,omitempty"`
}

type contentItem struct {
	Type string `json:"type"`
	Text string `json:"text"`
}

// Available tools
var availableTools = []mcpTool{
	{
		Name:        "search_bookmarks",
		Description: "Search the user's bookmarks/navigation by keyword. Searches title, URL, and description. Returns matching bookmarks with their URLs.",
		InputSchema: map[string]interface{}{
			"type": "object",
			"properties": map[string]interface{}{
				"query": map[string]interface{}{
					"type":        "string",
					"description": "Search keyword",
				},
				"limit": map[string]interface{}{
					"type":        "integer",
					"description": "Max results (default 20, max 100)",
				},
			},
			"required": []string{"query"},
		},
	},
	{
		Name:        "list_categories",
		Description: "List all bookmark categories/groups in the user's navigation.",
		InputSchema: map[string]interface{}{
			"type":       "object",
			"properties": map[string]interface{}{},
		},
	},
	{
		Name:        "list_bookmarks",
		Description: "List bookmarks in a specific category. Use list_categories first to get category IDs.",
		InputSchema: map[string]interface{}{
			"type": "object",
			"properties": map[string]interface{}{
				"category_id": map[string]interface{}{
					"type":        "integer",
					"description": "Category/group ID",
				},
				"limit": map[string]interface{}{
					"type":        "integer",
					"description": "Max results (default 50, max 200)",
				},
			},
			"required": []string{"category_id"},
		},
	},
	{
		Name:        "get_bookmark",
		Description: "Get full details of a single bookmark by its ID, including all URLs/addresses.",
		InputSchema: map[string]interface{}{
			"type": "object",
			"properties": map[string]interface{}{
				"id": map[string]interface{}{
					"type":        "integer",
					"description": "Bookmark ID",
				},
			},
			"required": []string{"id"},
		},
	},
	{
		Name:        "create_bookmark",
		Description: "Create a new bookmark. Requires title and url. Optionally specify category_id, description, lan_url.",
		InputSchema: map[string]interface{}{
			"type": "object",
			"properties": map[string]interface{}{
				"title": map[string]interface{}{
					"type":        "string",
					"description": "Bookmark title (required)",
				},
				"url": map[string]interface{}{
					"type":        "string",
					"description": "Bookmark URL (required)",
				},
				"category_id": map[string]interface{}{
					"type":        "integer",
					"description": "Category/group ID (optional, defaults to first category). Use list_categories to find IDs.",
				},
				"description": map[string]interface{}{
					"type":        "string",
					"description": "Description (optional)",
				},
				"lan_url": map[string]interface{}{
					"type":        "string",
					"description": "LAN URL (optional)",
				},
			},
			"required": []string{"title", "url"},
		},
	},
	{
		Name:        "update_bookmark",
		Description: "Update an existing bookmark by ID. Only provided fields are changed; omitted fields stay as-is.",
		InputSchema: map[string]interface{}{
			"type": "object",
			"properties": map[string]interface{}{
				"id": map[string]interface{}{
					"type":        "integer",
					"description": "Bookmark ID (required)",
				},
				"title": map[string]interface{}{
					"type":        "string",
					"description": "New title (optional)",
				},
				"url": map[string]interface{}{
					"type":        "string",
					"description": "New URL (optional)",
				},
				"category_id": map[string]interface{}{
					"type":        "integer",
					"description": "New category/group ID (optional)",
				},
				"description": map[string]interface{}{
					"type":        "string",
					"description": "New description (optional)",
				},
				"lan_url": map[string]interface{}{
					"type":        "string",
					"description": "New LAN URL (optional)",
				},
			},
			"required": []string{"id"},
		},
	},
}

// Handle is the single JSON-RPC endpoint// Handle is the single JSON-RPC endpoint for MCP (POST /mcp)
func Handle(c *gin.Context) {
	// Auth: check token (same as OpenAPI)
	if !checkAuth(c) {
		c.JSON(http.StatusUnauthorized, rpcResponse{
			JSONRPC: "2.0",
			Error:   &rpcError{Code: -32001, Message: "unauthorized: missing or invalid token"},
		})
		return
	}

	var req rpcRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, rpcResponse{
			JSONRPC: "2.0",
			Error:   &rpcError{Code: -32700, Message: "parse error: invalid JSON"},
		})
		return
	}

	resp := rpcResponse{JSONRPC: "2.0", ID: req.ID}

	switch req.Method {
	case "initialize":
		resp.Result = map[string]interface{}{
			"protocolVersion": "2024-11-05",
			"capabilities": map[string]interface{}{
				"tools": map[string]interface{}{},
			},
			"serverInfo": map[string]interface{}{
				"name":    "sun-panel-bookmarks",
				"version": "1.0.0",
			},
		}
	case "notifications/initialized":
		// Notification, no response needed (but we return empty for HTTP)
		resp.Result = map[string]interface{}{}
	case "tools/list":
		resp.Result = toolsListResult{Tools: availableTools}
	case "tools/call":
		var params callParams
		if err := json.Unmarshal(req.Params, &params); err != nil {
			resp.Error = &rpcError{Code: -32602, Message: "invalid params"}
			break
		}
		result, isErr := callTool(c, params.Name, params.Arguments)
		resp.Result = callResult{
			Content: []contentItem{{Type: "text", Text: result}},
			IsError: isErr,
		}
	case "ping":
		resp.Result = map[string]interface{}{}
	default:
		resp.Error = &rpcError{Code: -32601, Message: "method not found: " + req.Method}
	}

	c.JSON(http.StatusOK, resp)
}

// checkAuth validates the token using the same logic as OpenAPI.
// Returns the user ID if valid, 0 otherwise.
func checkAuth(c *gin.Context) bool {
	_, ok := getAuthUserID(c)
	return ok
}

func getAuthUserID(c *gin.Context) (uint, bool) {
	token := c.GetHeader("Authorization")
	if token == "" {
		token = c.GetHeader("token")
	}
	if token == "" {
		token = c.GetHeader("Token")
	}
	// Remove Bearer prefix
	token = strings.TrimPrefix(token, "Bearer ")
	token = strings.TrimSpace(token)
	if token == "" {
		return 0, false
	}
	return biz.VerifyOpenApiToken(token)
}

// callTool dispatches to the actual tool implementation
func callTool(c *gin.Context, name string, args map[string]interface{}) (string, bool) {
	// Get user ID from token (for multi-user support)
	userID, _ := getAuthUserID(c)

	switch name {
	case "search_bookmarks":
		query, _ := args["query"].(string)
		limit := getIntArg(args, "limit", 20)
		if limit > 100 {
			limit = 100
		}
		return searchBookmarks(userID, query, limit)
	case "list_categories":
		return listCategories(userID)
	case "list_bookmarks":
		catID := getIntArg(args, "category_id", 0)
		limit := getIntArg(args, "limit", 50)
		if limit > 200 {
			limit = 200
		}
		return listBookmarks(userID, catID, limit)
	case "get_bookmark":
		id := getIntArg(args, "id", 0)
		return getBookmark(userID, id)
	case "create_bookmark":
		return createBookmark(userID, args)
	case "update_bookmark":
		id := getIntArg(args, "id", 0)
		return updateBookmark(userID, id, args)
	default:
		return "unknown tool: " + name, true
	}
}

func getStringArg(args map[string]interface{}, key string) string {
	if v, ok := args[key].(string); ok {
		return strings.TrimSpace(v)
	}
	return ""
}

// createBookmark creates a new bookmark item
func createBookmark(userID uint, args map[string]interface{}) (string, bool) {
	title := getStringArg(args, "title")
	url := getStringArg(args, "url")
	if title == "" {
		return "title is required", true
	}
	if url == "" {
		return "url is required", true
	}
	description := getStringArg(args, "description")
	lanURL := getStringArg(args, "lan_url")
	categoryID := getIntArg(args, "category_id", 0)

	// Resolve category: use given ID, or default to first category
	if categoryID == 0 {
		var firstGroup models.ItemIconGroup
		if err := global.Db.Where("user_id = ?", userID).Order("sort ASC").First(&firstGroup).Error; err != nil {
			return "no categories exist, please create one first", true
		}
		categoryID = int(firstGroup.ID)
	} else {
		// Verify category exists and belongs to user
		var group models.ItemIconGroup
		if err := global.Db.Where("id = ? AND user_id = ?", categoryID, userID).First(&group).Error; err != nil {
			return "category not found", true
		}
	}

	onlyName := "item-" + buildRandCode(10)

	item := models.ItemIcon{
		Title:           title,
		Url:             url,
		LanUrl:          lanURL,
		Description:     description,
		OpenMethod:      2,
		ItemIconGroupId: categoryID,
		UserId:          userID,
		OnlyName:        onlyName,
	}
	// Build addresses JSON
	addresses := buildItemAddresses(url, lanURL)
	if addrJson, err := json.Marshal(addresses); err == nil {
		item.AddressesJson = string(addrJson)
	}

	if err := global.Db.Create(&item).Error; err != nil {
		return "database error: " + err.Error(), true
	}
	return "bookmark created with ID " + itoa(int(item.ID)), false
}

// updateBookmark updates an existing bookmark; only provided fields change
func updateBookmark(userID uint, id int, args map[string]interface{}) (string, bool) {
	if id == 0 {
		return "id is required", true
	}
	var item models.ItemIcon
	if err := global.Db.Where("id = ? AND user_id = ?", id, userID).First(&item).Error; err != nil {
		return "bookmark not found", true
	}

	changed := false
	if title := getStringArg(args, "title"); title != "" {
		item.Title = title
		changed = true
	}
	if url := getStringArg(args, "url"); url != "" {
		item.Url = url
		changed = true
	}
	if desc, ok := args["description"].(string); ok {
		item.Description = strings.TrimSpace(desc)
		changed = true
	}
	if lanURL, ok := args["lan_url"].(string); ok {
		item.LanUrl = strings.TrimSpace(lanURL)
		changed = true
	}
	if catID := getIntArg(args, "category_id", 0); catID > 0 {
		var group models.ItemIconGroup
		if err := global.Db.Where("id = ? AND user_id = ?", catID, userID).First(&group).Error; err != nil {
			return "category not found", true
		}
		item.ItemIconGroupId = catID
		changed = true
	}

	if !changed {
		return "no fields to update", true
	}

	// Rebuild addresses if url or lan_url changed
	if _, ok := args["url"]; ok {
		addresses := buildItemAddresses(item.Url, item.LanUrl)
		if addrJson, err := json.Marshal(addresses); err == nil {
			item.AddressesJson = string(addrJson)
		}
	}

	updateFields := []string{"Title", "Url", "LanUrl", "Description", "ItemIconGroupId", "AddressesJson"}
	if err := global.Db.Model(&models.ItemIcon{}).Where("id = ?", item.ID).Select(updateFields).Updates(&item).Error; err != nil {
		return "database error: " + err.Error(), true
	}
	return "bookmark " + itoa(id) + " updated", false
}

// buildRandCode generates a random alphanumeric code
func buildRandCode(length int) string {
	const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
	b := make([]byte, length)
	for i := range b {
		b[i] = chars[fastrand()%uint64(len(chars))]
	}
	return string(b)
}

var randSeed uint64 = 123456789

func fastrand() uint64 {
	randSeed = randSeed*6364136223846793005 + 1442695040888963407
	return randSeed >> 33
}

// buildItemAddresses builds the addresses array for a bookmark
func buildItemAddresses(url, lanURL string) []map[string]interface{} {
	var addresses []map[string]interface{}
	if url != "" {
		addresses = append(addresses, map[string]interface{}{"name": "default", "url": url, "openMethod": 2})
	}
	if lanURL != "" {
		addresses = append(addresses, map[string]interface{}{"name": "lan", "url": lanURL, "openMethod": 2})
	}
	return addresses
}


func getIntArg(args map[string]interface{}, key string, def int) int {
	if v, ok := args[key]; ok {
		switch n := v.(type) {
		case float64:
			return int(n)
		case int:
			return n
		}
	}
	return def
}

// searchBookmarks searches by keyword in title/url/description
func searchBookmarks(userID uint, query string, limit int) (string, bool) {
	if strings.TrimSpace(query) == "" {
		return "query is required", true
	}
	var items []models.ItemIcon
	like := "%" + query + "%"
	db := global.Db.Where("user_id = ?", userID).
		Where("title LIKE ? OR url LIKE ? OR description LIKE ?", like, like, like).
		Order("sort ASC").Limit(limit).Find(&items)
	if db.Error != nil {
		return "database error: " + db.Error.Error(), true
	}
	if len(items) == 0 {
		return "no bookmarks found for: " + query, false
	}
	return formatBookmarks(items), false
}

// listCategories returns all groups
func listCategories(userID uint) (string, bool) {
	var groups []models.ItemIconGroup
	db := global.Db.Where("user_id = ?", userID).Order("sort ASC").Find(&groups)
	if db.Error != nil {
		return "database error: " + db.Error.Error(), true
	}
	if len(groups) == 0 {
		return "no categories found", false
	}
	var sb strings.Builder
	sb.WriteString("Categories:\n")
	for _, g := range groups {
		sb.WriteString(formatCategory(g))
		sb.WriteString("\n")
	}
	return sb.String(), false
}

// listBookmarks lists items in a category
func listBookmarks(userID uint, categoryID int, limit int) (string, bool) {
	var items []models.ItemIcon
	db := global.Db.Where("user_id = ? AND item_icon_group_id = ?", userID, categoryID).
		Order("sort ASC").Limit(limit).Find(&items)
	if db.Error != nil {
		return "database error: " + db.Error.Error(), true
	}
	if len(items) == 0 {
		return "no bookmarks in this category", false
	}
	return formatBookmarks(items), false
}

// getBookmark returns full details of one item
func getBookmark(userID uint, id int) (string, bool) {
	var item models.ItemIcon
	db := global.Db.Where("user_id = ? AND id = ?", userID, id).First(&item)
	if db.Error != nil {
		return "bookmark not found", true
	}
	// Parse addresses JSON if present
	var sb strings.Builder
	sb.WriteString(formatBookmarkDetail(item))
	return sb.String(), false
}

// format helpers
func formatBookmarks(items []models.ItemIcon) string {
	var sb strings.Builder
	for _, item := range items {
		sb.WriteString(formatBookmarkLine(item))
		sb.WriteString("\n")
	}
	return sb.String()
}

func formatBookmarkLine(item models.ItemIcon) string {
	url := item.Url
	if url == "" && item.AddressesJson != "" {
		// Try to extract first URL from addresses JSON
		var addrs []map[string]interface{}
		if json.Unmarshal([]byte(item.AddressesJson), &addrs) == nil && len(addrs) > 0 {
			if u, ok := addrs[0]["url"].(string); ok {
				url = u
			}
		}
	}
	desc := item.Description
	if len(desc) > 100 {
		desc = desc[:100] + "..."
	}
	return "[" + itoa(int(item.ID)) + "] " + item.Title + " - " + url + 
		" (category: " + itoa(item.ItemIconGroupId) + ")" +
		func() string { if desc != "" { return " | " + desc }; return "" }()
}

func formatBookmarkDetail(item models.ItemIcon) string {
	var sb strings.Builder
	sb.WriteString("ID: " + itoa(int(item.ID)) + "\n")
	sb.WriteString("Title: " + item.Title + "\n")
	sb.WriteString("URL: " + item.Url + "\n")
	if item.LanUrl != "" {
		sb.WriteString("LAN URL: " + item.LanUrl + "\n")
	}
	if item.Description != "" {
		sb.WriteString("Description: " + item.Description + "\n")
	}
	sb.WriteString("Category ID: " + itoa(item.ItemIconGroupId) + "\n")
	if item.AddressesJson != "" {
		sb.WriteString("Addresses: " + item.AddressesJson + "\n")
	}
	return sb.String()
}

func formatCategory(g models.ItemIconGroup) string {
	return "[" + itoa(int(g.ID)) + "] " + g.Title +
		func() string { if g.Description != "" { return " - " + g.Description }; return "" }()
}

func itoa(n int) string {
	return strconv.Itoa(n)
}
