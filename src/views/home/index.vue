<script setup lang="ts">
import { VueDraggable } from 'vue-draggable-plus'
import { type DropdownOption, NBackTop, NButton, NButtonGroup, NDropdown, NModal, NSkeleton, NSpin, useDialog, useMessage } from 'naive-ui'
import { nextTick, onMounted, ref } from 'vue'
import { AIAssistant, AdminPanel, AppIcon, AppStarter, EditItem } from './components'
import { Clock, SearchBox, SystemMonitor } from '@/components/deskModule'
import { SvgIcon } from '@/components/common'
import { deletes, getListByGroupId, saveSort } from '@/api/panel/itemIcon'
import { getList as getGroupList } from '@/api/panel/itemIconGroup'
import { type AISearchResult, aiSearch } from '@/api/panel/aiSearch'
import { type AIAddWebsiteResult, addWebsite, githubSearch } from '@/api/panel/aiManage'
import { getDefaultAddress } from '@/utils/address'

import { setTitle, updateLocalUserInfo } from '@/utils/cmn'
import { useAuthStore, usePanelState } from '@/store'
import { PanelPanelConfigStyleEnum, PanelStateNetworkModeEnum } from '@/enums'
import { VisitMode } from '@/enums/auth'
import { router } from '@/router'
import { t } from '@/locales'

interface ItemGroup extends Panel.ItemIconGroup {
  sortStatus?: boolean
  hoverStatus: boolean
  items?: Panel.ItemInfo[]
}

const ms = useMessage()
const dialog = useDialog()
const panelState = usePanelState()
const authStore = useAuthStore()

const scrollContainerRef = ref<HTMLElement | undefined>(undefined)

const editItemInfoShow = ref<boolean>(false)
const editItemInfoData = ref<Panel.ItemInfo | null>(null)
const windowShow = ref<boolean>(false)
const windowSrc = ref<string>('')
const windowTitle = ref<string>('')

const windowIframeRef = ref(null)
const windowIframeIsLoad = ref<boolean>(false)

const dropdownMenuX = ref(0)
const dropdownMenuY = ref(0)
const dropdownShow = ref(false)
const currentRightSelectItem = ref<Panel.ItemInfo | null>(null)
const currentAddItenIconGroupId = ref<number | undefined>()

const settingModalShow = ref(false)
const aiAssistantShow = ref(false)
const adminPanelShow = ref(false)
// AppStarter 打开时的初始页面（UserInfo=设置首页，ItemGroupManage=分组管理直达）
const appStarterDefault = ref('UserInfo')

function openSettings() {
  appStarterDefault.value = 'UserInfo'
  settingModalShow.value = true
}

function openGroupManage() {
  appStarterDefault.value = 'ItemGroupManage'
  settingModalShow.value = true
}

// 退出登录：清空登录态并回登录页
function handleLogout() {
  dialog.warning({
    title: '退出登录',
    content: '确定要退出登录吗？',
    positiveText: t('common.confirm'),
    negativeText: t('common.cancel'),
    onPositiveClick: () => {
      authStore.removeToken()
      router.push('/login')
    },
  })
}

const items = ref<ItemGroup[]>([])
const filterItems = ref<ItemGroup[]>([])

// ===== AI 智能搜索状态 =====
const searchMode = ref<'normal' | 'ai'>('normal')
const searchKeyword = ref('')
const aiSearchLoading = ref(false)
const aiSearchResults = ref<Panel.ItemInfo[]>([])
const aiSearchError = ref<string | null>(null)
const aiSearchMeta = ref<{ provider: string; model: string; latencyMs: number; fallback: boolean }>(
  { provider: '', model: '', latencyMs: 0, fallback: false },
)
const aiSearchCache = new Map<string, Panel.ItemInfo[]>()
// AI 操作指令（添加网址 / GitHub 检索）的结果，展示在搜索框下方弹性面板
const aiActionResult = ref<AIAddWebsiteResult | null>(null)

function openPage(openMethod: number, url: string, title?: string) {
  switch (openMethod) {
    case 1:
      window.location.href = url
      break
    case 2:
      window.open(url)
      break
    case 3:
      windowShow.value = true
      windowSrc.value = url
      windowTitle.value = title || url
      windowIframeIsLoad.value = true
      break

    default:
      break
  }
}

// 主图标点击：永远打开用户指定的默认地址
function handleItemClick(itemGroupIndex: number, item: Panel.ItemInfo) {
  if (items.value[itemGroupIndex] && items.value[itemGroupIndex].sortStatus) {
    handleEditItem(item)
    return
  }

  const address = getDefaultAddress(item)
  if (!address || !address.url)
    return

  openPage(address.openMethod ?? item.openMethod, address.url, item.title)
}

// 迷你快捷地址点击：打开对应地址
function handleAddressClick(address: Panel.ItemAddress, item: Panel.ItemInfo) {
  if (!address.enabled || !address.url)
    return
  openPage(address.openMethod ?? item.openMethod, address.url, `${item.title} - ${address.name}`)
}

// AI 搜索结果主图标点击：打开默认地址
function handleAiItemClick(item: Panel.ItemInfo) {
  const address = getDefaultAddress(item)
  if (!address || !address.url)
    return
  openPage(address.openMethod ?? item.openMethod, address.url, item.title)
}

function handWindowIframeIdLoad(payload: Event) {
  windowIframeIsLoad.value = false
}

function getList() {
  // 获取组数据
  getGroupList<Common.ListResponse<ItemGroup[]>>().then(({ code, data, msg }) => {
    if (code === 0)
      items.value = data.list
    for (let i = 0; i < data.list.length; i++) {
      const element = data.list[i]
      if (element.id)
        updateItemIconGroupByNet(i, element.id)
    }
    filterItems.value = items.value
    // console.log(items)
  })
}

// 从后端获取组下面的图标
function updateItemIconGroupByNet(itemIconGroupIndex: number, itemIconGroupId: number) {
  getListByGroupId<Common.ListResponse<Panel.ItemInfo[]>>(itemIconGroupId).then((res) => {
    if (res.code === 0)
      items.value[itemIconGroupIndex].items = res.data.list
  })
}

function handleRightMenuSelect(key: string | number) {
  dropdownShow.value = false
  const cur = currentRightSelectItem.value
  if (!cur)
    return

  if (typeof key === 'string' && key.startsWith('address:')) {
    const id = key.substring('address:'.length)
    const address = cur.addresses?.find(a => a.id === id)
    if (address && address.enabled && address.url)
      openPage(address.openMethod ?? cur.openMethod, address.url, `${cur.title} - ${address.name}`)
    return
  }

  switch (key) {
    case 'newWindows':
      window.open(getDefaultAddress(cur)?.url || cur.url)
      break
    case 'openDefault':
      handleItemClick(0, cur)
      break
    case 'edit':
      // 这里有个奇怪的问题，如果不使用{...}的方式 父组件的值会同步修改 标记一下
      handleEditItem({ ...cur } as Panel.ItemInfo)
      break
    case 'delete':
      dialog.warning({
        title: t('common.warning'),
        content: t('common.deleteConfirmByName', { name: cur?.title }),
        positiveText: t('common.confirm'),
        negativeText: t('common.cancel'),
        onPositiveClick: () => {
          deletes([currentRightSelectItem.value?.id as number]).then(({ code, msg }) => {
            if (code === 0) {
              ms.success(t('common.deleteSuccess'))
              getList()
            }
            else {
              ms.error(`${t('common.deleteFail')}:${msg}`)
            }
          })
        },
      })

      break
    default:
      break
  }
}

function handleContextMenu(e: MouseEvent, itemGroupIndex: number, item: Panel.ItemInfo) {
  if (items.value[itemGroupIndex] && items.value[itemGroupIndex].sortStatus)
    return

  e.preventDefault()
  currentRightSelectItem.value = item
  dropdownShow.value = false
  nextTick().then(() => {
    dropdownShow.value = true
    dropdownMenuX.value = e.clientX
    dropdownMenuY.value = e.clientY
  })
}

function onClickoutside() {
  // message.info('clickoutside')
  dropdownShow.value = false
}

function handleEditSuccess(_item: Panel.ItemInfo) {
  aiSearchCache.clear()
  getList()
}

function handleChangeNetwork(mode: PanelStateNetworkModeEnum) {
  panelState.setNetworkMode(mode)
  if (mode === PanelStateNetworkModeEnum.lan)
    ms.success(t('panelHome.changeToLanModelSuccess'))

  else
    ms.success(t('panelHome.changeToWanModelSuccess'))
}

// 结束拖拽
// function handleEndDrag(event: any, itemIconGroup: Panel.ItemIconGroup) {
//   // console.log(event)
//   // console.log(items.value)
// }

function handleSaveSort(itemGroup: ItemGroup) {
  const saveItems: Common.SortItemRequest[] = []
  if (itemGroup.items) {
    for (let i = 0; i < itemGroup.items.length; i++) {
      const element = itemGroup.items[i]
      saveItems.push({
        id: element.id as number,
        sort: i + 1,
      })
    }

    saveSort({ itemIconGroupId: itemGroup.id as number, sortItems: saveItems }).then(({ code, msg }) => {
      if (code === 0) {
        ms.success(t('common.saveSuccess'))
        itemGroup.sortStatus = false
      }
      else {
        ms.error(`${t('common.saveFail')}:${msg}`)
      }
    })
  }
}

function getDropdownMenuOptions(): DropdownOption[] {
  const item = currentRightSelectItem.value
  const dropdownMenuOptions: DropdownOption[] = [
    {
      label: t('iconItem.openDefaultAddress'),
      key: 'openDefault',
    },
    {
      label: t('iconItem.newWindowOpen'),
      key: 'newWindows',
    },
  ]

  // 动态生成所有地址菜单
  if (item?.addresses) {
    const addresses = item.addresses
      .filter(address => address.enabled)
      .sort((a, b) => a.sort - b.sort)
    if (addresses.length > 0) {
      dropdownMenuOptions.push({
        type: 'divider',
        key: 'divider-address',
      })
      for (const address of addresses) {
        dropdownMenuOptions.push({
          label: `${address.name} — ${address.url}`,
          key: `address:${address.id}`,
        })
      }
    }
  }

  if (authStore.visitMode === VisitMode.VISIT_MODE_LOGIN) {
    dropdownMenuOptions.push({
      label: t('common.edit'),
      key: 'edit',
    }, {
      label: t('common.delete'),
      key: 'delete',
    })
  }

  return dropdownMenuOptions
}

onMounted(() => {
  // 更新用户信息
  updateLocalUserInfo()
  getList()

  // 更新同步云端配置
  panelState.updatePanelConfigByCloud()

  // 设置标题
  if (panelState.panelConfig.logoText)
    setTitle(panelState.panelConfig.logoText)
})

// 前端普通搜索过滤（也匹配弹性地址）
function itemFrontEndSearch(keyword?: string) {
  searchMode.value = 'normal'
  aiSearchResults.value = []
  aiSearchError.value = null
  const kw = (keyword ?? '').trim().toLowerCase()
  searchKeyword.value = kw

  if (kw !== '' && panelState.panelConfig.searchBoxSearchIcon) {
    const filteredData = ref<ItemGroup[]>([])
    for (let i = 0; i < items.value.length; i++) {
      const element = items.value[i].items?.filter((item: Panel.ItemInfo) => {
        const hitBase = item.title.toLowerCase().includes(kw)
          || item.url.toLowerCase().includes(kw)
          || (item.description?.toLowerCase().includes(kw) ?? false)
        if (hitBase)
          return true
        return (item.addresses ?? []).some(a =>
          a.name.toLowerCase().includes(kw) || a.url.toLowerCase().includes(kw))
      })
      if (element && element.length > 0)
        filteredData.value.push({ items: element, hoverStatus: false })
    }
    filterItems.value = filteredData.value
  }
  else {
    filterItems.value = items.value
  }
}

// AI 智能搜索：回车/点击 AI 时触发，自动降级普通搜索；支持「添加xx」「GitHub xx」操作指令
async function onAiSearch(keyword?: string) {
  const kw = (keyword ?? '').trim()
  searchKeyword.value = kw
  if (!kw) {
    searchMode.value = 'normal'
    return
  }
  searchMode.value = 'ai'
  aiActionResult.value = null

  // 操作类指令：添加网址 / GitHub 检索（走 AI 助手同款接口，结果在下方弹性面板展示）
  const isGithubAction = /github/i.test(kw)
  const isAddAction = /添加|收录|加入/.test(kw)
  if (isGithubAction || isAddAction) {
    aiSearchLoading.value = true
    aiSearchError.value = null
    aiSearchResults.value = []
    try {
      const call = isGithubAction ? githubSearch : addWebsite
      const { code, data, msg } = await call<AIAddWebsiteResult>(kw)
      if (code === 0 && data) {
        aiActionResult.value = data
        ms.success(`已添加到「${data.category}」分组`)
        getList()
      }
      else {
        aiSearchError.value = msg || '操作失败，请稍后重试'
      }
    }
    catch (e: any) {
      aiSearchError.value = e?.message || '操作失败，请稍后重试'
    }
    aiSearchLoading.value = false
    return
  }

  // 命中缓存
  const cacheKey = kw
  const cached = aiSearchCache.get(cacheKey)
  if (cached) {
    aiSearchResults.value = cached
    aiSearchError.value = null
    return
  }

  aiSearchLoading.value = true
  aiSearchError.value = null
  try {
    const { code, data } = await aiSearch<AISearchResult>({ query: kw, mode: 'ai', limit: 12 })
    if (code === 0 && data) {
      aiSearchResults.value = data.results ?? []
      aiSearchMeta.value = {
        provider: data.provider ?? '',
        model: data.model ?? '',
        latencyMs: 0,
        fallback: data.fallback ?? false,
      }
      if (!data.fallback)
        aiSearchCache.set(cacheKey, aiSearchResults.value)
    }
    else {
      aiSearchError.value = t('panelHome.aiSearchUnavailable')
    }
  }
  catch (e) {
    // 失败自动降级普通搜索
    aiSearchError.value = null
    searchMode.value = 'normal'
    itemFrontEndSearch(kw)
  }
  aiSearchLoading.value = false
}

function clearSearch() {
  searchKeyword.value = ''
  searchMode.value = 'normal'
  aiSearchResults.value = []
  aiSearchError.value = null
  aiActionResult.value = null
  filterItems.value = items.value
}

function handleSetHoverStatus(groupIndex: number, hoverStatus: boolean) {
  if (items.value[groupIndex])
    items.value[groupIndex].hoverStatus = hoverStatus
}

function handleSetSortStatus(groupIndex: number, sortStatus: boolean) {
  if (items.value[groupIndex])
    items.value[groupIndex].sortStatus = sortStatus

  // 并未保存排序重新更新数据
  if (!sortStatus) {
    // 单独更新组
    if (items.value[groupIndex] && items.value[groupIndex].id)
      updateItemIconGroupByNet(groupIndex, items.value[groupIndex].id as number)
  }
}

function handleEditItem(item: Panel.ItemInfo) {
  editItemInfoData.value = item
  editItemInfoShow.value = true
  currentAddItenIconGroupId.value = undefined
}

function handleAddItem(itemIconGroupId?: number) {
  editItemInfoData.value = null
  editItemInfoShow.value = true
  if (itemIconGroupId)
    currentAddItenIconGroupId.value = itemIconGroupId
}
</script>

<template>
  <div class="w-full h-full sun-main">
    <div
      class="cover wallpaper" :style="{
        filter: `blur(${panelState.panelConfig.backgroundBlur}px)`,
        background: `url(${panelState.panelConfig.backgroundImageSrc}) no-repeat`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }"
    />
    <div class="mask" :style="{ backgroundColor: `rgba(0,0,0,${panelState.panelConfig.backgroundMaskNumber})` }" />
    <div ref="scrollContainerRef" class="absolute w-full h-full overflow-auto">
      <div
        class="p-2.5 mx-auto"
        :style="{
          marginTop: `${panelState.panelConfig.marginTop}%`,
          marginBottom: `${panelState.panelConfig.marginBottom}%`,
          maxWidth: (panelState.panelConfig.maxWidth ?? '1200') + panelState.panelConfig.maxWidthUnit,
        }"
      >
        <!-- 头 -->
        <div class="mx-[auto] w-[80%]">
          <div class="flex mx-[auto] items-center justify-center text-white">
            <div class="logo">
              <span class="text-2xl md:text-6xl font-bold text-shadow">
                {{ panelState.panelConfig.logoText }}
              </span>
            </div>
            <div class="divider text-base lg:text-2xl mx-[10px]">
              |
            </div>
            <div class="text-shadow">
              <Clock :hide-second="!panelState.panelConfig.clockShowSecond" />
            </div>
          </div>
          <div v-if="panelState.panelConfig.searchBoxShow" class="flex mt-[20px] mx-auto sm:w-full lg:w-[80%]">
            <SearchBox v-model:search-mode="searchMode" @item-search="itemFrontEndSearch" @ai-search="onAiSearch" />
          </div>

          <!-- AI 智能搜索结果 / AI 操作结果（与搜索引擎选择框同款毛玻璃弹层，高度随内容弹性伸缩） -->
          <div v-if="searchMode === 'ai' && searchKeyword" class="mt-[10px] mx-auto sm:w-full lg:w-[80%]">
            <div
              class="ai-search-panel rounded-xl p-[10px]"
              :style="{ background: '#2a2a2a6b', color: '#fff', backdropFilter: 'blur(5px)', border: '1px solid #ccc' }"
            >
              <div class="flex items-center justify-between mb-2">
                <div class="text-sm flex items-center gap-2">
                  <SvgIcon icon="material-symbols:auto-awesome" class="text-sky-300" />
                  <span>{{ t('panelHome.aiSearchTitle') }}</span>
                  <span v-if="aiSearchMeta.provider" class="text-xs opacity-70">· {{ aiSearchMeta.provider }} / {{ aiSearchMeta.model }}</span>
                  <NTag v-if="aiSearchMeta.fallback" size="small" type="warning" round>
                    {{ t('panelHome.aiSearchFallback') }}
                  </NTag>
                </div>
                <NButton size="tiny" quaternary @click="clearSearch">
                  {{ t('common.cancel') }}
                </NButton>
              </div>

              <div v-if="aiSearchLoading" class="flex items-center gap-2 text-sm opacity-80">
                <NSpin size="small" />
                <span>AI 正在思考，免费算力高峰期可能需要 1~2 分钟，请稍候…</span>
              </div>
              <div v-else-if="aiSearchError" class="text-sm text-orange-300">
                {{ aiSearchError }}
              </div>
              <!-- AI 操作指令（添加网址 / GitHub 检索）结果卡片 -->
              <div v-else-if="aiActionResult" class="rounded-xl border border-slate-400/40 p-3 flex flex-col gap-2">
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 rounded-lg bg-sky-100 flex items-center justify-center text-sky-600 font-bold">
                    {{ aiActionResult.item.title?.slice(0, 1) }}
                  </div>
                  <div class="flex-1 min-w-0">
                    <div class="font-medium truncate">
                      {{ aiActionResult.item.title }}
                    </div>
                    <div class="text-xs opacity-70 truncate">
                      {{ aiActionResult.item.url }}
                    </div>
                  </div>
                  <NTag size="small" type="info" round>
                    {{ aiActionResult.category }}
                  </NTag>
                </div>
                <div class="text-xs opacity-70">
                  已添加到「{{ aiActionResult.category }}」分组，首页已同步更新。
                </div>
              </div>
              <div v-else-if="aiSearchResults.length === 0" class="text-sm opacity-70">
                {{ t('panelHome.aiSearchEmpty') }}
              </div>
              <div v-else class="icon-info-box">
                <div v-for="item in aiSearchResults" :key="item.id" @contextmenu="(e) => handleContextMenu(e, -1, item)">
                  <AppIcon
                    class="cursor-pointer"
                    :item-info="item"
                    :icon-text-color="panelState.panelConfig.iconTextColor"
                    :icon-text-info-hide-description="panelState.panelConfig.iconTextInfoHideDescription || false"
                    :icon-text-icon-hide-title="panelState.panelConfig.iconTextIconHideTitle || false"
                    :style="0"
                    @click="handleAiItemClick(item)"
                    @address-click="(addr) => handleAddressClick(addr, item)"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 应用盒子 -->
        <div :style="{ marginLeft: `${panelState.panelConfig.marginX}px`, marginRight: `${panelState.panelConfig.marginX}px` }">
          <!-- 系统监控状态 -->
          <div
            v-if="panelState.panelConfig.systemMonitorShow
              && ((panelState.panelConfig.systemMonitorPublicVisitModeShow && authStore.visitMode === VisitMode.VISIT_MODE_PUBLIC)
                || authStore.visitMode === VisitMode.VISIT_MODE_LOGIN)"
            class="flex mx-auto"
          >
            <SystemMonitor
              :allow-edit="authStore.visitMode === VisitMode.VISIT_MODE_LOGIN"
              :show-title="panelState.panelConfig.systemMonitorShowTitle"
            />
          </div>

          <!-- 组纵向排列 -->
          <div
            v-for="(itemGroup, itemGroupIndex) in filterItems" :key="itemGroupIndex"
            class="item-list mt-[50px]"
            :class="itemGroup.sortStatus ? 'shadow-2xl border shadow-[0_0_30px_10px_rgba(0,0,0,0.3)]  p-[10px] rounded-2xl' : ''"
            @mouseenter="handleSetHoverStatus(itemGroupIndex, true)"
            @mouseleave="handleSetHoverStatus(itemGroupIndex, false)"
          >
            <!-- 分组标题 -->
            <div class="text-white text-xl font-extrabold mb-[20px] ml-[10px] flex items-center">
              <span class="group-title text-shadow">
                {{ itemGroup.title }}
              </span>
              <div
                v-if="authStore.visitMode === VisitMode.VISIT_MODE_LOGIN"
                class="group-buttons ml-2 delay-100 transition-opacity flex"
                :class="itemGroup.hoverStatus ? 'opacity-100' : 'opacity-0'"
              >
                <span class="mr-2 cursor-pointer" :title="t('common.add')" @click="handleAddItem(itemGroup.id)">
                  <SvgIcon class="text-white font-xl" icon="typcn:plus" />
                </span>
                <span class="mr-2 cursor-pointer " :title="t('common.sort')" @click="handleSetSortStatus(itemGroupIndex, !itemGroup.sortStatus)">
                  <SvgIcon class="text-white font-xl" icon="ri:drag-drop-line" />
                </span>
              </div>
            </div>

            <!-- 详情图标 -->
            <div v-if="panelState.panelConfig.iconStyle === PanelPanelConfigStyleEnum.info">
              <div v-if="itemGroup.items">
                <VueDraggable
                  v-model="itemGroup.items" item-key="sort" :animation="300"
                  class="icon-info-box"
                  filter=".not-drag"
                  :disabled="!itemGroup.sortStatus"
                >
                  <div v-for="item, index in itemGroup.items" :key="index" :title="item.description" @contextmenu="(e) => handleContextMenu(e, itemGroupIndex, item)">
                    <AppIcon
                      :class="itemGroup.sortStatus ? 'cursor-move' : 'cursor-pointer'"
                      :item-info="item"
                      :icon-text-color="panelState.panelConfig.iconTextColor"
                      :icon-text-info-hide-description="panelState.panelConfig.iconTextInfoHideDescription || false"
                      :icon-text-icon-hide-title="panelState.panelConfig.iconTextIconHideTitle || false"
                      :style="0"
                      @click="handleItemClick(itemGroupIndex, item)"
                      @address-click="(addr) => handleAddressClick(addr, item)"
                    />
                  </div>

                  <div v-if="itemGroup.items.length === 0" class="not-drag">
                    <AppIcon
                      :class="itemGroup.sortStatus ? 'cursor-move' : 'cursor-pointer'"
                      :item-info="{ icon: { itemType: 3, text: 'subway:add' }, title: t('common.add'), url: '', openMethod: 0 }"
                      :icon-text-color="panelState.panelConfig.iconTextColor"
                      :icon-text-info-hide-description="panelState.panelConfig.iconTextInfoHideDescription || false"
                      :icon-text-icon-hide-title="panelState.panelConfig.iconTextIconHideTitle || false"
                      :style="0"
                      @click="handleAddItem(itemGroup.id)"
                    />
                  </div>
                </VueDraggable>
              </div>
            </div>

            <!-- APP图标宫型盒子 -->
            <div v-if="panelState.panelConfig.iconStyle === PanelPanelConfigStyleEnum.icon">
              <div v-if="itemGroup.items">
                <VueDraggable
                  v-model="itemGroup.items" item-key="sort" :animation="300"
                  class="icon-small-box"

                  filter=".not-drag"
                  :disabled="!itemGroup.sortStatus"
                >
                  <div v-for="item, index in itemGroup.items" :key="index" :title="item.description" @contextmenu="(e) => handleContextMenu(e, itemGroupIndex, item)">
                    <AppIcon
                      :class="itemGroup.sortStatus ? 'cursor-move' : 'cursor-pointer'"
                      :item-info="item"
                      :icon-text-color="panelState.panelConfig.iconTextColor"
                      :icon-text-info-hide-description="!panelState.panelConfig.iconTextInfoHideDescription"
                      :icon-text-icon-hide-title="panelState.panelConfig.iconTextIconHideTitle || false"
                      :style="1"
                      @click="handleItemClick(itemGroupIndex, item)"
                      @address-click="(addr) => handleAddressClick(addr, item)"
                    />
                  </div>

                  <div v-if="itemGroup.items.length === 0" class="not-drag">
                    <AppIcon
                      class="cursor-pointer"
                      :item-info="{ icon: { itemType: 3, text: 'subway:add' }, title: $t('common.add'), url: '', openMethod: 0 }"
                      :icon-text-color="panelState.panelConfig.iconTextColor"
                      :icon-text-info-hide-description="!panelState.panelConfig.iconTextInfoHideDescription"
                      :icon-text-icon-hide-title="panelState.panelConfig.iconTextIconHideTitle || false"
                      :style="1"
                      @click="handleAddItem(itemGroup.id)"
                    />
                  </div>
                </vuedraggable>
              </div>
            </div>

            <!-- 编辑栏 -->
            <div v-if="itemGroup.sortStatus" class="flex mt-[10px]">
              <div>
                <NButton color="#2a2a2a6b" @click="handleSaveSort(itemGroup)">
                  <template #icon>
                    <SvgIcon class="text-white font-xl" icon="material-symbols:save" />
                  </template>
                  <div>
                    {{ $t('common.saveSort') }}
                  </div>
                </NButton>
              </div>
            </div>
          </div>
        </div>
        <div class="mt-5 footer" v-html="panelState.panelConfig.footerHtml" />
      </div>
    </div>

    <!-- 右键菜单 -->
    <NDropdown
      placement="bottom-start" trigger="manual" :x="dropdownMenuX" :y="dropdownMenuY"
      :options="getDropdownMenuOptions()" :show="dropdownShow" :on-clickoutside="onClickoutside" @select="handleRightMenuSelect"
    />

    <!-- 悬浮按钮 -->
    <div class="fixed-element shadow-[0_0_10px_2px_rgba(0,0,0,0.2)]">
      <NButtonGroup vertical>
        <!-- 网络模式切换按钮组 -->
        <NButton
          v-if="panelState.networkMode === PanelStateNetworkModeEnum.lan && panelState.panelConfig.netModeChangeButtonShow" color="#2a2a2a6b"
          :title="t('panelHome.changeToWanModel')" @click="handleChangeNetwork(PanelStateNetworkModeEnum.wan)"
        >
          <template #icon>
            <SvgIcon class="text-white font-xl" icon="material-symbols:lan-outline-rounded" />
          </template>
        </NButton>

        <NButton
          v-if="panelState.networkMode === PanelStateNetworkModeEnum.wan && panelState.panelConfig.netModeChangeButtonShow" color="#2a2a2a6b"
          :title="t('panelHome.changeToLanModel')" @click="handleChangeNetwork(PanelStateNetworkModeEnum.lan)"
        >
          <template #icon>
            <SvgIcon class="text-white font-xl" icon="mdi:wan" />
          </template>
        </NButton>

        <NButton v-if="authStore.visitMode === VisitMode.VISIT_MODE_LOGIN" color="#2a2a2a6b" title="设置" @click="openSettings">
          <template #icon>
            <SvgIcon class="text-white font-xl" icon="majesticons-applications" />
          </template>
        </NButton>

        <NButton v-if="authStore.visitMode === VisitMode.VISIT_MODE_LOGIN" color="#2a2a2a6b" title="分组管理" @click="openGroupManage">
          <template #icon>
            <SvgIcon class="text-white font-xl" icon="material-symbols:ad-group-outline-rounded" />
          </template>
        </NButton>

        <NButton v-if="authStore.visitMode === VisitMode.VISIT_MODE_LOGIN" color="#2a2a2a6b" title="管理面板" @click="adminPanelShow = !adminPanelShow">
          <template #icon>
            <SvgIcon class="text-white font-xl" icon="material-symbols:admin-panel-settings" />
          </template>
        </NButton>

        <NButton v-if="authStore.visitMode === VisitMode.VISIT_MODE_LOGIN" color="#2a2a2a6b" title="AI 助手" @click="aiAssistantShow = !aiAssistantShow">
          <template #icon>
            <SvgIcon class="text-white font-xl" icon="material-symbols:smart-toy-outline" />
          </template>
        </NButton>

        <NButton v-if="authStore.visitMode === VisitMode.VISIT_MODE_LOGIN" color="#2a2a2a6b" title="退出登录" @click="handleLogout">
          <template #icon>
            <SvgIcon class="text-white font-xl" icon="material-symbols:logout" />
          </template>
        </NButton>

        <NButton v-if="authStore.visitMode === VisitMode.VISIT_MODE_PUBLIC" color="#2a2a2a6b" :title="$t('panelHome.goToLogin')" @click="router.push('/login')">
          <template #icon>
            <SvgIcon class="text-white font-xl" icon="material-symbols:account-circle" />
          </template>
        </NButton>
      </NButtonGroup>

      <AppStarter v-model:visible="settingModalShow" :default-app="appStarterDefault" />
      <!-- <Setting v-model:visible="settingModalShow" /> -->
    </div>

    <NBackTop
      :listen-to="() => scrollContainerRef"
      :right="10"
      :bottom="10"
      style="background-color:transparent;border: none;box-shadow: none;"
    >
      <div class="shadow-[0_0_10px_2px_rgba(0,0,0,0.2)]">
        <NButton color="#2a2a2a6b">
          <template #icon>
            <SvgIcon class="text-white font-xl" icon="icon-park-outline:to-top" />
          </template>
        </NButton>
      </div>
    </NBackTop>

    <EditItem v-model:visible="editItemInfoShow" :item-info="editItemInfoData" :item-group-id="currentAddItenIconGroupId" @done="handleEditSuccess" />

    <AIAssistant v-model:visible="aiAssistantShow" @done="getList" />

    <AdminPanel v-model:visible="adminPanelShow" />

    <!-- 弹窗 -->
    <NModal
      v-model:show="windowShow" :mask-closable="false" preset="card"
      style="max-width: 1000px;height: 600px;border-radius: 1rem;" :bordered="true" size="small" role="dialog"
      aria-modal="true"
    >
      <template #header>
        <div class="flex items-center">
          <span class="mr-[20px]">
            {{ windowTitle }}
          </span>

          <NSpin v-if="windowIframeIsLoad" size="small" />
        </div>
      </template>
      <div class="w-full h-full rounded-2xl overflow-hidden border dark:border-zinc-700">
        <div v-if="windowIframeIsLoad" class="flex flex-col p-5">
          <NSkeleton height="50px" width="100%" class="rounded-lg" />
          <NSkeleton height="180px" width="100%" class="mt-[20px] rounded-lg" />
          <NSkeleton height="180px" width="100%" class="mt-[20px] rounded-lg" />
        </div>
        <iframe
          v-show="!windowIframeIsLoad" id="windowIframeId" ref="windowIframeRef" :src="windowSrc"
          class="w-full h-full" frameborder="0" @load="handWindowIframeIdLoad"
        />
      </div>
    </NModal>
  </div>
</template>

<style>
body,
html {
  overflow: hidden;
  background-color: rgb(54, 54, 54);
}
</style>

<style scoped>
.mask {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.sun-main {
  user-select: none;
}

.cover {
  position: absolute;
  width: 100%;
  height: 100%;
  overflow: hidden;
  /* background: url(@/assets/start_sky.jpg) no-repeat; */

  transform: scale(1.05);
}

.text-shadow {
  text-shadow: 2px 2px 50px rgb(0, 0, 0);
}

.app-icon-text-shadow {
  text-shadow: 2px 2px 5px rgb(0, 0, 0);
}

.fixed-element {
  position: fixed;
  /* 将元素固定在屏幕上 */
  right: 10px;
  /* 距离屏幕顶部的距离 */
  bottom: 50px;
  /* 距离屏幕左侧的距离 */
}

.icon-info-box {
  width: 100%;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 18px;

}

.icon-small-box {
  width: 100%;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(75px, 1fr));
  gap: 18px;

}

@media (max-width: 500px) {
  .icon-info-box{
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  }
}
</style>
