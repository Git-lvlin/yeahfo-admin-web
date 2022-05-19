import request from '@/utils/request'

// 注销申请分页列表
export const memberShopCancel = async (params = {}, options = {}) => {
  const { current, pageSize, area = [], ...rest } = params;
  const res = await request('/auth/store/memberShopCancel/page', {
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
    data: res.data.records,
    success: true,
    total: res.data.total
  }
}

// 社区店注销申请 - 审核驳回
export const refuse = async (params = {}, options = {}) => {
  return await request('/auth/store/memberShopCancel/refuse', {
    method: 'POST',
    data: params,
    ...options
  })
}

// 社区店注销申请 - 审核通过
export const approve = async (params = {}, options = {}) => {
  return await request('/auth/store/memberShopCancel/approve', {
    method: 'POST',
    data: params,
    ...options
  })
}