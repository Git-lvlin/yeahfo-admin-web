import request from '@/utils/request';

export const getExpressList = (params, options = {}) => {
  return request('/auth/order/collectiveOrder/express', {
    method: 'POST',
    data: params,
    ...options
  });
}

export const categoryAll = (params = {}, options = {}) => {
  return request('/auth/goods/product/categoryAll', {
    method: 'GET',
    params,
    ...options
  });
}

export const supplierList = (params = {}, options = {}) => {
  return request('/auth/supplier/user/commonList', {
    method: 'GET',
    params: {
      page:1,
      size: 9999,
      ...params,
    },
    ...options
  });
}

export const cacheUserAuths = (params, options = {}) => {
  return request('/auth/rule/userRule', {
    method: 'GET',
    params,
    ...options
  });
}

export const getProvinces = (params = {}, options = {}) => {
  return request('/auth/supplier/user/getProvinces', {
    method: 'GET',
    params,
    ...options
  });
}

export const getChildArea = (params = {}, options = {}) => {
  return request('/auth/supplier/user/getChildArea', {
    method: 'GET',
    params,
    ...options
  });
}
