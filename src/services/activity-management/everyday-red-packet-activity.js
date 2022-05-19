import request from '@/utils/request';

export const couponEverydayList = async (params = {}, options = {}) => {
  const { current, pageSize, ...rest } = params;
  const res = await request('/auth/activity/Coupon/couponEverydayList', {
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


export const couponEverydaySub = async (params = {}, options = {}) => {
    const { ...rest } = params;
    const res = await request('/auth/activity/Coupon/couponEverydaySub', {
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

export const couponEverydayEdit = async (params = {}, options = {}) => {
    const { ...rest } = params;
    const res = await request('/auth/activity/Coupon/couponEverydayEdit', {
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


export const couponEverydayDetail = async (params = {}, options = {}) => {
    const { ...rest } = params;
    const res = await request('/auth/activity/Coupon/couponEverydayDetail', {
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

export const couponEverydaySelList = async (params = {}, options = {}) => {
    const { ...rest } = params;
    const res = await request('/auth/activity/Coupon/couponEverydaySelList', {
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


export const couponEverydayLogList = async (params = {}, options = {}) => {
  const { current, pageSize,dateTimeRange,dateTimeRange2,...rest } = params;
  const res = await request('/auth/activity/Coupon/couponEverydayLogList', {
    method: 'POST',
    data: {
      page: current,
      size: pageSize,
      lqStartTime1:dateTimeRange&&dateTimeRange[0],
      lqStartTime2:dateTimeRange&&dateTimeRange[1],
      useStartTime1:dateTimeRange2&&dateTimeRange2[0],
      useStartTime2:dateTimeRange2&&dateTimeRange2[1],
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