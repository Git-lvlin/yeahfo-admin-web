import request from '@/utils/request';

export const circleHide= async (params, options = {}) => {
  const { id }=params
  const res = await request('/auth/java-admin/circle/hide', {
    method: 'POST',
    data: {
        id
    },
    ...options
  });
  return {
    code: res.code,
    data: res.data,
    success: res.success,
  }
}