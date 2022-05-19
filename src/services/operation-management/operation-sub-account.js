import request from '@/utils/request';

export const getAccountList = async (params = {}, options = {}) => {
  const { current, pageSize, ...rest } = params;
  const res = await request('/auth/operation/account/lists', {
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

export const roleList = (params = {}, options = {}) => {
  return request('/auth/operation/role/lists', {
    method: 'GET',
    params,
    ...options
  });
}

export const details = (params = {}, options = {}) => {
  return request('/auth/operation/account/details', {
    method: 'GET',
    params,
    ...options
  });
}

export const addAccount = (params = {}, options = {}) => {
  return request('/auth/operation/account/adds', {
    method: 'POST',
    data: params,
    ...options
  });
}

export const editAccount = (params = {}, options = {}) => {
  return request('/auth/operation/account/edits', {
    method: 'POST',
    data: params,
    ...options
  });
}