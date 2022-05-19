import request from '@/utils/request';

export const setLadderConfig = async (params={}, options = {}) => {
  const { ...rest } = params;

  const res = await request('/auth/goods/product/setLadderConfig', {
    method: 'POST',
    data: {
      ...rest,
    },
    ...options
  });

  return {
    data: res.data,
    success: true,
    code: res.code
  }
}


export const getLadderConfig = async (params, options = {}) => {
    const { ...rest } = params;
  
    const res = await request('/auth/goods/product/getLadderConfig', {
      method: 'POST',
      data: {
        ...rest,
      },
      ...options
    });
  
    return {
      data: res.data,
      success: true,
      code: res.code
    }
  }