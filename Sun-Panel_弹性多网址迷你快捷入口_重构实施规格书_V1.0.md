# Sun-Panel「弹性多网址 + 迷你快捷入口」重构实施规格书

> 项目：`A-Yong1981/sun-panel`  
> 分支：`master`  
> 目标：交给 智能体 直接进行代码分析、重构、测试和验收  
> 版本：V1.0  
> 日期：2026-08-17

---

## 1. 改造目标

将 Sun-Panel 当前“默认地址 + 局域网地址”的固定双地址模型，升级为：

**一个图标 = 1 个默认地址 + N 个可选地址**

其中 N 为用户可动态增加、删除、编辑、排序的地址，不能在业务模型中人为限制为 2 个，也不能使用固定字段继续扩展。

### 核心交互

以现有图标卡片为基础：

```text
┌──────────────────────────────┐
│          网站图标             │
│      Dragon's Brand...        │
├──────────────────────────────┤
│  ●  ●  ●  ●  ●  ●  +         │
└──────────────────────────────┘
```

- 点击**原图标/标题主体区域**：始终打开该项目的 `default` 默认地址。
- 点击下面的**迷你快捷按钮**：打开对应地址。
- 每一个地址都必须独立保存名称、URL、类型、颜色、排序、启用状态等属性。
- 地址数量原则上为**无上限**，实际仅受数据库字段、请求体、浏览器渲染和设备资源限制。
- 不再把 `url` / `lanUrl` 作为长期扩展模型。
- 必须保留旧数据兼容能力，现有 `url` 自动迁移为默认地址，`lanUrl` 自动迁移为一个局域网地址。

---

## 2. 当前项目代码基线

本次检查确认当前项目是 Vue 3 + TypeScript + Vite + Naive UI + Pinia 架构。`package.json` 中明确使用 Vue 3、TypeScript、Naive UI、Pinia、Vite。不要为了本需求引入 React、Element Plus 或其它 UI 框架。

当前主要涉及文件：

```text
src/
├── typings/
│   └── panel.d.ts
├── api/
│   └── panel/
│       └── itemIcon.ts
├── views/
│   └── home/
│       ├── index.vue
│       └── components/
│           ├── AppIcon/
│           │   └── index.vue
│           └── EditItem/
│               └── index.vue
└── locales/
```

当前 `Panel.ItemInfo` 使用：

```ts
interface ItemInfo extends Common.InfoBase {
  icon: ItemIcon | null
  title: string
  url: string
  sort?: number
  lanUrl?: string
  description?: string
  openMethod: number
  itemIconGroupId?: number
}
```

当前首页点击逻辑根据 `networkMode` 在 `url` 和 `lanUrl` 之间选择地址。

当前编辑窗口也只提供 `url` 和 `lanUrl` 两个输入框。

本次改造必须围绕上述实际结构进行，而不是另起炉灶重做 Sun-Panel。

---

# 3. 新的数据模型

## 3.1 ItemInfo

推荐将 `Panel.ItemInfo` 改成：

```ts
interface ItemInfo extends Common.InfoBase {
  icon: ItemIcon | null
  title: string

  /**
   * 默认地址。
   * 点击图标主体时永远使用此地址。
   */
  url: string

  sort?: number
  description?: string
  openMethod: number
  itemIconGroupId?: number

  /**
   * 新版弹性地址集合。
   */
  addresses?: ItemAddress[]

  /**
   * 旧字段，仅用于兼容旧数据。
   * 新代码不得继续依赖它们实现业务逻辑。
   */
  lanUrl?: string
}
```

## 3.2 ItemAddress

新增：

```ts
interface ItemAddress {
  /**
   * 前端稳定唯一 ID。
   * 推荐 UUID / nanoid / 后端生成 ID。
   */
  id: string

  /**
   * 地址显示名称，例如：
   * 官方网站 / HTTPS / HTTP / 局域网 / NAS / 管理后台
   */
  name: string

  /**
   * 完整 URL。
   */
  url: string

  /**
   * 地址类型。
   */
  type: ItemAddressType

  /**
   * 是否作为默认地址。
   * 一个 Item 只能有一个 true。
   */
  isDefault: boolean

  /**
   * 排序。
   */
  sort: number

  /**
   * 是否显示。
   */
  enabled: boolean

  /**
   * 打开方式。
   * 继承项目现有 openMethod 逻辑。
   * 1 当前页
   * 2 新窗口
   * 3 页面内小窗
   */
  openMethod?: number

  /**
   * 可选自定义颜色。
   * 未填写时由 type 自动决定。
   */
  color?: string
}
```

类型：

```ts
type ItemAddressType =
  | 'https'
  | 'http'
  | 'lan'
  | 'other'
```

---

# 4. 地址类型识别规则

不要让用户必须手工选择颜色。

系统应根据 URL 自动识别基础类型。

```ts
export function classifyAddress(url: string): ItemAddressType {
  const value = url.trim().toLowerCase()

  if (value.startsWith('https://'))
    return 'https'

  if (value.startsWith('http://')) {
    const host = value.replace(/^http:\/\//, '').split('/')[0].split(':')[0]

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
```

注意：

- `https://192.168.1.10` 应优先归类为 `https`，因为它的协议是 HTTPS。
- `http://192.168.1.10` 应归类为 `lan`。
- `http://10.0.0.5` 应归类为 `lan`。
- `http://172.16.0.10` 至 `http://172.31.x.x` 应归类为 `lan`。
- `localhost`、`127.0.0.1`、`.local` 应视为局域/本机类。
- IPv6 局域地址必须支持，例如 `http://[fd00::1]:8080`。
- 不允许通过字符串简单判断 `192` 就认为是局域网。

建议进一步使用 `URL` API + IP 判断工具进行严谨实现。

---

# 5. 颜色规范

建议使用 CSS class，而不是把颜色硬编码在模板中。

```ts
export const ADDRESS_TYPE_CLASS: Record<ItemAddressType, string> = {
  https: 'address-type-https',
  http: 'address-type-http',
  lan: 'address-type-lan',
  other: 'address-type-other',
}
```

视觉建议：

| 类型 | 含义 | 推荐视觉 |
|---|---|---|
| HTTPS | 安全公网/加密地址 | 绿色 |
| HTTP | 普通 HTTP 地址 | 橙色 |
| LAN | 局域网/IP 地址 | 蓝色 |
| OTHER | 其它合法 URL | 灰色 |

不要使用刺眼的纯色大按钮。

迷你按钮建议：

```text
HTTPS  → 绿色
HTTP   → 橙色
LAN    → 蓝色
OTHER  → 灰色
```

可以同时显示短名称：

```text
[官] [安] [内] [NAS] [管理]
```

鼠标悬停显示完整名称和 URL。

---

# 6. AppIcon 改造

当前文件：

```text
src/views/home/components/AppIcon/index.vue
```

当前组件只负责展示图标和标题，并不直接决定打开 URL。

建议继续保持这一职责边界：

**AppIcon 负责视觉和迷你快捷按钮，首页 index.vue 负责实际导航。**

---

## 6.1 推荐模板结构

在现有 `.app-icon-info` 和 `.app-icon-small` 两种模式下，都加入地址快捷栏。

示意：

```vue
<div class="app-address-shortcuts">
  <button
    v-for="address in visibleAddresses"
    :key="address.id"
    class="address-shortcut"
    :class="getAddressTypeClass(address)"
    :title="`${address.name} — ${address.url}`"
    @click.stop="emit('address-click', address)"
  >
    <span class="address-shortcut-dot" />
    <span class="address-shortcut-label">
      {{ getShortAddressName(address) }}
    </span>
  </button>
</div>
```

关键点：

```vue
@click.stop
```

必须存在。

否则点击迷你按钮时会继续冒泡到父级 AppIcon，导致：

1. 打开快捷地址；
2. 同时触发默认地址；

这是本需求最重要的交互 BUG 防护之一。

---

# 7. AppIcon Props / Emits

建议：

```ts
interface Prop {
  itemInfo?: Panel.ItemInfo
  size?: number
  forceBackground?: string
  iconTextColor?: string
  iconTextInfoHideDescription: boolean
  iconTextIconHideTitle: boolean
  style: PanelPanelConfigStyleEnum
}

const emit = defineEmits<{
  (e: 'address-click', address: Panel.ItemAddress): void
}>()
```

地址：

```ts
const visibleAddresses = computed(() => {
  return (props.itemInfo?.addresses ?? [])
    .filter(item => item.enabled)
    .sort((a, b) => a.sort - b.sort)
})
```

默认地址不要重复显示在迷你地址列表中，推荐：

```ts
const shortcutAddresses = computed(() => {
  return visibleAddresses.value.filter(item => !item.isDefault)
})
```

但是，如果用户明确希望所有地址都作为快捷入口，则允许默认地址也显示。

**本项目默认推荐：快捷栏只显示非默认地址。**

这样视觉上：

```text
主图标 = 默认地址
下方按钮 = 其它地址
```

逻辑最清晰。

---

# 8. 首页 index.vue 改造

当前：

```text
src/views/home/index.vue
```

现在存在：

```ts
function handleItemClick(itemGroupIndex: number, item: Panel.ItemInfo) {
  ...
  let jumpUrl = ''

  if (item)
    jumpUrl = (panelState.networkMode === PanelStateNetworkModeEnum.lan ? item.lanUrl : item.url) as string

  if (item.lanUrl === '')
    jumpUrl = item.url

  openPage(item.openMethod, jumpUrl, item.title)
}
```

必须改成：

```ts
function getDefaultAddress(item: Panel.ItemInfo): Panel.ItemAddress | null {
  const addresses = item.addresses ?? []

  const defaultAddress = addresses
    .filter(address => address.enabled)
    .find(address => address.isDefault)

  if (defaultAddress)
    return defaultAddress

  if (item.url) {
    return {
      id: 'legacy-default',
      name: t('iconItem.defaultAddress'),
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
```

然后：

```ts
function handleItemClick(itemGroupIndex: number, item: Panel.ItemInfo) {
  if (items.value[itemGroupIndex] && items.value[itemGroupIndex].sortStatus) {
    handleEditItem(item)
    return
  }

  const address = getDefaultAddress(item)

  if (!address)
    return

  openPage(
    address.openMethod ?? item.openMethod,
    address.url,
    item.title,
  )
}
```

## 重要规则

**点击主图标不再根据 LAN/WAN 自动切换地址。**

主图标必须永远打开：

```text
isDefault === true
```

这正是本次“默认地址改为弹性地址”改造的核心。

---

# 9. 快捷地址点击

在首页增加：

```ts
function handleAddressClick(
  address: Panel.ItemAddress,
  item: Panel.ItemInfo,
) {
  if (!address.enabled || !address.url)
    return

  openPage(
    address.openMethod ?? item.openMethod,
    address.url,
    `${item.title} - ${address.name}`,
  )
}
```

模板：

```vue
<AppIcon
  ...
  @click="handleItemClick(itemGroupIndex, item)"
  @address-click="handleAddressClick($event, item)"
/>
```

由于 AppIcon 内部使用：

```vue
@click.stop
```

因此快捷按钮不会触发默认地址。

---

# 10. 编辑界面重构

当前：

```text
src/views/home/components/EditItem/index.vue
```

必须删除“固定 URL + 固定 LAN URL”的产品思维。

建议界面：

```text
网址
┌─────────────────────────────────────┐
│ 默认地址                             │
│ [HTTPS] https://example.com         │
│             [默认] [删除]           │
├─────────────────────────────────────┤
│ 局域网                               │
│ [LAN] http://192.168.1.10:8080      │
│             [设为默认] [删除]       │
├─────────────────────────────────────┤
│ NAS                                  │
│ [LAN] http://nas.local:5000         │
│             [设为默认] [删除]       │
├─────────────────────────────────────┤
│ 管理后台                             │
│ [HTTPS] https://admin.example.com   │
│             [设为默认] [删除]       │
└─────────────────────────────────────┘

              [+ 添加地址]
```

---

# 11. 编辑数据结构

新增：

```ts
const model = ref<Panel.Info>({
  ...
  addresses: [],
})
```

增加：

```ts
function addAddress() {
  const addresses = model.value.addresses ?? []

  addresses.push({
    id: crypto.randomUUID(),
    name: '',
    url: '',
    type: 'https',
    isDefault: addresses.length === 0,
    sort: addresses.length,
    enabled: true,
    openMethod: model.value.openMethod,
  })

  model.value.addresses = addresses
}
```

---

# 12. 设置默认地址

必须保证一个 Item 只有一个默认地址。

```ts
function setDefaultAddress(id: string) {
  if (!model.value.addresses)
    return

  model.value.addresses = model.value.addresses.map(address => ({
    ...address,
    isDefault: address.id === id,
  }))

  const defaultAddress = model.value.addresses.find(
    address => address.isDefault,
  )

  if (defaultAddress)
    model.value.url = defaultAddress.url
}
```

不要允许出现：

```text
A isDefault=true
B isDefault=true
```

---

# 13. 删除地址

```ts
function removeAddress(id: string) {
  if (!model.value.addresses)
    return

  const removed = model.value.addresses.find(item => item.id === id)

  model.value.addresses = model.value.addresses
    .filter(item => item.id !== id)
    .map((item, index) => ({
      ...item,
      sort: index,
    }))

  if (
    removed?.isDefault
    && model.value.addresses.length > 0
  ) {
    model.value.addresses[0].isDefault = true
    model.value.url = model.value.addresses[0].url
  }
}
```

删除最后一个地址时：

- 可以允许 `addresses=[]`；
- 但为了兼容旧版和保证主图标可用，保存时应至少保证存在一个有效默认地址。

---

# 14. URL 输入组件

每一个地址都建议：

```vue
<NInput
  v-model:value="address.url"
  placeholder="https://example.com"
  @blur="handleAddressUrlBlur(address)"
/>
```

自动识别：

```ts
function handleAddressUrlBlur(address: Panel.ItemAddress) {
  address.url = address.url.trim()

  if (!address.url)
    return

  address.type = classifyAddress(address.url)

  if (!address.name)
    address.name = getDefaultAddressName(address)

}
```

---

# 15. 自动名称

```ts
function getDefaultAddressName(address: Panel.ItemAddress): string {
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
```

如果 URL 是：

```text
https://example.com
```

可以显示：

```text
HTTPS
```

如果：

```text
http://192.168.1.100:8080
```

显示：

```text
局域网
```

用户可以自行修改成：

```text
NAS
群晖
内网
管理
```

---

# 16. 地址排序

必须支持拖拽排序。

可以继续使用项目已经存在的：

```text
vue-draggable-plus
```

不要新增第三方拖拽库。

数据：

```ts
addresses: [
  {
    id: '1',
    sort: 0,
    ...
  },
  {
    id: '2',
    sort: 1,
    ...
  }
]
```

保存前统一：

```ts
function normalizeAddressSort() {
  model.value.addresses = (model.value.addresses ?? [])
    .map((item, index) => ({
      ...item,
      sort: index,
    }))
}
```

---

# 17. 后端数据库迁移

这是本次改造的关键。

当前旧模型存在：

```text
url
lanUrl
```

不要直接删除。

建议新增：

```text
addresses
```

如果项目当前数据库使用 JSON/序列化字段，可优先将 `addresses` 作为 JSON 数组保存。

示例：

```json
[
  {
    "id": "default",
    "name": "默认",
    "url": "https://example.com",
    "type": "https",
    "isDefault": true,
    "sort": 0,
    "enabled": true,
    "openMethod": 2
  },
  {
    "id": "lan",
    "name": "局域网",
    "url": "http://192.168.1.10:8080",
    "type": "lan",
    "isDefault": false,
    "sort": 1,
    "enabled": true,
    "openMethod": 2
  }
]
```

如果当前数据库结构无法直接使用 JSON，则创建独立表：

```text
item_addresses
```

推荐字段：

```text
id
item_id
name
url
type
is_default
sort
enabled
open_method
color
created_at
updated_at
```

关系：

```text
item_icon
    1
    │
    ├──── N item_addresses
    │
    └──── addresses
```

---

# 18. 无上限设计要求

不要出现：

```ts
url1
url2
url3
url4
url5
```

也不要：

```ts
lanUrl
wanUrl
nasUrl
mobileUrl
adminUrl
```

必须使用：

```ts
addresses: ItemAddress[]
```

这样未来可以：

```text
默认
公网 HTTPS
公网 HTTP
局域网
NAS
Docker
IPv4
IPv6
移动端
备用线路
管理后台
开发环境
测试环境
```

理论上可无限增加。

---

# 19. 兼容旧数据

必须实现自动兼容：

### 旧数据

```json
{
  "url": "https://example.com",
  "lanUrl": "http://192.168.1.10:8080"
}
```

转换为：

```json
{
  "url": "https://example.com",
  "addresses": [
    {
      "id": "legacy-default",
      "name": "默认",
      "url": "https://example.com",
      "type": "https",
      "isDefault": true,
      "sort": 0,
      "enabled": true,
      "openMethod": 2
    },
    {
      "id": "legacy-lan",
      "name": "局域网",
      "url": "http://192.168.1.10:8080",
      "type": "lan",
      "isDefault": false,
      "sort": 1,
      "enabled": true,
      "openMethod": 2
    }
  ]
}
```

迁移必须是**幂等的**。

即：

```text
执行一次 → 正确
执行两次 → 结果不变
执行十次 → 结果不变
```

---

# 20. 新旧字段兼容策略

建议采用：

```text
addresses = 新主数据
url       = 默认地址缓存/兼容字段
lanUrl    = 旧版本兼容字段
```

读取：

```ts
if (item.addresses?.length) {
  // 新模型
}
else {
  // legacy migration
}
```

保存：

```ts
const defaultAddress = addresses.find(item => item.isDefault)

item.url = defaultAddress?.url ?? ''
```

短期不要马上删除：

```text
lanUrl
```

防止老客户端/旧导入数据无法使用。

---

# 21. 右键菜单重构

当前右键菜单存在：

```text
打开新窗口
打开局域网地址
打开公网地址
编辑
删除
```

升级后应变为：

```text
打开默认地址
──────────────
打开：
  ✓ 默认
  ✓ HTTPS
  ✓ HTTP
  ✓ 局域网
  ✓ NAS
  ✓ 管理后台
──────────────
编辑
删除
```

不要再写死：

```ts
openLanUrl
openWanUrl
```

应该动态生成：

```ts
function getAddressMenuOptions(item: Panel.ItemInfo) {
  return (item.addresses ?? [])
    .filter(address => address.enabled)
    .sort((a, b) => a.sort - b.sort)
    .map(address => ({
      label: `${address.name} - ${address.url}`,
      key: `address:${address.id}`,
    }))
}
```

点击：

```ts
if (typeof key === 'string' && key.startsWith('address:')) {
  const id = key.substring('address:'.length)
  const address = currentRightSelectItem.value?.addresses
    ?.find(item => item.id === id)

  if (address)
    openPage(address.openMethod ?? 2, address.url, address.name)

}
```

---

# 22. 网络模式功能如何处理

本次改造后：

```text
LAN/WAN 网络模式
```

不应该继续直接决定主图标打开哪个地址。

原因：

用户现在可以有：

```text
默认
公网 HTTPS
公网 HTTP
局域网
NAS
备用
```

因此：

```text
networkMode
```

以后只能作为：

- 地址推荐；
- 地址状态提示；
- 自动排序；
- 可选自动选择策略；

而不能破坏：

**默认地址 = 用户明确指定的地址。**

如果保留“自动选择”功能，应单独增加：

```ts
addressSelectionMode:
  | 'default'
  | 'auto-network'
```

默认：

```text
default
```

不要默认开启自动网络选择。

---

# 23. UI 迷你按钮设计

建议尺寸：

```css
.address-shortcut {
  width: 22px;
  height: 22px;
  min-width: 22px;
  border-radius: 9999px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 9px;
  font-weight: 700;
  border: 1px solid rgba(255,255,255,.25);
  transition: all .15s ease;
}
```

桌面：

```text
● ● ● ● ●
```

地址名称较短时：

```text
[官] [内] [NAS] [管]
```

不要显示完整 URL，否则会破坏卡片布局。

---

# 24. 地址过多时

“无上限”不等于“全部强制横向显示”。

当地址超过可用宽度时：

```text
[官][内][NAS][管][+3]
```

或者：

```text
[官][内][NAS][管] [...]
```

点击 `...`：

```text
┌──────────────────────────────┐
│ 地址                           │
├──────────────────────────────┤
│ ● HTTPS  官方                  │
│ ● LAN    局域网                │
│ ● LAN    NAS                   │
│ ● HTTPS  管理                  │
│ ● HTTP   备用                  │
│ ● HTTPS  IPv6                  │
└──────────────────────────────┘
```

建议实现：

```text
CSS flex-wrap + max-width
```

而不是截断数据。

---

# 25. 响应式要求

必须兼容：

```text
手机
平板
笔记本
桌面显示器
4K
```

移动端迷你按钮：

```text
最小 20px
推荐 22px
触控区域建议 >= 32px
```

可采用：

```css
.address-shortcut-hitbox {
  padding: 5px;
}
```

实际视觉按钮 20~22px，但点击区域更大。

---

# 26. 无障碍要求

每个快捷按钮必须：

```vue
<button
  type="button"
  :aria-label="`${address.name}: ${address.url}`"
>
```

同时支持：

```text
Tab
Enter
Space
```

不要使用：

```html
<div @click="...">
```

代替真正按钮。

---

# 27. 安全要求

URL 必须校验。

允许：

```text
http://
https://
```

允许合法：

```text
IP
域名
端口
路径
查询参数
IPv6
```

默认禁止：

```text
javascript:
data:
vbscript:
file:
chrome:
chrome-extension:
```

统一：

```ts
function isSafeWebUrl(value: string): boolean {
  try {
    const url = new URL(value.trim())

    return (
      url.protocol === 'http:'
      || url.protocol === 'https:'
    )
  }
  catch {
    return false
  }
}
```

注意：

不要为了兼容旧数据而允许 `javascript:` URL。

---

# 28. API 改造

现有：

```text
src/api/panel/itemIcon.ts
```

保持：

```ts
edit(item)
```

接口不变，优先通过 `Panel.ItemInfo.addresses` 扩展 payload。

例如：

```json
{
  "id": 123,
  "title": "Dragon's Brand",
  "url": "https://example.com",
  "addresses": [
    {
      "id": "01",
      "name": "官网",
      "url": "https://example.com",
      "type": "https",
      "isDefault": true,
      "sort": 0,
      "enabled": true,
      "openMethod": 2
    },
    {
      "id": "02",
      "name": "内网",
      "url": "http://192.168.1.20:8080",
      "type": "lan",
      "isDefault": false,
      "sort": 1,
      "enabled": true,
      "openMethod": 2
    }
  ]
}
```

---

# 29. 推荐的最终数据示例

```json
{
  "id": 123,
  "title": "Dragon's Brand",
  "url": "https://example.com",
  "description": "品牌官网",
  "openMethod": 2,
  "addresses": [
    {
      "id": "a1",
      "name": "官网",
      "url": "https://example.com",
      "type": "https",
      "isDefault": true,
      "sort": 0,
      "enabled": true,
      "openMethod": 2
    },
    {
      "id": "a2",
      "name": "HTTP",
      "url": "http://example.com",
      "type": "http",
      "isDefault": false,
      "sort": 1,
      "enabled": true,
      "openMethod": 2
    },
    {
      "id": "a3",
      "name": "内网",
      "url": "http://192.168.1.20:8080",
      "type": "lan",
      "isDefault": false,
      "sort": 2,
      "enabled": true,
      "openMethod": 2
    },
    {
      "id": "a4",
      "name": "NAS",
      "url": "http://nas.local:5000",
      "type": "lan",
      "isDefault": false,
      "sort": 3,
      "enabled": true,
      "openMethod": 2
    }
  ]
}
```

---

# 30. 必须修改的代码区域

智能体 开工后优先检查：

```text
[1] src/typings/panel.d.ts
    → 新增 ItemAddress
    → ItemInfo 新增 addresses

[2] src/views/home/components/EditItem/index.vue
    → 删除固定双地址编辑逻辑
    → 增加动态地址数组编辑器
    → 增删改
    → 拖拽排序
    → 设置默认
    → URL 自动分类

[3] src/views/home/components/AppIcon/index.vue
    → 增加迷你快捷按钮
    → 地址类型颜色
    → @click.stop
    → 超长地址折叠

[4] src/views/home/index.vue
    → 主图标始终打开 default
    → 快捷按钮打开对应 address
    → 右键菜单动态生成地址
    → 删除 openLanUrl/openWanUrl 的固定逻辑

[5] src/api/panel/itemIcon.ts
    → 确认 addresses 能正常随 ItemInfo 保存

[6] 后端 ItemInfo / 数据库
    → 增加 addresses 或 item_addresses
    → 数据迁移
    → 旧数据兼容

[7] src/locales/
    → 增加所有新增 UI 文案
```

---

# 31. 不允许的实现方式

智能体 不得采用：

```text
❌ url2
❌ url3
❌ url4

❌ lanUrl2
❌ lanUrl3

❌ wanUrl
❌ nasUrl
❌ dockerUrl
❌ adminUrl

❌ 只在前端 localStorage 保存地址

❌ 只修改 UI 不修改后端数据

❌ 修改主图标点击逻辑后破坏默认地址语义

❌ 快捷按钮点击冒泡导致默认地址再次打开

❌ 使用固定 2 个按钮

❌ 地址数量人为限制为 5、10、20

❌ 把 LAN/WAN 模式继续作为唯一地址选择器
```

---

# 32. 必须保留的现有能力

改造不能破坏：

```text
✓ 图标
✓ 标题
✓ 描述
✓ 分组
✓ 分组排序
✓ 图标排序
✓ 编辑
✓ 删除
✓ 新窗口
✓ 当前页面
✓ 页面内小窗
✓ 网络模式
✓ 登录权限
✓ 游客访问
✓ 导入导出
✓ 深色模式
✓ 国际化
✓ 移动端
```

特别注意：

`openMethod` 仍然有效。

地址级 `openMethod` 只是覆盖 Item 默认值：

```ts
address.openMethod ?? item.openMethod
```

---

# 33. 导入导出兼容

如果 Sun-Panel 存在配置导入/导出：

旧：

```json
{
  "url": "...",
  "lanUrl": "..."
}
```

导入后自动生成：

```json
{
  "addresses": [...]
}
```

导出新版时：

```json
{
  "addresses": [...]
}
```

为了兼容旧版，可同时保留：

```json
{
  "url": "默认地址",
  "lanUrl": "局域网地址",
  "addresses": [...]
}
```

但新版本内部逻辑只使用：

```text
addresses
```

---

# 34. 测试用例

## 基础

- [ ] 新建项目默认生成 1 个地址。
- [ ] 第一个地址自动成为默认地址。
- [ ] 默认地址可以修改。
- [ ] 可以增加第二个地址。
- [ ] 可以增加第三个、第四个……地址。
- [ ] 地址数量不应存在业务硬限制。
- [ ] 可以删除地址。
- [ ] 删除默认地址后自动指定新的默认地址。
- [ ] 可以拖拽排序。
- [ ] 可以启用/禁用地址。

## URL 类型

- [ ] HTTPS 正确分类。
- [ ] HTTP 正确分类。
- [ ] 192.168.x.x 正确分类 LAN。
- [ ] 10.x.x.x 正确分类 LAN。
- [ ] 172.16.x.x ~ 172.31.x.x 正确分类 LAN。
- [ ] localhost 正确分类 LAN。
- [ ] .local 正确分类 LAN。
- [ ] IPv6 正确处理。
- [ ] https://192.168.x.x 不应被错误识别为 HTTP/LAN。
- [ ] 非法 URL 被拒绝。
- [ ] javascript: 被拒绝。

## 点击

- [ ] 点击图标主体打开默认地址。
- [ ] 点击标题打开默认地址。
- [ ] 点击 HTTPS 快捷按钮只打开 HTTPS。
- [ ] 点击 HTTP 快捷按钮只打开 HTTP。
- [ ] 点击 LAN 快捷按钮只打开 LAN。
- [ ] 快捷按钮不会触发默认地址。
- [ ] 新窗口模式正确。
- [ ] 当前页面模式正确。
- [ ] 页面内小窗正确。

## 右键

- [ ] 地址菜单动态生成。
- [ ] 地址数量变化后菜单自动变化。
- [ ] 不再写死 WAN/LAN。
- [ ] 删除地址后右键菜单立即更新。

## 兼容

- [ ] 旧版本只有 url 的数据正常显示。
- [ ] 旧版本同时存在 url + lanUrl 的数据正常迁移。
- [ ] 迁移执行多次不会重复产生地址。
- [ ] 旧导出数据可以导入。
- [ ] 新数据可以保存。

## UI

- [ ] 桌面端正常。
- [ ] 手机端正常。
- [ ] 4K 正常。
- [ ] 地址过多时不会撑爆卡片。
- [ ] tooltip 显示完整 URL。
- [ ] 深色模式正常。
- [ ] 浅色模式正常。
- [ ] 国际化文案完整。

---

# 35. 构建与验收

修改完成后必须执行：

```bash
pnpm install
pnpm type-check
pnpm lint
pnpm build
```

如果项目后端有对应测试/构建命令，也必须执行。

最终至少验证：

```text
TypeScript 0 errors
ESLint 无新增错误
Build 成功
旧数据可读
新数据可写
默认地址正确
N 个快捷地址正确
```

---

# 36. 智能体 执行顺序

不要直接上来大面积重构。

严格按以下顺序：

```text
Step 1
扫描现有前后端 ItemInfo 数据流

Step 2
确认数据库实体 / DTO / API / 导入导出结构

Step 3
确认所有 url / lanUrl 引用点

Step 4
新增 ItemAddress 类型

Step 5
实现 legacy → addresses 迁移

Step 6
修改保存 API

Step 7
修改 EditItem 动态地址编辑器

Step 8
修改 AppIcon 快捷按钮

Step 9
修改 home/index.vue 点击和右键逻辑

Step 10
修改 i18n

Step 11
运行 type-check / lint / build

Step 12
补测试

Step 13
检查旧数据

Step 14
输出变更报告
```

---

# 37. 最终产品行为

最终用户看到一个网站卡片：

```text
┌───────────────────────────────┐
│  ┌──────┐                     │
│  │ ICON │  Dragon's Brand     │
│  └──────┘                     │
│          品牌官网              │
│                               │
│    ●官网  ●内网  ●NAS  ●管理  │
└───────────────────────────────┘
```

点击：

```text
ICON / 标题
      ↓
默认地址
```

点击：

```text
●内网
      ↓
http://192.168.1.20:8080
```

点击：

```text
●NAS
      ↓
http://nas.local:5000
```

点击：

```text
●管理
      ↓
https://admin.example.com
```

用户可以继续增加：

```text
●IPv6
●Docker
●备用
●测试
●开发
●移动
●VPN
●第二公网
……
```

不需要再次修改程序。

---

# 38. 最终验收标准

本需求只有在以下条件全部满足时才算完成：

> **一个 Item 不再是“默认地址 + 内网地址”，而是“默认地址 + 无限可扩展地址集合”。**

并且：

1. 主图标点击 = 默认地址。
2. 默认地址由用户指定。
3. 地址数量不设业务上限。
4. 每个地址有独立名称。
5. 每个地址有独立 URL。
6. 自动识别 HTTPS / HTTP / LAN / OTHER。
7. 不同类型使用不同颜色。
8. 图标下显示迷你快捷按钮。
9. 快捷按钮独立点击。
10. 快捷按钮不会触发主图标点击。
11. 支持地址增删改。
12. 支持地址排序。
13. 支持设置默认。
14. 支持启用/禁用。
15. 右键菜单动态显示所有地址。
16. 旧 `url + lanUrl` 数据自动迁移。
17. 导入导出兼容。
18. LAN/WAN 不再限制地址模型。
19. 不破坏现有 Sun-Panel 功能。
20. `pnpm type-check`、`pnpm lint`、`pnpm build` 全部通过。

---

# 39. 给 智能体 的最终执行指令

**请直接进入 `A-Yong1981/sun-panel` 项目实施本规格，不要只给方案。**

要求：

```text
1. 先完整扫描代码。
2. 找出所有 ItemInfo、url、lanUrl 的前后端引用。
3. 根据现有架构实施 ItemAddress。
4. 优先复用现有 Vue 3 / TypeScript / Naive UI / Pinia / vue-draggable-plus。
5. 不引入无必要的新依赖。
6. 不破坏现有功能。
7. 不限制地址数量。
8. 不允许通过 url2/url3 等方式扩展。
9. 做好数据库/JSON/DTO/导入导出迁移。
10. 做好旧数据兼容。
11. 主图标永远打开用户指定的默认地址。
12. 快捷按钮独立打开对应地址。
13. 快捷按钮必须阻止 click 冒泡。
14. HTTPS / HTTP / LAN / OTHER 使用不同视觉分类。
15. 地址过多必须自动折叠/滚动/更多菜单，不能撑坏卡片。
16. 完成后执行 type-check、lint、build。
17. 对关键逻辑增加测试。
18. 最终输出：
    - 修改文件清单
    - 数据结构变化
    - API变化
    - 数据迁移方案
    - 测试结果
    - 构建结果
    - 已知问题
```

**禁止仅修改前端视觉而不完成数据层和业务层重构。**
