<script setup lang="ts">
import { nextTick, ref } from 'vue'
import { NButton, NInput, NModal, NSpin, NTag, useMessage } from 'naive-ui'
import { SvgIcon } from '@/components/common'
import { aiChat } from '@/api/ai'
import type { AIAgentResult, AIMessage } from '@/types/ai'
import { getDefaultAddress } from '@/utils/address'

defineProps<{ visible: boolean }>()
const emit = defineEmits<{ (e: 'update:visible', visible: boolean): void; (e: 'done'): void }>()

const ms = useMessage()
const prompt = ref('')
const loading = ref(false)
const messages = ref<AIMessage[]>([])
const listRef = ref<HTMLElement | null>(null)

// 快捷示例：覆盖「面板检索 / 联网实时 / 管理操作 / 整理」四类能力
const examples = [
  '帮我找一下 NAS 相关的网址',
  '今天广州天气怎么样',
  '添加 ChatGPT 官网',
  '把常用工具分组整理一下',
]

function newId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
}

function scrollToBottom() {
  nextTick(() => {
    if (listRef.value)
      listRef.value.scrollTop = listRef.value.scrollHeight
  })
}

// 从结构化数据里取联网来源（后端 web 搜索工具返回 data.results）
function pickSources(data?: Record<string, any>) {
  const raw = data?.results
  if (!Array.isArray(raw))
    return []
  return raw
    .filter((r: any) => r && typeof r.url === 'string' && /^https?:\/\//i.test(r.url))
    .slice(0, 6)
    .map((r: any) => ({
      title: String(r.title || r.url),
      url: String(r.url),
      host: String(r.host || ''),
    }))
}

async function send(text?: string) {
  const p = (text ?? prompt.value).trim()
  if (!p || loading.value)
    return

  messages.value.push({ id: newId(), role: 'user', content: p, ts: Date.now() })
  prompt.value = ''
  loading.value = true
  scrollToBottom()

  try {
    const { code, data, msg } = await aiChat<AIAgentResult>(p)
    if (code === 0 && data) {
      messages.value.push({
        id: newId(),
        role: 'assistant',
        content: data.reply || (data.kind === 'items' ? '已找到以下网址：' : '已完成'),
        items: data.kind === 'items' ? (data.items ?? []) : [],
        intent: data.intent,
        tool: data.tool,
        data: data.data,
        changed: data.changed,
        ts: Date.now(),
      })
      if (data.changed) {
        ms.success('面板已更新')
        emit('done')
      }
    }
    else {
      messages.value.push({
        id: newId(),
        role: 'assistant',
        content: msg || 'AI 暂时不可用，请稍后重试',
        error: true,
        ts: Date.now(),
      })
    }
  }
  catch (e: any) {
    messages.value.push({
      id: newId(),
      role: 'assistant',
      content: e?.message || 'AI 请求失败，请检查网络或模型配置',
      error: true,
      ts: Date.now(),
    })
  }
  loading.value = false
  scrollToBottom()
}

// 命中的面板网址：点击直达用户设定的默认地址
function openItem(item: Panel.ItemInfo) {
  const address = getDefaultAddress(item)
  const url = address?.url || item.url
  if (!url)
    return
  const openMethod = address?.openMethod ?? item.openMethod
  window.open(url, openMethod === 1 ? '_self' : '_blank')
}

function openSource(url: string) {
  window.open(url, '_blank')
}

function clearAll() {
  messages.value = []
  prompt.value = ''
}

function close() {
  emit('update:visible', false)
}
</script>

<template>
  <NModal
    :show="visible" preset="card" title="AI 助手" style="width: 620px; max-width: 94vw;"
    :on-close="close"
  >
    <template #header-extra>
      <NButton size="tiny" quaternary :disabled="!messages.length" @click="clearAll">
        <template #icon>
          <SvgIcon icon="material-symbols:delete-sweep-outline" />
        </template>
        清空
      </NButton>
    </template>

    <div class="flex flex-col gap-3">
      <div class="text-xs text-slate-400">
        直接说人话就行：找网址、查天气时间新闻、加网址、改分组、整理面板。删除操作不会执行。
      </div>

      <!-- 对话区 -->
      <div ref="listRef" class="ai-msg-list flex flex-col gap-3">
        <div v-if="!messages.length" class="py-6 text-center text-sm text-slate-400">
          还没有对话，试试下面的示例。
        </div>

        <div v-for="m in messages" :key="m.id" class="flex flex-col gap-1">
          <!-- 用户消息 -->
          <div v-if="m.role === 'user'" class="flex justify-end">
            <div class="max-w-[80%] rounded-2xl rounded-br-sm bg-sky-500 px-3 py-2 text-sm text-white">
              {{ m.content }}
            </div>
          </div>

          <!-- 助手消息 -->
          <div v-else class="flex flex-col gap-2">
            <div class="flex items-start gap-2">
              <div class="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-sky-100 text-sky-600">
                <SvgIcon icon="material-symbols:auto-awesome" />
              </div>
              <div class="min-w-0 flex-1">
                <div
                  class="whitespace-pre-wrap rounded-2xl rounded-bl-sm px-3 py-2 text-sm"
                  :class="m.error
                    ? 'bg-orange-50 text-orange-600 dark:bg-orange-500/10'
                    : 'bg-slate-100 text-slate-700 dark:bg-zinc-800 dark:text-zinc-200'"
                >
                  {{ m.content }}
                </div>

                <!-- 工具标签 -->
                <div v-if="m.tool" class="mt-1 flex flex-wrap items-center gap-1">
                  <NTag size="tiny" round :bordered="false" type="info">
                    {{ m.tool }}
                  </NTag>
                  <NTag v-if="m.changed" size="tiny" round :bordered="false" type="success">
                    已改动面板
                  </NTag>
                </div>

                <!-- 面板命中网址 -->
                <div v-if="m.items && m.items.length" class="mt-2 flex flex-col gap-1">
                  <div
                    v-for="item in m.items" :key="item.id"
                    class="flex cursor-pointer items-center gap-2 rounded-lg border border-slate-200 px-2 py-1.5 transition-colors hover:bg-sky-50 dark:border-zinc-700 dark:hover:bg-zinc-800"
                    @click="openItem(item)"
                  >
                    <div class="flex h-6 w-6 shrink-0 items-center justify-center rounded bg-sky-100 text-xs font-bold text-sky-600">
                      {{ item.title?.slice(0, 1) }}
                    </div>
                    <div class="min-w-0 flex-1">
                      <div class="truncate text-sm">
                        {{ item.title }}
                      </div>
                      <div class="truncate text-xs text-slate-400">
                        {{ getDefaultAddress(item)?.url || item.url }}
                      </div>
                    </div>
                    <SvgIcon icon="material-symbols:open-in-new" class="shrink-0 text-slate-400" />
                  </div>
                </div>

                <!-- 联网参考来源 -->
                <div v-if="pickSources(m.data).length" class="mt-2 flex flex-col gap-1">
                  <div class="text-xs text-slate-400">
                    参考来源
                  </div>
                  <a
                    v-for="(s, i) in pickSources(m.data)" :key="i"
                    class="cursor-pointer truncate text-xs text-sky-500 hover:underline"
                    @click="openSource(s.url)"
                  >
                    {{ i + 1 }}. {{ s.title }}<span v-if="s.host" class="text-slate-400"> · {{ s.host }}</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div v-if="loading" class="flex items-center gap-2 pl-8 text-sm text-slate-400">
          <NSpin size="small" />
          <span>正在思考，免费算力高峰期可能要 1~2 分钟…</span>
        </div>
      </div>

      <!-- 快捷示例 -->
      <div class="flex flex-wrap items-center gap-2">
        <span class="text-xs text-slate-400">试试：</span>
        <NButton
          v-for="example in examples" :key="example"
          size="tiny" quaternary :disabled="loading" @click="send(example)"
        >
          {{ example }}
        </NButton>
      </div>

      <!-- 输入区 -->
      <div class="flex gap-2">
        <NInput
          v-model:value="prompt" placeholder="说点什么，例如：帮我找一下影音相关的网址"
          clearable :disabled="loading" @keyup.enter="send()"
        />
        <NButton type="primary" :loading="loading" @click="send()">
          <template #icon>
            <SvgIcon icon="material-symbols:send-outline" />
          </template>
          发送
        </NButton>
      </div>
    </div>
  </NModal>
</template>

<style scoped>
/* 用 min() 限高，避免移动端软键盘顶起后对话区超出屏幕 */
.ai-msg-list {
  max-height: min(52vh, 420px);
  overflow-y: auto;
  padding-right: 4px;
}
</style>
