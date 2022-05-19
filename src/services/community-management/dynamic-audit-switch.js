import request from '@/utils/request';

export const checkAuditDynamicSwitch= async (params, options = {}) => {
  const {...rest}=params
  const res = await request('/auth/java-admin/dynamic/checkAuditDynamicSwitch', {
    method: 'POST',
    data: {
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

export const updateAuditDynamicSwitch= async (params, options = {}) => {
    const {...rest}=params
    const res = await request('/auth/java-admin/dynamic/updateAuditDynamicSwitch', {
      method: 'POST',
      data: {
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