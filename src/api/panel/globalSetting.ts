import { post } from '@/utils/request'

// 站点品牌设置
export interface SiteSetting {
  faviconUrl: string
  title: string
  loginBackgroundUrl: string
  isEnableLoginCaptcha: boolean
  isDisableItemCardCache: boolean
}

export function getSiteSetting<T>() {
  return post<T>({ url: '/panel/globalSetting/getSiteStting', data: {} })
}

export function saveSiteSetting<T>(param: SiteSetting) {
  return post<T>({ url: '/panel/globalSetting/saveSiteStting', data: param })
}

// 在线自定义 CSS / JS
export interface CustomCode {
  jsContent: string
  cssContent: string
}

export function getCustomJsAndCssCode<T>() {
  return post<T>({ url: '/panel/globalSetting/getCustomJsAndCssCode', data: {} })
}

export function saveCustomJsAndCssCode<T>(param: CustomCode) {
  return post<T>({ url: '/panel/globalSetting/saveCustomJsAndCssCode', data: param })
}

export function getCustomStylePath<T>() {
  return post<T>({ url: '/panel/globalSetting/getCustomStylePath', data: {} })
}

// 开放接口（浏览器插件）
export interface OpenApiInfo {
  enabled: boolean
  token: string
  apiUrl: string
  updatedAt: string
}

export function getOpenApiInfo<T>() {
  return post<T>({ url: '/panel/openApi/getInfo', data: {} })
}

export function refreshOpenApiToken<T>() {
  return post<T>({ url: '/panel/openApi/refreshToken', data: {} })
}

export function setOpenApiEnabled<T>(enabled: boolean) {
  return post<T>({ url: '/panel/openApi/setEnable', data: { enabled } })
}
