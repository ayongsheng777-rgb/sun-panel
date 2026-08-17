<script setup lang="ts">
import { NButton, NCard, NList, NListItem, NModal, NPopconfirm, NSpace, NTag, NInput, useMessage } from 'naive-ui'
import { onMounted, ref } from 'vue'
import { deviceDelete, deviceList, otpConfirm, otpDisable, otpSetup } from '@/api/otp'
import QRCode from 'qrcode'

const props = defineProps<{ visible: boolean }>()
const emit = defineEmits<{ (e: 'update:visible', visible: boolean): void }>()

const ms = useMessage()

const enabled = ref(false)
const setupMode = ref(false)
const otpAuth = ref('')
const otpQr = ref('')
const otpCode = ref('')
const devices = ref<any[]>([])

async function loadStatus() {
  try {
    const res = await otpSetup<any>()
    if (res.code === 0) {
      enabled.value = res.data.enabled
      if (!res.data.enabled && res.data.otpAuth) {
        otpAuth.value = res.data.otpAuth
        otpQr.value = await QRCode.toDataURL(res.data.otpAuth, { width: 200, margin: 1 })
      }
    }
  }
  catch {}
}

async function loadDevices() {
  try {
    const res = await deviceList<any>()
    if (res.code === 0)
      devices.value = res.data || []
  }
  catch {}
}

async function startSetup() {
  setupMode.value = true
  await loadStatus()
}

async function confirmBind() {
  if (!otpCode.value) {
    ms.warning('请先输入验证器中的 6 位动态码')
    return
  }
  const res = await otpConfirm<any>(otpCode.value)
  if (res.code === 0) {
    ms.success('双重验证已开启')
    setupMode.value = false
    await loadStatus()
  }
  else {
    ms.error(res.msg || '绑定失败')
  }
}

async function disableOtp() {
  const res = await otpDisable<any>()
  if (res.code === 0) {
    ms.success('已关闭双重验证')
    enabled.value = false
    setupMode.value = false
    otpCode.value = ''
  }
  else {
    ms.error(res.msg || '操作失败')
  }
}

async function removeDevice(id: number) {
  const res = await deviceDelete<any>(id)
  if (res.code === 0) {
    ms.success('已撤销该设备')
    await loadDevices()
  }
  else {
    ms.error(res.msg || '操作失败')
  }
}

onMounted(() => {
  if (props.visible) {
    loadStatus()
    loadDevices()
  }
})
</script>

<template>
  <NModal
    :show="props.visible" preset="card" title="安全中心"
    style="max-width: 520px;" @update:show="(v: boolean) => emit('update:visible', v)"
  >
    <NCard title="双重验证 (OTP)" :bordered="false" size="small">
      <template v-if="!enabled && !setupMode">
        <p class="mb-2 text-sm text-slate-500">
          开启后，登录时需额外输入验证器（Google/Microsoft Authenticator）中的动态码，大幅提升账号安全。
        </p>
        <NButton type="primary" @click="startSetup">开启双重验证</NButton>
      </template>

      <template v-else-if="!enabled && setupMode">
        <p class="mb-2 text-sm text-slate-500">用验证器 App 扫描下方二维码，输入 6 位动态码完成绑定：</p>
        <div class="flex flex-col items-center">
          <img v-if="otpQr" :src="otpQr" alt="otp qr" class="mb-2 rounded border bg-white p-1" />
          <NInput v-model:value="otpCode" placeholder="输入 6 位动态码" maxlength="6" class="w-full" />
          <NSpace class="mt-3">
            <NButton type="primary" @click="confirmBind">确认开启</NButton>
            <NButton @click="setupMode = false">取消</NButton>
          </NSpace>
        </div>
      </template>

      <template v-else>
        <NSpace align="center">
          <NTag type="success">已开启</NTag>
          <NButton size="small" type="error" @click="disableOtp">关闭</NButton>
        </NSpace>
      </template>
    </NCard>

    <NCard title="受信任设备" :bordered="false" size="small" class="mt-3">
      <NList v-if="devices.length" bordered>
        <NListItem v-for="d in devices" :key="d.id">
          <div class="flex w-full items-center justify-between">
            <div class="text-sm">
              <div class="truncate" style="max-width: 300px;">{{ d.name }}</div>
              <div class="text-xs text-slate-400">IP: {{ d.ip }} · 到期: {{ d.trustedUntil }}</div>
            </div>
            <NPopconfirm @positive-click="removeDevice(d.id)">
              <template #trigger>
                <NButton size="small" type="error" quaternary>撤销</NButton>
              </template>
              确定撤销该受信任设备？
            </NPopconfirm>
          </div>
        </NListItem>
      </NList>
      <p v-else class="text-sm text-slate-400">暂无受信任设备</p>
    </NCard>
  </NModal>
</template>
