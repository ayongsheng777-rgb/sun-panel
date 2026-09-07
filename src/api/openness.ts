import { get } from '@/utils/request'

export function getLoginConfig<T>() {
  return get<T>({
    url: '/openness/loginConfig',
  })
}

// 获取免责声明
export function getDisclaimer<T>() {
  return get<T>({
    url: '/openness/getDisclaimer',
  })
}

// 获取关于的描述信息
export function getAboutDescription<T>() {
  return get<T>({
    url: '/openness/getAboutDescription',
  })
}

// 授权状态探测（本 Fork 恒返回 isExpired=false = 已解锁全部功能）
export function proIsExpired<T>() {
  return get<T>({
    url: '/openness/proIsExpired',
  })
}
