<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { NAlert, NButton, NCard, NInput, NSwitch, useMessage } from 'naive-ui'
import { post } from '@/utils/request'
import {
  getOpenApiInfo,
  refreshOpenApiToken,
  setOpenApiEnabled,
  type OpenApiInfo,
} from '@/api/panel/globalSetting'

const ms = useMessage()

const loading = ref(false)
const testing = ref(false)
const info = ref<OpenApiInfo>({
  enabled: false,
  token: '',
  apiUrl: '',
  updatedAt: '',
})

async function load() {
  loading.value = true
  try {
    const res = await getOpenApiInfo<OpenApiInfo>()
    if (res.code === 0 && res.data)
      info.value = res.data
  }
  finally {
    loading.value = false
  }
}

async function onRefresh() {
  loading.value = true
  try {
    const res = await refreshOpenApiToken<OpenApiInfo>()
    if (res.code === 0 && res.data) {
      info.value = res.data
      ms.success('令牌已重新生成')
    }
  }
  finally {
    loading.value = false
  }
}

async function onToggle(enabled: boolean) {
  const res = await setOpenApiEnabled<OpenApiInfo>(enabled)
  if (res.code === 0 && res.data)
    info.value = res.data
}

// 直接调 /openapi/v1/version，不走登录态，验证 token + 后端响应。
// 这等价于插件「测试连接」实际发的请求，能用来确认插件能否联通。
async function onTest() {
  if (!info.value.token) {
    ms.warning('请先生成 Token')
    return
  }
  testing.value = true
  try {
    const res = await post<{ version: string; versionCode: number }>({
      // 接口地址形如 http://host:port/api/openapi/v1，去掉 /api 前缀后拼接 /version
      url: `${info.value.apiUrl.replace(/\/api$/, '')}/version`,
      data: {},
      headers: { token: info.value.token },
    })
    if (res.code === 0)
      ms.success(`连通正常，自报版本 v${res.data?.version} (${res.data?.versionCode})`)
    else
      ms.error(res.msg || '测试失败')
  }
  catch (err: any) {
    ms.error(err?.msg || '测试失败')
  }
  finally {
    testing.value = false
  }
}

async function copy(text: string) {
  if (!text)
    return
  try {
    await navigator.clipboard.writeText(text)
    ms.success('已复制')
  }
  catch {
    ms.warning('复制失败，请手动选中复制')
  }
}

onMounted(load)
</script>

<template>
  <div class="pt-[10px]">
    <NAlert type="info" :bordered="false" class="mb-[10px]">
      开启后，官方浏览器插件（Sun-Panel BE）就能把当前浏览的网页一键存到面板里。
      把下面的「接口地址」和「Token」填进插件设置即可。
    </NAlert>

    <NCard size="small" style="border-radius:10px">
      <div class="flex items-center mb-[12px]">
        <span class="w-[90px] text-slate-500">启用</span>
        <NSwitch :value="info.enabled" @update:value="onToggle" />
      </div>

      <div class="flex items-center mb-[10px]">
        <span class="w-[90px] text-slate-500">接口地址</span>
        <NInput :value="info.apiUrl" readonly class="mr-[8px]" />
        <NButton size="small" @click="copy(info.apiUrl)">复制</NButton>
      </div>

      <div class="flex items-center">
        <span class="w-[90px] text-slate-500">Token</span>
        <NInput :value="info.token" readonly class="mr-[8px]" placeholder="点击右侧按钮生成" />
        <NButton size="small" type="primary" :loading="loading" @click="onRefresh">
          重新生成
        </NButton>
      </div>

      <div v-if="info.updatedAt" class="text-[12px] text-slate-400 mt-[8px]">
        最近更新：{{ info.updatedAt }}
      </div>

      <div class="mt-[12px] flex justify-end">
        <NButton size="small" :loading="testing" @click="onTest">
          用插件 API 测试连通
        </NButton>
      </div>
    </NCard>
  </div>
</template>
