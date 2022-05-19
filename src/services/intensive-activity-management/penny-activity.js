import request from '@/utils/request';

export const getActiveConfigList = async (params = {}, options = {}) => {
  const { current, pageSize, ...rest } = params;
  const res = await request('/auth/activity/wsCent/getActiveConfigList', {
    method: 'POST',
    data: {
      page: current,
      size: pageSize,
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


export const saveWSCentActiveConfig = async (params = {}, options = {}) => {
    const { ...rest } = params;
    const res = await request('/auth/activity/wsCent/saveWSCentActiveConfig', {
    method: 'POST',
    data: {
        ...rest
    },
    ...options
    });

    return {
    data: res.data,
    success: true,
    code: res.code
    }
}

export const getActiveConfigById = async (params = {}, options = {}) => {
  const { ...rest } = params;
  const res = await request('/auth/activity/wsCent/getActiveConfigById', {
  method: 'POST',
  data: {
      ...rest
  },
  ...options
  });

  return {
  data: res.data,
  success: true,
  code: res.code,
  }
}

export const changeStatus = async (params = {}, options = {}) => {
  const { ...rest } = params;
  const res = await request('/auth/activity/wsCent/changeStatus', {
  method: 'POST',
  data: {
      ...rest
  },
  ...options
  });

  return {
  data: res.data,
  success: true,
  code: res.code
  }
}


export const chooseWholesaleList = async (params = {}, options = {}) => {
  const { current, pageSize,wholesaleStartTime, ...rest } = params;
  const res = await request('/auth/wholesale/index/chooseWholesaleList', {
    method: 'POST',
    data: {
      page: current,
      size: pageSize,
      ...rest,
      wholesaleStartTime:{
        start:wholesaleStartTime?.[0],
        end:wholesaleStartTime?.[1]
      },

    },
    ...options
  });

  return {
    data: res.data.records,
    success: true,
    total: res.data.total
  }
}


export const updateActStock = async (params = {}, options = {}) => {
  const { ...rest } = params;
  const res = await request('/auth/activity/wsCent/updateActStock', {
  method: 'POST',
  data: {
      ...rest
  },
  ...options
  });

  return {
  data: res.data,
  success: true,
  code: res.code
  }
}


export const activityGoods = async (params = {}, options = {}) => {
  const { current, pageSize,wholesaleStartTime, ...rest } = params;
  const res = await request('/auth/java-admin/report/config/activityGoods', {
    method: 'POST',
    data: {
      page: current,
      size: pageSize,
      ...rest,
      startTime:wholesaleStartTime?.[0],
      endTime:wholesaleStartTime?.[1]

    },
    ...options
  });

  return {
    data: res.data.records,
    success: true,
    total: res.data.total
  }
}


export const activityData = async (params = {}, options = {}) => {
  const { current, pageSize,...rest } = params;
  const res = await request('/auth/java-admin/report/config/activityData', {
    method: 'POST',
    data: {
      page: current,
      size: pageSize,
      ...rest,
    },
    ...options
  });

  return {
    data: res.data.records,
    success: true,
    code: res.code
  }
}


export const activityDataSum = async (params = {}, options = {}) => {
  const { current, pageSize, ...rest } = params;
  const res = await request('/auth/java-admin/report/config/activityDataSum', {
    method: 'POST',
    data: {
      page: current,
      size: pageSize,
      ...rest,
    },
    ...options
  });

  return {
    data: res.data,
    success: true,
  }
}