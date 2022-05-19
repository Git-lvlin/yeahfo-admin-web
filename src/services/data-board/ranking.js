import request from '@/utils/request'

// B端集约GMV-商家月排名
export const bSupGmvRanking = async (params = {}, options = {}) => {
  const res = await request('/auth/java-admin/report/bjiyue/supGmvRanking', {
    method: 'POST',
    data: {
      ...params
    },
    ...options
  })
  return {
    data: res.data?.dwdBJiyueGmvSupplierRankingResponseList,
    success: res.success
  }
}

// B端集约GMV-会员店月排名
export const bMemberGmvRanking = async (params = {}, options = {}) => {
  const res = await request('/auth/java-admin/report/bjiyue/memberGmvRanking', {
    method: 'POST',
    data: {
      ...params
    },
    ...options
  })
  return {
    data: res.data?.memberMonRankingResponseList,
    success: res.success
  }
}

// B端集约销售额商家月排名
export const saleSupplierMember = async (params = {}, options = {}) => {
  const res = await request('/auth/java-admin/report/bjiyue/saleSupplierMember', {
    method: 'POST',
    data: {
      ...params
    },
    ...options
  })
  return {
    data: res.data?.saleSupplierMonRankingResponseList,
    success: res.success
  }
}

// B端集约销售额-会员店月排名
export const saleMemberRanking = async (params = {}, options = {}) => {
  const res = await request('/auth/java-admin/report/bjiyue/saleMemberRanking', {
    method: 'POST',
    data: {
      ...params
    },
    ...options
  })
  return {
    data: res.data?.saleMemberMonRankingResponseList,
    success: res.success
  }
}

// c端集约GMV-会员店月排名
export const cMemberGmvRanking = async (params = {}, options = {}) => {
  const res = await request('/auth/java-admin/report/cjiyue/memberGmvRanking', {
    method: 'POST',
    data: {
      ...params
    },
    ...options
  })
  return {
    data: res.data?.memberMonRankingResponseList,
    success: res.success
  }
}

// c端集约销售额-会员店月排名
export const memberSalesRanking = async (params = {}, options = {}) => {
  const res = await request('/auth/java-admin/report/cjiyue/memberSalesRanking', {
    method: 'POST',
    data: {
      ...params
    },
    ...options
  })
  return {
    data: res.data?.dwdSalesMemberMonRankingResponseList,
    success: res.success
  }
}

// c端秒约gmv-商家月排名
export const cSupGmvRanking = async (params = {}, options = {}) => {
  const res = await request('/auth/java-admin/report/cmiao/supGmvRanking', {
    method: 'POST',
    data: {
      ...params
    },
    ...options
  })
  return {
    data: res.data?.miaoGmvMemberMonRankingResponseList,
    success: res.success
  }
}

// c端秒约销售额-会员店月排名
export const supSalesRanking = async (params = {}, options = {}) => {
  const res = await request('/auth/java-admin/report/cmiao/supSalesRanking', {
    method: 'POST',
    data: {
      ...params
    },
    ...options
  })
  return {
    data: res.data?.miaoSaleSupplierMonRankingResponseList,
    success: res.success
  }
}

// C端-1688-GMV-内部店-月排名
export const gmvAgentMonRanking = async (params = {}, options = {}) => {
  const res = await request('/auth/java-admin/report/c1688/gmvAgentMonRanking', {
    method: 'POST',
    data: {
      ...params
    },
    ...options
  })
  return {
    data: res.data?.dwdC1688GmvAgentMonRankingResponseList,
    success: res.success
  }
}

// C端-1688-销售额-内部店-月排名
export const saleAgentMonRanking = async (params = {}, options = {}) => {
  const res = await request('/auth/java-admin/report/c1688/saleAgentMonRanking', {
    method: 'POST',
    data: {
      ...params
    },
    ...options
  })
  return {
    data: res.data?.c1688SaleAgentMonRankingResponseList,
    success: res.success
  }
}

// 商家idGMV排名
export const gmvFindByStoreId = async (params = {}, options = {}) => {
  const res = await request('/auth/java-admin/report/gmvFindByStoreId', {
    method: 'POST',
    data: {
      ...params
    },
    ...options
  })
  return {
    data: res.data?.orderSubDetailResponseList,
    success: res.success
  }
}

// 供应商idGMV排名
export const gmvFindBySupperId = async (params = {}, options = {}) => {
  const res = await request('/auth/java-admin/report/gmvFindBySupperId', {
    method: 'POST',
    data: {
      ...params
    },
    ...options
  })
  return {
    data: res.data?.orderSubDetailResponseList,
    success: res.success
  }
}

// 商家id销售额排名
export const saleFindByStoreId = async (params = {}, options = {}) => {
  const res = await request('/auth/java-admin/report/saleFindByStoreId', {
    method: 'POST',
    data: {
      ...params
    },
    ...options
  })
  return {
    data: res.data?.orderSubDetailResponseList,
    success: res.success
  }
}

// 供应商id销售额排名
export const saleFindBySupperId = async (params = {}, options = {}) => {
  const res = await request('/auth/java-admin/report/saleFindBySupperId', {
    method: 'POST',
    data: {
      ...params
    },
    ...options
  })
  return {
    data: res.data?.orderSubDetailResponseList,
    success: res.success
  }
}