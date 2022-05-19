import request from '@/utils/request';

// 创建导入任务
export const createImportTask = async (params, options = {}) => {
  const res = await request('/auth/java-admin/importTask/createImportTask', {
    method: 'POST',
    data: {
      ...params
    },
    ...options
  });

  return {
    success: res.success
  }
}

// 导入查询任务分页
export const findPage = async (params, options = {}) => {
  const res = await request('/auth/java-admin/importTask/findPage', {
    method: 'POST',
    data: {
      ...params
    },
    ...options
  });
  return {
    data: Array.isArray(res.data.records) ? res.data.records : [],
    total: res.data.total,
    success: res?.success
  }
}