import request from '@/utils/request';

export const goodsPage = async (params = {}, options = {}) => {
  const { current, pageSize, gcId = [], ...rest } = params;
  const res = await request('/auth/store/memberShopWholesale/goodsPage', {
    method: 'GET',
    params: {
      page: current,
      size: pageSize,
      gcId1: gcId[0],
      gcId2: gcId[1],
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

export const modifyPriceRecord = async (params = {}, options = {}) => {
  const { current, pageSize, ...rest } = params;
  const res = await request('/auth/store/memberShopWholesale/modifyPriceRecord', {
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