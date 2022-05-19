import request from '@/utils/request';

export const dynamicTop= async (params, options = {}) => {
  const {id}=params
  const res = await request('/auth/java-admin/dynamic/top', {
    method: 'POST',
    data: {
        id
    },
    ...options
  });
  return {
    data: res.data,
  }
}