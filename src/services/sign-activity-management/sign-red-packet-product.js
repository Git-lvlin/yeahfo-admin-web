import request from '@/utils/request';

export const productPage = async (params, options = {}) => {
  const {current, pageSize,...rest} = params;
  const res = await request('/auth/java-admin/redpacket/product/page', {
    method: 'POST',
    data: {
        page: current,
        size: pageSize,
        ...rest
    },  
    ...options
  });

  return {
    code: res.code,
    data: res.data.records,
    success: res.success,
    total: res.data.total
  }
}



export const productAdd= async (params, options = {}) => {
  const {...rest}=params
  const res = await request('/auth/java-admin/redpacket/product/add', {
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


export const productDelete= async (params, options = {}) => {
  const {...rest}=params
  const res = await request('/auth/java-admin/redpacket/product/delete', {
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


export const productUpdateStatus= async (params, options = {}) => {
  const {...rest}=params
  const res = await request('/auth/java-admin/redpacket/product/updateStatus', {
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


export const productEdit= async (params, options = {}) => {
  const {...rest}=params
  const res = await request('/auth/java-admin/redpacket/product/edit', {
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


export const updateSort= async (params, options = {}) => {
  const {...rest}=params
  const res = await request('/auth/java-admin/redpacket/product/updateSort', {
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