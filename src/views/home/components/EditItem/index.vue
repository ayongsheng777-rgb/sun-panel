<script setup lang="ts">
import { computed, defineEmits, defineProps, ref, watch } from 'vue'
import type { FormInst, FormItemRule, FormRules } from 'naive-ui'
import { NButton, NForm, NFormItem, NGrid, NGridItem, NInput, NInputGroup, NModal, NSelect, NSwitch, NTag, useMessage } from 'naive-ui'
import { VueDraggable } from 'vue-draggable-plus'
import IconEditor from './IconEditor.vue'
import { edit, getSiteFavicon } from '@/api/panel/itemIcon'
import { getList as getGroupList } from '@/api/panel/itemIconGroup'
import { classifyAddress, getDefaultAddressName, isSafeWebUrl } from '@/utils/address'
import { t } from '@/locales'

interface Props {
  visible: boolean
  itemInfo: Panel.Info | null
  itemGroupId?: number
}

const props = defineProps<Props>()
const emit = defineEmits<Emit>()
const ms = useMessage()
const submitLoading = ref(false)
const getIconLoading = ref([false, false])
const itemIconGroupOptions = ref<{
  label: string
  value: number
}[]>([])

const restoreDefault: Panel.Info = {
  icon: null,
  title: '',
  url: '',
  lanUrl: '',
  description: '',
  openMethod: 2,
  addresses: [],
}

interface Emit {
  (e: 'update:visible', visible: boolean): void
  (e: 'done', item: Panel.Info): void// 创建完成
}

const model = ref<Panel.Info>(props.itemInfo ? { ...props.itemInfo } : { ...restoreDefault })
const formRef = ref<FormInst | null>(null)

const rules: FormRules = {
  title: {
    required: true,
    trigger: 'blur',
    message: t('form.required'),
  },
  addresses: {
    validator: (_rule: FormItemRule, value: any): boolean | Error => {
      const list = (value as Panel.ItemAddress[] | undefined) ?? model.value.addresses ?? []
      const valid = list.some(a => a.enabled && isSafeWebUrl(a.url))
      if (!valid)
        return new Error(t('iconItem.addressRequired'))
      return true
    },
    trigger: ['change', 'blur'],
  },
}

const options = [
  {
    default: true,
    label: t('iconItem.currentPageOpen'),
    value: 1,
  },
  {
    label: t('iconItem.newWindowOpen'),
    value: 2,
  },
  {
    label: t('iconItem.currentPageLayerOpen'),
    value: 3,
  },
]

// 更新值父组件传来的值
const show = computed({
  get: () => props.visible,
  set: (visible: boolean) => {
    emit('update:visible', visible)
  },
})

function buildLegacyAddresses() {
  const list: Panel.ItemAddress[] = []
  let sort = 0
  if (model.value.url) {
    list.push({ id: 'legacy-default', name: '默认', url: model.value.url, type: classifyAddress(model.value.url), isDefault: true, sort, enabled: true, openMethod: model.value.openMethod })
    sort++
  }
  if (model.value.lanUrl) {
    list.push({ id: 'legacy-lan', name: '局域网', url: model.value.lanUrl, type: 'lan', isDefault: false, sort, enabled: true, openMethod: model.value.openMethod })
    sort++
  }
  model.value.addresses = list
}

async function editApi() {
  submitLoading.value = true
  try {
    // url 作为默认地址缓存/兼容字段
    const def = (model.value.addresses || []).find(a => a.isDefault && a.enabled)
    model.value.url = def?.url || (model.value.addresses?.[0]?.url ?? '')
    model.value.lanUrl = (model.value.addresses || []).find(a => a.type === 'lan' && !a.isDefault)?.url || ''
    const { code, data, msg } = await edit<Panel.ItemInfo>(model.value)
    if (code === 0) {
      show.value = false
      model.value = { ...restoreDefault }
      emit('done', data)
    }
    else {
      ms.error(`${t('common.saveFail')}:${msg}`)
    }
  }
  catch (error) {
    ms.error(t('common.saveFail'))
  }
  submitLoading.value = false
}

const handleValidateButtonClick = (e: MouseEvent) => {
  e.preventDefault()
  formRef.value?.validate((errors) => {
    if (!errors)
      editApi()
  })
}

function addAddress() {
  const addresses = model.value.addresses ?? []
  addresses.push({
    id: crypto.randomUUID(),
    name: '',
    url: '',
    type: 'https',
    isDefault: addresses.length === 0,
    sort: addresses.length,
    enabled: true,
    openMethod: model.value.openMethod,
  })
  model.value.addresses = addresses
}

function removeAddress(id: string) {
  const addresses = model.value.addresses ?? []
  const removed = addresses.find(item => item.id === id)
  model.value.addresses = addresses
    .filter(item => item.id !== id)
    .map((item, index) => ({ ...item, sort: index }))
  if (removed?.isDefault && model.value.addresses.length > 0)
    model.value.addresses[0].isDefault = true
}

function setDefaultAddress(id: string) {
  model.value.addresses = (model.value.addresses ?? []).map(address => ({
    ...address,
    isDefault: address.id === id,
  }))
}

function handleAddressUrlBlur(address: Panel.ItemAddress) {
  address.url = address.url.trim()
  if (!address.url)
    return
  address.type = classifyAddress(address.url)
  if (!address.name)
    address.name = getDefaultAddressName(address)
}

async function getIconByUrl(url: string, loadingIndex: number) {
  getIconLoading.value[loadingIndex] = true
  try {
    const { code, data } = await getSiteFavicon<{ iconUrl: string }>(url)
    if (code === 0) {
      model.value.icon = {
        itemType: 2,
        src: data.iconUrl,
      }
    }
    else {
      ms.error(t('iconItem.geticonFail'))
    }
  }
  catch (error) {
    ms.error(t('iconItem.geticonFail'))
  }
  getIconLoading.value[loadingIndex] = false
}

watch(() => props.visible, (newValue) => {
  if (newValue === true) {
    model.value = props.itemInfo ? { ...props.itemInfo } : { ...restoreDefault }
    // 旧数据兼容：有 url/lanUrl 但无 addresses 时构建
    if ((!model.value.addresses || model.value.addresses.length === 0) && (model.value.url || model.value.lanUrl))
      buildLegacyAddresses()

    if (props.itemGroupId)
      model.value.itemIconGroupId = props.itemGroupId
  }

  getGroupListOptions()
})

function getGroupListOptions() {
  getGroupList<Common.ListResponse<Panel.ItemIconGroup[]>>().then(({ data, code, msg }) => {
    if (code === 0) {
      itemIconGroupOptions.value = []

      for (let i = 0; i < data.list.length; i++) {
        const element = data.list[i]
        if (i === 0 && !model.value.itemIconGroupId) {
          model.value.itemIconGroupId = element.id
          restoreDefault.itemIconGroupId = element.id
        }

        itemIconGroupOptions.value.push({
          value: element.id as number,
          label: element.title as string,
        })
      }
    }
    else {
      ms.error(`${t('iconItem.getGroupFail')}:${msg}`)
    }
  })
}
</script>

<template>
  <NModal v-model:show="show" preset="card" size="small" style="width: 600px;border-radius: 1rem;" :title="itemInfo ? t('iconItem.edit') : t('iconItem.add')">
    <div class="max-h-[70vh] overflow-auto p-[5px]">
      <NForm ref="formRef" :model="model" :rules="rules">
        <NGrid cols="2" :x-gap="10" item-responsive>
          <NGridItem span="2 500:1">
            <NFormItem path="itemIconGroupId" :label="t('iconItem.iconGroup')">
              <NSelect v-model:value="model.itemIconGroupId" :options="itemIconGroupOptions" />
            </NFormItem>
          </NGridItem>
          <NGridItem span="2 500:1">
            <NFormItem path="title" :label="$t('common.title')">
              <NInput v-model:value="model.title" type="text" show-count :maxlength="20" />
            </NFormItem>
          </NGridItem>
        </NGrid>

        <NFormItem path="icon" :label="$t('common.icon')">
          <IconEditor v-model:item-icon="model.icon" />
        </NFormItem>

        <!-- 弹性多地址编辑器 -->
        <NFormItem path="addresses" :label="t('iconItem.addressList')">
          <div class="w-full">
            <VueDraggable
              v-if="model.addresses && model.addresses.length"
              v-model="model.addresses" item-key="id" handle=".address-drag" :animation="200"
              class="flex flex-col gap-2"
            >
              <div v-for="address in model.addresses" :key="address.id" class="address-row flex items-center gap-2 rounded-lg p-2" :class="`address-type-${address.type}`">
                <span class="address-drag cursor-move select-none text-white/60" title="拖拽排序">⠿</span>
                <NInput v-model:value="address.name" :placeholder="t('iconItem.addressName')" style="width: 90px" />
                <NInputGroup class="flex-1">
                  <NInput v-model:value="address.url" type="text" :maxlength="1000" placeholder="https://example.com" @blur="handleAddressUrlBlur(address)" />
                  <NButton v-if="!address.isDefault" :disabled="!address.url" :loading="getIconLoading[0]" @click="getIconByUrl(address.url, 0)">
                    {{ $t('iconItem.getIcon') }}
                  </NButton>
                </NInputGroup>
                <NTag v-if="address.isDefault" type="success" size="small" :bordered="false">
                  {{ t('iconItem.defaultAddress') }}
                </NTag>
                <NButton v-else size="tiny" @click="setDefaultAddress(address.id)">
                  {{ t('iconItem.setDefault') }}
                </NButton>
                <NSwitch v-model:value="address.enabled" :title="t('iconItem.enabled')" />
                <NButton size="tiny" type="error" ghost @click="removeAddress(address.id)">
                  ✕
                </NButton>
              </div>
            </VueDraggable>

            <NButton class="mt-2" dashed block @click="addAddress">
              + {{ t('iconItem.addAddress') }}
            </NButton>
          </div>
        </NFormItem>

        <NFormItem path="description" :label="$t('common.description')">
          <NInput v-model:value="model.description" type="text" show-count :maxlength="100" />
        </NFormItem>
        <NFormItem path="openMethod" :label="$t('iconItem.openMethod')">
          <NSelect v-model:value="model.openMethod" :options="options" />
        </NFormItem>
      </NForm>
    </div>

    <template #footer>
      <NButton type="success" :loading="submitLoading" style="float: right;" @click="handleValidateButtonClick">
        {{ $t('common.save') }}
      </NButton>
    </template>
  </NModal>
</template>

<style scoped>
.address-row {
  background: rgba(255, 255, 255, 0.06);
  border-left: 3px solid transparent;
}

.address-type-https {
  border-left-color: rgb(34, 197, 94);
}

.address-type-http {
  border-left-color: rgb(249, 115, 22);
}

.address-type-lan {
  border-left-color: rgb(59, 130, 246);
}

.address-type-other {
  border-left-color: rgb(113, 113, 122);
}
</style>
