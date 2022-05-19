import request from '@/utils/request';

export const changePwd = async (params, options = {}) => {
  return request('/auth/admin/changePwd', {
    method: 'POST',
    data: params,
    ...options
  });
}