import request from '@/utils/request';

export const getStoreList = async (params = {}, options = {}) => {
  const { current, pageSize, area = [], provideTime = [], ...rest } = params;
  const res = await request('/auth/store/memberShopApply/page', {
    method: 'GET',
    params: {
      page: current,
      size: pageSize,
      provinceId: area[0]?.value,
      cityId: area[1]?.value,
      regionId: area[2]?.value,
      provideTimeStart: provideTime[0],
      provideTimeEnd: provideTime[1],
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

export const approve = async (params = {}, options = {}) => {
  return request('/auth/store/memberShopApply/approve', {
    method: 'POST',
    data: params,
    ...options
  });
}

export const refuse = async (params = {}, options = {}) => {
  return request('/auth/store/memberShopApply/refuse', {
    method: 'POST',
    data: params,
    ...options
  });
}

export const storeDetail = async (params = {}, options = {}) => {
  return request('/auth/store/memberShopApply/detail', {
    method: 'GET',
    params,
    ...options
  });
}