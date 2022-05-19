import request from '@/utils/request';
import moment from 'moment'

export const findAdminDebunkList = async (params = {}, options = {}) => {
  const { current, pageSize,dateTimeRange, ...rest } = params;
  const res = await request('/auth/java-admin/debunkInfo/findAdminDebunkList', {
    method: 'POST',
    data: {
      page: current,
      size: pageSize,
      beginTime:dateTimeRange&&moment(dateTimeRange[0]).valueOf()/1000,
      endTime:dateTimeRange&&moment(dateTimeRange[1]).valueOf()/1000,
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
