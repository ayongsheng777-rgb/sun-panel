// Sun-Panel AI 统一 API 入口（P4）。
// 顶部搜索框（SearchBox）与右下角助手（AIAssistant）都只通过这里访问后端，
// 后端统一走 lib/ai/engine.go 的意图路由 + 工具注册表。
import { get, post } from '@/utils/request'
import type { AIAgentResult } from '@/types/ai'

export type { AIAgentResult, AIIntent, AIMessage, AIResultKind } from '@/types/ai'

/**
 * 统一 AI 对话/操作入口。
 * 用户的任何自然语言（搜网址、联网查资料、天气时间、加网址、管分组、整理、改设置、闲聊）
 * 都发到这里，由后端引擎决定调用哪个工具。删除类操作会被后端硬性拒绝。
 */
export function aiChat<T = AIAgentResult>(prompt: string) {
  return post<T>({
    url: '/panel/ai/agent',
    data: { prompt },
  })
}

// ============ 单点能力接口（后端保留，新代码优先用 aiChat） ============

export interface AIAddWebsiteResult {
  item: Panel.ItemInfo
  category: string
  groupId: number
  searchResults: { title: string; url: string; description: string; host: string }[]
  repo?: string
}

export function addWebsite<T = AIAddWebsiteResult>(prompt: string) {
  return post<T>({ url: '/panel/ai/add-website', data: { prompt } })
}

export function githubSearch<T = AIAddWebsiteResult>(prompt: string) {
  return post<T>({ url: '/panel/ai/github-search', data: { prompt } })
}

// ============ 旧版两段式搜索（普通搜索现由前端本地过滤，此接口后端仍保留） ============

export interface AISearchRequest {
  query: string
  mode: 'normal' | 'ai'
  limit?: number
}

export function aiSearch<T = Panel.AISearchResponse>(req: AISearchRequest) {
  return post<T>({ url: '/panel/search', data: req })
}

// ============ AI 配置（模型 / Provider / Key） ============

export function getAIConfig<T = Panel.AIConfig>() {
  return get<T>({ url: '/panel/ai/config', data: {} })
}

export function saveAIConfig<T = Panel.AIConfig>(data: Panel.AIConfig) {
  return post<T>({ url: '/panel/ai/config', data })
}

export function listAIModels<T = { provider: string; models: Panel.AIModel[] }>(provider: string) {
  return get<T>({ url: '/panel/ai/models', data: { provider } })
}

export function testAIModels<T = { results: Panel.AIModelTestResult[] }>() {
  return post<T>({ url: '/panel/ai/test', data: {} })
}
