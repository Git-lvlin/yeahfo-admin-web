import request from '@/utils/request';

export const reportHandle= async (params, options = {}) => {
  const {sourceIds,status}=params
  const res = await request('/auth/java-admin/report/handle', {
    method: 'POST',
    data: {
        sourceIds,
        status
    },
    ...options
  });
  return {
    code: res.code,
    data: res.data.records,
    success: res.success,
  }
}