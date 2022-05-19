import request from '@/utils/request';

export const sortOrderMove= async (params, options = {}) => {
  const { id,type }=params
  const res = await request('/auth/java-admin/circle/sortOrderMove', {
    method: 'POST',
    data: {
        id,
        type
    },
    ...options
  });
  return {
    code: res.code,
    data: res.data,
    success: res.success,
  }
}