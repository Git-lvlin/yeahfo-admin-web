import request from '@/utils/request';

// 售后订单
export const refundOrder = async (params = {}, options = {}) => {
  const { current, pageSize, applyTime, ...rest } = params
  const res = await request('/auth/java-admin/orderReturn/page', {
    method: 'POST',
    data: {
      page: current,
      size: pageSize,
      beginTime: applyTime&& applyTime[0],
      endTime: applyTime&& applyTime[1],
      ...rest
    },
    ...options
  });
  return {
    data: res.data.records,
    success: true,
    total: res.data.total
  }
}
// 订单详情
export const refundOrderDetail = async (params = {}, options = {}) => {
  const { id } = params
  const res = await request('/auth/java-admin/orderReturn/detail', {
    method: 'POST',
    data: {
      id
    },
    ...options
  })
  return {
     data: res.data,
     success: true
  }
}

// 查询物流信息
export const expressInfo = async (params={}, options={}) => {
  const res = await request('/auth/express/express/expressInfo', {
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
// 订单协商记录
export const findReturnRecord = async (params={}, options={}) => {
  const res = await request('/auth/java-admin/orderReturn/findReturnRecord', {
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



// 缺货单信息
export const getRefundStoreOrderDetail = async (params = {}, options = {}) => {
  const { ...rest } = params
  const res = await request('/auth/wholesale/orderRefund/getRefundStoreOrderDetail', {
    method: 'POST',
    data: {
      ...rest
    },
    ...options
  })
  return {
     data: res.data,
     success: true,
     code: res.code
  }
}