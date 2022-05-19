import request from '@/utils/request';

export const levelPage = async (params = {}, options = {}) => {
  const { current, pageSize, ...rest } = params;
  const res = await request('/auth/store/memberShopLevel/levelPage', {
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

export const levelPageEdit = (params = {}, options = {}) => {
  return request('/auth/store/memberShopLevel/levelPageEdit', {
    method: 'POST',
    data: params,
    ...options
  });
}