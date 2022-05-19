import request from '@/utils/request';

export const addressList = async (params = {}, options = {}) => {
  const { current, pageSize, ...rest } = params;
  const res = await request('/auth/operation/user/addressList', {
    method: 'POST',
    data: {
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


export const getProvinces = (params = {}, options = {}) => {
  return request('/auth/operation/user/getProvinces', {
    method: 'GET',
    params,
    ...options
  });
}

export const getChildArea = (params = {}, options = {}) => {
  return request('/auth/operation/user/getChildArea', {
    method: 'GET',
    params,
    ...options
  });
}

export const addressDetail = (params = {}, options = {}) => {
  return request('/auth/operation/user/addressDetail', {
    method: 'GET',
    params,
    ...options
  });
}

export const addressAdd = (params = {}, options = {}) => {
  return request('/auth/operation/user/addressAdd', {
    method: 'POST',
    data: params,
    ...options
  });
}

export const addressEdit = (params = {}, options = {}) => {
  return request('/auth/operation/user/addressEdit', {
    method: 'POST',
    data: params,
    ...options
  });
}

export const addressSwitch = (params = {}, options = {}) => {
  return request('/auth/operation/user/addressSwitch', {
    method: 'POST',
    data: params,
    ...options
  });
}

export const addressSetDefault = (params = {}, options = {}) => {
  return request('/auth/operation/user/addressSetDefault', {
    method: 'POST',
    data: params,
    ...options
  });
}
