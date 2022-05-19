import request from '@/utils/request';

export const productList = async (params = {}, options = {}) => {
  const { current, pageSize, groupName, ...rest } = params;
  let url = '/auth/goods/Product_Ali/selectedList'

  const param = {
    page: current,
    size: pageSize,
    ...rest
  }
  if (groupName) {
    url='/auth/goods/Product_Ali/searchGroupInfo'
    param.groupName = groupName
  }
  const res = await request(url, {
    method: 'POST',
    data: param,
    ...options
  });
  const data = res.data.records?res.data.records:res.data
  return {
    data: data || [],
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

export const indexProductList = async (params = {}, options = {}) => {
  const { current, pageSize, ...rest } = params;
  const res = await request('/auth/goods/Product_Ali/sendingList', {
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

// 商品组列表
export const getGoodsList = async (params = {}, options = {}) => {
  const { current, pageSize, title, ...rest } = params;
  let url = '/auth/goods/Product_Ali/pullGoodsGroup'
  const param = {
    page: current,
    size: pageSize,
    ...rest
  }
  if (title) {
    url = '/auth/goods/Product_Ali/searchGroupInfo'
    param.groupName = title
  }
  const res = await request(url, {
    method: 'POST',
    data: param,
    ...options
  });

  return {
    data: res.data || [],
    success: true,
    total: res.data.total
  }
}

// 选择商品组
export const selectGoodsList = async (params = {}, options = {}) => {
  const { current, pageSize, ...rest } = params;
  const res = await request('/auth/goods/Product_Ali/groupGoodsList', {
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

// 商品设置
export const setIndex = (params = {}, options = {}) => {
  return request('/auth/goods/Product_Ali/setGoods', {
    method: 'POST',
    data: params,
    ...options
  });
}

// 内部基础库商品更新
export const goodsLoading = (params = {}, options = {}) => {
  return request('/auth/goods/Product_Ali/modifySetInfo', {
    method: 'POST',
    data: params,
    ...options
  });
}


