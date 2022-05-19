import request from '@/utils/request';

export const listReportType= async (params, options = {}) => {
  const res = await request('/auth/java-admin/report/listReportType', {
    method: 'POST',
    data: {},
    ...options
  });
  return {
    code: res.code,
    data: res.data,
    success: res.success,
  }
}