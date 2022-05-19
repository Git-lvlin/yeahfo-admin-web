import request from '@/utils/request';

export const memberShopSaleOrder = async (params = {}, options = {}) => {
  const { current, pageSize, time, ...rest } = params;
  const res = await request('/auth/store/memberShopSaleOrder/page', {
    method: 'GET',
    params: {
      page: current,
      size: pageSize,
      beginTime: time?.[0] ? +time[0] : '',
      endTime: time?.[1] ? +time[1] : '',
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