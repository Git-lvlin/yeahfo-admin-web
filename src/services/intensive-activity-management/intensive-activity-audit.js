import request from '@/utils/request';


export const getWholesaleAuditList = async (params = {}, options = {}) => {
  const { current, pageSize,dateTimeRange, ...rest } = params;
  const res = await request('/auth/wholesale/index/getWholesaleAuditList', {
    method: 'POST',
    data: {
      page: current,
      size: pageSize,
      createTimeStart:dateTimeRange&&dateTimeRange[0],
      createTimeEnd:dateTimeRange&&dateTimeRange[1],
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

export const updateWholesaleAuditStatus = (params = {}, options = {}) => {
    return request('/auth/wholesale/index/updateWholesaleAuditStatus', {
      method: 'POST',
      data: params,
      ...options
    });
}
