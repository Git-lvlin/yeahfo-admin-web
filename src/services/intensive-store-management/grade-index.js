import request from '@/utils/request';

export const gradeList = async (params = {}, options = {}) => {
  const { current, pageSize, ...rest } = params;
  const res = await request('/auth/store/memberShopGrade/page', {
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

export const memberShopGradeEdit = async (params = {}, options = {}) => {
  return request('/auth/store/memberShopGrade/edit', {
    method: 'POST',
    data: {
      ...params,
    },
    ...options
  });
  
}