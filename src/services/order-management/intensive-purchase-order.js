import request from '@/utils/request';

export const operationList = async (params = {}, options = {}) => {
  const { current, pageSize, createTime = [], ...rest } = params;
  const res = await request('/auth/operation/order/list', {
    method: 'POST',
    params: {
      page: current,
      size: pageSize,
      beginTime: createTime[0],
      endTime: createTime[1],
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

export const purchaseInList = async (params = {}) => {
  const res = await request('/auth/operation/stock/purchaseInList', {
    method: 'POST',
    params: {
      ...params,
      page: 1,
      size: 999,
    },
  });

  return {
    data: res.data.records.records,
    success: true,
    total: res.data.total
  }
}

export const dispatchOutList = async (params = {}) => {
  const res = await request('/auth/operation/stock/dispatchOutList', {
    method: 'POST',
    params: {
      ...params,
      page: 1,
      size: 999,
    },
  });

  return {
    data: res.data.records.records,
    success: true,
    total: res.data.total
  }
}

export const detail = async (params = {}, options = {}) => {
  return request('/auth/operation/order/detail', {
    method: 'POST',
    data: params,
    ...options
  });
}

export const expressInfo = async (params = {}, options = {}) => {
  return request('/auth/operation/order/orderExpressDetail', {
    method: 'POST',
    data: params,
    ...options
  });
}