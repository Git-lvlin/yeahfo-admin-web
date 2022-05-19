import request from '@/utils/request';

export const userList = async (params = {}, options = {}) => {
  const { current, pageSize, loginTime, createTime, area = [], ...rest } = params;
  const obj = {}
  if (area.length === 1) {
    obj.provinceName = area[0].label
  }
  if (area.length === 2) {
    obj.provinceName = area[0].label
    obj.cityName = area[1].label
  }
  if (area.length === 3) {
    obj.provinceName = area[0].label
    obj.cityName = area[1].label
    obj.districtName = area[2].label
  }
  const res = await request('/auth/java-admin/memberInfo/searchByMoreCondition', {
    method: 'POST',
    data: {
      pageNum: current,
      pageSize,
      loginStartTm: loginTime?.[0],
      loginEndTm: loginTime?.[1],
      registerStartTm: createTime?.[0],
      registerEndTm: createTime?.[1],
      ...obj,
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

export const getMemberDetail = (params = {}, options = {}) => {
  return request('/auth/java-admin/memberInfo/getMemberDetail', {
    method: 'POST',
    data: params,
    ...options
  });
}

export const changeMemberStatus = (params = {}, options = {}) => {
  return request('/auth/java-admin/memberInfo/changeMemberStatus', {
    method: 'POST',
    data: params,
    ...options
  });
}