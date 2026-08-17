<script setup lang="ts">
import { NButton, NCard, NCheckbox, NForm, NFormItem, NGradientText, NInput, NSelect, useMessage } from 'naive-ui'
import { computed, ref } from 'vue'
import { login } from '@/api'
import { otpBind } from '@/api/otp'
import { useAppStore, useAuthStore } from '@/store'
import { SvgIcon } from '@/components/common'
import { router } from '@/router'
import { t } from '@/locales'
import { languageOptions } from '@/utils/defaultData'
import type { Language } from '@/store/modules/app/helper'
import QRCode from 'qrcode'

const authStore = useAuthStore()
const appStore = useAppStore()
const ms = useMessage()
const loading = ref(false)
const languageValue = ref<Language>(appStore.language)

// 登录状态机：password(输密码) | otp(输动态码) | bind(首次绑定扫码)
type LoginMode = 'password' | 'otp' | 'bind'
const mode = ref<LoginMode>('password')

// 持久设备指纹（写入 localStorage，用于「信任此设备」）
function getDeviceId(): string {
  let id = localStorage.getItem('sp_device_id')
  if (!id) {
    id = 'dev_' + Math.random().toString(36).slice(2) + Date.now().toString(36)
    localStorage.setItem('sp_device_id', id)
  }
  return id
}

const form = ref<Login.LoginReqest>({
  username: '',
  password: '',
  otp: '',
  deviceId: getDeviceId(),
  trustDevice: false,
})

// 绑定流程用到的临时数据
const bindToken = ref('')
const otpQrDataUrl = ref('')
const otpAuth = ref('')

// 绑定二维码
async function renderOtpQr(uri: string) {
  try {
    otpQrDataUrl.value = await QRCode.toDataURL(uri, { width: 200, margin: 1 })
  }
  catch {
    otpQrDataUrl.value = ''
  }
}

const loginPost = async () => {
  loading.value = true
  try {
    const res = await login<Login.LoginResponse>(form.value)
    if (res.code === 0 && res.data.token) {
      // 正常登录成功（已开启 OTP 且校验通过 / 受信任设备 / 首次绑定后）
      finishLogin(res.data)
    }
    else if (res.code === 0 && res.data.needBind) {
      // 首次登录：引导绑定 OTP
      mode.value = 'bind'
      bindToken.value = res.data.bindToken || ''
      otpAuth.value = res.data.otpAuth || ''
      await renderOtpQr(res.data.otpAuth || '')
    }
    else if (res.code === 1008) {
      // 已绑定 OTP，需要输入动态码
      mode.value = 'otp'
    }
    else {
      ms.error(res.msg || t('login.loginFail'))
    }
  }
  catch (error: any) {
    ms.error(error?.msg || t('login.loginFail'))
  }
  finally {
    loading.value = false
  }
}

// 在 otp 模式下提交动态码（重新登录）
const otpPost = async () => {
  loading.value = true
  try {
    const res = await login<Login.LoginResponse>(form.value)
    if (res.code === 0 && res.data.token) {
      finishLogin(res.data)
    }
    else if (res.code === 1009) {
      ms.error('动态验证码错误，请重新输入')
      form.value.otp = ''
    }
    else {
      ms.error(res.msg || '验证失败')
    }
  }
  catch (error: any) {
    ms.error(error?.msg || '验证失败')
  }
  finally {
    loading.value = false
  }
}

// 在 bind 模式下提交（校验动态码并开启 OTP）
const bindPost = async () => {
  if (!form.value.otp) {
    ms.warning('请先输入验证器中的 6 位动态码')
    return
  }
  loading.value = true
  try {
    const res = await otpBind<Login.LoginResponse>(bindToken.value, form.value.otp, form.value.deviceId || getDeviceId())
    if (res.code === 0 && res.data.token) {
      finishLogin(res.data)
    }
    else if (res.code === 1009) {
      ms.error('动态验证码错误，请重试')
      form.value.otp = ''
    }
    else {
      ms.error(res.msg || '绑定失败')
    }
  }
  catch (error: any) {
    ms.error(error?.msg || '绑定失败')
  }
  finally {
    loading.value = false
  }
}

function finishLogin(data: Login.LoginResponse) {
  authStore.setToken(data.token)
  authStore.setUserInfo(data)
  setTimeout(() => {
    ms.success(`Hi ${data.name},${t('login.welcomeMessage')}`)
    loading.value = false
    router.push({ path: '/' })
  }, 500)
}

function handleSubmit() {
  if (mode.value === 'otp')
    otpPost()
  else if (mode.value === 'bind')
    bindPost()
  else
    loginPost()
}

function backToPassword() {
  mode.value = 'password'
  form.value.otp = ''
}

const showBack = computed(() => mode.value !== 'password')

function handleChangeLanuage(value: Language) {
  languageValue.value = value
  appStore.setLanguage(value)
}
</script>

<template>
  <div class="login-container">
    <NCard class="login-card" style="border-radius: 20px;">
      <div class="mb-5 flex items-center justify-end">
        <div class="mr-2">
          <SvgIcon icon="ion-language" style="width: 20;height: 20;" />
        </div>
        <div class="min-w-[100px]">
          <NSelect v-model:value="languageValue" size="small" :options="languageOptions" @update-value="handleChangeLanuage" />
        </div>
      </div>

      <div class="login-title  ">
        <NGradientText :size="30" type="success" class="!font-bold">
          {{ $t('common.appName') }}
        </NGradientText>
      </div>

      <!-- 密码模式 -->
      <template v-if="mode === 'password'">
        <NForm :model="form" label-width="100px" @keydown.enter="handleSubmit">
          <NFormItem>
            <NInput v-model:value="form.username" :placeholder="$t('login.usernamePlaceholder')">
              <template #prefix>
                <SvgIcon icon="ph:user-bold" />
              </template>
            </NInput>
          </NFormItem>
          <NFormItem>
            <NInput v-model:value="form.password" type="password" :placeholder="$t('login.passwordPlaceholder')">
              <template #prefix>
                <SvgIcon icon="mdi:password-outline" />
              </template>
            </NInput>
          </NFormItem>
          <NFormItem style="margin-top: 10px">
            <NButton type="primary" block :loading="loading" @click="handleSubmit">
              {{ $t('login.loginButton') }}
            </NButton>
          </NFormItem>
        </NForm>
      </template>

      <!-- 动态码模式 -->
      <template v-else-if="mode === 'otp'">
        <NForm :model="form" @keydown.enter="handleSubmit">
          <div class="mb-3 text-center text-sm text-slate-500">
            账号已开启双重验证，请输入验证器中的 6 位动态码
          </div>
          <NFormItem>
            <NInput v-model:value="form.otp" placeholder="请输入 6 位动态验证码" maxlength="6" />
          </NFormItem>
          <NFormItem>
            <NCheckbox v-model:checked="form.trustDevice">信任此设备 30 天</NCheckbox>
          </NFormItem>
          <NFormItem>
            <NButton type="primary" block :loading="loading" @click="handleSubmit">
              验证并登录
            </NButton>
          </NFormItem>
        </NForm>
      </template>

      <!-- 首次绑定模式 -->
      <template v-else-if="mode === 'bind'">
        <div class="mb-3 text-center text-sm text-slate-500">
          首次登录请绑定验证器（Google/Microsoft Authenticator）
        </div>
        <div class="flex flex-col items-center">
          <img v-if="otpQrDataUrl" :src="otpQrDataUrl" alt="otp qr" class="mb-2 rounded border bg-white p-1" />
          <div class="mb-3 break-all px-2 text-center text-xs text-slate-400">
            {{ otpAuth }}
          </div>
          <NInput v-model:value="form.otp" placeholder="输入验证器中的 6 位动态码" maxlength="6" class="w-full" />
          <NButton type="primary" block class="mt-3" :loading="loading" @click="handleSubmit">
            绑定并登录
          </NButton>
        </div>
      </template>

      <div v-if="showBack" class="mt-2 flex justify-center">
        <NButton text type="primary" size="small" @click="backToPassword">
          返回密码登录
        </NButton>
      </div>

      <div class="mt-4 flex justify-center text-slate-300">
        Powered By <a href="https://github.com/ayongsheng777-rgb/sun-panel" target="_blank" class="ml-[5px] text-slate-500">Sun-Panel</a>
      </div>
    </NCard>
  </div>
</template>

  <style>
    .login-container {
        padding: 20px;
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100vh;
        background-color: #f2f6ff;
    }

    /* 夜间模式 */
    .dark .login-container{
      background-color: rgb(43, 43, 43);
    }

    @media (min-width: 600px) {
        .login-card {
            width: auto;
            margin: 0px 10px;
        }
        .login-button {
            width: 100%;
        }
    }

    .login-card {
        margin: 20px;
        min-width:400px;
    }

  .login-title{
    text-align: center;
    margin: 20px;
  }
  </style>
