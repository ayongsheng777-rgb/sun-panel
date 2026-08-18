package panel

import (
	"context"
	"encoding/json"
	"strings"
	"time"

	"sun-panel/api/api_v1/common/apiReturn"
	"sun-panel/api/api_v1/common/base"
	"sun-panel/global"
	"sun-panel/lib/ai"
	"sun-panel/models"

	"github.com/gin-gonic/gin"
	"github.com/gin-gonic/gin/binding"
)

// AiAgent 对话式 AI 操作代理：搜索全部内容 + 分组/网址管理（禁止删除）
type AiAgent struct{}

// Execute 统一对话入口：理解自然语言 → 执行白名单操作 → 返回结果
func (a *AiAgent) Execute(c *gin.Context) {
	userInfo, _ := base.GetCurrentUserInfo(c)
	var req struct {
		Prompt string `json:"prompt"`
	}
	if err := c.ShouldBindBodyWith(&req, binding.JSON); err != nil {
		apiReturn.ErrorParamFomat(c, err.Error())
		return
	}
	if strings.TrimSpace(req.Prompt) == "" {
		apiReturn.ErrorParamFomat(c, "prompt is empty")
		return
	}

	cfg := ai.LoadConfig(userInfo.ID)
	if !cfg.Enabled {
		apiReturn.Error(c, "AI 未启用，请先在设置中开启 AI 搜索")
		return
	}

	// 免费算力延迟抖动大（实测 0.3s~100s+），给足 150s
	ctx, cancel := context.WithTimeout(c.Request.Context(), 150*time.Second)
	defer cancel()

	engine, err := ai.NewEngine(cfg)
	if err != nil {
		apiReturn.Error(c, "AI 引擎初始化失败："+err.Error())
		return
	}

	result, err := engine.Execute(ctx, userInfo.ID, req.Prompt)
	if err != nil {
		apiReturn.Error(c, "AI 处理失败："+err.Error())
		return
	}

	data := gin.H{
		"kind":    result.Kind,
		"reply":   result.Reply,
		"changed": result.Changed,
	}
	if result.Tool != "" {
		data["tool"] = result.Tool
	}
	if result.Intent != "" {
		data["intent"] = result.Intent
	}
	if len(result.Data) > 0 {
		data["data"] = result.Data
	}

	// kind=items：按 id 顺序取出完整网址（URL 永远来自数据库，AI 不接触）
	if result.Kind == "items" {
		items := []models.ItemIcon{}
		if err := global.Db.Where("user_id=?", userInfo.ID).Find(&items).Error; err == nil {
			list := ai.FetchByIds(items, result.ItemIds, ai.MaxResults)
			for i := range list {
				_ = json.Unmarshal([]byte(list[i].IconJson), &list[i].Icon)
				_ = json.Unmarshal([]byte(list[i].AddressesJson), &list[i].Addresses)
			}
			data["items"] = list
		}
	}

	apiReturn.SuccessData(c, data)
}
