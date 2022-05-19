import request from '@/utils/request';

export const banShare= async (params, options = {}) => {
  const {id}=params
  const res = await request('/auth/java-admin/dynamic/banShare', {
    method: 'POST',
    data: {
        id
    },
    ...options
  });
  return {
    code: res.code,
    data: res.data.records,
    success: res.success,
  }
}