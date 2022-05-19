import request from '@/utils/request';

export const queryUserRecordList = async (params, options = {}) => {
  const {current, pageSize,dateTimeRange,...rest} = params;
  const res = await request('/auth/java-admin/redpacket/redPacketRecord/queryUserRecordList', {
    method: 'POST',
    data: {
        page: current,
        size: pageSize,
        beginTime:dateTimeRange&&dateTimeRange[0],
        endTime:dateTimeRange&&dateTimeRange[1],
        ...rest
    },  
    ...options
  });

  return {
    code: res.code,
    data: res.data,
    success: res.success,
    total: res.data.total
  }
}