import request from '@/utils/request';

export const getDynamicDetail= async (params, options = {}) => {
  const { id }=params
  const res = await request('/auth/java-admin/dynamic/getDynamicDetail', {
    method: 'POST',
    data: {
        id
    },
    ...options
  });
  return {
    code: res.code,
    data: res.data,
    success: res.success,
  }
}

export const findAdminCommentList= async (params, options = {}) => {
  const { current,pageSize,dynamicId }=params
  const res = await request('/auth/java-admin/dynamicComment/findAdminCommentList', {
    method: 'POST',
    data: {
      page:current,
      size:pageSize,
      dynamicId
    },
    ...options
  });
  return {
    code: res.code,
    data: res.data.records,
    total:Number(res.data.total),
    success: res.success,
  }
}

export const insertComment= async (params, options = {}) => {
  const { dynamicId,...rest }=params
  const res = await request('/auth/java-admin/dynamicComment/insertComment', {
    method: 'POST',
    data: {
      dynamicId,
      ...rest
    },
    ...options
  });
  return {
    code: res.code,
    data: res.data.records,
    success: res.success,
  }
}


export const insertReply= async (params, options = {}) => {
  const { userId,...rest }=params
  const res = await request('/auth/java-admin/dynamicComment/insertReply', {
    method: 'POST',
    data: {
      userId,
      ...rest
    },
    ...options
  });
  return {
    code: res.code,
    data: res.data.records,
    success: res.success,
  }
}