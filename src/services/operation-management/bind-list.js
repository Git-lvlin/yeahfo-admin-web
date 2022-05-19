import request from '@/utils/request';

export const bindOperationPage = async (params = {}, options = {}) => {
  const { current, pageSize, ...rest } = params;
  const res = await request('/auth/store/memberShop/bindOperationPage', {
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

export const bindingForAdmin = async (params = {}, options = {}) => {
  return request('/auth/store/bindingOperationApply/bindingForAdmin', {
    method: 'POST',
    data: params,
    ...options
  });
}

export const unbindingForAdmin = async (params = {}, options = {}) => {
  return request('/auth/store/bindingOperationApply/unbindingForAdmin', {
    method: 'POST',
    data: params,
    ...options
  });
}

