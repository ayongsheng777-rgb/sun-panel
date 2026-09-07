import { get, post } from '@/utils/request'

export interface DockerContainer {
  id: string
  name: string
  image: string
  state: string
  status: string
  ports: { ip: string; privatePort: number; publicPort: number; type: string }[]
}

// 后端把列表注册成 GET，这里用 get（会自动带上 token 头）
export function getContainerList<T>(all = true) {
  return get<T>({ url: '/docker/container/getList', data: { all: all ? 1 : 0 } })
}

export function getContainerStates<T>(containerIds: string[]) {
  return post<T>({ url: '/docker/container/getContainerStates', data: { containerIds } })
}

export function getContainerIDByName<T>(name: string) {
  return post<T>({ url: '/docker/container/getContainerIDByName', data: { name } })
}

export function execSwitchAction<T>(containerId: string, action: 'start' | 'stop' | 'restart') {
  return post<T>({
    url: '/docker/container/execSwitchActionByContainerID',
    data: { containerId, action },
  })
}

export function restartContainer<T>(containerId: string) {
  return post<T>({ url: '/docker/container/restartContainer', data: { containerId } })
}
