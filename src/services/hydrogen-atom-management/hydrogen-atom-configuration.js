import request from '@/utils/request'

// 购买_氢原子交易款的各个角色分成
export const getQyzBuyConfig = async (params = {}, options = {}) => {
  const { ...rest } = params
  const res = await request('/auth/goods/product/getQyzBuyConfig', {
    method: 'POST',
    data: {
      ...rest
    },
    ...options
  })
  return {
    data: res.data,
    success: res.success,
    code: res.code
  }
}


//租赁_氢原子租金款的各个角色提成比例
export const personDivide = async (params = {}, options = {}) => {
  const { ...rest } = params
  const res = await request('/auth/java-admin/bizConfig/findByCode/PERSON_DIVIDE', {
    method: 'POST',
    data: {
      ...rest
    },
    ...options
  })
  return {
    data: res.data,
    success: res.success,
    code: res.code
  }
}


//租赁_氢原子租金款的各个角色提成详情
export const aboutMachine = async (params = {}, options = {}) => {
  const { ...rest } = params
  const res = await request('/auth/java-admin/bizConfig/findByCode/ABOUT_MACHINE', {
    method: 'POST',
    data: {
      ...rest
    },
    ...options
  })
  return {
    data: res.data,
    success: res.success,
    code: res.code
  }
}



//查看续租租金变动配置
export const againRentChange = async (params = {}, options = {}) => {
  const { ...rest } = params
  const res = await request('/auth/java-admin/bizConfig/findByCode/AGAIN_RENT_CHANGE', {
    method: 'POST',
    data: {
      ...rest
    },
    ...options
  })
  return {
    data: res.data,
    success: res.success,
    code: res.code
  }
}

//修改续租租金变动配置接口
export const updateByCode = async (params = {}, options = {}) => {
  const { ...rest } = params
  const res = await request('/auth/java-admin/bizConfig/updateByCode', {
    method: 'POST',
    data: {
      ...rest
    },
    ...options
  })
  return {
    data: res.data,
    success: res.success,
    code: res.code
  }
}

//查看提醒续租通知日期
export const againRentNoticeTime = async (params = {}, options = {}) => {
  const { ...rest } = params
  const res = await request('/auth/java-admin/bizConfig/findByCode/AGAIN_RENT_NOTICE_TIME', {
    method: 'POST',
    data: {
      ...rest
    },
    ...options
  })
  return {
    data: res.data,
    success: res.success,
    code: res.code
  }
}

//查看提醒续租通知文案
export const againRentNoticeContent = async (params = {}, options = {}) => {
  const { ...rest } = params
  const res = await request('/auth/java-admin/bizConfig/findByCode/AGAIN_RENT_NOTICE_CONTENT', {
    method: 'POST',
    data: {
      ...rest
    },
    ...options
  })
  return {
    data: res.data,
    success: res.success,
    code: res.code
  }
}


//查看提醒补租通知日期
export const supplyRentNoticeTime = async (params = {}, options = {}) => {
  const { ...rest } = params
  const res = await request('/auth/java-admin/bizConfig/findByCode/SUPPLY_RENT_NOTICE_TIME', {
    method: 'POST',
    data: {
      ...rest
    },
    ...options
  })
  return {
    data: res.data,
    success: res.success,
    code: res.code
  }
}


//查看提醒续租通知文案
export const supplyRentNoticeConten = async (params = {}, options = {}) => {
  const { ...rest } = params
  const res = await request('/auth/java-admin/bizConfig/findByCode/SUPPLY_RENT_NOTICE_CONTENT', {
    method: 'POST',
    data: {
      ...rest
    },
    ...options
  })
  return {
    data: res.data,
    success: res.success,
    code: res.code
  }
}

//查看首次交租
export const firestRent = async (params = {}, options = {}) => {
  const { ...rest } = params
  const res = await request('/auth/java-admin/bizConfig/findByCode/FIREST_RENT', {
    method: 'POST',
    data: {
      ...rest
    },
    ...options
  })
  return {
    data: res.data,
    success: res.success,
    code: res.code
  }
}


//查看购买发货
export const buySend = async (params = {}, options = {}) => {
  const { ...rest } = params
  const res = await request('/auth/java-admin/bizConfig/findByCode/BUY_SEND', {
    method: 'POST',
    data: {
      ...rest
    },
    ...options
  })
  return {
    data: res.data,
    success: res.success,
    code: res.code
  }
}


//查看租赁发货
export const rentSend = async (params = {}, options = {}) => {
  const { ...rest } = params
  const res = await request('/auth/java-admin/bizConfig/findByCode/RENT_SEND', {
    method: 'POST',
    data: {
      ...rest
    },
    ...options
  })
  return {
    data: res.data,
    success: res.success,
    code: res.code
  }
}


//查看客服或者管理员通知配置
export const serviceOrManagerNotice = async (params = {}, options = {}) => {
  const { ...rest } = params
  const res = await request('/auth/java-admin/bizConfig/findByCode/SERVICE_OR_MANAGER_NOTICE', {
    method: 'POST',
    data: {
      ...rest
    },
    ...options
  })
  return {
    data: res.data,
    success: res.success,
    code: res.code
  }
}

//查看客服或者管理员通知配置
export const serviceNoticeContent = async (params = {}, options = {}) => {
  const { ...rest } = params
  const res = await request('/auth/java-admin/bizConfig/findByCode/SERVICE_NOTICE_CONTENT', {
    method: 'POST',
    data: {
      ...rest
    },
    ...options
  })
  return {
    data: res.data,
    success: res.success,
    code: res.code
  }
}
