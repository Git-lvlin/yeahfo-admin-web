import request from '@/utils/request';

export const adminList= async (params, options = {}) => {
  const {current,dynamicId,circleId,pageSize,status,dateRange,userName,...rest}=params
  const res = await request('/auth/java-admin/dynamic/adminList', {
    method: 'POST',
    data: {
      dynamicId,
      circleId,
      memberName:userName,
      status:parseInt(status)||0,
      startTime:dateRange&&dateRange[0],
      endTime:dateRange&&dateRange[1],
      page:current,
      size:pageSize,
      ...rest
    },
    ...options
  });
  return {
    code: res.code,
    data: res.data.records,
    total:Number(res.data.total),
    success: res.success,
  }
}