package panel

import (
	"context"
	"encoding/json"
	"time"

	"sun-panel/api/api_v1/common/apiReturn"
	"sun-panel/api/api_v1/common/base"
	"sun-panel/global"
	"sun-panel/lib/ai"
	"sun-panel/models"

	"github.com/gin-gonic/gin"
	"github.com/gin-gonic/gin/binding"
)

// Search AI 智能搜索 handler
type Search struct{}

// Search 首页搜索：普通搜索 / AI 智能搜索（自动降级普通搜索）
func (a *Search) Search(c *gin.Context) {
	userInfo, _ := base.GetCurrentUserInfo(c)
	var req struct {
		Query string `json:"query"`
		Mode  string `json:"mode"`
		Limit int    `json:"limit"`
	}
	if err := c.ShouldBindBodyWith(&req, binding.JSON); err != nil {
		apiReturn.ErrorParamFomat(c, err.Error())
		return
	}
	if req.Limit <= 0 || req.Limit > ai.MaxResults {
		req.Limit = ai.MaxResults
	}

	// 取出当前用户全部图标（权限隔离：只检索本人可见）
	itemIcons := []models.ItemIcon{}
	if err := global.Db.Order("sort,created_at").Find(&itemIcons, "user_id=?", userInfo.ID).Error; err != nil {
		apiReturn.ErrorDatabase(c, err.Error())
		return
	}
	for k := range itemIcons {
		if itemIcons[k].AddressesJson != "" && itemIcons[k].AddressesJson != "null" {
			json.Unmarshal([]byte(itemIcons[k].AddressesJson), &itemIcons[k].Addresses)
		}
	}

	// 普通搜索
	if req.Mode != "ai" {
		result := ai.LocalFilter(itemIcons, req.Query, req.Limit)
		apiReturn.SuccessData(c, gin.H{
			"mode":   "normal",
			"query":  req.Query,
			"results": result,
			"count":  len(result),
		})
		return
	}

	// AI 搜索
	cfg := ai.LoadConfig(userInfo.ID)
	if !cfg.Enabled {
		result := ai.LocalFilter(itemIcons, req.Query, req.Limit)
		apiReturn.SuccessData(c, gin.H{
			"mode":    "normal",
			"query":   req.Query,
			"results": result,
			"count":   len(result),
			"fallback": true,
			"reason":  "ai disabled",
		})
		return
	}

	ctx, cancel := context.WithTimeout(c.Request.Context(), 15*time.Second)
	defer cancel()

	groups := []models.ItemIconGroup{}
	_ = global.Db.Order("sort,created_at").Where("user_id=?", userInfo.ID).Find(&groups).Error

	ids, err := ai.AISearch(ctx, cfg, itemIcons, groups, req.Query)
	if err != nil {
		result := ai.LocalFilter(itemIcons, req.Query, req.Limit)
		apiReturn.SuccessData(c, gin.H{
			"mode":    "normal",
			"query":   req.Query,
			"results": result,
			"count":   len(result),
			"fallback": true,
			"reason":  err.Error(),
		})
		return
	}

	ordered := ai.FetchByIds(itemIcons, ids, req.Limit)
	apiReturn.SuccessData(c, gin.H{
		"mode":    "ai",
		"query":   req.Query,
		"results": ordered,
		"count":   len(ordered),
		"provider": string(cfg.DefaultProvider),
		"model":   cfg.Providers[string(cfg.DefaultProvider)].Model,
		"fallback": false,
	})
}

// GetAIConfig 获取 AI 搜索配置（含 API Key，仅登录用户可见）
func (a *Search) GetAIConfig(c *gin.Context) {
	userInfo, _ := base.GetCurrentUserInfo(c)
	cfg := ai.LoadConfig(userInfo.ID)
	apiReturn.SuccessData(c, cfg)
}

// SaveAIConfig 保存 AI 搜索配置
func (a *Search) SaveAIConfig(c *gin.Context) {
	userInfo, _ := base.GetCurrentUserInfo(c)
	var req ai.AIConfig
	if err := c.ShouldBindBodyWith(&req, binding.JSON); err != nil {
		apiReturn.ErrorParamFomat(c, err.Error())
		return
	}
	if req.Providers == nil {
		req.Providers = map[string]ai.AIProviderConfig{}
	}
	if err := ai.SaveConfig(userInfo.ID, req); err != nil {
		apiReturn.ErrorDatabase(c, err.Error())
		return
	}
	apiReturn.SuccessData(c, ai.LoadConfig(userInfo.ID))
}

// ListModels 获取指定服务商模型列表
func (a *Search) ListModels(c *gin.Context) {
	userInfo, _ := base.GetCurrentUserInfo(c)
	provider := c.Query("provider")
	if provider == "" {
		provider = string(ai.ProviderDeepSeek)
	}
	cfg := ai.LoadConfig(userInfo.ID)
	pc, ok := cfg.Providers[provider]
	if !ok {
		apiReturn.ErrorParamFomat(c, "unknown provider")
		return
	}
	if pc.APIKey == "" {
		apiReturn.Error(c, "apiKey required")
		return
	}
	ctx, cancel := context.WithTimeout(c.Request.Context(), 20*time.Second)
	defer cancel()
	modelsList, err := ai.ProviderManager{}.GetAdapter(pc).ListModels(ctx, pc)
	if err != nil {
		apiReturn.Error(c, err.Error())
		return
	}
	apiReturn.SuccessData(c, gin.H{"provider": provider, "models": modelsList})
}

// AutoBestModel 自动检测某服务商可用且最优的模型并启用（自动保存）
func (a *Search) AutoBestModel(c *gin.Context) {
	userInfo, _ := base.GetCurrentUserInfo(c)
	var req struct {
		Provider string `json:"provider"`
	}
	if err := c.ShouldBindBodyWith(&req, binding.JSON); err != nil {
		apiReturn.ErrorParamFomat(c, err.Error())
		return
	}
	if req.Provider == "" {
		apiReturn.ErrorParamFomat(c, "provider required")
		return
	}
	ctx, cancel := context.WithTimeout(c.Request.Context(), 120*time.Second)
	defer cancel()
	result, err := ai.AutoBestModel(ctx, userInfo.ID, ai.Provider(req.Provider))
	if err != nil {
		// 即使未选出最优，也带回实测明细便于前端展示失败原因
		if len(result.Tested) > 0 {
			apiReturn.ErrorCode(c, -1, err.Error(), result)
			return
		}
		apiReturn.Error(c, err.Error())
		return
	}
	apiReturn.SuccessData(c, result)
}

// TestModels 测速：对所有已配置的服务商模型进行可用性 + 延迟测试
func (a *Search) TestModels(c *gin.Context) {
	userInfo, _ := base.GetCurrentUserInfo(c)
	cfg := ai.LoadConfig(userInfo.ID)
	results := []ai.ModelTestResult{}
	for _, pc := range cfg.Providers {
		if !pc.Enabled || pc.APIKey == "" || pc.Model == "" {
			continue
		}
		ctx, cancel := context.WithTimeout(c.Request.Context(), 30*time.Second)
		res := ai.ProviderManager{}.GetAdapter(pc).TestModel(ctx, pc, pc.Model)
		cancel()
		results = append(results, res)
	}
	apiReturn.SuccessData(c, gin.H{"results": results})
}
