<script setup lang="ts">
import { computed, onMounted, reactive, ref, watch } from 'vue'
import { NButton, NCard, NDivider, NForm, NFormItem, NInput, NInputNumber, NModal, NSelect, NSpin, NSwitch, NTag, useMessage } from 'naive-ui'
import { autoBestModel, getAIConfig, listAIModels, saveAIConfig, testAIModels } from '@/api/ai'
import { t } from '@/locales'

const props = withDefaults(defineProps<{ visible?: boolean; embedded?: boolean }>(), {
  visible: false,
  embedded: false,
})
const emit = defineEmits<{ (e: 'update:visible', visible: boolean): void }>()

const ms = useMessage()
const loading = ref(false)
const saving = ref(false)
const testing = ref(false)
const modelLists = reactive<Record<string, Panel.AIModel[]>>({})
const testResults = ref<Panel.AIModelTestResult[]>([])
// 自动优选：每个 provider 的加载态与实测明细
const autoBestLoading = reactive<Record<string, boolean>>({})
const autoBestTested = reactive<Record<string, Panel.AIModelTestResult[]>>({})

// 加载到的原始 key（用于「留空保留原值」）
const originalKeys = reactive<Record<string, string>>({})

const PROVIDER_LIST: Panel.AIProviderConfig['provider'][] = ['openai', 'deepseek', 'nvidia', 'gemini', 'custom']

const PROVIDER_LABELS: Record<string, string> = {
  openai: 'OpenAI',
  deepseek: 'DeepSeek',
  nvidia: 'NVIDIA',
  gemini: 'Gemini',
  custom: '自定义(OpenAI兼容)',
}

const providerOptions = PROVIDER_LIST.map(p => ({
  label: PROVIDER_LABELS[p] || p,
  value: p,
}))

const defaultProviderOptions = providerOptions

const backupProviderOptions = [
  { label: '无（不启用备用）', value: '' },
  ...providerOptions,
]

const thinkingOptions = [
  { label: '关闭', value: 'off' },
  { label: '低 (low)', value: 'low' },
  { label: '中 (medium)', value: 'medium' },
  { label: '高 (high)', value: 'high' },
]

function emptyConfig(): Panel.AIConfig {
  return {
    enabled: false,
    defaultProvider: 'deepseek',
    strategy: 'auto',
    providers: {
      openai: { provider: 'openai', baseUrl: 'https://api.openai.com/v1', apiKey: '', model: 'gpt-4o-mini', enabled: false, timeout: 8000, thinking: 'off' },
      deepseek: { provider: 'deepseek', baseUrl: 'https://api.deepseek.com/v1', apiKey: '', model: 'deepseek-chat', enabled: true, timeout: 8000, thinking: 'off' },
      nvidia: { provider: 'nvidia', baseUrl: 'https://integrate.api.nvidia.com/v1', apiKey: '', model: 'nvidia/llama-3.1-nemotron-70b-instruct', enabled: false, timeout: 8000, thinking: 'off' },
      gemini: { provider: 'gemini', baseUrl: 'https://generativelanguage.googleapis.com/v1beta/openai', apiKey: '', model: 'gemini-2.0-flash', enabled: false, timeout: 8000, thinking: 'off' },
      custom: { provider: 'custom', baseUrl: '', apiKey: '', model: '', enabled: false, timeout: 8000, thinking: 'off' },
    },
  }
}

const form = reactive<Panel.AIConfig>(emptyConfig())

function cloneInto(target: Panel.AIConfig, src: Panel.AIConfig) {
  target.enabled = src.enabled
  target.defaultProvider = src.defaultProvider
  target.backupProvider = src.backupProvider || ''
  target.strategy = src.strategy || 'auto'
  target.providers = {}
  for (const p of PROVIDER_LIST) {
    const s = src.providers?.[p]
    target.providers[p] = s
      ? { ...s }
      : { provider: p, baseUrl: '', apiKey: '', model: '', enabled: false, timeout: 8000, thinking: 'off' }
    originalKeys[p] = target.providers[p].apiKey || ''
  }
}

async function load() {
  loading.value = true
  try {
    const { code, data } = await getAIConfig<Panel.AIConfig>()
    if (code === 0 && data)
      cloneInto(form, data)
    else
      cloneInto(form, emptyConfig())
  }
  catch {
    ms.error(t('common.loadFail'))
  }
  finally {
    loading.value = false
  }
}

// 弹窗模式：visible 变 true 时加载；内嵌模式：挂载即加载
watch(() => props.visible, (v) => {
  if (v) {
    testResults.value = []
    Object.keys(modelLists).forEach(k => delete modelLists[k])
    load()
  }
})

onMounted(() => {
  if (props.embedded) {
    testResults.value = []
    load()
  }
})

function close() {
  emit('update:visible', false)
}

async function handleSave() {
  saving.value = true
  // 构造保存体：apiKey 留空且原值存在则保留
  const payload: Panel.AIConfig = {
    enabled: form.enabled,
    defaultProvider: form.defaultProvider,
    backupProvider: form.backupProvider || '',
    strategy: form.strategy,
    providers: {},
  }
  for (const p of PROVIDER_LIST) {
    const src = form.providers[p]
    const key = (src.apiKey || '').trim()
    payload.providers[p] = {
      ...src,
      apiKey: key === '' ? (originalKeys[p] || '') : key,
    }
  }
  try {
    const { code, msg } = await saveAIConfig<Panel.AIConfig>(payload)
    if (code === 0) {
      ms.success(t('aiSearch.saveSuccess'))
      close()
    }
    else {
      ms.error(`${t('common.saveFail')}:${msg}`)
    }
  }
  catch {
    ms.error(t('common.saveFail'))
  }
  finally {
    saving.value = false
  }
}

async function handleListModels(provider: string) {
  try {
    const { code, data } = await listAIModels<{ provider: string; models: Panel.AIModel[] }>(provider)
    if (code === 0 && data) {
      modelLists[provider] = data.models || []
      if (!modelLists[provider].length)
        ms.info(t('aiSearch.noModels'))
    }
    else {
      ms.error(t('aiSearch.listFail'))
    }
  }
  catch {
    ms.error(t('aiSearch.listFail'))
  }
}

async function handleTest() {
  testing.value = true
  try {
    const { code, data } = await testAIModels<{ results: Panel.AIModelTestResult[] }>()
    if (code === 0 && data) {
      testResults.value = data.results || []
      const ok = testResults.value.filter(r => r.success).length
      ms.success(t('aiSearch.testDone', { ok, total: testResults.value.length }))
    }
    else {
      ms.error(t('aiSearch.testFail'))
    }
  }
  catch {
    ms.error(t('aiSearch.testFail'))
  }
  finally {
    testing.value = false
  }
}

async function handleAutoBest(provider: Panel.AIProviderConfig['provider']) {
  // 后端用的是「已保存」的 key：key 刚填还没保存时先提示保存
  if (!(originalKeys[provider] || '').trim()) {
    ms.warning('请先点「保存」把 API Key 存到后端，再来自动检测')
    return
  }
  autoBestLoading[provider] = true
  delete autoBestTested[provider]
  try {
    const { code, msg, data } = await autoBestModel<Panel.AIAutoBestResult>(provider)
    if (data?.tested?.length)
      autoBestTested[provider] = data.tested
    if (code === 0 && data?.model) {
      // 后端已自动保存：同步回填表单（模型名 + 启用开关）
      form.providers[provider].model = data.model
      form.providers[provider].enabled = true
      ms.success(`已自动启用最优模型：${data.model}（${data.latencyMs}ms）`)
    }
    else {
      ms.error(msg || '自动检测失败')
    }
  }
  catch {
    ms.error('自动检测失败（网络错误）')
  }
  finally {
    autoBestLoading[provider] = false
  }
}

const hasAnyKey = computed(() => PROVIDER_LIST.some(p => (form.providers[p]?.apiKey || originalKeys[p] || '').trim() !== ''))
</script>

<template>
  <template v-if="embedded">
    <div class="p-1">
      <NSpin :show="loading">
        <NForm label-placement="top">
          <NFormItem :label="t('aiSearch.enabled')">
            <NSwitch v-model:value="form.enabled" />
            <span class="ml-2 text-xs text-zinc-400">{{ t('aiSearch.enabledHint') }}</span>
          </NFormItem>

          <NFormItem :label="t('aiSearch.defaultProvider')">
            <NSelect
              v-model:value="form.defaultProvider" :options="defaultProviderOptions"
              style="max-width: 280px;" :disabled="!hasAnyKey"
            />
          </NFormItem>

          <NFormItem label="备用服务商（主用失败自动切换）">
            <NSelect
              v-model:value="form.backupProvider" :options="backupProviderOptions"
              style="max-width: 280px;"
            />
            <span class="ml-2 text-xs text-zinc-400">主用不可用时自动尝试备用</span>
          </NFormItem>

          <NDivider />

          <NCard
            v-for="p in PROVIDER_LIST" :key="p" size="small" class="mb-3"
            :title="PROVIDER_LABELS[p] || p"
          >
            <template #header-extra>
              <NSwitch v-model:value="form.providers[p].enabled" size="small" />
            </template>
            <NFormItem :label="t('aiSearch.baseUrl')">
              <NInput v-model:value="form.providers[p].baseUrl" placeholder="https://..." />
            </NFormItem>
            <NFormItem :label="t('aiSearch.apiKey')">
              <NInput
                v-model:value="form.providers[p].apiKey" type="password" show-password-on="click"
                :placeholder="originalKeys[p] ? t('aiSearch.keepKeyHint') : t('aiSearch.apiKeyPlaceholder')"
              />
            </NFormItem>
            <NFormItem :label="t('aiSearch.model')">
              <NInput v-model:value="form.providers[p].model" placeholder="model-id" />
            </NFormItem>
            <NFormItem :label="t('aiSearch.timeout')">
              <NInputNumber v-model:value="form.providers[p].timeout" :min="1000" :step="1000" style="width: 200px;" />
              <span class="ml-2 text-xs text-zinc-400">ms</span>
            </NFormItem>
            <NFormItem :label="t('aiSearch.temperature')">
              <NInputNumber v-model:value="form.providers[p].temperature" :min="0" :max="2" :step="0.1" style="width: 200px;" />
              <span class="ml-2 text-xs text-zinc-400">{{ t('aiSearch.temperatureHint') }}</span>
            </NFormItem>
            <NFormItem :label="t('aiSearch.maxTokens')">
              <NInputNumber v-model:value="form.providers[p].maxTokens" :min="0" :step="100" style="width: 200px;" />
              <span class="ml-2 text-xs text-zinc-400">{{ t('aiSearch.maxTokensHint') }}</span>
            </NFormItem>
            <NFormItem label="思考模式 (thinking)">
              <NSelect
                v-model:value="form.providers[p].thinking" :options="thinkingOptions"
                style="max-width: 200px;"
              />
              <span class="ml-2 text-xs text-zinc-400">推理模型生效（低/中/高）</span>
            </NFormItem>

            <div class="flex items-center gap-2">
              <NButton size="small" @click="handleListModels(p)">
                {{ t('aiSearch.listModels') }}
              </NButton>
              <NButton
                v-if="p === 'nvidia'" size="small" type="primary" secondary
                :loading="autoBestLoading[p]" @click="handleAutoBest(p)"
              >
                ⚡ 自动检测最优模型
              </NButton>
              <div v-if="modelLists[p] && modelLists[p].length" class="flex flex-wrap gap-1">
                <NTag v-for="m in modelLists[p]" :key="m.id" size="small" type="success" round>
                  {{ m.id }}
                </NTag>
              </div>
            </div>
            <div v-if="autoBestTested[p]?.length" class="mt-2 flex flex-wrap gap-1">
              <NTag
                v-for="r in autoBestTested[p]" :key="r.model" size="small" round
                :type="r.success ? (r.model === form.providers[p].model ? 'success' : 'info') : 'error'"
                :title="r.error || ''"
              >
                {{ r.model.split('/').pop() }} · {{ r.success ? `${r.latencyMs}ms` : '失败' }}
              </NTag>
            </div>
          </NCard>

          <NDivider />
          <div class="flex items-center gap-3">
            <NButton :loading="testing" @click="handleTest">
              {{ t('aiSearch.test') }}
            </NButton>
            <NButton type="primary" :loading="saving" @click="handleSave">
              {{ t('aiSearch.save') }}
            </NButton>
          </div>

          <div v-if="testResults.length" class="mt-3">
            <div
              v-for="(r, i) in testResults" :key="i"
              class="flex items-center justify-between rounded-lg bg-zinc-100 dark:bg-zinc-800 px-3 py-2 mb-1 text-sm"
            >
              <span>{{ r.model }}</span>
              <NTag :type="r.success ? 'success' : 'error'" size="small" round>
                {{ r.success ? `${r.latencyMs}ms` : (r.error || t('aiSearch.fail')) }}
              </NTag>
            </div>
          </div>
        </NForm>
      </NSpin>
    </div>
  </template>

  <NModal
    v-else
    :show="visible" preset="card" style="max-width: 760px; max-height: 86vh; overflow: auto;"
    :title="t('aiSearch.title')" :bordered="false" size="medium" role="dialog" aria-modal="true"
    @update:show="(v: boolean) => emit('update:visible', v)"
  >
    <NSpin :show="loading">
      <NForm label-placement="top">
        <NFormItem :label="t('aiSearch.enabled')">
          <NSwitch v-model:value="form.enabled" />
          <span class="ml-2 text-xs text-zinc-400">{{ t('aiSearch.enabledHint') }}</span>
        </NFormItem>

        <NFormItem :label="t('aiSearch.defaultProvider')">
          <NSelect
            v-model:value="form.defaultProvider" :options="defaultProviderOptions"
            style="max-width: 280px;" :disabled="!hasAnyKey"
          />
        </NFormItem>

        <NFormItem label="备用服务商（主用失败自动切换）">
          <NSelect
            v-model:value="form.backupProvider" :options="backupProviderOptions"
            style="max-width: 280px;"
          />
          <span class="ml-2 text-xs text-zinc-400">主用不可用时自动尝试备用</span>
        </NFormItem>

        <NDivider />

        <NCard
          v-for="p in PROVIDER_LIST" :key="p" size="small" class="mb-3"
          :title="p === 'deepseek' ? 'DeepSeek' : p === 'nvidia' ? 'NVIDIA' : '自定义(OpenAI兼容)'"
        >
          <template #header-extra>
            <NSwitch v-model:value="form.providers[p].enabled" size="small" />
          </template>
          <NFormItem :label="t('aiSearch.baseUrl')">
            <NInput v-model:value="form.providers[p].baseUrl" placeholder="https://..." />
          </NFormItem>
          <NFormItem :label="t('aiSearch.apiKey')">
            <NInput
              v-model:value="form.providers[p].apiKey" type="password" show-password-on="click"
              :placeholder="originalKeys[p] ? t('aiSearch.keepKeyHint') : t('aiSearch.apiKeyPlaceholder')"
            />
          </NFormItem>
          <NFormItem :label="t('aiSearch.model')">
            <NInput v-model:value="form.providers[p].model" placeholder="model-id" />
          </NFormItem>
          <NFormItem :label="t('aiSearch.timeout')">
            <NInputNumber v-model:value="form.providers[p].timeout" :min="1000" :step="1000" style="width: 200px;" />
            <span class="ml-2 text-xs text-zinc-400">ms</span>
          </NFormItem>
          <NFormItem label="思考模式 (thinking)">
            <NSelect
              v-model:value="form.providers[p].thinking" :options="thinkingOptions"
              style="max-width: 200px;"
            />
            <span class="ml-2 text-xs text-zinc-400">推理模型生效（低/中/高）</span>
          </NFormItem>

          <div class="flex items-center gap-2">
            <NButton size="small" @click="handleListModels(p)">
              {{ t('aiSearch.listModels') }}
            </NButton>
            <NButton
              v-if="p === 'nvidia'" size="small" type="primary" secondary
              :loading="autoBestLoading[p]" @click="handleAutoBest(p)"
            >
              ⚡ 自动检测最优模型
            </NButton>
            <div v-if="modelLists[p] && modelLists[p].length" class="flex flex-wrap gap-1">
              <NTag v-for="m in modelLists[p]" :key="m.id" size="small" type="success" round>
                {{ m.id }}
              </NTag>
            </div>
          </div>
          <div v-if="autoBestTested[p]?.length" class="mt-2 flex flex-wrap gap-1">
            <NTag
              v-for="r in autoBestTested[p]" :key="r.model" size="small" round
              :type="r.success ? (r.model === form.providers[p].model ? 'success' : 'info') : 'error'"
              :title="r.error || ''"
            >
              {{ r.model.split('/').pop() }} · {{ r.success ? `${r.latencyMs}ms` : '失败' }}
            </NTag>
          </div>
        </NCard>

        <NDivider />
        <div class="flex items-center gap-3">
          <NButton :loading="testing" @click="handleTest">
            {{ t('aiSearch.test') }}
          </NButton>
          <NButton type="primary" :loading="saving" @click="handleSave">
            {{ t('aiSearch.save') }}
          </NButton>
        </div>

        <div v-if="testResults.length" class="mt-3">
          <div
            v-for="(r, i) in testResults" :key="i"
            class="flex items-center justify-between rounded-lg bg-zinc-100 dark:bg-zinc-800 px-3 py-2 mb-1 text-sm"
          >
            <span>{{ r.model }}</span>
            <NTag :type="r.success ? 'success' : 'error'" size="small" round>
              {{ r.success ? `${r.latencyMs}ms` : (r.error || t('aiSearch.fail')) }}
            </NTag>
          </div>
        </div>
      </NForm>
    </NSpin>
  </NModal>
</template>
