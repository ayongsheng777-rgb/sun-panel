package ai

import (
	"context"
	"errors"
	"sort"
	"sync"
	"time"
)

// 自动优选：候选池（按能力分档，tier 越小越强）。
// 作用是把实测范围限制在十来个知名模型上，避免全量实测上百个模型（慢且费调用）。
// 用户侧排序规则：免费可用 > 速度（延迟低优先）> 能力（tier 小优先，仅作同速平局裁决）。
type modelCandidate struct {
	Id   string
	Tier int
}

// providerModelCandidates 各服务商内置候选池（目前重点维护 NVIDIA）
var providerModelCandidates = map[Provider][]modelCandidate{
	ProviderNvidia: {
		// 第一档：旗舰
		{Id: "deepseek-ai/deepseek-v3.1-terminus", Tier: 1},
		{Id: "deepseek-ai/deepseek-v3.1", Tier: 1},
		{Id: "qwen/qwen3-235b-a22b", Tier: 1},
		{Id: "meta/llama-3.3-70b-instruct", Tier: 1},
		// 第二档：中坚
		{Id: "nvidia/llama-3.1-nemotron-70b-instruct", Tier: 2},
		{Id: "qwen/qwen2.5-72b-instruct", Tier: 2},
		{Id: "mistralai/mixtral-8x22b-instruct-v0.1", Tier: 2},
		// 第三档：轻量快速
		{Id: "meta/llama-3.1-8b-instruct", Tier: 3},
		{Id: "qwen/qwen2.5-7b-instruct", Tier: 3},
		{Id: "mistralai/mistral-7b-instruct-v0.3", Tier: 3},
		{Id: "microsoft/phi-3-mini-128k-instruct", Tier: 3},
	},
}

// AutoBestResult 自动优选结果
type AutoBestResult struct {
	Provider string            `json:"provider"`
	Model    string            `json:"model"`
	Latency  int64             `json:"latencyMs"`
	Tested   []ModelTestResult `json:"tested"`
}

// AutoBestModel 自动检测某服务商「可用且最优」的模型并启用：
//  1. 拉取该 key 可见的模型列表，与内置候选池取交集（交集为空则退化为列表前 5 个）
//  2. 并发实测（测活+计时）
//  3. 在测活成功者中按 延迟低优先、能力档高兜底 选出最优
//  4. 回填 cfg（model + enabled=true）并保存
func AutoBestModel(ctx context.Context, userId uint, provider Provider) (AutoBestResult, error) {
	cfg := LoadConfig(userId)
	pc, ok := cfg.Providers[string(provider)]
	if !ok {
		return AutoBestResult{}, errors.New("unknown provider")
	}
	if pc.APIKey == "" {
		return AutoBestResult{}, errors.New("请先填写该服务商的 API Key")
	}

	adapter := ProviderManager{}.GetAdapter(pc)

	listCtx, cancel := context.WithTimeout(ctx, 20*time.Second)
	models, err := adapter.ListModels(listCtx, pc)
	cancel()
	if err != nil {
		return AutoBestResult{}, err
	}
	available := map[string]bool{}
	for _, m := range models {
		available[m.Id] = true
	}

	// 候选池 ∩ 可见列表
	tierOf := map[string]int{}
	candidates := []string{}
	for _, c := range providerModelCandidates[provider] {
		if available[c.Id] {
			candidates = append(candidates, c.Id)
			tierOf[c.Id] = c.Tier
		}
	}
	// 兜底：候选池一个都没命中（服务商大改版），实测列表前 5 个
	if len(candidates) == 0 {
		for i, m := range models {
			if i >= 5 {
				break
			}
			candidates = append(candidates, m.Id)
			tierOf[m.Id] = 9
		}
	}
	if len(candidates) == 0 {
		return AutoBestResult{}, errors.New("未拉取到任何可用模型")
	}

	// 并发实测（限制并发 4，单模型超时 20s）
	tested := make([]ModelTestResult, len(candidates))
	var wg sync.WaitGroup
	sem := make(chan struct{}, 4)
	for i, id := range candidates {
		wg.Add(1)
		go func(i int, id string) {
			defer wg.Done()
			sem <- struct{}{}
			defer func() { <-sem }()
			tCtx, tCancel := context.WithTimeout(ctx, 20*time.Second)
			defer tCancel()
			tested[i] = adapter.TestModel(tCtx, pc, id)
		}(i, id)
	}
	wg.Wait()

	// 选优：测活成功 → 延迟低优先 → 能力档高兜底
	okList := []ModelTestResult{}
	for _, r := range tested {
		if r.Success {
			okList = append(okList, r)
		}
	}
	if len(okList) == 0 {
		return AutoBestResult{
			Provider: string(provider),
			Tested:   tested,
		}, errors.New("候选模型全部实测失败，请检查 API Key 额度或网络")
	}
	sort.Slice(okList, func(i, j int) bool {
		if okList[i].LatencyMs != okList[j].LatencyMs {
			return okList[i].LatencyMs < okList[j].LatencyMs
		}
		return tierOf[okList[i].Model] < tierOf[okList[j].Model]
	})
	best := okList[0]

	// 回填并保存：填入最优模型 + 打开启用开关
	pc.Model = best.Model
	pc.Enabled = true
	cfg.Providers[string(provider)] = pc
	if err := SaveConfig(userId, cfg); err != nil {
		return AutoBestResult{}, err
	}

	return AutoBestResult{
		Provider: string(provider),
		Model:    best.Model,
		Latency:  best.LatencyMs,
		Tested:   tested,
	}, nil
}
