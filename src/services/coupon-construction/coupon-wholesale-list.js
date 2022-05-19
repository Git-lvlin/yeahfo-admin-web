import request from '@/utils/request';
export const couponWholesaleList = async (params = {}, options = {}) => {
    const { current, pageSize,wholesaleType, ...rest } = params;
    const res = await request('/auth/activity/Coupon/couponWholesaleList', {
      method: 'POST',
      data: {
        page: current,
        pageSize,
        wholesaleType:parseInt(wholesaleType),
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