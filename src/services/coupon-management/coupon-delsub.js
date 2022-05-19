import request from '@/utils/request';

export const couponDelSub= async (params = {}, options = {}) => {
  const { id } = params;
  const res = await request('/auth/activity/Coupon/couponDelSub', {
    method: 'POST',
    data: {
     id
    },
    ...options
  });

  return {
    code:res.code,
    data: res.data,
    success: res.success,
  }
}


export const couponStatusSub= async (params = {}, options = {}) => {
    const { id,...rest } = params;
    const res = await request('/auth/activity/Coupon/couponStatusSub', {
      method: 'POST',
      data: {
       id,
       ...rest
      },
      ...options
    });
  
    return {
      code:res.code,
      data: res.data,
      success: res.success,
    }
  }