<script setup lang="ts">
import { ref } from 'vue'
import { NTabs, NTabPane } from 'naive-ui'
import BrandSetting from './BrandSetting.vue'
import CustomCode from './CustomCode.vue'
import SearchEngine from './SearchEngine.vue'
import PublicGallery from './PublicGallery.vue'
import BackupMigration from './BackupMigration.vue'
import DockerManage from './DockerManage.vue'
import OpenApi from './OpenApi.vue'

// 原本散落在管理面板里的多个设置入口，统一收进这一个页面
type TabKey = 'brand' | 'code' | 'engine' | 'gallery' | 'backup' | 'docker' | 'openapi'

const tab = ref<TabKey>('brand')
</script>

<template>
  <div class="h-full">
    <NTabs v-model:value="tab" type="line" animated size="small">
      <NTabPane name="brand" tab="站点品牌">
        <BrandSetting />
      </NTabPane>

      <NTabPane name="code" tab="自定义代码">
        <CustomCode />
      </NTabPane>

      <NTabPane name="engine" tab="搜索引擎">
        <SearchEngine />
      </NTabPane>

      <NTabPane name="gallery" tab="公共图库">
        <PublicGallery />
      </NTabPane>

      <NTabPane name="backup" tab="备份迁移">
        <BackupMigration />
      </NTabPane>

      <NTabPane name="docker" tab="Docker">
        <DockerManage />
      </NTabPane>

      <NTabPane name="openapi" tab="开放接口">
        <OpenApi />
      </NTabPane>
    </NTabs>
  </div>
</template>
