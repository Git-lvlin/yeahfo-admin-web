import request from '@/utils/request';

export const adminReportDetailList= async (params, options = {}) => {
  const {sourceId}=params
  const res = await request('/auth/java-admin/report/adminReportDetailList', {
    method: 'POST',
    data: {
        sourceId
    },
    ...options
  });
  return {
    code: res.code,
    data: res.data.records,
    total:Number(res.data.total),
    success: res.success,
  }
}