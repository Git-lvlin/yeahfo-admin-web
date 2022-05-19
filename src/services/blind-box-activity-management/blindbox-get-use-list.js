import request from '@/utils/request';

export const getBlindboxUseList = async (params = {}, options = {}) => {
    const { current, pageSize,dateTimeRange, ...rest } = params;
    const res = await request('/auth/blindbox/Blindbox/getBlindboxUseList', {
      method: 'POST',
      data: {
        page: current,
        pageSize:pageSize,
        startTime1:dateTimeRange&&dateTimeRange[0],
        startTime2:dateTimeRange&&dateTimeRange[1],
        ...rest
      },
      ...options
    });
  
    return {
      data: res.data,
      success: true,
      total: res.data.total
    }
  }


  export const getBlindboxUseDetail = async (params = {}, options = {}) => {
    const { current, pageSize,dateTimeRange, ...rest } = params;
    const res = await request('/auth/blindbox/Blindbox/getBlindboxUseDetail', {
      method: 'POST',
      data: {
        page: current,
        pageSize:pageSize,
        startTime1:dateTimeRange&&dateTimeRange[0],
        startTime2:dateTimeRange&&dateTimeRange[1],
        ...rest
      },
      ...options
    });
  
    return {
      data: res.data,
      success: true,
      total: res.data.total
    }
  }
