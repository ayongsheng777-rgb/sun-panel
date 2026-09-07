<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { NButton, NCard, NInput, NRadio, NTag, useMessage } from 'naive-ui'
import { useModuleConfig } from '@/store/modules'

const ms = useMessage()
const moduleConfig = useModuleConfig()

interface Engine {
  iconSrc: string
  title: string
  url: string
  key?: string
  isDefault?: boolean
  sort?: number
}

const moduleName = 'deskModuleSearchBox'

const list = ref<Engine[]>([])
const current = ref<Engine | null>(null)

const form = ref({
  title: '',
  url: '',
  iconSrc: '',
})

function persist() {
  moduleConfig.saveToCloud(moduleName, {
    currentSearchEngine: current.value,
    searchEngineList: list.value,
    newWindowOpen: false,
  })
}

async function load() {
  const res = await moduleConfig.getValueByNameFromCloud<{
    currentSearchEngine: Engine | null
    searchEngineList: Engine[]
  }>(moduleName)
  if (res.code === 0 && res.data) {
    list.value = res.data.searchEngineList?.length ? res.data.searchEngineList : list.value
    current.value = res.data.currentSearchEngine || list.value[0] || null
  }
}

function add() {
  const title = form.value.title.trim()
  const url = form.value.url.trim()
  if (!title || !url) {
    ms.warning('标题和搜索地址都要填')
    return
  }
  if (!url.includes('%s')) {
    ms.warning('搜索地址需要带 %s 占位符，例如 https://xxx.com/search?q=%s')
    return
  }
  list.value.push({
    title,
    url,
    iconSrc: form.value.iconSrc.trim() || '',
    key: `custom-${Date.now()}`,
    isDefault: false,
    sort: list.value.length,
  })
  form.value = { title: '', url: '', iconSrc: '' }
  persist()
  ms.success('已添加')
}

function remove(index: number) {
  const target = list.value[index]
  if (target.isDefault) {
    ms.warning('内置引擎不能删除')
    return
  }
  list.value.splice(index, 1)
  if (current.value?.key === target.key)
    current.value = list.value[0] || null
  persist()
}

function setDefault(engine: Engine) {
  current.value = engine
  persist()
  ms.success(`已把 ${engine.title} 设为默认`)
}

onMounted(load)
</script>

<template>
  <div class="pt-[10px]">
    <NCard size="small" style="border-radius:10px">
      <div class="text-slate-500 mb-[6px] font-bold">添加自定义搜索引擎</div>
      <div class="flex items-center gap-[8px] mb-[10px]">
        <NInput v-model:value="form.title" placeholder="名称，如 知乎" style="width:160px" />
        <NInput v-model:value="form.url" placeholder="搜索地址，如 https://zhihu.com/search?type=content&q=%s" class="flex-1" />
      </div>
      <div class="flex items-center gap-[8px]">
        <NInput v-model:value="form.iconSrc" placeholder="图标地址（可选）" class="flex-1" />
        <NButton size="small" type="primary" @click="add">添加</NButton>
      </div>
    </NCard>

    <NCard size="small" class="mt-[10px]" style="border-radius:10px">
      <div class="text-slate-500 mb-[6px] font-bold">搜索引擎列表（点选设为默认）</div>
      <div v-if="list.length" class="flex flex-col gap-[6px]">
        <div
          v-for="(engine, index) in list"
          :key="engine.key || index"
          class="flex items-center border rounded-[8px] p-[8px]"
        >
          <NRadio
            :checked="current?.key === engine.key || (current?.title === engine.title && !engine.key)"
            @update:checked="setDefault(engine)"
          />
          <div class="flex-1 min-w-0 ml-[8px]">
            <div class="text-[13px] truncate">
              {{ engine.title }}
              <NTag v-if="engine.isDefault" size="tiny" class="ml-[6px]">内置</NTag>
            </div>
            <div class="text-[12px] text-slate-400 truncate">{{ engine.url }}</div>
          </div>
          <NButton v-if="!engine.isDefault" size="tiny" type="error" @click="remove(index)">
            删除
          </NButton>
        </div>
      </div>
      <div v-else class="text-slate-400 text-[13px]">还没有搜索引擎</div>
    </NCard>
  </div>
</template>
