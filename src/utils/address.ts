/**
 * 根据 URL 自动识别地址类型
 * https://...        -> https
 * http://10.x / 192.168.x / 172.16~31.x / localhost / .local -> lan
 * http://...        -> http
 * 其它                -> other
 */
export function classifyAddress(url: string): Panel.ItemAddressType {
  const value = (url || '').trim().toLowerCase()

  if (value.startsWith('https://'))
    return 'https'

  if (value.startsWith('http://')) {
    let host = value.replace(/^http:\/\//, '').split('/')[0].split(':')[0]
    // 处理 IPv6 [host]:port
    if (host.startsWith('[')) {
      const m = host.match(/^\[(.+)\]/)
      if (m)
        host = m[1]
    }
    if (
      /^10\./.test(host)
      || /^192\.168\./.test(host)
      || /^172\.(1[6-9]|2\d|3[0-1])\./.test(host)
      || host === 'localhost'
      || host.endsWith('.local')
    )
      return 'lan'

    return 'http'
  }

  return 'other'
}

/** 仅允许 http/https，禁止 javascript:/data:/file: 等危险协议 */
export function isSafeWebUrl(value: string): boolean {
  try {
    const url = new URL((value || '').trim())
    return url.protocol === 'http:' || url.protocol === 'https:'
  }
  catch {
    return false
  }
}

/** 根据地址类型返回默认名称 */
export function getDefaultAddressName(address: Panel.ItemAddress): string {
  switch (address.type) {
    case 'https':
      return 'HTTPS'
    case 'http':
      return 'HTTP'
    case 'lan':
      return '局域网'
    default:
      return '网址'
  }
}

/** 迷你按钮上的简短显示名（最多 2 字） */
export function getShortAddressName(address: Panel.ItemAddress): string {
  const name = (address.name || '').trim()
  if (!name)
    return getDefaultAddressName(address).slice(0, 2)
  return name.length > 2 ? name.slice(0, 2) : name
}

/** 取默认地址：优先 addresses 中的 isDefault，否则用旧 url 兜底 */
export function getDefaultAddress(item: Panel.ItemInfo): Panel.ItemAddress | null {
  const addresses = item.addresses ?? []
  const def = addresses
    .filter(address => address.enabled)
    .find(address => address.isDefault)
  if (def)
    return def
  if (item.url) {
    return {
      id: 'legacy-default',
      name: '默认',
      url: item.url,
      type: classifyAddress(item.url),
      isDefault: true,
      sort: 0,
      enabled: true,
      openMethod: item.openMethod,
    }
  }
  return null
}

/** 迷你快捷按钮：默认不显示默认地址本身 */
export function getShortcutAddresses(item: Panel.ItemInfo): Panel.ItemAddress[] {
  return (item.addresses ?? [])
    .filter(address => address.enabled)
    .sort((a, b) => a.sort - b.sort)
}
