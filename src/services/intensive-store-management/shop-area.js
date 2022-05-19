import request from '@/utils/request';


//开店区域和保证金
export const getApplicableArea = async (params = {}, options = {}) => {
  const { current, pageSize, area = [], ...rest } = params;
  const res = await request('/auth/store/storeSetting/getApplicableArea', {
    method: 'GET',
    params: {
      page: current,
      size: pageSize,
      provinceId: area[0]?.value,
      cityId: area[1]?.value,
      regionId: area[2]?.value,
      ...rest
    },
    ...options
  });

  return {
    data: res.data,
    success: true,
    total: res.data.total
  }
}

export const setApplicableArea = (params = {}, options = {}) => {
  return request('/auth/store/storeSetting/setApplicableArea', {
    method: 'POST',
    data: params,
    ...options
  });
}

export const changeApplicableArea = (params = {}, options = {}) => {
  return request('/auth/store/storeSetting/changeApplicableArea', {
    method: 'POST',
    data: params,
    ...options
  });
}

export const editApplicableAreaDeposit = (params = {}, options = {}) => {
  return request('/auth/store/storeSetting/editApplicableAreaDeposit', {
    method: 'POST',
    data: params,
    ...options
  });
}


//服务费
export const getMemberShopServicepoint = (params = {}, options = {}) => {
  return request('/auth/store/storeSetting/getMemberShopServicepoint', {
    method: 'POST',
    data: params,
    ...options
  });
}

export const setMemberShopServicepoint = (params = {}, options = {}) => {
  return request('/auth/store/storeSetting/setMemberShopServicepoint', {
    method: 'POST',
    data: params,
    ...options
  });
}

export const getMemberShopServicepointLog = async (params = {}, options = {}) => {
  const { current, pageSize, area = [], ...rest } = params;
  const res = await request('/auth/store/storeSetting/getMemberShopServicepointLog', {
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

//残疾人缴费
export const getMemberShopDeformed = (params = {}, options = {}) => {
  return request('/auth/store/storeSetting/getMemberShopDeformed', {
    method: 'POST',
    data: params,
    ...options
  });
}

export const setMemberShopDeformed = (params = {}, options = {}) => {
  return request('/auth/store/storeSetting/setMemberShopDeformed', {
    method: 'POST',
    data: params,
    ...options
  });
}

export const getMemberShopDeformedLog = async (params = {}, options = {}) => {
  const { current, pageSize, area = [], ...rest } = params;
  const res = await request('/auth/store/storeSetting/getMemberShopDeformedLog', {
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