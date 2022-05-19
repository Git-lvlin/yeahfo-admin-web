import request from '@/utils/request';

export const getAuditList = async (params = {}, options = {}) => {
  const { current, pageSize, dateTimeRange, ...rest } = params
  const res = await request('/auth/operation/operationRefund/getAuditList', {
    method: 'POST',
    data: {
      page: current,
      size: pageSize,
      createTimeBegin: dateTimeRange&& dateTimeRange[0],
      createTimeEnd: dateTimeRange&& dateTimeRange[1],
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



export const getAuditInfo = async (params = {}, options = {}) => {
    const { ...rest } = params
    const res = await request('/auth/operation/operationRefund/getAuditInfo', {
      method: 'POST',
      data: {
        ...rest
      },
      ...options
    });
    return {
      data: res.data,
      success: true,
      code: res.code
    }
  }

export const operationRefundAudit = async (params = {}, options = {}) => {
    const { ...rest } = params
    const res = await request('/auth/operation/operationRefund/audit', {
        method: 'POST',
        data: {
        ...rest
        },
        ...options
    });
    return {
        data: res.data,
        success: true,
        code: res.code
    }
}