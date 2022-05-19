import request from '@/utils/request';

export const couponAddQuantity= async (params = {}, options = {}) => {
  const { id,issueQuantity } = params;
  const res = await request('/auth/activity/Coupon/couponAddQuantity', {
    method: 'POST',
    data: {
     id:parseInt(id),
     issueQuantity:parseInt(issueQuantity)
    },
    ...options
  });

  return res
}
