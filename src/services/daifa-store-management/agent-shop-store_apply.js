import request from '@/utils/request';

export const storeApplyList = async (params = {}, options = {}) => {
  const { current, pageSize, ...rest } = params;
  const res = await request('/auth/store/AgentShop/store_apply', {
    method: 'POST',
    data: {
      page: current,
      pageSize,
      ...rest
    },
    ...options
  });

  return {
    data: res.data.records.length?res.data.records:[],
    success: true,
    total: res.data.total
  }
}

export const storeApplyDetail = (params = {}, options = {}) => {
  return request('/auth/store/AgentShop/store_apply_detail', {
    method: 'GET',
    params,
    ...options,
  });
}

export const storeApplyEdit = (params = {}, options = {}) => {
  const {applyId,...rest}=params
  return request('/auth/store/AgentShop/store_apply_edit', {
    method: 'POST',
    data: {
      applyId,
      ...rest
    },
    ...options,
  });
}

export const storeApplyAudit = (params = {}, options = {}) => {
  const {applyId,...rest}=params
  return request('/auth/store/AgentShop/apply', {
    method: 'POST',
    data: {
      applyId,
      ...rest
    },
    ...options,
  });
}