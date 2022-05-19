import request from '@/utils/request';

export const findAdsensePositionById= async (params, options = {}) => {
  const {id}=params
  const res = await request('/auth/java-admin/adsense/findAdsensePositionById', {
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