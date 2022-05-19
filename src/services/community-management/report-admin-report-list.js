import request from '@/utils/request';

export const adminReportList= async (params, options = {}) => {
  const {current,pageSize,status,type}=params
  const res = await request('/auth/java-admin/report/adminReportList', {
    method: 'POST',
    data: {
        page:current,
        size:pageSize,
        status:status|| '3',
        type
    },
    ...options
  });
  return {
    code: res.code,
    data: res.data.records,
    success: res.success,
  }
}