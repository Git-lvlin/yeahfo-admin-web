import request from '@/utils/request';

export const getOrderDetail = async (params = {}, options = {}) => {
  return request('/auth/java-admin/order/ops/getOrderDetail', {
    method: 'POST',
    data: params,
    ...options
  });
}

export const modifyShip = async (params = {}, options = {}) => {
  return request('/auth/order/collectiveOrder/modifyShip', {
    method: 'POST',
    data: params,
    ...options
  });
}

export const expressInfo = async (params = {}, options = {}) => {
  return request('/auth/express/express/expressInfo', {
    method: 'POST',
    data: params,
    ...options
  });
}