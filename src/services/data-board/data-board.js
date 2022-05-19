import request from '@/utils/request'

// 会员数量
export const findDwdMemberCount = async (params = {}, options = {}) => {
  const res = await request('/auth/java-admin/report/accountCount/findDwdMemberCount', {
    method: 'POST',
    data: {
      ...params
    },
    ...options
  })
  return {
    data: res.data,
    success: res.success
  }
}

// 月销售额，完成率
export const gmvPayRat = async (params = {}, options = {}) => {
  const res = await request('/auth/java-admin/report/gmvPayRat', {
    method: 'POST',
    data: {
      ...params
    },
    ...options
  })
  return {
    data: res.data,
    success: res.success
  }
}

// 查找sku数量
export const skuAccount = async (params = {}, options = {}) => {
  const res = await request('/auth/java-admin/report/skuAccount', {
    method: 'POST',
    data: {
      ...params
    },
    ...options
  })
  return {
    data: res.data,
    success: res.success
  }
}

// 每月的登录次数
export const dwdMau = async (params = {}, options = {}) => {
  const res = await request('/auth/java-admin/report/dwdMau', {
    method: 'POST',
    data: {
      ...params
    },
    ...options
  })
  return {
    data: res.data,
    success: res.success
  }
}

// 不同约的销售额日期的整合
export const findYueSales = async (params = {}, options = {}) => {
  const res = await request('/auth/java-admin/report/moreyue/findYueSales', {
    method: 'POST',
    data: {
      ...params
    },
    ...options
  })
  return {
    data: res.data,
    success: res.success
  }
}

// 不同约的gmv日期的整合
export const findYueGmv = async (params = {}, options = {}) => {
  const res = await request('/auth/java-admin/report/moreyue/findYueGmv', {
    method: 'POST',
    data: {
      ...params
    },
    ...options
  })
  return {
    data: res.data,
    success: res.success
  }
}

// 根据不同时间和类型查不同约 
export const findMoreYueGmv = async (params = {}, options = {}) => {
  const res = await request('/auth/java-admin/report/findMoreYueGmv', {
    method: 'POST',
    data: {
      ...params
    },
    ...options
  })
  return {
    data: res.data.moreYueGmvResponseList,
    success: res.success
  }
}

// gmv日总数
export const sumDayGmv = async (params = {}, options = {}) => {
  const res = await request('/auth/java-admin/report/sumDayGmv', {
    method: 'POST',
    data: {
      ...params
    },
    ...options
  })
  return {
    data: res.data,
    success: res.success
  }
}

// gmv周总数
export const sumWeekGmv = async (params = {}, options = {}) => {
  const res = await request('/auth/java-admin/report/sumWeekGmv', {
    method: 'POST',
    data: {
      ...params
    },
    ...options
  })
  return {
    data: res.data,
    success: res.success
  }
}

// 月gmv总数
export const sumMonthGmv = async (params = {}, options = {}) => {
  const res = await request('/auth/java-admin/report/sumMonthGmv', {
    method: 'POST',
    data: {
      ...params
    },
    ...options
  })
  return {
    data: res.data,
    success: res.success
  }
}

// 销售额日总数
export const sumDaySales = async (params = {}, options = {}) => {
  const res = await request('/auth/java-admin/report/sumDaySales', {
    method: 'POST',
    data: {
      ...params
    },
    ...options
  })
  return {
    data: res.data,
    success: res.success
  }
}

// 销售额周总数
export const sumWeekSales = async (params = {}, options = {}) => {
  const res = await request('/auth/java-admin/report/sumWeekSales', {
    method: 'POST',
    data: {
      ...params
    },
    ...options
  })
  return {
    data: res.data,
    success: res.success
  }
}

// 销售额月总数
export const sumMonthSales = async (params = {}, options = {}) => {
  const res = await request('/auth/java-admin/report/sumMonthSales', {
    method: 'POST',
    data: {
      ...params
    },
    ...options
  })
  return {
    data: res.data,
    success: res.success
  }
}

// gmv日订单总数
export const sumDayOrderCount = async (params = {}, options = {}) => {
  const res = await request('/auth/java-admin/report/sumDayOrderCount', {
    method: 'POST',
    data: {
      ...params
    },
    ...options
  })
  return {
    data: res.data,
    success: res.success
  }
}

// gmv周订单总数
export const sumWeekOrderCount = async (params = {}, options = {}) => {
  const res = await request('/auth/java-admin/report/sumWeekOrderCount', {
    method: 'POST',
    data: {
      ...params
    },
    ...options
  })
  return {
    data: res.data,
    success: res.success
  }
}

// gmv月订单总数
export const sumMonthOrderCount = async (params = {}, options = {}) => {
  const res = await request('/auth/java-admin/report/sumMonthOrderCount', {
    method: 'POST',
    data: {
      ...params
    },
    ...options
  })
  return {
    data: res.data,
    success: res.success
  }
}

// 日支付订单总数
export const sumDayPayCount = async (params = {}, options = {}) => {
  const res = await request('/auth/java-admin/report/sumDayPayCount', {
    method: 'POST',
    data: {
      ...params
    },
    ...options
  })
  return {
    data: res.data,
    success: res.success
  }
}

// 周支付订单总数
export const sumWeekPayCount = async (params = {}, options = {}) => {
  const res = await request('/auth/java-admin/report/sumWeekPayCount', {
    method: 'POST',
    data: {
      ...params
    },
    ...options
  })
  return {
    data: res.data,
    success: res.success
  }
}

// 月支付订单总数
export const sumMonthPayCount = async (params = {}, options = {}) => {
  const res = await request('/auth/java-admin/report/sumMonthPayCount', {
    method: 'POST',
    data: {
      ...params
    },
    ...options
  })
  return {
    data: res.data,
    success: res.success
  }
}

// 统计各种约的总和
export const findSumMoreYue = async (params = {}, options = {}) => {
  const res = await request('/auth/java-admin/report/findSumMoreYue', {
    method: 'POST',
    data: {
      ...params
    },
    ...options
  })
  return {
    data: res.data.moreYueGmvResponseList,
    success: res.success
  }
}

// 根据类型和时间查gmv
export const moreTypeGmvSumYue = async (params = {}, options = {}) => {
  const res = await request('/auth/java-admin/report/moreTypeGmvSumYue', {
    method: 'POST',
    data: {
      ...params
    },
    ...options
  })
  return {
    data: [res.data],
    success: res.success
  }
}

// 根据类型和时间查销售额
export const moreTypeSaleSumYue = async (params = {}, options = {}) => {
  const res = await request('/auth/java-admin/report/moreTypeSaleSumYue', {
    method: 'POST',
    data: {
      ...params
    },
    ...options
  })
  return {
    data: [res.data],
    success: res.success
  }
}

// gmv订单数
export const gmvOrder = async (params = {}, options = {}) => {
  const res = await request('/auth/java-admin/report/gmvOrder', {
    method: 'POST',
    data: {
      ...params
    },
    ...options
  })
  return {
    data: res.data.gmvOrderSubDetailResponseList,
    success: res.success
  }
}

// 销售额订单
export const saleOrder = async (params = {}, options = {}) => {
  const res = await request('/auth/java-admin/report/saleOrder', {
    method: 'POST',
    data: {
      ...params
    },
    ...options
  })
  return {
    data: res.data.salesOrderSubDetailResponseList,
    success: res.success
  }
}
