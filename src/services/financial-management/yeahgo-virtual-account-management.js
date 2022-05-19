import request from '@/utils/request'

// 平台账户列表
export const platforms = async (params, options = {}) => {
  const res = await request('/auth/java-admin/financial/account/platforms', {
    method: 'POST',
    data: params,
    ...options
  })

  return {
    data: res?.data,
    success: res?.success
  }
}

// 账户明细
export const logPage = async (params, options = {}) => {
  const { current, pageSize, createTime, ...rest } = params
  const res = await request('/auth/java-admin/financial/account/logPage', {
    method: 'POST',
    data: {
      page: current,
      size: pageSize,
      begin: createTime&& createTime[0],
      end: createTime&& createTime[1],
      ...rest
    },
    ...options
  })

  return {
    data: res.data?.records,
    success: res?.success,
    total: res?.data.total
  }
}

// 平台申请提现
export const platformWithdraw = async (params, options = {}) => {
  const res = await request('/auth/java-admin/financial/account/platformWithdraw', {
    method: 'POST',
    data: {
      ...params
    },
    ...options
  })

  return {
    data: res?.data,
    success: res?.success
  }
}

// 平台供应链申请提现
export const supplyChainWithdraw = async (params, options = {}) => {
  const res = await request('/auth/java-admin/financial/account/supplyChainWithdraw', {
    method: 'POST',
    data: {
      ...params
    },
    ...options
  })

  return {
    data: res?.data,
    success: res?.success
  }
}