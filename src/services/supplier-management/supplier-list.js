import request from '@/utils/request';

export const getCommonList = async (params = {}, options = {}) => {
  const { current, pageSize, ...rest } = params;
  const res = await request('/auth/supplier/user/commonList', {
    method: 'GET',
    params: {
      page: current,
      size: pageSize,
      ...rest
    },
    ...options
  });

  return {
    data: res.data.records,
    success: true,
    total: res.data.total
  }
}

export const helperList = async (params = {}, options = {}) => {
  const { current, pageSize, ...rest } = params;
  const res = await request('/auth/supplier/user/helperList', {
    method: 'GET',
    params: {
      page: current,
      size: pageSize,
      ...rest
    },
    ...options
  });

  return {
    data: res.data.records,
    success: true,
    total: res.data.total
  }
}

export const supplierAdd = (params = {}, options = {}) => {
  return request('/auth/supplier/user/adds', {
    method: 'POST',
    data: params,
    ...options
  });
}

export const supplierEdit = (params = {}, options = {}) => {
  return request('/auth/supplier/user/edits', {
    method: 'POST',
    data: params,
    ...options
  });

}
export const openAccount = (params = {}, options = {}) => {
  return request('/auth/supplier/bank_account/openAccount', {
    method: 'POST',
    data: params,
    ...options
  });
}

export const details = (params = {}, options = {}) => {
  return request('/auth/supplier/user/details', {
    method: 'get',
    params,
    ...options
  });
}

export const helperAdds = (params = {}, options = {}) => {
  return request('/auth/supplier/user/helperAdds', {
    method: 'POST',
    data: params,
    ...options
  });
}

export const helperEdits = (params = {}, options = {}) => {
  return request('/auth/supplier/user/helperEdits', {
    method: 'POST',
    data: params,
    ...options
  });
}

export const statusSwitch = (params = {}, options = {}) => {
  return request('/auth/supplier/user/switch', {
    method: 'POST',
    data: params,
    ...options
  });
}

export const editPwd = (params = {}, options = {}) => {
  return request('/auth/supplier/account/editPwd', {
    method: 'POST',
    data: params,
    ...options
  });
}

export const categoryAll = (params = {}, options = {}) => {
  return request('/auth/goods/product/categoryAll', {
    method: 'get',
    params,
    ...options
  });
}

export const detailExt = (params = {}, options = {}) => {
  return request('/auth/supplier/user/detailExt', {
    method: 'get',
    params,
    ...options
  });
}

export const addSelectCommonList = async (params = {}, options = {}) => {
  const { current, pageSize, ...rest } = params;
  const res = await request('/auth/supplier/user/addSelectCommonList', {
    method: 'GET',
    params: {
      page: current,
      size: pageSize,
      ...rest
    },
    ...options
  });

  return {
    data: res.data.records,
    success: true,
    total: res.data.total
  }
}

export const addSelectHelperList = async (params = {}, options = {}) => {
  const { current, pageSize, ...rest } = params;
  const res = await request('/auth/supplier/user/addSelectHelperList', {
    method: 'GET',
    params: {
      page: current,
      size: pageSize,
      ...rest
    },
    ...options
  });

  return {
    data: res.data.records,
    success: true,
    total: res.data.total
  }
}

export const getBanks = async () => {
  const res = await request('/auth/supplier/Bank_Account/getBanks', {
    method: 'GET',
  });

  let data = [];

  if (res.code === 0) {
    data = res.data.map(item => ({ label: item.bankName, value: item.bankCode }))
  }

  return data;
}

export const getAreas = async () => {
  return request('/auth/supplier/Bank_Account/getAreas', {
    method: 'GET',
  });
}

export const delSupplier = (params = {}, options = {}) => {
  return request('/auth/supplier/user/delSupplier', {
    method: 'POST',
    data: params,
    ...options
  });
}

export const resetPwd = (params = {}, options = {}) => {
  return request('/auth/supplier/user/resetPwd', {
    method: 'POST',
    data: params,
    ...options
  });
}

export const searchUniName = (params = {}, options = {}) => {
  return request('/auth/supplier/user/searchUniName', {
    method: 'POST',
    data: params,
    ...options
  });
}
