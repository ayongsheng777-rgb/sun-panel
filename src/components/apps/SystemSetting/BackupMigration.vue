<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { NAlert, NButton, NCard, NSpin, NTag, NUpload, useMessage } from 'naive-ui'
import type { UploadFileInfo } from 'naive-ui'
import { useAuthStore } from '@/store'
import {
  createBackup,
  downloadUrl,
  getBackupList,
  recovery,
  type RecoveryResult,
} from '@/api/panel/backup'

const ms = useMessage()
const authStore = useAuthStore()

const loading = ref(false)
const creating = ref(false)
const restoring = ref(false)
const list = ref<string[]>([])
const lastResult = ref<RecoveryResult | null>(null)

async function load() {
  loading.value = true
  try {
    const res = await getBackupList<{ list: string[] }>()
    if (res.code === 0)
      list.value = res.data?.list || []
  }
  finally {
    loading.value = false
  }
}

async function onCreate() {
  creating.value = true
  try {
    const res = await createBackup<{ fileName: string }>()
    if (res.code === 0) {
      ms.success('备份已生成')
      load()
    }
  }
  finally {
    creating.value = false
  }
}

async function onRestore(fileName: string, force = false) {
  restoring.value = true
  try {
    const res = await recovery<RecoveryResult>(fileName, force)
    if (res.code === 0) {
      lastResult.value = res.data
      if (res.data.compatibilityStatus === 1)
        ms.success('恢复完成')
      else
        ms.warning(`版本不兼容：${res.data.message}`)
    }
  }
  finally {
    restoring.value = false
  }
}

function onUploadFinish({ event }: { file: UploadFileInfo; event?: ProgressEvent }) {
  try {
    const res = JSON.parse((event?.target as XMLHttpRequest).response)
    if (res?.code === 0) {
      ms.success('上传成功，可在下方列表里恢复')
      load()
    }
  }
  catch {
    ms.error('上传失败')
  }
}

onMounted(load)
</script>

<template>
  <div class="pt-[10px]">
    <NAlert type="warning" :bordered="false" class="mb-[10px]">
      恢复会用备份包里的数据覆盖当前的网址、图片和设置，操作前建议先创建一个新的备份。
    </NAlert>

    <NCard size="small" style="border-radius:10px">
      <div class="flex items-center mb-[10px]">
        <NButton type="primary" size="small" :loading="creating" @click="onCreate">
          立即创建备份
        </NButton>

        <NUpload
          action="/api/panel/backup/uploadZipFile"
          name="file"
          :show-file-list="false"
          :headers="{ token: authStore.token as string }"
          class="ml-[8px]"
          @finish="onUploadFinish"
        >
          <NButton size="small">上传备份包</NButton>
        </NUpload>
      </div>

      <NSpin :show="loading || restoring">
        <div v-if="list.length" class="flex flex-col gap-[8px]">
          <div
            v-for="name in list"
            :key="name"
            class="flex items-center border rounded-[8px] p-[8px]"
          >
            <span class="flex-1 text-[13px]">{{ name }}</span>
            <NTag size="small" class="mr-[8px]">zip</NTag>
            <NButton
              size="tiny"
              class="mr-[6px]"
              tag="a"
              :href="downloadUrl(name)"
              target="_blank"
            >
              下载
            </NButton>
            <NButton size="tiny" type="warning" @click="onRestore(name, false)">
              恢复到此备份
            </NButton>
          </div>
        </div>
        <div v-else class="text-slate-400 text-[13px]">
          还没有备份文件
        </div>
      </NSpin>
    </NCard>

    <NAlert v-if="lastResult" type="info" :bordered="false" class="mt-[10px]">
      {{ lastResult.message }}（备份包要求的最低版本：{{ lastResult.lowestSunPanelVersion || '不限' }}）
    </NAlert>
  </div>
</template>
