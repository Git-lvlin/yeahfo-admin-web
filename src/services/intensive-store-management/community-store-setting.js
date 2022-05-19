import request from '@/utils/request';


export const setMemberShopDeliveryCoverage = async (params = {}, options = {}) => {
    return request('/auth/store/storeSetting/setMemberShopDeliveryCoverage', {
      method: 'POST',
      data: params,
      ...options
    });
  }

export const getMemberShopDeliveryCoverage = async (params = {}, options = {}) => {
    return request('/auth/store/storeSetting/getMemberShopDeliveryCoverage', {
      method: 'POST',
      data: params,
      ...options
    });
  }