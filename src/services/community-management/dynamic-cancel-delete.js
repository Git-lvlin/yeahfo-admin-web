import request from '@/utils/request';

export const cancelDelete= async (params, options = {}) => {
  const {id}=params
  const res = await request('/auth/java-admin/dynamic/cancelDelete', {
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