import request from '@/utils/request';

export const category = async (params = {}, options = {}) => {
  const { isFresh, ...rest } = params
  let res = await request('/auth/goods/product/category', {
    method: 'POST',
    data: {
      ...rest
    },
    ...options
  });
  if(isFresh) {
    res.data.records = res.data.records.filter(item => item.fresh === 0)
  }
  return res
}

export const categoryAdd = (params = {}, options = {}) => {
  return request('/auth/goods/product/categoryAdd', {
    method: 'POST',
    data: params,
    ...options
  });
}

export const categorySorts = (params = {}, options = {}) => {
  return request('/auth/goods/product/categorySorts', {
    method: 'POST',
    data: params,
    ...options
  });
}

export const categoryDel = (params = {}, options = {}) => {
  return request('/auth/goods/product/categoryDel', {
    method: 'POST',
    data: params,
    ...options
  });
}

export const categoryEdit = (params = {}, options = {}) => {
  return request('/auth/goods/product/categoryEdit', {
    method: 'POST',
    data: params,
    ...options
  });
}

export const categorySwitch = (params = {}, options = {}) => {
  return request('/auth/goods/product/categorySwitch', {
    method: 'GET',
    params,
    ...options
  });
}

export const checkGcIdData = (params = {}, options = {}) => {
  return request('/auth/goods/product/checkGcIdData', {
    method: 'GET',
    params,
    ...options
  });
}