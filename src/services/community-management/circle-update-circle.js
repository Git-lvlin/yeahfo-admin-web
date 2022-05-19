import request from '@/utils/request';

export const circleUpdateCircle= async (params, options = {}) => {
  const { id,...rest }=params
  const res = await request('/auth/java-admin/circle/updateCircle', {
    method: 'POST',
    data: {
        id,
        ...rest
    },
    ...options
  });
  return {
    code: res.code,
    data: res.data,
    success: res.success,
  }
}