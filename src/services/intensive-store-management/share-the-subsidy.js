import request from '@/utils/request';

export const storeShareCommission = async (params = {}, options = {}) => {
  const { current, pageSize, ...rest } = params;
  const res = await request('/auth/java-admin/financial/suggest/commission/storeShareCommission', {
    method: 'POST',
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

export const storeShareCommissionItem = async (params = {}, options = {}) => {
  const { current, pageSize, dateTimeRange = [], ...rest } = params;
  const res = await request('/auth/java-admin/financial/suggest/commission/storeShareCommissionItem', {
    method: 'POST',
    params: {
    page: current,
    size: pageSize,
    orderTimeBegin: dateTimeRange[0],
    orderTimeEnd: dateTimeRange[1],
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