import request from '@/utils/request';

export const getDetail = async (params = {}, options = {}) => {
  return request('/auth/store/memberShop/detail', {
    method: 'GET',
    params,
    ...options
  });
}

export const changeAreaInfo = async (params = {}, options = {}) => {
  return request('/auth/store/memberShop/changeAreaInfo', {
    method: 'POST',
    data: params,
    ...options
  });
}