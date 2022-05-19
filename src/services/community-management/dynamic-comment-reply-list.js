import request from '@/utils/request';

export const CommentReplyList= async (params, options = {}) => {
  const {id,content,dateRange,...rest}=params
  const data={
    dynamicId:id,
    startTime:dateRange&&dateRange[0],
    endTime:dateRange&&dateRange[1],
    ...rest
  }
  const data2={
    content,
    startTime:dateRange&&dateRange[0],
    endTime:dateRange&&dateRange[1],
    ...rest
  }
  const res = await request('/auth/java-admin/dynamicComment/adminCommentReplyList', {
    method: 'POST',
    data:content?data2:data,
    ...rest,
    ...options
  });
  return {
    code: res.code,
    data: res.data.records,
    total:Number(res.data.total),
    success: res.success,
  }
}