import request from '@/utils/request';

export const ruleDetail = (params = {}, options = {}) => {
  return request('/auth/activity/Rule/ruleDetail', {
    method: 'POST',
    data: params,
    ...options
  });
}
