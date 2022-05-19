import request from '@/utils/request';

export const releaseDynamic= async (params, options = {}) => {
  const { circleId,...rest}=params
  const res = await request('/auth/java-admin/dynamic/releaseDynamic', {
    method: 'POST',
    data: {
        circleId,
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