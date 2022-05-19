import request from '@/utils/request';

export const feedbackList = async (params = {}, options = {}) => {
  const { current, pageSize, ...rest } = params;
  const res = await request('/auth/java-admin/public/feedback/list', {
    method: 'POST',
    data: {
      page: current,
      size:pageSize,
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

export const feedbackDetail = (params = {}, options = {}) => {
    return request('/auth/java-admin/public/feedback/detail', {
      method: 'POST',
      data: params,
      ...options
    });
}
  
export const feedbackReply = (params = {}, options = {}) => {
return request('/auth/java-admin/public/feedback/reply', {
    method: 'POST',
    data: params,
    ...options
});
}

export const selAllVersion = (params = {}, options = {}) => {
  return request('/auth/java-admin/cms/appversion/selAllVersion', {
      method: 'POST',
      data: params,
      ...options
  });
}