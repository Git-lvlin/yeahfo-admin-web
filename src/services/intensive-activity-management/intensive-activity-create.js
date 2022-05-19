import request from '@/utils/request';

export const productList = async (params, options = {}) => {
  const { current, pageSize, gcId = [], ...rest } = params;
  const res = await request('/auth/goods/product/skuList', {
    method: 'POST',
    data: {
      page: current,
      size: pageSize,
      gcId1: gcId[0],
      gcId2: gcId[1],
      NEGoodsSaleType: 1,
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

export const addWholesale = (params = {}, options = {}) => {
  return request('/auth/wholesale/index/addWholesale', {
    method: 'POST',
    data: params,
    ...options
  });
}

export const getApplicableAreaForWholesale = (params = {}, options = {}) => {
  return request('/auth/store/storeSetting/getApplicableAreaForWholesale', {
    method: 'POST',
    data: params,
    ...options
  });
}