import request from '@/utils/request'
// 提现审核管理
export const withdrawPage = async (params, options = {}) => {
  const { current, pageSize, createTime, bindTime, ...rest } = params
  const res = await request('/auth/java-admin/financial/withdraw/page', {
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
    data: res?.data.records,
    success: res?.success,
    total: res.data.total
  }
}

// 提现详情
export const withdrawPageDetail = async (params, options = {}) => {
  const res = await request('/auth/java-admin/financial/withdraw/detail', {
    method: 'POST',
    data: params,
    ...options
  })

  return {
    data: res?.data,
    success: res?.success
  }
}

// 提现审核
export const audit = async (params= {}, options= {}) => {
  const res = await request('/auth/java-admin/financial/withdraw/audit', {
    method: 'POST',
    data: params,
    ...options
  })

  return {
    data: res?.data,
    success: res?.success
  }
}
// 提现执行
export const payment = async (params= {}, options= {}) => {
  const res = await request('/auth/java-admin/financial/withdraw/payment', {
    method: 'POST',
    data: params,
    ...options
  })

  return {
    data: res?.data,
    success: res?.success
  }
}

// 订单支付明细管理
export const orderPage = async (params, options = {}) => {
  const { current, pageSize, payTime, ...rest } = params
  const res = await request('/auth/java-admin/financial/trans/orderPage', {
    method: 'POST',
    data: {
      page: current,
      size: pageSize,
      begin: payTime&& payTime[0],
      end: payTime&& payTime[1],
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
// 订单详情
export const orderPageDetail = async (params, options = {}) => {
  const res = await request('/auth/java-admin/financial/trans/orderDetail', {
    method: 'POST',
    data: params,
    ...options
  })

  return {
    data: res?.data,
    success: res?.success
  }
}

// 提成明细管理
export const commissionPage = async (params, options = {}) => {
  const { current, pageSize, createTime, ...rest } = params
  const res = await request('/auth/java-admin/financial/trans/commissionPage', {
    method: 'POST',
    data: {
      page: current,
      size: pageSize,
      begin: createTime && createTime[0],
      end: createTime && createTime[1],
      ...rest 
    },
    ...options
  })

  return {
    data: res?.data.records,
    success: res?.success,
    total: res.data.total
  }
}
// 提成详情
export const commissionDetail = async (params, options = {}) => {
  const res = await request('/auth/java-admin/financial/trans/commissionDetail', {
    method: 'POST',
    data: params,
    ...options
  })

  return {
    data: res?.data,
    success: res?.success
  }
}

// 佣金明细管理
export const platformCommissionPage = async (params, options = {}) => {
  const { current, pageSize, createTime, ...rest } = params
  const res = await request('/auth/java-admin/financial/trans/platformCommissionPage', {
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
    data: res?.data.records,
    success: res?.success,
    total: res?.data.total
  }
}
// 佣金详情
export const platformCommissionDetail = async (params, options = {}) => {
  const res = await request('/auth/java-admin/financial/trans/platformCommissionDetail', {
    method: 'POST',
    data: params,
    ...options
  })

  return {
    data: res?.data,
    success: res?.success
  }
}

// 货款明细管理
export const goodsAmountPage = async (params, options = {}) => {
  const { current, pageSize, createTime, ...rest } = params
  const res = await request('/auth/java-admin/financial/trans/goodsAmountPage', {
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
    data: res?.data.records,
    success: res?.success,
    total: res?.data.total
  }
}
// 货款详情
export const goodsAmountDetail = async (params, options = {}) => {
  const res = await request('/auth/java-admin/financial/trans/goodsAmountDetail', {
    method: 'POST',
    data: params,
    ...options
  })

  return {
    data: res?.data,
    success: res?.success
  }
}

// 售后订单明细
export const refundPage = async (params, options = {}) => {
  const { current, pageSize, ...rest } = params
  const res = await request('/auth/java-admin/financial/trans/refundPage', {
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
    total: res.data.total
  }
}
// 售后订单详情
export const refundDetail = async (params, options = {}) => {
  const res = await request('/auth/java-admin/financial/trans/refundDetail', {
    method: 'POST',
    data: params,
    ...options
  })

  return {
    data: res?.data,
    success: res?.success
  }
}

// 运营商收益明细管理详情
export const operationCommissionDetail = async (params, options = {}) => {
  const res = await request('/auth/java-admin/financial/trans/operationCommissionDetail', {
    method: 'POST',
    data: params,
    ...options
  })

  return {
    data: res?.data,
    success: res?.success
  }
}