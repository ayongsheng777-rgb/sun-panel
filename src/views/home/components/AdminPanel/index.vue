<script setup lang="ts">
import { computed, ref } from 'vue'
import { NButton, NEmpty, NList, NListItem, NModal, NSpace, NTag, NSwitch, useMessage } from 'naive-ui'
import AISearchConfig from '@/views/home/components/AISearchConfig/index.vue'
import SecuritySetting from '@/views/home/components/SecuritySetting/index.vue'
import { adminUserList, updateAiPermission } from '@/api/admin'
import { useAuthStore } from '@/store'
import { t } from '@/locales'

withDefaults(defineProps<{ visible?: boolean }>(), { visible: false })
const emit = defineEmits<{ (e: 'update:visible', visible: boolean): void }>()

const ms = useMessage()
const authStore = useAuthStore()

// 管理员才显示「权限清单」
const isAdmin = computed(() => authStore.userInfo?.role === 1)

type MenuKey = 'ai' | 'security' | 'permission'
const active = ref<MenuKey>('ai')

const menuItems = computed(() => {
  const items: { key: MenuKey; label: string; icon: string }[] = [
    { key: 'ai', label: 'AI 配置', icon: 'material-symbols:auto-awesome' },
    { key: 'security', label: '安全中心', icon: 'material-symbols:lock-outline' },
  ]
  if (isAdmin.value)
    items.push({ key: 'permission', label: '权限清单', icon: 'material-symbols:shield-person' })
  return items
})

// ===== 权限清单 =====
interface PermUser {
  id: number
  username: string
  name?: string
  role: number
  aiAdmin: boolean
  otpEnabled: boolean
}
const permUsers = ref<PermUser[]>([])
const permLoading = ref(false)

async function loadPerm() {
  if (!isAdmin.value)
    return
  permLoading.value = true
  try {
    const { code, data } = await adminUserList<PermUser[]>()
    if (code === 0 && data)
      permUsers.value = data
    else
      permUsers.value = []
  }
  catch {
    ms.error(t('common.loadFail'))
  }
  finally {
    permLoading.value = false
  }
}

// 切换菜单时按需加载
function onSelect(key: MenuKey) {
  active.value = key
  if (key === 'permission')
    loadPerm()
}

async function toggleAiAdmin(u: PermUser, val: boolean) {
  const prev = u.aiAdmin
  u.aiAdmin = val
  try {
    const { code, msg } = await updateAiPermission<unknown>(u.id, val)
    if (code !== 0) {
      u.aiAdmin = prev
      ms.error(msg || t('common.saveFail'))
    }
    else {
      ms.success(t('common.saveSuccess'))
    }
  }
  catch {
    u.aiAdmin = prev
    ms.error(t('common.saveFail'))
  }
}

function close() {
  emit('update:visible', false)
}
</script>

<template>
  <NModal
    :show="visible" preset="card" title="管理面板" style="max-width: 920px; height: 78vh;"
    :bordered="false" size="large" role="dialog" aria-modal="true"
    @update:show="(v: boolean) => emit('update:visible', v)"
  >
    <div class="flex h-full" style="min-height: 520px;">
      <!-- 左侧菜单 -->
      <div class="w-[160px] shrink-0 border-r border-zinc-200 pr-2 dark:border-zinc-700">
        <div
          v-for="item in menuItems" :key="item.key"
          class="mb-1 flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors"
          :class="active === item.key ? 'bg-sky-500/15 text-sky-500 font-medium' : 'hover:bg-zinc-100 dark:hover:bg-zinc-800'"
          @click="onSelect(item.key)"
        >
          <SvgIcon :icon="item.icon" />
          <span>{{ item.label }}</span>
        </div>
      </div>

      <!-- 右侧内容 -->
      <div class="flex-1 overflow-auto pl-4">
        <AISearchConfig v-if="active === 'ai'" embedded />
        <SecuritySetting v-else-if="active === 'security'" embedded />

        <div v-else-if="active === 'permission'" class="pb-4">
          <p class="mb-3 text-sm text-zinc-400">
            开启「AI 管理员」后，该账号可使用 AI 自动添加 / 修改网址等 AI 管理功能。
          </p>
          <NSpace v-if="permLoading" vertical>
            <NEmpty v-if="!permUsers.length" description="加载中..." />
          </NSpace>
          <NList v-else bordered>
            <NListItem v-for="u in permUsers" :key="u.id">
              <div class="flex w-full items-center justify-between">
                <div>
                  <div class="text-sm font-medium">
                    {{ u.name || u.username }}
                    <NTag v-if="u.role === 1" size="small" type="warning" class="ml-1">管理员</NTag>
                  </div>
                  <div class="text-xs text-zinc-400">
                    @{{ u.username }} · OTP {{ u.otpEnabled ? '已开启' : '未开启' }}
                  </div>
                </div>
                <NSwitch
                  :value="u.aiAdmin"
                  :disabled="u.role === 1"
                  @update:value="(v: boolean) => toggleAiAdmin(u, v)"
                >
                  <template #checked>AI 管理员</template>
                  <template #unchecked>普通</template>
                </NSwitch>
              </div>
            </NListItem>
            <NEmpty v-if="!permUsers.length" description="暂无账号" />
          </NList>
        </div>
      </div>
    </div>

    <template #footer>
      <div class="flex justify-end">
        <NButton @click="close">关闭</NButton>
      </div>
    </template>
  </NModal>
</template>
