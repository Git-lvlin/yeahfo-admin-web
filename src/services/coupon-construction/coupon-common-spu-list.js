import request from '@/utils/request';

export const commonSpuList= async (params = {}, options = {}) => {
    const { current,pageSize,spuId,...rest} = params;
    const res = await request('/auth/activity/Goods/commonSpuList', {
      method: 'POST',
      data: {
        page:current,
        pageSize:pageSize,
        spuId:parseInt(spuId),
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