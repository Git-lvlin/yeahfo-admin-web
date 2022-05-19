import request from '@/utils/request';

export const remindSetConfig = async (params = {}, options = {}) => {
  const { ...rest } = params;
  const res = await request('/auth/wholesale/index/remindSetConfig', {
    method: 'POST',
    data: {
      ...rest
    },
    ...options
  });

  return {
    code: res.code,
    data: res.data,
    success: true,
  }
}


export const remindGetConfig  = async (params = {}, options = {}) => {
  const { ...rest } = params;
  const res = await request('/auth/wholesale/index/remindGetConfig ', {
    method: 'POST',
    data: {
      ...rest
    },
    ...options
  });

  return {
    code: res.code,
    data: res.data,
    success: true,
  }
}