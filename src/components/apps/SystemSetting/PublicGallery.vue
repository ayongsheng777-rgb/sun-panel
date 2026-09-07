<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import {
  NButton,
  NCard,
  NEmpty,
  NImage,
  NSelect,
  NSpin,
  NTag,
  NUpload,
  useMessage,
} from 'naive-ui'
import type { UploadFileInfo } from 'naive-ui'
import { useAuthStore } from '@/store'
import {
  deletes,
  getImagesList,
  updateFileType,
  type GalleryImage,
} from '@/api/panel/publicGallery'

const ms = useMessage()
const authStore = useAuthStore()

const isAdmin = computed(() => authStore.userInfo?.role === 1)

const loading = ref(false)
const list = ref<GalleryImage[]>([])
const checkedIds = ref<number[]>([])

const typeOptions = [
  { label: '全部', value: 0 },
  { label: '壁纸', value: 1 },
  { label: '图标', value: 2 },
]
const filterType = ref(0)

const changeTypeOptions = [
  { label: '壁纸', value: 1 },
  { label: '图标', value: 2 },
]
const changeType = ref(1)

async function load() {
  loading.value = true
  try {
    const res = await getImagesList<{ list: GalleryImage[] }>({
      type: filterType.value,
      page: 1,
      size: 100,
    })
    if (res.code === 0)
      list.value = res.data?.list || []
  }
  finally {
    loading.value = false
  }
}

function toggleCheck(id: number) {
  const idx = checkedIds.value.indexOf(id)
  if (idx >= 0)
    checkedIds.value.splice(idx, 1)
  else
    checkedIds.value.push(id)
}

async function onChangeType() {
  if (checkedIds.value.length === 0) {
    ms.warning('请先勾选图片')
    return
  }
  const res = await updateFileType(checkedIds.value, changeType.value)
  if (res.code === 0) {
    ms.success('已更新分类')
    checkedIds.value = []
    load()
  }
}

async function onDelete() {
  if (checkedIds.value.length === 0) {
    ms.warning('请先勾选图片')
    return
  }
  const res = await deletes(checkedIds.value)
  if (res.code === 0) {
    ms.success('已删除')
    checkedIds.value = []
    load()
  }
}

function onUploadFinish({ event }: { file: UploadFileInfo; event?: ProgressEvent }) {
  try {
    const res = JSON.parse((event?.target as XMLHttpRequest).response)
    if (res?.code === 0) {
      ms.success('上传成功')
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
    <NCard size="small" style="border-radius:10px">
      <div class="flex items-center mb-[10px]">
        <span class="mr-[10px] text-slate-500">筛选分类</span>
        <NSelect v-model:value="filterType" :options="typeOptions" style="width:140px" @update:value="load" />

        <template v-if="isAdmin">
          <NUpload
            action="/api/panel/publicGallery/uploadImg"
            name="imgfile"
            :show-file-list="false"
            :headers="{ token: authStore.token as string }"
            class="ml-auto"
            @finish="onUploadFinish"
          >
            <NButton size="small" type="primary">上传图片</NButton>
          </NUpload>
        </template>
      </div>

      <div v-if="isAdmin" class="flex items-center mb-[10px]">
        <NSelect v-model:value="changeType" :options="changeTypeOptions" style="width:120px" />
        <NButton size="small" class="ml-[8px]" @click="onChangeType">
          批量改分类
        </NButton>
        <NButton size="small" type="error" class="ml-[8px]" @click="onDelete">
          删除所选
        </NButton>
      </div>

      <NSpin :show="loading">
        <div v-if="list.length" class="grid grid-cols-[repeat(auto-fill,minmax(110px,1fr))] gap-[10px]">
          <div
            v-for="item in list"
            :key="item.id"
            class="border rounded-[8px] p-[6px] cursor-pointer"
            :style="{ borderColor: checkedIds.includes(item.id) ? '#18A058' : 'transparent' }"
            @click="toggleCheck(item.id)"
          >
            <NImage :src="item.src" object-fit="cover" style="height:70px;width:100%" />
            <div class="text-[12px] text-slate-500 truncate mt-[4px]">
              {{ item.fileName }}
            </div>
            <NTag v-if="item.type === 1" size="small" type="info">壁纸</NTag>
            <NTag v-else-if="item.type === 2" size="small" type="success">图标</NTag>
            <NTag v-else size="small">未分类</NTag>
          </div>
        </div>

        <NEmpty v-else description="公共图库还是空的" />
      </NSpin>
    </NCard>
  </div>
</template>
