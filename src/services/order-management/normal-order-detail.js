import request from '@/utils/request';

export const findAdminOrderDetail = async (params = {}, options = {}) => {
  return request('/auth/java-admin/order/findAdminOrderDetail', {
    method: 'POST',
    data: {
      ...params,
    },
    ...options
  });
}

export const findAdminOrderDetail2 = async (params = {}, options = {}) => {
  return request('/auth/java-admin/order/findAdminOrderDetail2', {
    method: 'POST',
    data: {
      ...params,
    },
    ...options
  });
}

export const deliverGoods = async (params = {}, options = {}) => {
  return request('/auth/java-admin/order/deliverGoods', {
    method: 'POST',
    data: {
      ...params,
    },
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

export const expressInfoYlbb = async (params = {}, options = {}) => {
  return request('/auth/express/express/expressInfoYlbb', {
    method: 'POST',
    data: params,
    ...options
  });
}