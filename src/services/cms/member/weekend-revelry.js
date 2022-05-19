import request from '@/utils/request';

export const cmsWeekList = async (params = {}, options = {}) => {
    const { current, pageSize, ...rest } = params;
    
    const data = {
      page: current,
      size: pageSize,
      ...rest
    }
    const res = await request('/auth/activity/CmsWeek/cmsWeekList', {
      method: 'POST',
      data,
      ...options
    });
  
    return {
      data: res.data.records || [],
      success: true,
      total: res.data.total,
    }
  }

export const cmsWeekSub= (params = {}, options = {}) => {
  return request('/auth/activity/CmsWeek/cmsWeekSub', {
    method: 'POST',
    data: params,
    ...options
  });
}


export const cmsWeekStatusSub = (params = {}, options = {}) => {
  return request('/auth/activity/CmsWeek/cmsWeekStatusSub', {
    method: 'POST',
    data: params,
    ...options
  });
}



export const cmsWeekGoodsList = async (params = {}, options = {}) => {
  const { current, pageSize, ...rest } = params;

  const data = {
    page: current,
    pageSize,
    ...rest
  }

  const res = await request('/auth/activity/CmsWeek/cmsWeekGoodsList', {
    method: 'POST',
    data,
    ...options
  });
  if (!res.data.records.length) {
    res.data = []
  }
  return {
    data: res.data.records || [],
    success: true,
    total: res.data.total,
  }
}

export const cmsGoodsStatusSub = (params = {}, options = {}) => {
  return request('/auth/activity/CmsWeek/cmsWeekGoodsStatusSub', {
    method: 'POST',
    data: params,
    ...options
  });
}


export const cmsWeekGoodsSub = (params = {}, options = {}) => {
  return request('/auth/activity/CmsWeek/cmsWeekGoodsSub', {
    method: 'POST',
    data: params,
    ...options
  });
}


export const WeekCrazyTagSort = (params = {}, options = {}) => {
  return request('/auth/activity/CmsWeek/cmsWeekGoodsSortSub', {
    method: 'POST',
    data: params,
    ...options
  });
}

