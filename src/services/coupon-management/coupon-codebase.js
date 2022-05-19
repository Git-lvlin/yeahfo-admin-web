import request from '@/utils/request';

export const couponCcodebase= async (params, options = {}) => {
  const {status,id,dateRange,current,pageSize,...rest } = params;
  const res = await request('/auth/activity/Coupon/couponCodebase', {
    method: 'POST',
    data: {
        status:parseInt(status),
        id:parseInt(id),
        lqStartTime:dateRange&&dateRange[0],
        lqEndTime:dateRange&&dateRange[1],
        size:pageSize,
        page:current,
        ...rest
    },
    ...options
  });

  return {
    code: res.code,
    data: res.data,
    success: res.success,
    total:res.data.memberCouponList?.total
  }
}

export const couponCodebaseEnd= async (params, options = {}) => {
  const res = await request('/auth/activity/Coupon/couponCodebaseEnd', {
    method: 'POST',
    data: {
      ...params
    },
    ...options
  });

  return {
    code: res.code,
    data: res.data,
    success: res.success
  }
}