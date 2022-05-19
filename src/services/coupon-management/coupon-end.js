import request from '@/utils/request';

export const couponEnd= async (params = {}, options = {}) => {
  const { id} = params;
  const res = await request('/auth/activity/Coupon/couponEnd', {
    method: 'POST',
    data: {
     id
    },
    ...options
  });

  return res
}
