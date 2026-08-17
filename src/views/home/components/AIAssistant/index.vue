<script setup lang="ts">
import { ref } from 'vue'
import { NButton, NInput, NModal, NSpin, NTag, useMessage } from 'naive-ui'
import { SvgIcon } from '@/components/common'
import { addWebsite, type AIAddWebsiteResult } from '@/api/panel/aiManage'

defineProps<{ visible: boolean }>()
const emit = defineEmits<{ (e: 'update:visible', visible: boolean): void; (e: 'done'): void }>()

const ms = useMessage()
const prompt = ref('')
const loading = ref(false)
const result = ref<AIAddWebsiteResult | null>(null)
const error = ref('')

const examples = ['添加 ChatGPT 官网', '添加 GitHub 官网', '添加 docker 管理工具', '添加股票行情网站']

async function submit() {
  const p = prompt.value.trim()
  if (!p)
    return
  loading.value = true
  error.value = ''
  result.value = null
  try {
    const { code, data, msg } = await addWebsite<AIAddWebsiteResult>(p)
    if (code === 0 && data) {
      result.value = data
      ms.success(`已添加到「${data.category}」分组`)
      emit('done')
    }
    else {
      error.value = msg || '添加失败，请稍后重试'
    }
  }
  catch (e: any) {
    error.value = e?.message || '添加失败，请稍后重试'
  }
  loading.value = false
}

function useExample(example: string) {
  prompt.value = example
}

function close() {
  emit('update:visible', false)
  result.value = null
  error.value = ''
}
</script>

<template>
  <NModal
    :show="visible" preset="card" title="AI 助手" style="width: 560px; max-width: 92vw;"
    :on-close="close"
  >
    <div class="flex flex-col gap-3">
      <div class="text-sm text-slate-500">
        告诉我你想添加的网站，我会联网找到官网、自动分类并配好图标。
      </div>

      <div class="flex gap-2">
        <NInput
          v-model:value="prompt" placeholder="例如：添加 ChatGPT 官网"
          clearable @keyup.enter="submit"
        />
        <NButton type="primary" :loading="loading" @click="submit">
          <template #icon>
            <SvgIcon icon="material-symbols:auto-awesome" />
          </template>
          添加
        </NButton>
      </div>

      <div class="flex flex-wrap gap-2">
        <span class="text-xs text-slate-400">试试：</span>
        <NButton v-for="example in examples" :key="example" size="tiny" quaternary @click="useExample(example)">
          {{ example }}
        </NButton>
      </div>

      <NSpin :show="loading">
        <div v-if="error" class="text-sm text-orange-500">{{ error }}</div>

        <div v-if="result" class="rounded-xl border border-slate-200 p-3 flex flex-col gap-2">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-lg bg-sky-100 flex items-center justify-center text-sky-600 font-bold">
              {{ result.item.title?.slice(0, 1) }}
            </div>
            <div class="flex-1 min-w-0">
              <div class="font-medium truncate">{{ result.item.title }}</div>
              <div class="text-xs text-slate-400 truncate">{{ result.item.url }}</div>
            </div>
            <NTag size="small" type="info" round>{{ result.category }}</NTag>
          </div>
          <div class="text-xs text-slate-500">
            已添加到「{{ result.category }}」分组，刷新首页即可看到。
          </div>
        </div>
      </NSpin>
    </div>
  </NModal>
</template>
