import request from '@/utils/request';

export const upgradePage = async (params = {}, options = {}) => {
  const { current, pageSize, ...rest } = params;
  const res = await request('/auth/store/memberShopLevel/upgradePage', {
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

export const upgradePageEdit = (params = {}, options = {}) => {
  return request('/auth/store/memberShopLevel/upgradePageEdit', {
    method: 'POST',
    data: params,
    ...options
  });
}