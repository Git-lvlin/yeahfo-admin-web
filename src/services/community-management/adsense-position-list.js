import request from '@/utils/request';

export const findAdsensePositionList= async (params, options = {}) => {
  const res = await request('/auth/java-admin/adsense/findAdsensePositionList', {
    method: 'POST',
    data: {},
    ...options
  });
  return {
    code: res.code,
    data: res.data.length?res.data:[],
    success: res.success,
  }
}