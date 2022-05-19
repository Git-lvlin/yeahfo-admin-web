import request from '@/utils/request'

// 创建导出任务
export const createExportTask = async (params = {}, options = {}) => {
  const res = await request('/auth/java-admin/exportTask/createExportTask', {
    method: 'POST',
    data: {
      ...params
    },
    ...options
  })
  return {
    data: res.data,
    success: res.success
  }
}

// 导出任务分页查询
export const findByWays = async (params = {}, options = {}) => {
  const res = await request('/auth/java-admin/exportTask/findByWays', {
    method: 'POST',
    data: {
      ...params
    },
    ...options
  });

  return {
    data: Array.isArray(res.data.records) ? res.data.records : [],
    total: res?.data?.total,
    success: res?.success
  }
}

// id查找导出任务
export const findById = async (params = {}, options = {}) => {
  const res = await request('/auth/java-admin/exportTask/findById', {
    method: 'POST',
    data: {
      ...params
    },
    ...options
  });

  return {
    data: res.data,
    success: res?.success
  }
}


// 取消任务
export const cancelTask = async (params = {}, options = {}) => {
  const res = await request('/auth/java-admin/exportTask/cancelTask', {
    method: 'POST',
    data: {
      ...params
    },
    ...options
  });

  return {
    data: res.data,
    success: res?.success,
    code:res.code
  }
}


