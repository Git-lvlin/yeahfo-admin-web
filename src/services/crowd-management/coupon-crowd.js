import request from '@/utils/request';

export const couponCrowdList = async (params = {}, options = {}) => {
  const { current, pageSize, ...rest } = params;
  const res = await request('/auth/activity/Coupon/couponCrowdList', {
    method: 'POST',
    data: {
      page: current,
      size: pageSize,
      ...rest
    },
    ...options
  });

  return {
    code:res.code,
    data: res.data.records,
    success: true,
    total: res.data.total
  }
}

export const couponCrowdSub = async (params = {}, options = {}) => {
  const {  ...rest } = params;
  const res = await request('/auth/activity/Coupon/couponCrowdSub', {
    method: 'POST',
    data: {
      ...rest
    },
    ...options
  });

  return {
    code:res.code,
    data: res.data,
    success: true,
  }
}


export const couponCrowdDetail = async (params = {}, options = {}) => {
  const {  ...rest } = params;
  const res = await request('/auth/activity/Coupon/couponCrowdDetail', {
    method: 'POST',
    data: {
      ...rest
    },
    ...options
  });

  return {
    code:res.code,
    data: res.data,
    success: true,
  }
}

export const couponCrowdEdit = async (params = {}, options = {}) => {
  const {  ...rest } = params;
  const res = await request('/auth/activity/Coupon/couponCrowdEdit', {
    method: 'POST',
    data: {
      ...rest
    },
    ...options
  });

  return {
    code:res.code,
    data: res.data,
    success: true
  }
}

export const couponCrowdStatusSub = async (params = {}, options = {}) => {
  const {  ...rest } = params;
  const res = await request('/auth/activity/Coupon/couponCrowdStatusSub', {
    method: 'POST',
    data: {
      ...rest
    },
    ...options
  });

  return {
    code:res.code,
    data: res.data,
    success: true
  }
}

export const couponCrowdDel = async (params = {}, options = {}) => {
  const {  ...rest } = params;
  const res = await request('/auth/activity/Coupon/couponCrowdDel', {
    method: 'POST',
    data: {
      ...rest
    },
    ...options
  });

  return {
    code:res.code,
    data: res.data,
    success: true
  }
}

export const userLevelList = async (params = {}, options = {}) => {
  const {  ...rest } = params;
  const res = await request('/auth/activity/Coupon/userLevelList', {
    method: 'POST',
    data: {
      ...rest
    },
    ...options
  });

  return {
    code:res.code,
    data: res.data,
    success: true
  }
}