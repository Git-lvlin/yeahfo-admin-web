import request from '@/utils/request';
import moment from 'moment';

export const checkList = async (params = {}, options = {}) => {
  const { current, pageSize, gcId = [], createTime = [], ...rest } = params;
  const res = await request('/auth/goods/product/checkList', {
    method: 'POST',
    data: {
      page: current,
      size: pageSize,
      gcId1: gcId[0],
      gcId2: gcId[1],
      createTimeStart: createTime[0] && moment(createTime[0]).unix(),
      createTimeEnd: createTime[1] && moment(createTime[1]).unix(),
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

export const getDetail = (params = {}, options = {}) => {
  return request('/auth/goods/product/detail', {
    method: 'POST',
    data: params,
    ...options
  });
}

export const purchaseAuditPass = (params = {}, options = {}) => {
  return request('/auth/goods/product/purchaseAuditPass', {
    method: 'POST',
    data: params,
    ...options
  });
}

export const purchaseAuditRefuse = (params = {}, options = {}) => {
  return request('/auth/goods/product/purchaseAuditRefuse', {
    method: 'POST',
    data: params,
    ...options
  });
}

export const noFirstCheckList = (params = {}, options = {}) => {
  return request('/auth/goods/product/noFirstCheckList', {
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
