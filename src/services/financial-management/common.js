import request from '@/utils/request'

// 订单类型
export const orderTypes = async (params={}, options= {}) => {
  const res = await request('/auth/java-admin/financial/common/orderTypes', {
    method: 'POST',
    data: params,
    ...options
  })

  return {
    data: res.data
  }
}