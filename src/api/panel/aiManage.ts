import { post } from '@/utils/request'

// 后端 /panel/ai/add-website 返回的 data 结构
export interface AIAddWebsiteResult {
  item: Panel.ItemInfo
  category: string
  groupId: number
  searchResults: { title: string; url: string; description: string; host: string }[]
}

// AI 自动添加网址：联网搜官网 → 选官网 → 分类 → 建分组 → 保存
export function addWebsite<T = AIAddWebsiteResult>(prompt: string) {
  return post<T>({
    url: '/panel/ai/add-website',
    data: { prompt },
  })
}

// GitHub 智能检索：搜索仓库 → AI 选最佳仓库 → 分类 → 添加导航入口
export function githubSearch<T = AIAddWebsiteResult>(prompt: string) {
  return post<T>({
    url: '/panel/ai/github-search',
    data: { prompt },
  })
}
