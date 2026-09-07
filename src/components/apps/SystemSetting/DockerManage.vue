<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
import {
  NAlert,
  NButton,
  NCard,
  NEmpty,
  NSpin,
  NTag,
  useMessage,
} from 'naive-ui'
import {
  execSwitchAction,
  getContainerList,
  type DockerContainer,
} from '@/api/panel/docker'

const ms = useMessage()

const loading = ref(false)
const unavailable = ref(false)
const list = ref<DockerContainer[]>([])
let timer: ReturnType<typeof setInterval> | null = null

// 状态 → 颜色的直观映射
const stateTagType = computed(() => (state: string) => {
  if (state === 'running')
    return 'success'
  if (state === 'exited' || state === 'dead')
    return 'error'
  if (state === 'paused')
    return 'warning'
  return 'default'
})

async function load(silent = false) {
  if (!silent)
    loading.value = true
  try {
    const res = await getContainerList<{ list: DockerContainer[] }>(true)
    if (res.code === 0) {
      list.value = res.data?.list || []
      unavailable.value = false
    }
  }
  catch {
    unavailable.value = true
  }
  finally {
    loading.value = false
  }
}

async function onAction(id: string, action: 'start' | 'stop' | 'restart') {
  const res = await execSwitchAction(id, action)
  if (res.code === 0) {
    ms.success('操作已提交')
    load(true)
  }
  else {
    ms.error(res.msg || '操作失败')
  }
}

onMounted(() => {
  load()
  // 容器状态会变，定时静默刷新，避免用户手动点
  timer = setInterval(() => load(true), 10000)
})

onUnmounted(() => {
  if (timer)
    clearInterval(timer)
})
</script>

<template>
  <div class="pt-[10px]">
    <NAlert v-if="unavailable" type="warning" :bordered="false" class="mb-[10px]">
      Docker daemon unavailable —— 没读到容器。若面板跑在 Docker 里，需要在部署时把
      /var/run/docker.sock 映射进容器。
    </NAlert>

    <NCard size="small" style="border-radius:10px">
      <div class="flex items-center mb-[10px]">
        <span class="text-slate-500">容器列表</span>
        <NButton size="tiny" class="ml-auto" :loading="loading" @click="load()">
          刷新
        </NButton>
      </div>

      <NSpin :show="loading">
        <div v-if="list.length" class="flex flex-col gap-[8px]">
          <div
            v-for="c in list"
            :key="c.id"
            class="border rounded-[8px] p-[8px] flex items-center"
          >
            <div class="flex-1 min-w-0">
              <div class="text-[13px] font-bold truncate">
                {{ c.name || '(无名容器)' }}
              </div>
              <div class="text-[12px] text-slate-400 truncate">
                {{ c.image }}
              </div>
              <div class="text-[12px] text-slate-400">
                {{ c.status }}
              </div>
            </div>

            <NTag :type="stateTagType(c.state)" size="small" class="mr-[8px]">
              {{ c.state }}
            </NTag>

            <NButton
              v-if="c.state !== 'running'"
              size="tiny"
              type="success"
              class="mr-[4px]"
              @click="onAction(c.id, 'start')"
            >
              启动
            </NButton>
            <NButton
              v-if="c.state === 'running'"
              size="tiny"
              class="mr-[4px]"
              @click="onAction(c.id, 'stop')"
            >
              停止
            </NButton>
            <NButton size="tiny" type="warning" @click="onAction(c.id, 'restart')">
              重启
            </NButton>
          </div>
        </div>

        <NEmpty v-else description="没有读到容器" />
      </NSpin>
    </NCard>
  </div>
</template>
