import { post } from '@/utils/request'

// 基础版权限清单：列出所有账号的 AI 管理员权限（仅管理员可调用）
export interface AdminUserItem {
  id: number
  username: string
  name?: string
  role: number
  aiAdmin: boolean
  otpEnabled: boolean
}

export function adminUserList<T = AdminUserItem[]>() {
  return post<T>({
    url: '/user/admin/list',
    data: {},
  })
}

// 切换某账号的 AI 管理员权限（仅管理员可调用）
export function updateAiPermission<T = unknown>(userId: number, aiAdmin: boolean) {
  return post<T>({
    url: '/user/admin/ai-permission',
    data: { userId, aiAdmin },
  })
}
