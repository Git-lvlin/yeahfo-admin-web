import request from '@/utils/request'
import moment from 'moment'

export const consumerOrderPage = async (params = {}, options = {}) => {
  const { current=1, pageSize=10,dateTimeRange,...rest } = params
  const res = await request('/auth/java-admin/iot/consumerOrder/page', {
    method: 'POST',
    data: {
      page: current,
      size: pageSize,
      startTime:dateTimeRange&&moment(dateTimeRange[0]).format('YYYY-MM-DD HH:mm:ss'),
      endTime:dateTimeRange&&moment(dateTimeRange[1]).format('YYYY-MM-DD HH:mm:ss'),
      ...rest
    },
    ...options
  })
  return {
    data: res.data.records,
    success: res.success,
    code: res.code,
    total: res.data.total
  }
}