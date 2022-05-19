import request from '@/utils/request';

export const searchUnit = async (params = {}, options = {}) => {
  const { current, pageSize, ...rest } = params;
  const res = await request('/auth/goods/product/searchUnit', {
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

export const saveGoodsUnit = async (params = {}, options = {}) => {
  return request('/auth/goods/product/saveGoodsUnit', {
    method: 'POST',
    data: params,
    ...options
  });
}