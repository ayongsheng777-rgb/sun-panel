<script setup lang="ts">
import { computed, ref } from 'vue'
import { NEllipsis } from 'naive-ui'
import { ItemIcon } from '@/components/common'
import { PanelPanelConfigStyleEnum } from '@/enums'
import { classifyAddress, getShortAddressName } from '@/utils/address'

interface Prop {
  itemInfo?: Panel.ItemInfo
  size?: number // 默认70
  forceBackground?: string // 强制背景色
  iconTextColor?: string
  iconTextInfoHideDescription: boolean
  iconTextIconHideTitle: boolean
  style: PanelPanelConfigStyleEnum
}

const props = withDefaults(defineProps<Prop>(), {
  size: 70,
})

const emit = defineEmits<{
  (e: 'addressClick', address: Panel.ItemAddress): void
}>()

const defaultBackground = '#2a2a2a6b'

const expanded = ref(false)
const maxVisible = 6

// 迷你快捷按钮列表（不含默认地址）
const shortcutAddresses = computed<Panel.ItemAddress[]>(() => {
  return (props.itemInfo?.addresses ?? [])
    .filter(item => item.enabled)
    .sort((a, b) => a.sort - b.sort)
})

const visibleShortcuts = computed(() => {
  if (expanded.value || shortcutAddresses.value.length <= maxVisible)
    return shortcutAddresses.value
  return shortcutAddresses.value.slice(0, maxVisible)
})

const hiddenCount = computed(() => Math.max(0, shortcutAddresses.value.length - maxVisible))

const textColor = computed(() => {
  const hex = props.itemInfo?.icon?.backgroundColor || defaultBackground
  const c = hex.replace(/^#/, '')
  const r = parseInt(c.substring(0, 2), 16)
  const g = parseInt(c.substring(2, 4), 16)
  const b = parseInt(c.substring(4, 6), 16)
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255 > 0.5 ? 'black' : 'white'
})

function addressTypeClass(address: Panel.ItemAddress): string {
  const type = address.type || classifyAddress(address.url)
  return `address-type-${type}`
}

function onAddressClick(address: Panel.ItemAddress) {
  emit('addressClick', address)
}
</script>

<template>
  <div class="app-icon w-full">
    <!-- 详情图标 -->
    <div
      v-if="style === PanelPanelConfigStyleEnum.info"
      class="app-icon-info w-full rounded-2xl  transition-all duration-200 hover:shadow-[0_0_20px_10px_rgba(0,0,0,0.2)] flex flex-col"
      :style="{ background: itemInfo?.icon?.backgroundColor || defaultBackground }"
    >
      <div class="flex w-full">
        <!-- 图标 -->
        <div class="app-icon-info-icon w-[70px] h-[70px]">
          <div class="w-[70px] h-full flex items-center justify-center ">
            <ItemIcon :item-icon="itemInfo?.icon" force-background="transparent" :size="50" class="overflow-hidden rounded-xl" />
          </div>
        </div>

        <!-- 文字 -->
        <div class="text-white flex items-center" :style="{ color: (iconTextColor === '#ffffff') ? textColor : iconTextColor, maxWidth: 'calc(100% - 80px)' }">
          <div class="app-icon-info-text-box w-full">
            <div class="app-icon-info-text-box-title font-semibold w-full">
              <NEllipsis>
                {{ itemInfo?.title }}
              </NEllipsis>
            </div>
            <div v-if="!iconTextInfoHideDescription" class="app-icon-info-text-box-description">
              <NEllipsis :line-clamp="2" class="text-xs">
                {{ itemInfo?.description }}
              </NEllipsis>
            </div>
          </div>
        </div>
      </div>

      <!-- 迷你快捷地址 -->
      <div v-if="shortcutAddresses.length" class="app-address-shortcuts mt-[8px] flex flex-wrap gap-[4px]">
        <button
          v-for="address in visibleShortcuts" :key="address.id" type="button"
          class="address-shortcut" :class="addressTypeClass(address)"
          :aria-label="`${address.name}: ${address.url}`" :title="`${address.name} — ${address.url}`"
          @click.stop="onAddressClick(address)"
        >
          <span class="address-shortcut-dot" />
          <span class="address-shortcut-label">{{ getShortAddressName(address) }}</span>
        </button>
        <button
          v-if="hiddenCount > 0 && !expanded" type="button" class="address-shortcut address-type-other"
          :aria-label="`还有 ${hiddenCount} 个地址`" title="更多地址" @click.stop="expanded = true"
        >
          +{{ hiddenCount }}
        </button>
      </div>
    </div>

    <!-- 极简(小)图标（APP） -->
    <div v-if="style === PanelPanelConfigStyleEnum.icon" class="app-icon-small flex flex-col items-center">
      <div
        class="app-icon-small-icon overflow-hidden rounded-2xl sunpanel w-[70px] h-[70px] mx-auto rounded-2xl transition-all duration-200 hover:shadow-[0_0_20px_10px_rgba(0,0,0,0.2)]"
        :title="itemInfo?.description"
      >
        <ItemIcon :item-icon="itemInfo?.icon" />
      </div>
      <div
        v-if="!iconTextIconHideTitle"
        class="app-icon-small-title text-center app-icon-text-shadow cursor-pointer mt-[2px]"
        :style="{ color: iconTextColor }"
      >
        <span>{{ itemInfo?.title }}</span>
      </div>

      <!-- 迷你快捷地址 -->
      <div v-if="shortcutAddresses.length" class="app-address-shortcuts mt-[4px] flex flex-wrap justify-center gap-[4px]">
        <button
          v-for="address in visibleShortcuts" :key="address.id" type="button"
          class="address-shortcut" :class="addressTypeClass(address)"
          :aria-label="`${address.name}: ${address.url}`" :title="`${address.name} — ${address.url}`"
          @click.stop="onAddressClick(address)"
        >
          <span class="address-shortcut-dot" />
          <span class="address-shortcut-label">{{ getShortAddressName(address) }}</span>
        </button>
        <button
          v-if="hiddenCount > 0 && !expanded" type="button" class="address-shortcut address-type-other"
          :aria-label="`还有 ${hiddenCount} 个地址`" title="更多地址" @click.stop="expanded = true"
        >
          +{{ hiddenCount }}
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.app-address-shortcuts {
  width: 100%;
}

.address-shortcut {
  display: inline-flex;
  align-items: center;
  gap: 2px;
  min-width: 22px;
  height: 20px;
  padding: 0 5px;
  border-radius: 9999px;
  border: 1px solid rgba(255, 255, 255, 0.25);
  background: rgba(255, 255, 255, 0.12);
  color: #fff;
  font-size: 9px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.15s ease;
  line-height: 1;
}

.address-shortcut:hover {
  filter: brightness(1.15);
}

.address-shortcut-dot {
  width: 6px;
  height: 6px;
  border-radius: 9999px;
  background: currentColor;
  opacity: 0.9;
}

.address-shortcut-label {
  white-space: nowrap;
}

/* 类型配色 */
.address-type-https {
  background: rgba(34, 197, 94, 0.85);
  border-color: rgba(34, 197, 94, 0.6);
}

.address-type-http {
  background: rgba(249, 115, 22, 0.85);
  border-color: rgba(249, 115, 22, 0.6);
}

.address-type-lan {
  background: rgba(59, 130, 246, 0.85);
  border-color: rgba(59, 130, 246, 0.6);
}

.address-type-other {
  background: rgba(113, 113, 122, 0.85);
  border-color: rgba(113, 113, 122, 0.6);
}
</style>
