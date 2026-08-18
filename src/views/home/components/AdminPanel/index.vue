<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { NButton, NEmpty, NList, NListItem, NModal, NSpin, NSwitch, NTag, useMessage } from 'naive-ui'
import AISearchConfig from '@/views/home/components/AISearchConfig/index.vue'
import SecuritySetting from '@/views/home/components/SecuritySetting/index.vue'
import { AppLoader, SvgIcon } from '@/components/common'
import { adminUserList, updateAiPermission } from '@/api/admin'
import { useAuthStore } from '@/store'
import { t } from '@/locales'

const props = withDefaults(defineProps<{ visible?: boolean }>(), { visible: false })
const emit = defineEmits<{ (e: 'update:visible', visible: boolean): void }>()

const ms = useMessage()
const authStore = useAuthStore()

// 管理员才显示「用户管理」「权限清单」
const isAdmin = computed(() => authStore.userInfo?.role === 1)

// app: 前缀 = 复用 src/components/apps 下的原管理组件
type MenuKey =
  | 'app:UserInfo' | 'app:Style' | 'app:ItemGroupManage' | 'app:UploadFileManager'
  | 'app:ImportExport' | 'app:Users' | 'app:About'
  | 'ai' | 'security' | 'permission'

interface MenuItem {
  key: MenuKey
  label: string
  icon: string
}
interface MenuGroup {
  title: string
  items: MenuItem[]
}

const active = ref<MenuKey>('app:UserInfo')
// 移动端菜单折叠
const menuOpen = ref(false)

const menuGroups = computed<MenuGroup[]>(() => {
  const general: MenuItem[] = [
    { key: 'app:UserInfo', label: '账号资料', icon: 'material-symbols-person-edit-outline-rounded' },
    { key: 'app:Style', label: '外观设置', icon: 'ion-color-palette-outline' },
    { key: 'app:ItemGroupManage', label: '分组管理', icon: 'material-symbols-ad-group-outline-rounded' },
    { key: 'app:UploadFileManager', label: '文件管理', icon: 'tabler:file-upload' },
    { key: 'app:ImportExport', label: '导入导出', icon: 'icon-park-outline-import-and-export' },
  ]
  if (isAdmin.value)
    general.push({ key: 'app:Users', label: '用户管理', icon: 'material-symbols:group-outline' })
  general.push({ key: 'app:About', label: '关于', icon: 'lucide-info' })

  const groups: MenuGroup[] = [
    { title: '常规管理', items: general },
    { title: 'AI', items: [{ key: 'ai', label: 'AI 配置', icon: 'material-symbols:auto-awesome' }] },
  ]

  const secure: MenuItem[] = [
    { key: 'security', label: '安全中心', icon: 'material-symbols:lock-outline' },
  ]
  if (isAdmin.value)
    secure.push({ key: 'permission', label: 'AI 权限清单', icon: 'material-symbols:shield-person' })
  groups.push({ title: '安全与权限', items: secure })

  return groups
})

const activeLabel = computed(() => {
  for (const g of menuGroups.value) {
    const hit = g.items.find(i => i.key === active.value)
    if (hit)
      return hit.label
  }
  return '管理面板'
})

// 当前要动态加载的原管理组件名（非 app: 项返回 null）
const appComponentName = computed(() =>
  active.value.startsWith('app:') ? active.value.slice(4) : null,
)

// ===== AI 权限清单 =====
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
    permUsers.value = code === 0 && data ? data : []
  }
  catch {
    ms.error(t('common.loadFail'))
    permUsers.value = []
  }
  finally {
    permLoading.value = false
  }
}

function onSelect(key: MenuKey) {
  active.value = key
  menuOpen.value = false
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

// 每次打开回到默认页
watch(() => props.visible, (v) => {
  if (v) {
    active.value = 'app:UserInfo'
    menuOpen.value = false
  }
})

function close() {
  emit('update:visible', false)
}
</script>

<template>
  <NModal
    :show="props.visible" preset="card" title="管理面板"
    style="max-width: 960px; width: 94vw;"
    :bordered="false" size="large" role="dialog" aria-modal="true"
    @update:show="(v: boolean) => emit('update:visible', v)"
  >
    <div class="admin-panel-body flex flex-col md:flex-row">
      <!-- 移动端菜单开关 -->
      <div class="mb-2 flex items-center justify-between md:hidden">
        <div class="text-sm font-medium">
          {{ activeLabel }}
        </div>
        <NButton size="tiny" quaternary @click="menuOpen = !menuOpen">
          <template #icon>
            <SvgIcon :icon="menuOpen ? 'material-symbols:close' : 'material-symbols:menu'" />
          </template>
          菜单
        </NButton>
      </div>

      <!-- 左侧菜单 -->
      <div
        class="admin-panel-menu shrink-0 md:block md:w-[168px] md:border-r md:border-zinc-200 md:pr-2 dark:md:border-zinc-700"
        :class="menuOpen ? 'block' : 'hidden'"
      >
        <div v-for="group in menuGroups" :key="group.title" class="mb-3">
          <div class="mb-1 px-3 text-xs text-zinc-400">
            {{ group.title }}
          </div>
          <div
            v-for="item in group.items" :key="item.key"
            class="mb-1 flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors"
            :class="active === item.key
              ? 'bg-sky-500/15 font-medium text-sky-500'
              : 'hover:bg-zinc-100 dark:hover:bg-zinc-800'"
            @click="onSelect(item.key)"
          >
            <SvgIcon :icon="item.icon" />
            <span>{{ item.label }}</span>
          </div>
        </div>
      </div>

      <!-- 右侧内容 -->
      <div class="admin-panel-content min-w-0 flex-1 md:pl-4">
        <!-- 原有管理功能（动态加载 src/components/apps 下组件） -->
        <AppLoader v-if="appComponentName" :key="appComponentName" :component-name="appComponentName" />

        <!-- AI 配置 -->
        <AISearchConfig v-else-if="active === 'ai'" embedded />

        <!-- 安全中心 -->
        <SecuritySetting v-else-if="active === 'security'" embedded />

        <!-- AI 权限清单 -->
        <div v-else-if="active === 'permission'" class="pb-4">
          <p class="mb-3 text-sm text-zinc-400">
            开启「AI 管理员」后，该账号可用 AI 添加网址、调整分组等管理操作。删除类操作对所有账号一律禁止。
          </p>
          <NSpin :show="permLoading">
            <NList v-if="permUsers.length" bordered>
              <NListItem v-for="u in permUsers" :key="u.id">
                <div class="flex w-full items-center justify-between">
                  <div>
                    <div class="text-sm font-medium">
                      {{ u.name || u.username }}
                      <NTag v-if="u.role === 1" size="small" type="warning" class="ml-1">
                        管理员
                      </NTag>
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
                    <template #checked>
                      AI 管理员
                    </template>
                    <template #unchecked>
                      普通
                    </template>
                  </NSwitch>
                </div>
              </NListItem>
            </NList>
            <NEmpty v-else :description="permLoading ? '加载中...' : '暂无账号'" class="py-8" />
          </NSpin>
        </div>
      </div>
    </div>

    <template #footer>
      <div class="flex justify-end">
        <NButton @click="close">
          关闭
        </NButton>
      </div>
    </template>
  </NModal>
</template>

<style scoped>
/* 用 min() 限高，规避移动端 100vh + 软键盘顶起问题 */
.admin-panel-body {
  height: min(72vh, 620px);
}

.admin-panel-menu {
  overflow-y: auto;
}

.admin-panel-content {
  overflow-y: auto;
  height: 100%;
}

@media (max-width: 767px) {
  .admin-panel-menu {
    max-height: 40vh;
  }
}
</style>
