import request from '@/utils/request';

export const pageForAdmin = async (params = {}, options = {}) => {
  const { current, pageSize, ...rest } = params;
  const res = await request('/auth/store/storeCancelReason/pageForAdmin', {
    method: 'GET',
    params: {
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



export const cancelReasonSave = async (params = {}, options = {}) => {
    const { ...rest } = params;
    const res = await request('/auth/store/storeCancelReason/insert', {
      method: 'GET',
      params: {
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

  export const cancelReasonUpdate = async (params = {}, options = {}) => {
    const { ...rest } = params;
    const res = await request('/auth/store/storeCancelReason/update', {
      method: 'GET',
      params: {
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