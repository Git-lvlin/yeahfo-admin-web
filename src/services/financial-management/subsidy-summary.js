import request from '@/utils/request'

// 补贴汇总
export const allowance = async (params, options= {}) => {
  const { current=1, pageSize=10, ...rest } = params
  const res = await request('/auth/java-admin/financial/allowance/page', {
    method: 'POST',
    data: {
      page: current,
      size: pageSize,
      ...rest
    },
    ...options
  })

  return {
    data: res?.data.records,
    success: res?.success,
    total: res?.data.total
  }
}

// 补贴明细分页
export const detail = async (params, options= {}) => {
  const { current=1, pageSize=10, ...rest } = params
  const res = await request('/auth/java-admin/financial/allowance/detail/page', {
    method: 'POST',
    data: {
      page: current,
      size: pageSize,
      ...rest
    },
    ...options
  })

  return {
    data: res?.data.records,
    success: res?.success,
    total: res?.data.total
  }
}

// 优惠补贴详情
export const allowanceDetail = async (params, options= {}) => {
  const { current=1, pageSize=10, ...rest } = params
  const res = await request('/auth/java-admin/financial/allowance/detail', {
    method: 'POST',
    data: {
      page: current,
      size: pageSize,
      ...rest
    },
    ...options
  })

  return {
    data: res?.data,
    success: res?.success
  }
}

// 优惠补贴结算
export const settle = async (params, options= {}) => {
  const { current=1, pageSize=10, ...rest } = params
  const res = await request('/auth/java-admin/financial/allowance/settle', {
    method: 'POST',
    data: {
      page: current,
      size: pageSize,
      ...rest
    },
    ...options
  })

  return {
    data: res?.data,
    success: res?.success
  }
}