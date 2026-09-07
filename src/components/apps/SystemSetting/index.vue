<script setup lang="ts">
import { ref } from 'vue'
import { NCard } from 'naive-ui'
import { SvgIcon } from '@/components/common'
import BrandSetting from './BrandSetting.vue'
import CustomCode from './CustomCode.vue'
import SearchEngine from './SearchEngine.vue'
import PublicGallery from './PublicGallery.vue'
import BackupMigration from './BackupMigration.vue'
import DockerManage from './DockerManage.vue'
import OpenApi from './OpenApi.vue'

// 原本散落在管理面板里的多个设置入口，统一收进这一个页面。
// 采用卡片式分区布局（仿 VIP 后台），每块功能带 PRO 角标，全部无限制开放。
type SectionKey = 'brand' | 'code' | 'engine' | 'gallery' | 'backup' | 'docker' | 'openapi'

interface Section {
  key: SectionKey
  label: string
  desc: string
  icon: string
}

const sections: Section[] = [
  { key: 'brand', label: '站点品牌', desc: '站点标题、图标、登录页背景', icon: 'material-symbols:storefront-outline-rounded' },
  { key: 'code', label: '自定义代码', desc: '在线编辑自定义 CSS / JS', icon: 'material-symbols:code-rounded' },
  { key: 'engine', label: '搜索引擎', desc: '自定义搜索引擎，无数量限制', icon: 'material-symbols:search-rounded' },
  { key: 'gallery', label: '公共图库', desc: '全账号共享的公共图片库', icon: 'material-symbols:collections-outline-rounded' },
  { key: 'backup', label: '备份迁移', desc: '数据打包备份与一键恢复', icon: 'material-symbols:backup-outline-rounded' },
  { key: 'docker', label: 'Docker 管理', desc: '容器列表、状态与启停', icon: 'material-symbols:deployed-code-outline-rounded' },
  { key: 'openapi', label: '开放接口', desc: '浏览器插件接入，保留 token 校验', icon: 'material-symbols:api-rounded' },
]

const active = ref<SectionKey>('brand')

function open(key: SectionKey) {
  active.value = key
}
</script>

<template>
  <div class="h-full p-3">
    <!-- 卡片墙 -->
    <div class="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
      <div
        v-for="s in sections"
        :key="s.key"
        class="group relative cursor-pointer rounded-xl border border-zinc-200 bg-white p-4 transition-all hover:-translate-y-0.5 hover:border-amber-300 hover:shadow-md dark:border-zinc-700 dark:bg-zinc-800"
        @click="open(s.key)"
      >
        <!-- PRO 角标 -->
        <span
          class="absolute right-2 top-2 inline-flex items-center gap-0.5 rounded-full bg-gradient-to-r from-amber-400 to-yellow-500 px-1.5 py-0.5 text-[10px] font-semibold text-white shadow-sm"
        >
          PRO
        </span>

        <div class="mb-2 flex h-9 w-9 items-center justify-center rounded-lg bg-amber-50 text-amber-500 dark:bg-amber-500/10">
          <SvgIcon :icon="s.icon" :size="20" />
        </div>
        <div class="text-sm font-semibold text-zinc-800 dark:text-zinc-100">
          {{ s.label }}
        </div>
        <div class="mt-1 text-xs leading-relaxed text-zinc-400">
          {{ s.desc }}
        </div>
      </div>
    </div>

    <!-- 详情面板 -->
    <div v-if="active" class="mt-3">
      <NCard size="small" style="border-radius: 12px">
        <BrandSetting v-if="active === 'brand'" />
        <CustomCode v-else-if="active === 'code'" />
        <SearchEngine v-else-if="active === 'engine'" />
        <PublicGallery v-else-if="active === 'gallery'" />
        <BackupMigration v-else-if="active === 'backup'" />
        <DockerManage v-else-if="active === 'docker'" />
        <OpenApi v-else-if="active === 'openapi'" />
      </NCard>
    </div>
  </div>
</template>
