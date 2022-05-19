import request from '@/utils/request';

export const latedeliveryAreaIndex = async (params = {}, options = {}) => {
  const { current, pageSize, ...rest } = params;
  const res = await request('/auth/express/LatedeliveryArea/latedeliveryAreaIndex', {
    method: 'POST',
    data: {
      page: current,
      pageSize: pageSize,
      ...rest
    },
    ...options
  });

  return {
    data: res.data,
    success: true,
    total: res.data.total
  }
}

export const addLateDeliveryDesc = (params = {}, options = {}) => {
  return request('/auth/express/LatedeliveryArea/addLateDeliveryDesc', {
    method: 'POST',
    data: params,
    ...options
  });
}

export const addLatedeliveryArea = (params = {}, options = {}) => {
  return request('/auth/express/LatedeliveryArea/addLatedeliveryArea', {
    method: 'POST',
    data: params,
    ...options
  });
}

export const updateLatedeliveryAreaStatus = (params = {}, options = {}) => {
    return request('/auth/express/LatedeliveryArea/updateLatedeliveryAreaStatus', {
      method: 'POST',
      data: params,
      ...options
    });
  }