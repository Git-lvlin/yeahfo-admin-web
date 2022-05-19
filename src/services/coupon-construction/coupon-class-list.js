import request from '@/utils/request';

export const classList = async (params, options = {}) => {
  const {...rest } = params;
  const res = await request('/auth/activity/Goods/classList', {
    method: 'POST',
    data: {
        ...rest
    },
    ...options
  });
  // console.log('res',res)

  return {
    code: res.code,
    data: res.data.records,
    success: res.success,
  }
}