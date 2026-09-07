import { post } from '@/utils/request'

export interface RecoveryResult {
  compatibilityStatus: number
  lowestSunPanelVersion: string
  message: string
}

// 立即创建一个备份包
export function createBackup<T>() {
  return post<T>({ url: '/panel/backup/backup', data: {} })
}

export function getBackupList<T>() {
  return post<T>({ url: '/panel/backup/getList', data: {} })
}

export function recovery<T>(fileName: string, force = false) {
  return post<T>({ url: '/panel/backup/recovery', data: { fileName, force } })
}

// 下载与上传走原生地址：下载要触发浏览器保存，上传要带文件流
export function downloadUrl(fileName: string) {
  return `/api/panel/backup/downloadBackupZIPFile?fileName=${encodeURIComponent(fileName)}`
}

export function uploadUrl() {
  return '/api/panel/backup/uploadZipFile'
}
