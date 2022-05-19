import request from '@/utils/request';

export const ruleGoodsList = async (params = {}, options = {}) => {
  const { current, pageSize, ...rest } = params;

  const res = await request('/auth/activity/Rule/ruleGoodsList', {
    method: 'POST',
    data: {
      page: current,
      size: pageSize,
      ...rest
    },
    ...options
  });

  return {
    data: res.data,
    success: true,
    total: res.data.goodsList.total
  }
}

// 活动数据统计
export const ruleStatInfo = async (params = {}, options = {}) => {
  const res = await request('/auth/activity/Rule/ruleStatInfo', {
    method: 'POST',
    data: params,
    ...options
  });

  return {
    data: res.data,
    success: true
  }
}

// 活动商品库存修改
export const ruleSkuStockSub = async (params = {}, options = {}) => {
  return await request('/auth/activity/Rule/ruleSkuStockSub', {
    method: 'POST',
    data: params,
    ...options
  })
}

// 活动商品置顶
export const ruleGoodsSortTop = async (params = {}, options = {}) => {
  return await request('/auth/activity/Rule/ruleGoodsSortTop', {
    method: 'POST',
    data: params,
    ...options
  })
}