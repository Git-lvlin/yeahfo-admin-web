import request from '@/utils/request';

export const categoryList = async (params = {}, options = {}) => {
  const {current,pageSize, ...rest } = params;
  const res = await request('/auth/wholesale/percentAudit/categoryList', {
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


export const categoryPercentLog = async (params = {}, options = {}) => {
  const {current,pageSize, ...rest } = params;
  const res = await request('/auth/wholesale/percentAudit/categoryPercentLog', {
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


export const updateCategoryPercent = async (params = {}, options = {}) => {
  const { ...rest } = params;
  const res = await request('/auth/wholesale/percentAudit/updateCategoryPercent', {
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