import request from '@/utils/request';

export const ruleList = async (params = {}, options = {}) => {
  const { current, pageSize, ...rest } = params;
  const res = await request('/auth/activity/Rule/ruleList', {
    method: 'GET',
    params: {
      page: current,
      size: pageSize,
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

export const ruleSub = async (params = {}, options = {}) => {
  return request('/auth/activity/Rule/ruleSub', {
    method: 'POST',
    data: params,
    ...options
  });
}

export const ruleEdit = async (params = {}, options = {}) => {
  return request('/auth/activity/Rule/ruleEdit', {
    method: 'POST',
    data: params,
    ...options
  });
}

export const ruleDetail = async (params = {}, options = {}) => {
  return request('/auth/activity/Rule/ruleDetail', {
    method: 'POST',
    data: params,
    ...options
  });
}

export const ruleEnd = async (params = {}, options = {}) => {
  return request('/auth/activity/Rule/ruleEnd', {
    method: 'POST',
    data: params,
    ...options
  });
}

export const ruleGoodsImport = async (params = {}, options = {}) => {
  return request('/auth/activity/Rule/ruleGoodsImport', {
    method: 'POST',
    data: params,
    ...options
  });
}

export const ruleGoodsExportTemplate = async (params = {}, options = {}) => {
  return request('/auth/activity/Rule/ruleGoodsExportTemplate', {
    method: 'POST',
    data: params,
    ...options
  });
}