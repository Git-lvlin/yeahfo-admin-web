import request from '@/utils/request';

export const ruleAdd = async (params, options = {}) => {
  return request('/auth/rule/ruleAdd', {
    method: 'POST',
    data: params,
    ...options
  });
}

export const adminRule = async (params, options = {}) => {
  return request('/auth/rule/adminRule', {
    method: 'GET',
    data: params,
    ...options
  });
}

export const ruleDel = async (params, options = {}) => {
  return request('/auth/rule/ruleDel', {
    method: 'POST',
    data: params,
    ...options
  });
}

export const ruleEdit = async (params, options = {}) => {
  return request('/auth/rule/ruleEdit', {
    method: 'POST',
    data: params,
    ...options
  });
}

