import request from '@/utils/request'

// 运营商收益分页
export const operationCommissionPage = async (params, options= {}) => {
  const { current=1, pageSize=10, createTime, ...rest } = params
  const res = await request('/auth/java-admin/financial/trans/operationCommissionPage', {
    method: 'POST',
    data: {
      page: current,
      size: pageSize,
      begin: createTime?.[0],
      end: createTime?.[1],
      ...rest
    },
    ...options
  })

  return {
    data: res?.data.records,
    success: res?.success,
    total: res?.data.total
  }
}