import request from '@/utils/request'

// 运营中心采购订单总量
export const operationsCenterRank = async (params = {}, options = {}) => {
  const res = await request('/auth/java-admin/report/config/operationsCenterRank', {
    method: 'POST',
    data: params,
    ...options
  })
  return {
    data: res.data.records,
    success: res.success
  }
}

// 运营中心核心数据
export const operationsCenterData = async (params = {}, options = {}) => {
  const { current=1, pageSize=10, companyName, time, area, ...rest } = params
  const arr = area?.map(item => item.value)
  const res = await request('/auth/java-admin/report/config/operationsCenterData', {
    method: 'POST',
    data: {
      name: companyName,
      page: current,
      size: pageSize,
      startTime: time?.[0],
      endTime: time?.[1],
      province: arr?.[0],
      city: arr?.[1],
      area: arr?.[2],
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

// 运营中心数据总览
export const operationDataTotalView = async (params = {}, options = {}) => {
  const res = await request('/auth/java-admin/report/config/operationDataTotalView', {
    method: 'POST',
    data: params,
    ...options
  })
  return {
    data: res.data,
    success: res.success
  }
}
