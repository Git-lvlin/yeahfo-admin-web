import request from '@/utils/request';



export const editSignRedPacketConfig = async (params, options = {}) => {
  const {...rest} = params;
  const res = await request('/auth/java-admin/redPacket/editSignRedPacketConfig', {
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

export const getSignRedPacketConfig = async (params, options = {}) => {
  const {...rest} = params;
  const res = await request('/auth/java-admin/redPacket/getSignRedPacketConfig', {
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
