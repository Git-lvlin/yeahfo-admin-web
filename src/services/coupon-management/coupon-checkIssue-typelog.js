import request from '@/utils/request';

export const checkIssueTypeLog= async (params = {}, options = {}) => {
  const {...rest} = params;
  const res = await request('/auth/activity/Coupon/checkIssueTypeLog', {
    method: 'POST',
    data: {
        ...rest
    },
    ...options
  });

  return {
    code: res.code,
    data: res.data,
    success: res.success
  }
}
