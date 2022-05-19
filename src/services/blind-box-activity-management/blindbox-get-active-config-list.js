import request from '@/utils/request';

export const getActiveConfigList = async (params = {}, options = {}) => {
    const { current, pageSize, ...rest } = params;
    const res = await request('/auth/activity/blindbox/getActiveConfigList', {
      method: 'POST',
      data: {
        page: current,
        size: pageSize,
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


export const getActiveConfigById = async (params = {}, options = {}) => {
    const { ...rest } = params;
    const res = await request('/auth/activity/blindbox/getActiveConfigById', {
    method: 'POST',
    data: {
        ...rest
    },
    ...options
    });

    return {
    data: res.data,
    success: true,
    code: res.code
    }
}