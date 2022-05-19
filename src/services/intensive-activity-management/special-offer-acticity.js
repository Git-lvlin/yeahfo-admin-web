import request from '@/utils/request';

export const getActiveConfigList = async (params = {}, options = {}) => {
  const { current, pageSize, ...rest } = params;
  const res = await request('/auth/activity/wsDiscount/getActiveConfigList', {
    method: 'POST',
    data: {
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

export const saveWSDiscountActiveConfig = async (params = {}, options = {}) => {
  const { ...rest } = params;
  const res = await request('/auth/activity/wsDiscount/saveWSDiscountActiveConfig', {
  method: 'POST',
  data: {
      ...rest
  },
  ...options
  });

  return {
  data: res.data,
  success: true,
  code: res.code
  }
}


export const getActiveConfigById = async (params = {}, options = {}) => {
    const { ...rest } = params;
    const res = await request('/auth/activity/wsDiscount/getActiveConfigById', {
    method: 'POST',
    data: {
        ...rest
    },
    ...options
    });

    return {
    data: res.data,
    success: true,
    code: res.code
    }
}


export const changeStatus = async (params = {}, options = {}) => {
  const { ...rest } = params;
  const res = await request('/auth/activity/wsDiscount/changeStatus', {
  method: 'POST',
  data: {
      ...rest
  },
  ...options
  });

  return {
  data: res.data,
  success: true,
  code: res.code
  }
}


export const updateActStock = async (params = {}, options = {}) => {
  const { ...rest } = params;
  const res = await request('/auth/activity/wsDiscount/updateActStock', {
  method: 'POST',
  data: {
      ...rest
  },
  ...options
  });

  return {
  data: res.data,
  success: true,
  code: res.code
  }
}


export const specialActivityDataSum = async (params = {}, options = {}) => {
  const { current, pageSize, ...rest } = params;
  const res = await request('/auth/java-admin/report/config/specialActivityDataSum', {
    method: 'POST',
    data: {
      page: current,
      size: pageSize,
      ...rest,
    },
    ...options
  });

  return {
    data: res.data,
    success: true,
  }
}