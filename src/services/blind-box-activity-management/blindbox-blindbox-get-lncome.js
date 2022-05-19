import request from '@/utils/request';

export const getBlindboxIncomeList = async (params = {}, options = {}) => {
    const { current, pageSize,dateTimeRange, ...rest } = params;
    const res = await request('/auth/blindbox/Blindbox/getBlindboxIncomeList', {
      method: 'POST',
      data: {
        page: current,
        pageSize: pageSize,
        startTime1:dateTimeRange&&dateTimeRange[0],
        startTime2:dateTimeRange&&dateTimeRange[1],
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


  export const getBlindboxIncomeDetail = async (params = {}, options = {}) => {
    const { current, pageSize,dateTimeRange,...rest } = params;
    const res = await request('/auth/blindbox/Blindbox/getBlindboxIncomeDetail', {
    method: 'POST',
    data: {
        page: current,
        pageSize:pageSize,
        startTime1:dateTimeRange&&dateTimeRange[0],
        startTime2:dateTimeRange&&dateTimeRange[1],
        ...rest,
    },
    ...options
    });

    return {
    data: res.data,
    success: true,
    code: res.code,
    total: res.data.total
    }
}



export const getBlindboxIncomeReclaim = async (params = {}, options = {}) => {
  const { ...rest } = params;
  const res = await request('/auth/blindbox/Blindbox/getBlindboxIncomeReclaim', {
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
