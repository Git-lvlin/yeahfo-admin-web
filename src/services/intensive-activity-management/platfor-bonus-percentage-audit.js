import request from '@/utils/request';

export const categoryAuditList = async (params = {}, options = {}) => {
  const {current,pageSize, ...rest } = params;
  const res = await request('/auth/wholesale/percentAudit/categoryAuditList', {
    method: 'POST',
    data: {
      ...rest
    },
    ...options
  });

  return {
    data: res.data.records,
    success: true,
    code:res.code
  }
}


export const categoryPercentAudit = async (params = {}, options = {}) => {
  const { ...rest } = params;
  const res = await request('/auth/wholesale/percentAudit/categoryPercentAudit', {
    method: 'POST',
    data: {
      ...rest
    },
    ...options
  });

  return {
    data: res.data,
    success: true,
    code:res.code
  }
}


export const skuAuditList = async (params = {}, options = {}) => {
  const {current,pageSize, ...rest } = params;
  const res = await request('/auth/wholesale/percentAudit/skuAuditList', {
    method: 'POST',
    data: {
      page:current,
      size:pageSize,
      ...rest
    },
    ...options
  });

  return {
    data: res.data.records,
    success: true,
    code:res.code
  }
}


export const skuPercentLog = async (params = {}, options = {}) => {
  const {current,pageSize, ...rest } = params;
  const res = await request('/auth/wholesale/percentAudit/skuPercentLog', {
    method: 'POST',
    data: {
      size:pageSize,
      page:current,
      ...rest
    },
    ...options
  });

  return {
    data: res.data.records,
    success: true,
    total:res.data.total
  }
}


export const skuPercentAudit = async (params = {}, options = {}) => {
  const { ...rest } = params;
  const res = await request('/auth/wholesale/percentAudit/skuPercentAudit', {
    method: 'POST',
    data: {
      ...rest
    },
    ...options
  });

  return {
    data: res.data,
    success: true,
    code:res.code
  }
}