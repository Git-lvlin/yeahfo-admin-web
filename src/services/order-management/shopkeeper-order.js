import request from '@/utils/request';

export const orderList = async (params = {}, options = {}) => {
  return request('/auth/java-admin/order/ops/getOrderPage', {
    method: 'POST',
    data: {
      ...params
    },
    ...options
  });
}

export const orderShip = async (params = {}, options = {}) => {
  return request('/auth/order/collectiveOrder/orderShip', {
    method: 'POST',
    data: params,
    ...options
  });
}

