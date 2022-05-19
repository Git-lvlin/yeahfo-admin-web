import request from '@/utils/request';

export const deleteCommentOrReply= async (params, options = {}) => {
  const {id}=params
  const res = await request('/auth/java-admin/dynamicComment/deleteCommentOrReply', {
    method: 'POST',
    data: {
        id
    },
    ...options
  });
  return {
    code: res.code,
    data: res.data,
    success: res.success
  }
}