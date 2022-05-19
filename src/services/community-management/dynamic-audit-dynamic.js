import request from '@/utils/request';

export const auditDynamic= async (params, options = {}) => {
  const {state,...rest}=params
  const res = await request('/auth/java-admin/dynamic/auditDynamic', {
    method: 'POST',
    data: {
      state:parseInt(state),
      ...rest
    },
    ...options
  });
  return {
    code: res.code,
    data: res.data,
    success: res.success,
  }
}