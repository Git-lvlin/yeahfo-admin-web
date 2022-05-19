import request from '@/utils/request'
import { amountTransform } from '@/utils/utils'

// 提现配置详情
export const withdrawConfigDetail = async (params, options = {}) => {
  const res = await request('/auth/java-admin/financial/config/withdrawConfigDetail', {
    method: 'POST',
    data: params,
    ...options
  })

  return {
    data: res?.data,
    success: res?.success
  }
}

// 提现配置详情
export const withdrawConfigUpdate = async (params, options = {}) => {
  const {
    withdrawBusinessFaxScale,
    withdrawBusinessFeeFixed,
    withdrawBusinessFeeScale,
    withdrawBusinessMax,
    withdrawBusinessMin,
    withdrawPersonFaxScale,
    withdrawPersonFeeFixed,
    withdrawPersonFeeScale,
    withdrawPersonMax,
    withdrawPersonMin
  } = params
  const res = await request('/auth/java-admin/financial/config/withdrawConfigUpdate', {
    method: 'POST',
    data: {
      ...params,
      withdrawBusinessFaxScale: amountTransform(withdrawBusinessFaxScale, '/'),
      withdrawBusinessFeeFixed: amountTransform(withdrawBusinessFeeFixed, '*'),
      withdrawBusinessFeeScale: amountTransform(withdrawBusinessFeeScale, '/'),
      withdrawBusinessMax: amountTransform(withdrawBusinessMax, '*'),
      withdrawBusinessMin: amountTransform(withdrawBusinessMin, '*'),
      withdrawPersonFaxScale: amountTransform(withdrawPersonFaxScale, '/'),
      withdrawPersonFeeFixed: amountTransform(withdrawPersonFeeFixed, '*'),
      withdrawPersonFeeScale: amountTransform(withdrawPersonFeeScale, '/'),
      withdrawPersonMax: amountTransform(withdrawPersonMax, '*'),
      withdrawPersonMin: amountTransform(withdrawPersonMin, '*')
    },
    ...options
  })

  return {
    data: res?.data,
    success: res?.success
  }
}
