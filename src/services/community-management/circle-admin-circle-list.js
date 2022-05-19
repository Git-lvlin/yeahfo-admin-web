import request from '@/utils/request';

export const adminCircleList= async (params, options = {}) => {
  const res = await request('/auth/java-admin/circle/adminCircleList', {
    method: 'POST',
    data: {
      params
    },
    ...options
  });
  return {
    code: res.code,
    data: res.data.length?res.data:[],
    success: res.success,
  }
}

export const miniCircleList= async (params, options = {}) => {
  const res = await request('/auth/java-admin/circle/miniCircleList', {
    method: 'POST',
    data: {
      params
    },
    ...options
  });
  return {
    code: res.code,
    data: res.data.length?res.data:[],
    success: res.success,
  }
}