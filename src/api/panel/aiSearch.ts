import { get, post } from '@/utils/request'

export interface AISearchRequest {
  query: string
  mode: 'normal' | 'ai'
  limit?: number
}

// 后端 /panel/search 返回的 data 结构
export type AISearchResult = Panel.AISearchResponse

// 触发搜索（普通 / AI）。AI 失败由后端自动降级为普通搜索并返回 fallback 标记
export function aiSearch<T = AISearchResult>(req: AISearchRequest) {
  return post<T>({
    url: '/panel/search',
    data: req,
  })
}

// 读取 AI 搜索配置（含 API Key 明文，仅登录用户可见；前端以密码框展示，留空即保留原值）
export function getAIConfig<T = Panel.AIConfig>() {
  return get<T>({
    url: '/panel/ai/config',
    data: {},
  })
}

// 保存 AI 搜索配置
export function saveAIConfig<T = Panel.AIConfig>(data: Panel.AIConfig) {
  return post<T>({
    url: '/panel/ai/config',
    data,
  })
}

// 拉取某 provider 可用模型列表（GET，provider 作为 query 传递）
export function listAIModels<T = { provider: string; models: Panel.AIModel[] }>(provider: string) {
  return get<T>({
    url: '/panel/ai/models',
    data: { provider },
  })
}

// 测试模型连通性（后端会测试所有已启用且已配置 key 的 provider）
export function testAIModels<T = { results: Panel.AIModelTestResult[] }>() {
  return post<T>({
    url: '/panel/ai/test',
    data: {},
  })
}
