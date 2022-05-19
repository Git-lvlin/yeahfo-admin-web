import request from '@/utils/request';

export const banDynamicComment= async (params, options = {}) => {
  const {id}=params
  const res = await request('/auth/java-admin/dynamic/banDynamicComment', {
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