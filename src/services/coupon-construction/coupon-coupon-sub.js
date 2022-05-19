import request from '@/utils/request';
import moment from 'moment';

export const couponSub = async (params, options = {}) => {
  const {limitStartTime,limitEndTime,activityStartTime,activityEndTime,...rest} = params;
  const res = await request('/auth/activity/Coupon/couponSub', {
    method: 'POST',
    data: {
      limitStartTime: moment(limitStartTime).format('YYYY-MM-DD HH:mm:ss'),
      limitEndTime:moment(limitEndTime).format('YYYY-MM-DD HH:mm:ss'),
      activityStartTime:moment(activityStartTime).format('YYYY-MM-DD HH:mm:ss'),
      activityEndTime:moment(activityEndTime).format('YYYY-MM-DD HH:mm:ss'),
      ...rest
    },  
    ...options
  });

  return {
    code: res.code,
    data: res.data,
    success: res.success,
  }
}
