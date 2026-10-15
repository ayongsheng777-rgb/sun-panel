package mcp

import (
	"sun-panel/api/api_v1/mcp"

	"github.com/gin-gonic/gin"
)

// Init MCP server routes.
// MCP endpoint: POST http://host:port/mcp
// Uses Streamable HTTP transport (JSON-RPC 2.0).
// Auth: same token as OpenAPI, via Authorization: Bearer <token> or token header.
func Init(router *gin.RouterGroup) {
	mcpGroup := router.Group("mcp")
	{
		mcpGroup.POST("", mcp.Handle)
		mcpGroup.POST("/", mcp.Handle)
	}
}
