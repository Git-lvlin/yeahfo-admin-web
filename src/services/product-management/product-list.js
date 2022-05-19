import request from '@/utils/request';
import moment from 'moment';

export const productList = async (params, options = {}) => {
  const { current, pageSize, gcId = [], createTime = [], auditTime = [], lastOperateTime = [], lastPutonTime = [], ...rest } = params;
  const res = await request('/auth/goods/product/lists', {
    method: 'POST',
    data: {
      page: current,
      size: pageSize,
      gcId1: gcId[0],
      gcId2: gcId[1],
      auditTimeStart: auditTime[0] && moment(auditTime[0]).unix(),
      auditTimeEnd: auditTime[1] && moment(auditTime[1]).unix(),
      createTimeStart: createTime[0] && moment(createTime[0]).unix(),
      createTimeEnd: createTime[1] && moment(createTime[1]).unix(),
      lastOperateTimeStart: lastOperateTime[0] && moment(lastOperateTime[0]).unix(),
      lastOperateTimeEnd: lastOperateTime[1] && moment(lastOperateTime[1]).unix(),
      lastPutonTimeStart: lastPutonTime[0] && moment(lastPutonTime[0]).unix(),
      lastPutonTimeEnd: lastPutonTime[1] && moment(lastPutonTime[1]).unix(),
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

export const rejectList = async (params, options = {}) => {
  const { current, pageSize, gcId = [], createTime = [], auditTime = [], lastOperateTime = [], lastPutonTime = [], ...rest } = params;
  const res = await request('/auth/goods/product/rejectList', {
    method: 'POST',
    data: {
      page: current,
      size: pageSize,
      gcId1: gcId[0],
      gcId2: gcId[1],
      auditTimeStart: auditTime[0] && moment(auditTime[0]).unix(),
      auditTimeEnd: auditTime[1] && moment(auditTime[1]).unix(),
      createTimeStart: createTime[0] && moment(createTime[0]).unix(),
      createTimeEnd: createTime[1] && moment(createTime[1]).unix(),
      lastOperateTimeStart: lastOperateTime[0] && moment(lastOperateTime[0]).unix(),
      lastOperateTimeEnd: lastOperateTime[1] && moment(lastOperateTime[1]).unix(),
      lastPutonTimeStart: lastPutonTime[0] && moment(lastPutonTime[0]).unix(),
      lastPutonTimeEnd: lastPutonTime[1] && moment(lastPutonTime[1]).unix(),
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

export const getConfig = (params = {}, options = {}) => {
  return request('/auth/goods/product/getConfig', {
    method: 'POST',
    data: params,
    ...options
  });
}

export const addGoods = (params = {}, options = {}) => {
  return request('/auth/goods/product/add', {
    method: 'POST',
    data: params,
    ...options
  });
}

export const editGoods = (params = {}, options = {}) => {
  return request('/auth/goods/product/edit', {
    method: 'POST',
    data: params,
    ...options
  });
}

export const getDetail = (params = {}, options = {}) => {
  return request('/auth/goods/product/detail', {
    method: 'POST',
    data: params,
    ...options
  });
}

export const onShelf = (params = {}, options = {}) => {
  return request('/auth/goods/product/onShelf', {
    method: 'POST',
    data: params,
    ...options
  });
}

export const offShelf = (params = {}, options = {}) => {
  return request('/auth/goods/product/offShelf', {
    method: 'POST',
    data: params,
    ...options
  });
}

export const changeStoreState = (params = {}, options = {}) => {
  return request('/auth/goods/product/changeStoreState', {
    method: 'POST',
    data: params,
    ...options
  });
}

export const listExport = (params = {}, options = {}) => {
  return request('/auth/goods/product/export', {
    method: 'POST',
    data: params,
    ...options
  });
}

export const subAccountCheck = (params = {}, options = {}) => {
  return request('/auth/goods/product/subAccountCheck', {
    method: 'POST',
    data: params,
    ...options
  });
}

export const preAccountCheck = (params = {}, options = {}) => {
  return request('/auth/goods/product/preAccountCheck', {
    method: 'POST',
    data: params,
    ...options
  });
}

export const preAccountShow = (params = {}, options = {}) => {
  return request('/auth/goods/product/preAccountShow', {
    method: 'POST',
    data: params,
    ...options
  });
}

export const getActivityRecord = (params = {}, options = {}) => {
  return request('/auth/goods/product/getActivityRecord', {
    method: 'POST',
    data: params,
    ...options
  });
}

export const getTemplateList = async (params = {}, options = {}) => {
  const { current, pageSize, ...rest } = params;
  const res = await request('/auth/express/express/postageList', {
    method: 'POST',
    data: {
      page: current,
      size: pageSize,
      ...rest
    },
    ...options
  });

  return {
    data: res?.data?.records,
    success: true,
    total: res?.data?.total
  }
}