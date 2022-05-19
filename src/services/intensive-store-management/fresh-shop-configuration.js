import request from '@/utils/request';

export const allowAreaList = async (params = {}, options = {}) => {
  const { current, pageSize, area = [], ...rest } = params;
  const res = await request('/auth/store/FreshMemberShop/allowAreaList', {
    method: 'GET',
    params: {
      page: current,
      size: pageSize,
      provinceId: area[0]?.value,
      cityId: area[1]?.value,
      regionId: area[2]?.value,
      ...rest
    },
    ...options
  });

  return {
    data: res.data,
    success: true,
    total: res.data.total
  }
}

export const allowAreaAdd = (params = {}, options = {}) => {
    return request('/auth/store/FreshMemberShop/allowAreaAdd', {
      method: 'POST',
      data: params,
      ...options
    });
  }




export const allowAreaEdit = (params = {}, options = {}) => {
    return request('/auth/store/FreshMemberShop/allowAreaEdit', {
      method: 'POST',
      data: params,
      ...options
    });
  }