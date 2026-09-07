import { post } from '@/utils/request'

export interface GalleryImage {
  id: number
  src: string
  fileName: string
  type: number
  ext: string
  isPublicGallery: boolean
  createTime: string
}

export function getImagesList<T>(param: { type?: number; page?: number; size?: number }) {
  return post<T>({ url: '/panel/publicGallery/getImagesList', data: param })
}

export function updateFileType<T>(ids: number[], type: number) {
  return post<T>({ url: '/panel/publicGallery/updateFileType', data: { ids, type } })
}

export function deletes<T>(ids: number[]) {
  return post<T>({ url: '/panel/publicGallery/deletes', data: { ids } })
}
