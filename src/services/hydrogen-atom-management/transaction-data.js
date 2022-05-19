import request from '@/utils/request'

// 氢原子统计总览
export const findMemberDeviceTotal = async (params = {}, options = {}) => {
  const res = await request('/auth/java-admin/iot/memberDevice/findMemberDeviceTotal', {
    method: 'POST',
    data: params,
    ...options
  })
  return {
    data: res.data,
    success: res.success,
    total: res.data.total
  }
}

// 氢原子统计列表
export const findMemberDevicePage = async (params = {}, options = {}) => {
  const { current = 1, pageSize = 10, ...rest } = params
  const res = await request('/auth/java-admin/iot/memberDevice/findMemberDevicePage', {
    method: 'POST',
    data: {
      page: current,
      size: pageSize,
      ...rest
    },
    ...options
  })
  return {
    data: res.data.records,
    success: res.success,
    total: res.data.total
  }
}

// 用户设备列表
export const devices = async (params = {}, options = {}) => {
  const { current = 1, pageSize = 10, ...rest } = params
  const res = await request('/auth/java-admin/iot/member/devices', {
    method: 'POST',
    data: {
      page: current,
      size: pageSize,
      ...rest
    },
    ...options
  })
  const statistics = await request('/auth/java-admin/iot/member/device-statistics', {
    method: 'POST',
    data: params,
    ...options
  })
  return {
    data: {
      ...res.data,
      ...statistics.data
    },
    success: res.success,
    total: res.data.total
  }
}

// 租赁订单明细
export const findOrderRecordList = async (params = {}, options = {}) => {
  const { current = 1, pageSize = 10, flag, ...rest } = params
  const res = await request('/auth/java-admin/iot/leaseOrder/findOrderRecordList', {
    method: 'POST',
    data: {
      page: current,
      size: pageSize,
      ...rest
    },
    ...options
  })
  const findStatistics = flag && await request('/auth/java-admin/iot/leaseOrder/findStatistics', {
    method: 'POST',
    data: params,
    ...options
  })
  return {
    data:{
      ...res.data,
      ...findStatistics?.data
    },
    success: res.success,
    total: res.data.total
  }
}

// 设备启动明细
export const consumerOrder = async (params = {}, options = {}) => {
  const { current = 1, pageSize = 10, ...rest } = params
  const res = await request('/auth/java-admin/iot/consumerOrder/page', {
    method: 'POST',
    data: {
      page: current,
      size: pageSize,
      ...rest
    },
    ...options
  })
  return {
    data: res.data,
    success: res.success,
    total: res.data.total
  }
}

// 分享明细
export const queryMyCommissionDetail = async (params = {}, options = {}) => {
  const res = await request('/auth/java-admin/iot/deviceCommission/queryMyCommissionDetail', {
    method: 'POST',
    data: params,
    ...options
  })
  return {
    data: {
      ...res.data,
      ...res.data.list
    },
    success: res.success,
    total: res.data.list.total
  }
}

// 操作日志
export const findOptionLog = async (params = {}, options = {}) => {
  const res = await request('/auth/java-admin/device/findOpLog', {
    method: 'POST',
    data: params,
    ...options
  })
  
  return {
    data: res.data,
    success: res.success
  }
}