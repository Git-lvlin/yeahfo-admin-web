import request from '@/utils/request';

export const bindBank = (params = {}, options = {}) => {
  return request('/auth/supplier/bank_account/bindBank', {
    method: 'POST',
    data: params,
    ...options
  });
}