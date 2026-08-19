// 泳昇-Panel AI 统一类型定义（P4：顶部搜索框与右下角助手共用同一套后端）
// 对应后端 lib/ai/engine.go 的 AgentResult。

// AI 引擎返回的结果种类
export type AIResultKind = 'items' | 'reply' | 'changed' | 'data'

// 路由判定的意图类型（与后端 IntentType 对齐）
export type AIIntent =
  | 'chat'
  | 'local_search'
  | 'web_search'
  | 'realtime'
  | 'panel_action'
  | 'settings_action'
  | 'organize'
  | 'rejected'

// 统一 AI 结果（/panel/ai/agent 返回的 data）
export interface AIAgentResult {
  kind: AIResultKind
  reply: string
  changed: boolean
  tool?: string
  intent?: AIIntent
  items?: Panel.ItemInfo[]
  data?: Record<string, any>
}

// 一条对话消息（前端会话状态）
export interface AIMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  // 助手消息可携带的检索结果 / 结构化数据
  items?: Panel.ItemInfo[]
  intent?: AIIntent
  tool?: string
  data?: Record<string, any>
  // 面板数据是否因这条消息发生变更（前端据此刷新列表）
  changed?: boolean
  error?: boolean
  loading?: boolean
  ts: number
}
