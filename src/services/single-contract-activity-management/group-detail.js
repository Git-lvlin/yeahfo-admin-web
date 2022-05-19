import request from '@/utils/request';

export const singleGroupList = async (params = {}, options = {}) => {
  const { current, pageSize, joinGroupTime, createGroupTime, finishGroupTime, ...rest } = params;
  const res = await request('/auth/activity/group/singleGroupList', {
    method: 'POST',
    data: {
      page: current,
      size: pageSize,
      joinGroupStartTime: joinGroupTime?.[0],
      joinGroupEndTime: joinGroupTime?.[1],
      createGroupStartTime: createGroupTime?.[0],
      createGroupEndTime: createGroupTime?.[1],
      finishGroupStartTime: finishGroupTime?.[0],
      finishGroupEndTime: finishGroupTime?.[1],
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

export const multiGroupList = async (params = {}, options = {}) => {
  const { current, pageSize, finishGroupTime, joinGroupTime, createGroupTime, ...rest } = params;
  const res = await request('/auth/activity/group/multiGroupList', {
    method: 'POST',
    data: {
      page: current,
      size: pageSize,
      joinGroupStartTime: joinGroupTime?.[0],
      joinGroupEndTime: joinGroupTime?.[1],
      finishGroupStartTime: finishGroupTime?.[0],
      finishGroupEndTime: finishGroupTime?.[1],
      createGroupStartTime: createGroupTime?.[0],
      createGroupEndTime: createGroupTime?.[1],
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

export const groupMemberList = (params = {}, options = {}) => {
  return request('/auth/activity/group/groupMemberList', {
    method: 'POST',
    data: params,
    ...options
  });
}