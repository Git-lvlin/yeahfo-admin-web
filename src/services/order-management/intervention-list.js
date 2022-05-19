import request from '@/utils/request';

// 介入列表
export const interventionList = async (params = {}, options = {}) => {
  const { page=1, size=10, applyTime, ...rest } = params;
  const res = await request('/auth/java-admin/orderReturn/arbitration/page', {
    method: 'POST',
    data: {
      page,
      size,
      beginTime: applyTime&& applyTime[0],
      endTime: applyTime&& applyTime[1],
      ...rest
    },
    ...options
  });
  return {
    data: res.data.records,
    success: res.success,
    total: res.data.total
  }
}
// 介入列表详情
export const interventionListDetail = async (params = {}, options = {}) => {
  const { id } = params
  const res = await request('/auth/java-admin/orderReturn/arbitration/detail', {
    method: 'POST',
    data: {
      id
    },
    ...options
  })
  return {
     data: res.data,
     success: res.success,
  }
}

// 平台判决
export const interventionSentence = async (params = {}, options = {}) => {
  const res = await request('/auth/java-admin/orderReturn/platformDecision', {
    method: 'POST',
    data: {
      ...params
    },
    ...options
  })
  return {
     success: res.success
  }
}

// 查询物流信息
export const expressInfo = async (params={}, options={}) => {
  const res = await request('/auth/express/express/expressInfo', {
    method: 'POST',
    data: {
      ...params 
    },
    ...options
  })
  return {
    data: res?.data,
    success: res?.success
  }
}

// 订单协商记录
export const findReturnRecord = async (params={}, options={}) => {
  const res = await request('/auth/java-admin/orderReturn/findReturnRecord', {
    method: 'POST',
    data: {
      ...params
    },
    ...options
  })
  return {
    data: res?.data,
    success: res?.success
  }
}

// 售后地址列表
export const addressList = async (params={}, options={}) => {
  const { supplierId } = params
  const res = await request('/auth/supplier/user/addressList', {
    method: 'POST',
    data: {
      page: 1,
      size: 999,
      supplierId
    },
    ...options
  })
  return {
    data: res?.data.records,
    success: res?.success
  }
}

