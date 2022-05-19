import request from '@/utils/request'

// 分成关系列表
export const queryStatisticsCommissionList = async (params = {}, options = {}) => {
  const res = await request('/auth/java-admin/iot/deviceCommission/queryStatisticsCommissionList', {
    method: 'POST',
    data: params,
    ...options
  })
  return {
    data: res.data.records,
    success: res.success,
    total: res.data.total
  }
}
