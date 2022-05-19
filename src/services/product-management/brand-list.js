import request from '@/utils/request';

export const brand = async (params = {}, options = {}) => {
  const { current, pageSize, ...rest } = params;
  const res = await request('/auth/goods/product/brand', {
    method: 'POST',
    data: {
      page: current,
      size: pageSize,
      ...rest
    },
    ...options
  });

  return {
    data: res.data.records || [],
    success: true,
    total: res.data.total
  }
}

export const brandAdd = (params = {}, options = {}) => {
  return request('/auth/goods/product/brandAdd', {
    method: 'POST',
    data: params,
    ...options
  });
}

export const brandDel = (params = {}, options = {}) => {
  return request('/auth/goods/product/brandDel', {
    method: 'POST',
    data: params,
    ...options
  });
}

export const brandEdit = (params = {}, options = {}) => {
  return request('/auth/goods/product/brandEdit', {
    method: 'POST',
    data: params,
    ...options
  });
}

export const getExistsByBrandId = (params = {}, options = {}) => {
  return request('/auth/goods/product/getExistsByBrandId', {
    method: 'POST',
    data: params,
    ...options
  });
}

