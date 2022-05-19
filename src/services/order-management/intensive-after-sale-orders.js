import request from '@/utils/request';

// 售后订单
export const getRefundStoreOrderList = async (params = {}, options = {}) => {
  const { current, pageSize, applyTime, ...rest } = params
  const res = await request('/auth/wholesale/orderRefund/getRefundStoreOrderList', {
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
export const getRefundStoreOrderDetail = async (params = {}, options = {}) => {
  const res = await request('/auth/wholesale/orderRefund/getRefundStoreOrderDetail', {
    method: 'POST',
    data: {
      ...params
    },
    ...options
  })
  return {
     data: res.data,
     success: true,
     code: res.code
  }
}

