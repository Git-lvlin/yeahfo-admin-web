import request from '@/utils/request';

// 生鲜社区店申请分页列表
export const freshApplyPage = async (params = {}, options = {}) => {
  const { current, pageSize, area, verifyStatusCode, ...rest } = params;
  const res = await request('/auth/store/freshApply/page', {
    method: 'POST',
    data: {
      page: current,
      size: pageSize,
      verifyStatus: verifyStatusCode,
      provinceId: area?.[0].value,
      cityId: area?.[1]?.value,
      regionId: area?.[2]?.value,
      ...rest
    },
    ...options
  })
  return {
    data: res?.data?.records,
    success: res?.success,
    total: res?.data?.total
  }
}

// 生鲜社区店申请 - 审核通过
export const approve = async (params = {}, options = {}) => {
  return request('/auth/store/freshApply/approve', {
    method: 'POST',
    data: {
      ...params,
    },
    ...options
  });
}

// 生鲜社区店申请 - 审核驳回
export const refuse = async (params = {}, options = {}) => {
  return request('/auth/store/freshApply/refuse', {
    method: 'POST',
    data: {
      ...params,
    },
    ...options
  });
}

// 生鲜社区店申请记录详情
export const detail = async (params = {}, options = {}) => {
  return request('/auth/store/freshApply/detail', {
    method: 'POST',
    data: {
      ...params,
    },
    ...options
  });
}