import { post } from '@/utils/request'

// 后端 /panel/ai/agent 返回的 data 结构
export interface AIAgentResult {
  kind: 'items' | 'reply' | 'changed'
  reply: string
  changed: boolean
  items?: Panel.ItemInfo[]
}

// 对话式 AI 操作代理：搜索全部内容 + 分组/网址管理（禁止删除）
export function aiAgent<T = AIAgentResult>(prompt: string) {
  return post<T>({
    url: '/panel/ai/agent',
    data: { prompt },
  })
}
