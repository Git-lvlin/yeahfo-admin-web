import request from '@/utils/request';

export const adsenseAdminList= async (params, options = {}) => {
  const {id,state,current,pageSize,...rest}=params
  const res = await request('/auth/java-admin/adsense/adminList', {
    method: 'POST',
    data: {
      id,
      page:current,
      size:pageSize,
      state:parseInt(state),
      ...rest
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