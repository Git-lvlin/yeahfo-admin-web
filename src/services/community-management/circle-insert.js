import request from '@/utils/request';

export const circleInsert= async (params, options = {}) => {
    console.log('params',params)
  const { ...rest }=params
  const res = await request('/auth/java-admin/circle/insert', {
    method: 'POST',
    data: {
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


export const circleDetail= async (params, options = {}) => {
  const { id }=params
  const res = await request('/auth/java-admin/circle/circleDetail', {
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