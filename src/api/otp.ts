import { post } from '@/utils/request'

// OTP 绑定：首次登录用 bindToken 校验动态码，开启后下发正式会话
export function otpBind<T>(bindToken: string, otp: string, deviceId: string) {
  return post<T>({
    url: '/login/otp-bind',
    data: { bindToken, otp, deviceId },
  })
}

// 当前用户 OTP 是否已开启
export function otpStatus<T>() {
  return post<T>({
    url: '/user/otp-status',
  })
}

// 已登录用户发起 OTP 绑定，返回 otpauth URI
export function otpSetup<T>() {
  return post<T>({
    url: '/user/otp-setup',
  })
}

// 确认 OTP 绑定（输入正确动态码后开启）
export function otpConfirm<T>(otp: string) {
  return post<T>({
    url: '/user/otp-confirm',
    data: { otp },
  })
}

// 关闭 OTP
export function otpDisable<T>() {
  return post<T>({
    url: '/user/otp-disable',
  })
}

// 受信任设备列表
export function deviceList<T>() {
  return post<T>({
    url: '/user/device-list',
  })
}

// 撤销某受信任设备
export function deviceDelete<T>(id: number) {
  return post<T>({
    url: `/user/device-delete/${id}`,
  })
}
