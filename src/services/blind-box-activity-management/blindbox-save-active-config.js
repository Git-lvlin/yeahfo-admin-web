import request from '@/utils/request';
import moment from 'moment';

export const saveActiveConfig = async (params, options = {}) => {
  const {startTime,endTime,...rest} = params;
  const res = await request('/auth/activity/blindbox/saveActiveConfig', {
    method: 'POST',
    data: {
      startTime: moment(startTime).unix(),
      endTime:moment(endTime).unix(),
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
