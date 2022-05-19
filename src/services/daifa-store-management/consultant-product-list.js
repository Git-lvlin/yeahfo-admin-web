import request from '@/utils/request';

export const page_spuList = async (params = {}, options = {}) => {
  const { current, pageSize,gcId1Display, ...rest } = params;
  const res = await request('/auth/store/AgentShopGoods/page_spu', {
    method: 'POST',
    data: {
      page: current,
      pageSize,
      gid1:gcId1Display?.[0],
      gid2:gcId1Display?.[1],
      ...rest
    },
    ...options
  });

  return {
    data: res.data.records,
    success: true,
    total:res.data.total,
    code:res.code
  }
}

export const page_skuList = async (params = {}, options = {}) => {
  const { current, pageSize, ...rest } = params;
  const res = await request('/auth/store/AgentShopGoods/page_sku', {
    method: 'POST',
    data: {
      page: current,
      size: pageSize,
      ...rest
    },
    ...options
  });

  return {
    data: res.data.length?res.data:[],
    success: true,
    code:res.code
  }
}