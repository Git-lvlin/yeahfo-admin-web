import request from '@/utils/request';

export const listLikes= async (params, options = {}) => {
  const { id,...rest }=params
  const res = await request('/auth/java-admin/dynamic/listLikes', {
    method: 'POST',
    data: {
        id,
        ...rest
    },
    ...options
  });
  return {
    code: res.code,
    data: Array.isArray(res.data)?res.data:[],
    total:Number(res.data.total),
    success: res.success,
  }
}