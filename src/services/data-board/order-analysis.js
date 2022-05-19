import request from '@/utils/request'
import moment from 'moment'

// 订单分析
export const orderAnalysis = async (params = {}, options = {}) => {
  const res = await request('/auth/java-admin/report/config/orderTrendAnalysis', {
    method: 'POST',
    data: params,
    ...options
  })
  return {
    data: res.data,
    success: res.success
  }
}

// 订单统计
export const orderStatistical = async (params = {}, options = {}) => {
  const res = await request('/auth/java-admin/report/config/orderStatistical', {
    method: 'POST',
    data: params,
    ...options
  })
  return {
    data: res.data,
    success: res.success
  }
}

// 地区订单分析
export const areaOrderAnalysis = async (params = {}, options = {}) => {
  const res = await request('/auth/java-admin/report/config/areaOrderAnalysis', {
    method: 'POST',
    data: params,
    ...options
  })
  return {
    data: res.data,
    success: res.success
  }
}

// 集约订单明细
export const wholeSaleOrderDetail = async (params = {}, options = {}) => {
  const { current, pageSize,dateTimeRange, ...rest } = params;
  const res = await request('/auth/java-admin/report/config/wholeSaleOrderDetail', {
    method: 'POST',
    data:  {
      page: current,
      size: pageSize,
      startTime:dateTimeRange&&moment(dateTimeRange[0]).format('YYYY-MM-DD HH:mm:ss'),
      endTime:dateTimeRange&&moment(dateTimeRange[1]).format('YYYY-MM-DD HH:mm:ss'),
      ...rest
    },
    ...options
  })
  return {
    data: res.data.records,
    total:res.data.total,
    success: res.success
  }
}


// 集约订单明细-汇总
export const wholeSaleOrderDetailSummary = async (params = {}, options = {}) => {
  const { current, pageSize,dateTimeRange, ...rest } = params;
  const res = await request('/auth/java-admin/report/config/wholeSaleOrderDetailSummary', {
    method: 'POST',
    data:  {
      page: current,
      size: pageSize,
      startTime:dateTimeRange&&moment(dateTimeRange[0]).format('YYYY-MM-DD HH:mm:ss'),
      endTime:dateTimeRange&&moment(dateTimeRange[1]).format('YYYY-MM-DD HH:mm:ss'),
      ...rest
    },
    ...options
  })
  return {
    data: res.data,
    code: res.code,
    success: res.success
  }
}



// 集约订单明细-子公司名单
export const wholeSaleOrderSubCompany = async (params = {}, options = {}) => {
  const { ...rest } = params;
  const res = await request('/auth/java-admin/report/config/wholeSaleOrderSubCompany', {
    method: 'POST',
    data:  {
      ...rest
    },
    ...options
  })
  return {
    data: res.data,
    code: res.code,
    success: res.success
  }
}