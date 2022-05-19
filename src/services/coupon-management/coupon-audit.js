import request from '@/utils/request';

export const couponVerifyList= async (params = {}, options = {}) => {
  const { ...rest} = params;
  const res = await request('/auth/activity/Coupon/couponVerifyList', {
    method: 'POST',
    data: {
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


export const couponVerify= async (params = {}, options = {}) => {
    const { ...rest} = params;
    const res = await request('/auth/activity/Coupon/couponVerify', {
      method: 'POST',
      data: {
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


  export const couponVerifyDetail= async (params = {}, options = {}) => {
    const { ...rest} = params;
    const res = await request('/auth/activity/Coupon/couponVerifyDetail', {
      method: 'POST',
      data: {
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