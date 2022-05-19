import request from '@/utils/request';

export const saveAdsensePosition= async (params, options = {}) => {
  const {id,title,status}=params
  const res = await request('/auth/java-admin/adsense/saveAdsensePosition', {
    method: 'POST',
    data: {
        id,
        title,
        status
    },
    ...options
  });
  return {
    code: res.code,
    data: res.data,
    success: res.success,
  }
}