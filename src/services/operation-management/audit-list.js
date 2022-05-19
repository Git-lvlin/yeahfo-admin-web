import request from '@/utils/request';

export const getAuditedList = async (params = {}, options = {}) => {
  const { current, pageSize, ...rest } = params;
  const res = await request('/auth/operation/bank_account/getAuditedList', {
    method: 'GET',
    params: {
      page: current,
      size: pageSize,
      ...rest
    },
    ...options
  });

  return {
    data: res.data.records,
    success: true,
    total: res.data.total
  }
}

export const auditAccount = (params = {}, options = {}) => {
  return request('/auth/operation/bank_account/auditAccount', {
    method: 'POST',
    data: params,
    ...options
  });
}