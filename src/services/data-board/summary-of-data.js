import request from '@/utils/request'

// 数据概况-右边汇总
export const briefCount = async (params = {}, options = {}) => {
  const res = await request('/auth/java-admin/report/config/briefCount', {
    method: 'POST',
    data: params,
    ...options
  })
  return {
    data: res.data,
    success: res.success
  }
}

// 数据概况-左边折线
export const briefCountDetail = async (params = {}, options = {}) => {
  const res = await request('/auth/java-admin/report/config/briefCountDetail', {
    method: 'POST',
    data: params,
    ...options
  })
  return {
    data: res.data,
    success: res.success
  }
}

// 核心指标
export const coreData = async (params = {}, options = {}) => {
  const res = await request('/auth/java-admin/report/config/coreData', {
    method: 'POST',
    data: params,
    ...options
  })
  return {
    data: res.data,
    success: res.success
  }
}

// 总数据
export const sumData = async (params = {}, options = {}) => {
  const res = await request('/auth/java-admin/report/config/sumData', {
    method: 'POST',
    data: params,
    ...options
  })
  return {
    data: res.data,
    success: res.success
  }
}

// 数据总览
export const operationDailySummaryData = async (params = {}, options = {}) => {
  const res = await request('/auth/java-admin/report/config/operationDailySummaryData', {
    method: 'POST',
    data: params,
    ...options
  })
  return {
    data: res.data,
    success: res.success
  }
}

// 每日数据概况
export const dailyDataOverview = async (params = {}, options = {}) => {
  const { pageSize=10, current=1, dateTime, ...rest } = params
  const res = await request('/auth/java-admin/report/config/dailyDataOverview', {
    method: 'POST',
    data: {
      page: current,
      size: pageSize,
      startTime: dateTime?.[0],
      endTime: dateTime?.[1],
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

// 每日数据总览
export const sumDailyDataOverview = async (params = {}, options = {}) => {
  const { date, ...rest } = params
  return await request('/auth/java-admin/report/config/sumDailyDataOverview', {
    method: 'POST',
    data: {
      startTime: date?.[0].format("YYYY-MM-DD"),
      endTime: date?.[1].format("YYYY-MM-DD"),
      ...rest
    },
    ...options
  })
}