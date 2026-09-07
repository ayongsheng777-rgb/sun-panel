<script setup lang="ts">
import { onMounted, ref } from 'vue'
import {
  NButton,
  NCard,
  NInput,
  NUpload,
  useMessage,
} from 'naive-ui'
import type { UploadFileInfo } from 'naive-ui'
import { useAuthStore } from '@/store'
import {
  getSiteSetting,
  saveSiteSetting,
  type SiteSetting,
} from '@/api/panel/globalSetting'

const ms = useMessage()
const authStore = useAuthStore()

const loading = ref(false)
const saving = ref(false)
const setting = ref<SiteSetting>({
  faviconUrl: '',
  title: '',
  loginBackgroundUrl: '',
  isEnableLoginCaptcha: false,
  isDisableItemCardCache: false,
})

async function load() {
  loading.value = true
  try {
    const res = await getSiteSetting<SiteSetting>()
    if (res.code === 0 && res.data)
      setting.value = { ...setting.value, ...res.data }
  }
  finally {
    loading.value = false
  }
}

async function save() {
  saving.value = true
  try {
    const res = await saveSiteSetting(setting.value)
    if (res.code === 0) {
      ms.success('已保存，刷新页面后生效')
      // 站点标题改了要同步到浏览器标签页
      if (setting.value.title)
        document.title = setting.value.title
    }
  }
  finally {
    saving.value = false
  }
}

function parseUploadedUrl(event?: ProgressEvent) {
  try {
    const res = JSON.parse((event?.target as XMLHttpRequest).response)
    return res?.data?.imageUrl || ''
  }
  catch {
    return ''
  }
}

function onFaviconFinish({ event }: { file: UploadFileInfo; event?: ProgressEvent }) {
  const url = parseUploadedUrl(event)
  if (url)
    setting.value.faviconUrl = url
}

function onBackgroundFinish({ event }: { file: UploadFileInfo; event?: ProgressEvent }) {
  const url = parseUploadedUrl(event)
  if (url)
    setting.value.loginBackgroundUrl = url
}

onMounted(load)
</script>

<template>
  <div class="pt-[10px]">
    <NCard size="small" style="border-radius:10px">
      <div class="flex items-center mb-[10px]">
        <span class="w-[110px] text-slate-500">站点标题</span>
        <NInput v-model:value="setting.title" placeholder="留空则使用默认标题" :maxlength="50" />
      </div>

      <div class="flex items-center mb-[10px]">
        <span class="w-[110px] text-slate-500">站点图标</span>
        <NInput v-model:value="setting.faviconUrl" placeholder="上传后自动填充" class="mr-[10px]" />
        <NUpload
          action="/api/panel/globalSetting/uploadFaviconImage"
          name="imgfile"
          :show-file-list="false"
          :headers="{ token: authStore.token as string }"
          @finish="onFaviconFinish"
        >
          <NButton size="small">上传</NButton>
        </NUpload>
      </div>

      <div class="flex items-center mb-[10px]">
        <span class="w-[110px] text-slate-500">登录页背景</span>
        <NInput v-model:value="setting.loginBackgroundUrl" placeholder="上传后自动填充" class="mr-[10px]" />
        <NUpload
          action="/api/panel/globalSetting/uploadLoginBackgroundImage"
          name="imgfile"
          :show-file-list="false"
          :headers="{ token: authStore.token as string }"
          @finish="onBackgroundFinish"
        >
          <NButton size="small">上传</NButton>
        </NUpload>
      </div>
    </NCard>

    <NCard size="small" class="mt-[10px]" style="border-radius:10px">
      <div class="flex items-center">
        <span class="text-slate-400 text-[12px]">
          站点标题会显示在浏览器标签页；图标和背景上传后自动填充上面的地址。
        </span>
      </div>
    </NCard>

    <div class="mt-[12px] flex justify-end">
      <NButton type="primary" :loading="saving || loading" @click="save">
        保存品牌设置
      </NButton>
    </div>
  </div>
</template>
