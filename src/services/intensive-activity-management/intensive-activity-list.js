import request from '@/utils/request';

export const getWholesaleList = async (params = {}, options = {}) => {
  const { current, pageSize, createTime = [], ...rest } = params;
  const res = await request('/auth/wholesale/index/getWholesaleList', {
    method: 'POST',
    data: {
      page: current,
      size: pageSize,
      createTimeStart: createTime[0],
      createTimeEnd: createTime[1],
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

export const getWholesaleDetail = (params = {}, options = {}) => {
  return request('/auth/wholesale/index/getWholesaleDetail', {
    method: 'GET',
    params,
    ...options
  });
}

export const getWholesaleSku = (params = {}, options = {}) => {
  return request('/auth/wholesale/index/getWholesaleSku', {
    method: 'GET',
    params,
    ...options
  });
}

export const updateWholesaleState = (params = {}, options = {}) => {
  return request('/auth/wholesale/index/updateWholesaleState', {
    method: 'GET',
    params,
    ...options
  });
}

export const addWholesaleStock = (params = {}, options = {}) => {
  return request('/auth/wholesale/index/addWholesaleStock', {
    method: 'GET',
    params,
    ...options
  });
}

export const getWholesaleOneSku = (params = {}, options = {}) => {
  return request('/auth/wholesale/index/getWholesaleOneSku', {
    method: 'GET',
    params,
    ...options
  });
}

export const wholesaleStop = (params = {}, options = {}) => {
  return request('/auth/wholesale/index/wholesaleStop', {
    method: 'POST',
    data: params,
    ...options
  });
}

export const getWholesaleArea = (params = {}, options = {}) => {
  return request('/auth/wholesale/index/getWholesaleArea', {
    method: 'POST',
    data: params,
    ...options
  });
}


export const updateWholesaleArea = (params = {}, options = {}) => {
  return request('/auth/wholesale/index/updateWholesaleArea', {
    method: 'POST',
    data: params,
    ...options
  });
}

export const cancelWholesale = (params = {}, options = {}) => {
  return request('/auth/wholesale/index/cancelWholesale', {
    method: 'POST',
    data: params,
    ...options
  });
}

export const wholesaleEdit = (params = {}, options = {}) => {
  return request('/auth/wholesale/index/wholesaleEdit', {
    method: 'POST',
    data: params,
    ...options
  });
}
