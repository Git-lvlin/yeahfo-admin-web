import request from '@/utils/request';

export const memberShopResults = async (params = {}, options = {}) => {
  const { current, pageSize, ...rest } = params;
  const res = await request('/auth/store/memberShopResults/page', {
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

export const memberShopResultsEdit = async (params = {}, options = {}) => {
  return request('/auth/store/memberShopResults/edit', {
    method: 'POST',
    data: params,
    ...options
  });
}