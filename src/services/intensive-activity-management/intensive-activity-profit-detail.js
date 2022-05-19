import request from '@/utils/request';

export const exportList = async (params = {}, options = {}) => {
    const { current, pageSize,wholesaleStartTime, ...rest } = params;
    const res = await request('/auth/wholesale/index/exportList', {
      method: 'POST',
      data: {
        page: current,
        size: pageSize,
        ...rest,
        wholesaleStartTime:{
          start:wholesaleStartTime?.[0],
          end:wholesaleStartTime?.[1]
        },
  
      },
      ...options
    });
  
    return {
      data: res.data.records,
      success: true,
      total: res.data.total
    }
  }
