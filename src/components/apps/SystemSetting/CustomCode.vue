<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { NButton, NCard, NInput, useMessage } from 'naive-ui'
import {
  getCustomJsAndCssCode,
  saveCustomJsAndCssCode,
  type CustomCode as CustomCodePayload,
} from '@/api/panel/globalSetting'

const ms = useMessage()

const loading = ref(false)
const saving = ref(false)
const code = ref<CustomCodePayload>({ jsContent: '', cssContent: '' })

async function load() {
  loading.value = true
  try {
    const res = await getCustomJsAndCssCode<CustomCodePayload>()
    if (res.code === 0 && res.data)
      code.value = res.data
  }
  finally {
    loading.value = false
  }
}

async function save() {
  saving.value = true
  try {
    const res = await saveCustomJsAndCssCode(code.value)
    if (res.code === 0)
      ms.success('已保存，刷新页面后生效')
  }
  finally {
    saving.value = false
  }
}

onMounted(load)
</script>

<template>
  <div class="pt-[10px]">
    <NCard size="small" style="border-radius:10px">
      <div class="text-slate-500 mb-[6px] font-bold">
        自定义 CSS
      </div>
      <NInput
        v-model:value="code.cssContent"
        type="textarea"
        :autosize="{ minRows: 6, maxRows: 14 }"
        placeholder="例如：body { background: #000; }"
      />

      <div class="text-slate-500 mt-[12px] mb-[6px] font-bold">
        自定义 JS
      </div>
      <NInput
        v-model:value="code.jsContent"
        type="textarea"
        :autosize="{ minRows: 6, maxRows: 14 }"
        placeholder="页面加载完成后执行，例如：console.log('hello')"
      />

      <div class="text-slate-400 text-[12px] mt-[8px]">
        内容保存在服务器 conf/custom 目录下，重新发版前端不会丢失。
      </div>
    </NCard>

    <div class="mt-[12px] flex justify-end">
      <NButton type="primary" :loading="saving || loading" @click="save">
        保存自定义代码
      </NButton>
    </div>
  </div>
</template>
