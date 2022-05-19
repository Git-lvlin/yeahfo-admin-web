import request from '@/utils/request';

export const storeList = async (params = {}, options = {}) => {
  const { current,...rest} = params;
  const res = await request('/auth/store/AgentShop/page', {
    method: 'POST',
    data: {
      page: current,
      ...rest
    },
    ...options
  });

  return {
    data: res.data.records.length?res.data.records:[],
    success: true,
    total: res.data.total
  }
}

export const storeDetail = (params = {}, options = {}) => {
  return request('/auth/store/AgentShop/detail', {
    method: 'GET',
    params,
    ...options,
  });
}

export const storeAdd = (params = {}, options = {}) => {
  return request('/auth/store/AgentShop/add', {
    method: 'POST',
    data: params,
    ...options,
  });
}

export const storeEdit = (params = {}, options = {}) => {
  const {storeNo,...rest}=params
  return request('/auth/store/AgentShop/edit', {
    method: 'POST',
    data: {
      storeNo,
      ...rest
    },
    ...options,
  });
}

export const statusSwitch = (params = {}, options = {}) => {
  return request('/auth/store/AgentShop/status', {
    method: 'POST',
    data: params,
    ...options,
  });
}

export const commissionSum = async (params = {}, options = {}) => {
  const res = await request('/auth/store/AgentShopMoney/CommissionSum', {
    method: 'POST',
    data: params,
    ...options,
  });
  return {
    data: res.data,
    success: true,
  }
}

export const commissionPage = async (params = {}, options = {}) => {
  const { current, pageSize,storeNo, ...rest } = params;
  const res = await request('/auth/store/AgentShopMoney/CommissionPage', {
    method: 'POST',
    data:{
      page: current,
      size: pageSize,
      storeNo,
      ...rest
  },
    ...options,
  });
  return {
    data: res.data.records,
    success: true,
    total: res.data.total
  }
  
}

export const file_tpl_url = async (params = {}, options = {}) => {
  const { current, pageSize, ...rest } = params;
  const res = await request('/auth/store/AgentShop/file_tpl_url', {
    method: 'POST',
    data: {
      page: current,
      size: pageSize,
      ...rest
    },
    ...options
  });
  return {
    data: res.data,
    success: true
  }
}

export const findPage = async (params = {}, options = {}) => {
  const {current} = params;
  const res = await request('/auth/java-admin/importTask/findPage', {
    method: 'POST',
    data: {
      code:'inner_store_import',
      pageSize:10,
      page:current
    },
    ...options
  });
  return {
    code:res.code,
    data: res.data.records,
    total:Number(res.data.total),
    success: true
  }
}

export const createImportTask = async (params = {}, options = {}) => {
  const { fileUrl,param} = params;
  const res = await request('/auth/java-admin/importTask/createImportTask', {
    method: 'POST',
    data: {
     code:'inner_store_import',
     fileUrl,
     param
    },
    ...options
  });
  return {
    code:res.code,
    data: res.data,
    success: true
  }
}

export const import_store = async (params = {}, options = {}) => {
  const { current, pageSize, ...rest } = params;
  const res = await request('/auth/store/AgentShop/import_store', {
    method: 'POST',
    data: {
      page: current,
      size: pageSize,
      ...rest
    },
    ...options
  });
  return {
    code:res.code,
    data: res.data,
    success: true
  }
}

export const get_bank_data= async (params = {}, options = {}) => {
  const res = await request('/auth/store/AgentShop/get_bank_data', {
    method: 'POST',
    data: {
     ...params
    },
    ...options
  });
  return {
    code:res.code,
    data: res.data,
    success: true
  }
}


export const agent_bank_detail= async (params = {}, options = {}) => {
  const res = await request('/auth/store/AgentShop/agent_bank_detail', {
    method: 'POST',
    data: {
     ...params
    },
    ...options
  });
  return {
    code:res.code,
    data: res.data,
    success: true
  }
}

export const agent_bank_edit= async (params = {}, options = {}) => {
  const res = await request('/auth/store/AgentShop/agent_bank_edit', {
    method: 'POST',
    data: {
     ...params
    },
    ...options
  });
  return {
    code:res.code,
    data: res.data,
    success: true
  }
}


export const AgentShopDelete= async (params = {}, options = {}) => {
  const res = await request('/auth/store/AgentShop/delete', {
    method: 'POST',
    data: {
     ...params
    },
    ...options
  });
  return {
    code:res.code,
    data: res.data,
    success: true
  }
}


export const accountDetail= async (params = {}, options = {}) => {
  const res = await request('/auth/java-admin/financial/account/detail', {
    method: 'POST',
    data: {
     ...params
    },
    ...options
  });
  return {
    code:res.code,
    data: res.data,
    success: true
  }
}

export const memberShopCancelDetail= async (params = {}, options = {}) => {
  const res = await request('/auth/store/memberShopCancel/detail', {
    method: 'POST',
    data: {
     ...params
    },
    ...options
  });
  return {
    code:res.code,
    data: res.data,
    success: true
  }
}