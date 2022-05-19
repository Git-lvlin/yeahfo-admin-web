// 分页查询导出配置
export const findByWays = async (params, options= {}) => {
  const { current=1, pageSize=10, ...rest } = params
  const res = await request('/auth/java-admin/exportConfig/findByWays', {
    method: 'POST',
    data: {
      page: current,
      size: pageSize,
      ...rest
    },
    ...options
  })

  return {
    success: res?.success,
    data: res?.data.records,
    total: res?.data?.total
  }
}

// 添加导出配置
export const add = async (params, options= {}) => {
  const res = await request('/auth/java-admin/exportConfig/add', {
    method: 'POST',
    data: params,
    ...options
  })

  return {
    success: res?.success
  }
}
