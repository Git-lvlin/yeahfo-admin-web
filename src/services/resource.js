import request from '@/utils/request';

// 资源位列表
export async function getResList(params) {
  return request('/auth/java-admin/cms/json/selByWays', {
    method: 'POST',
    data: params,
  });
}

// 资源位详情
export async function getResDetail(params) {
  return request(`/auth/java-admin/cms/json/selById?id=${!!params.id ? params.id : ""}`, {
    method: 'GET',
  });
}

// 删除列表资源位
export async function getDeleteRes(params) {
  return request('/auth/java-admin/cms/json/delById', {
    method: 'POST',
    data: params,
  });
}

// 添加资源位
export async function addRes(params) {
  return request('/auth/java-admin/cms/json/save', {
    method: 'POST',
    data: params,
  });
}

// 编辑资源位
export async function updateRes(params) {
  return request('/auth/java-admin/cms/json/upd', {
    method: 'POST',
    data: params,
  });
}

// 添加版本号
export async function addVersion(params) {
  return request('/auth/java-admin/cms/appversion/save', {
    method: 'POST',
    data: params,
  });
}

// 更新版本号
export async function updateVersion(params) {
  return request('/auth/java-admin/cms/appversion/update', {
    method: 'POST',
    data: params,
  });
}

// 查询版本号详情
export async function getVersion(params) {
  return request(`/auth/java-admin/cms/appversion/selById?id=${params.id}`, {
    method: 'GET',
  });
}

// 查询版本号列表
export async function getVersionList(params) {
  return request(`/auth/java-admin/cms/appversion/selAll?page=${params.page}&size=${params.size}`, {
    method: 'GET',
  });
}

// 查询所有版本号
export async function getVersionAllList(params) {
  return request('/auth/java-admin/cms/appversion/selAllVersion', {
    method: 'GET',
    data: params,
  });
}

// 导入资源位数据
export async function inputVersionList(params) {
  return request('/auth/java-admin/cms/json/input', {
    method: 'POST',
    headers: {
      "Content-Type": "application/json;charset=UTF-8"
    },
    // data: params,
    body: params,
  });
}

//数据报表分页查询
export const findByPage = async (params, options = {}) => {
  const {current, pageSize,...rest} = params;
  const res = await request('/auth/java-admin/report/config/findByPage', {
    method: 'POST',
    data: {
      page: current,
      size: pageSize,
      ...rest
    },  
    ...options
  });

  return {
    code: res.code,
    data: res.data.records,
    success: res.success,
    total: res.data.total
  }
}

//添加数据报表
export const addConfig = async (params, options = {}) => {
  const {...rest} = params;
  const res = await request('/auth/java-admin/report/config/addConfig', {
    method: 'POST',
    data: {
      ...rest
    },  
    ...options
  });

  return {
    code: res.code,
    data: res.data,
    success: res.success,
  }
}


//数据报表分页编辑
export const updateConfig = async (params, options = {}) => {
  const {...rest} = params;
  const res = await request('/auth/java-admin/report/config/updateConfig', {
    method: 'POST',
    data: {
      ...rest
    },  
    ...options
  });

  return {
    code: res.code,
    data: res.data,
    success: res.success,
  }
}


//数据报表分页详情
export const findById = async (params, options = {}) => {
  const {...rest} = params;
  const res = await request('/auth/java-admin/report/config/findById', {
    method: 'POST',
    data: {
      ...rest
    },  
    ...options
  });

  return {
    code: res.code,
    data: res.data,
    success: res.success,
  }
}

//数据报表删除
export const removeById = async (params, options = {}) => {
  const {...rest} = params;
  const res = await request('/auth/java-admin/report/config/removeById', {
    method: 'POST',
    data: {
      ...rest
    },  
    ...options
  });

  return {
    code: res.code,
    data: res.data,
    success: res.success,
  }
}

//数据报表测试接口
export const configTest = async (params, options = {}) => {
  const {reportCode,responseTemplate} = params;
  const res = await request(`/auth/java-admin/report/config/${reportCode}`, {
    method: 'POST',
    data: JSON.parse(responseTemplate),  
    ...options
  });

  return {
    data: res
  }
}

//获取函数列表
export const findFunctions = async (params, options = {}) => {
  const {current, pageSize,...rest} = params;
  const res = await request('/auth/java-admin/report/config/findFunctions', {
    method: 'POST',
    data: {
      ...rest
    },  
    ...options
  });

  return {
    code: res.code,
    data: res.data,
    success: res.success,
  }
}
