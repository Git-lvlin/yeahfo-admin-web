import request from '@/utils/request';
import moment from 'moment';

export const couponEdit = async (params, options = {}) => {
  const {limitStartTime,limitEndTime,activityStartTime,activityEndTime,...rest} = params;
  const res = await request('/auth/activity/Coupon/couponEdit', {
    method: 'POST',
    data: {
      limitStartTime: limitStartTime&&moment(limitStartTime).format('YYYY-MM-DD HH:mm:ss'),
      limitEndTime:limitEndTime&&moment(limitEndTime).format('YYYY-MM-DD HH:mm:ss'),
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
