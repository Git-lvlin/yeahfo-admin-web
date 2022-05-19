import request from '@/utils/request'
import moment from 'moment'

// 供应商数据
export const supplierData = async (params = {}, options = {}) => {
  const { time, current=1, pageSize=10, ...rest } = params
  const res = await request('/auth/java-admin/report/config/supplierData', {
    method: 'POST',
    data: {
      page: current,
      size: pageSize,
      startTime: time?.[0],
      endTime: time?.[1],
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

// 供应商-商品数据
export const supplierGoodsData = async (params = {}, options = {}) => {
  const { current=1, pageSize=10, ...rest } = params
  const res = await request('/auth/java-admin/report/config/supplierGoodsData', {
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

// 供应商-秒约销售数据
export const supplierSecondSaleData = async (params = {}, options = {}) => {
  const { current=1, pageSize=10, ...rest } = params
  const res = await request('/auth/java-admin/report/config/supplierSecondSaleData', {
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

// 供应商-出售中商品
export const supplierSaleGoodsData = async (params = {}, options = {}) => {
  const { current=1, pageSize=10, ...rest } = params
  const res = await request('/auth/java-admin/report/config/supplierSaleGoodsData', {
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

// 供应商-集约销售数据
export const supplierWholesaleData = async (params = {}, options = {}) => {
  const { current=1, pageSize=10, ...rest } = params
  const res = await request('/auth/java-admin/report/config/supplierWholesaleData', {
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

// 供应商-销售排名
export const supplierSalesRank = async (params = {}, options = {}) => {
  const res = await request('/auth/java-admin/report/config/supplierSalesRank', {
    method: 'POST',
    data: params,
    ...options
  })
  return {
    data: res.data.records,
    success: res.success
  }
}

// 供应商-数据总览
export const supplierDataOverview = async (params = {}, options = {}) => {
  const { time, ...rest } = params
  const res = await request('/auth/java-admin/report/config/supplierDataOverview', {
    method: 'POST',
    data: params,
    ...options
  })
  return {
    data: res.data,
    success: res.success
  }
}

// 供应商-开发数据
export const supplierDevelopmentData = async (params = {}, options = {}) => {
  const { current=1, pageSize=10, time, ...rest } = params
  const res = await request('/auth/java-admin/report/config/supplierDevelopmentData', {
    method: 'POST',
    data: {
      startTime: time?.[0] && moment(time?.[0]).format('YYYY-MM-01'),
      endTime: time?.[1] && moment(time?.[1]).format('YYYY-MM-01'),
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
