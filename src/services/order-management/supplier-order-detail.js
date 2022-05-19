import request from '@/utils/request';

export const getSupplierOrderDetail = async (params = {}, options = {}) => {
  return request('/auth/wholesale/SupplierOrder/getSupplierOrderDetail', {
    method: 'POST',
    data: params,
    ...options
  });
}

export const getPurchaseOrderDetail = async (params = {}, options = {}) => {
  return request('/auth/wholesale/SupplierOrder/getPurchaseOrderDetail', {
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