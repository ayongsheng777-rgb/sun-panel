<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { NAlert, NButton, NCard, NInput, NTag, useMessage } from 'naive-ui'
import {
  getOpenApiInfo,
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

// MCP 地址 = OpenAPI 地址把 /openapi/v1 换成 /mcp
const mcpUrl = computed(() => {
  if (!info.value.apiUrl)
    return ''
  return info.value.apiUrl.replace(/\/openapi\/v1\/?$/, '/mcp')
})

const tools = [
  { name: 'search_bookmarks', desc: '关键词搜索书签（标题/网址/描述）' },
  { name: 'list_categories', desc: '列出全部分类' },
  { name: 'list_bookmarks', desc: '按分类列出书签' },
  { name: 'get_bookmark', desc: '按 ID 取书签详情（含多地址）' },
]

const configExample = computed(() => {
  if (!mcpUrl.value || !info.value.token)
    return ''
  return JSON.stringify({
    mcpServers: {
      'sun-panel': {
        url: mcpUrl.value,
        headers: {
          Authorization: 'Bearer ' + info.value.token,
        },
      },
    },
  }, null, 2)
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

// 调 MCP 的 tools/list 验证连通（MCP 是 JSON-RPC 格式，用原生 fetch）
async function onTest() {
  if (!info.value.token) {
    ms.warning('请先到「开放接口」里生成 Token')
    return
  }
  if (!mcpUrl.value) {
    ms.warning('MCP 地址不可用')
    return
  }
  testing.value = true
  try {
    const resp = await fetch(mcpUrl.value, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + info.value.token,
      },
      body: JSON.stringify({ jsonrpc: '2.0', id: 1, method: 'tools/list', params: {} }),
    })
    const data: any = await resp.json()
    const names = data?.result?.tools?.map((t: any) => t.name).join(', ')
    if (names)
      ms.success('MCP 连通正常，可用工具：' + names)
    else
      ms.error(data?.error?.message || '测试失败')
  }
  catch (err: any) {
    ms.error(err?.message || '测试失败')
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
      开启「开放接口」后，MCP 服务自动可用。AI 助手（Claude Desktop、Cursor 等）通过 MCP 协议就能搜索你的书签、查分类、取网址。
      认证用的是开放接口的 Token，两边共用。
    </NAlert>

    <NCard size="small" style="border-radius:10px">
      <div class="flex items-center mb-[10px]">
        <span class="w-[90px] text-slate-500">MCP 地址</span>
        <NInput :value="mcpUrl" readonly class="mr-[8px]" placeholder="先到「开放接口」里启用并生成 Token" />
        <NButton size="small" @click="copy(mcpUrl)">
          复制
        </NButton>
      </div>

      <div class="flex items-center mb-[12px]">
        <span class="w-[90px] text-slate-500">状态</span>
        <NTag :type="info.enabled ? 'success' : 'warning'" size="small">
          {{ info.enabled ? '可用（跟随开放接口开关）' : '未启用（去「开放接口」里打开）' }}
        </NTag>
      </div>

      <div class="mb-[12px]">
        <div class="text-slate-500 mb-[6px] text-[13px]">
          可用工具
        </div>
        <div class="flex flex-wrap gap-[8px]">
          <NTag v-for="t in tools" :key="t.name" type="info" size="small" :title="t.desc">
            {{ t.name }}
          </NTag>
        </div>
        <div class="text-[12px] text-slate-400 mt-[6px]">
          search_bookmarks 关键词搜书签 · list_categories 列分类 · list_bookmarks 按分类列书签 · get_bookmark 按 ID 取详情
        </div>
      </div>

      <div class="mb-[12px]">
        <div class="flex items-center mb-[6px]">
          <span class="text-slate-500 text-[13px]">Claude Desktop 配置示例</span>
          <NButton size="tiny" class="ml-[8px]" @click="copy(configExample)">
            复制配置
          </NButton>
        </div>
        <NInput
          :value="configExample"
          type="textarea"
          readonly
          :rows="10"
          placeholder="Token 生成后这里会显示完整配置"
          style="font-family: monospace; font-size: 12px;"
        />
      </div>

      <div class="flex justify-end">
        <NButton size="small" :loading="testing" @click="onTest">
          测试 MCP 连通
        </NButton>
      </div>
    </NCard>
  </div>
</template>
