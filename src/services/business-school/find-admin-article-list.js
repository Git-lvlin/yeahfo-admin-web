import request from '@/utils/request';

export const findAdminArticleList = async (params = {}, options = {}) => {
  const { current, pageSize,articleTypeId,TypeId, ...rest } = params;
  const res = await request('/auth/java-admin/articleInfo/findAdminArticleList', {
    method: 'POST',
    data: {
      page: current,
      size: pageSize,
      articleTypeId:TypeId||params.articleTypeId,
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


export const settingRecommend = (params = {}, options = {}) => {
  return request('/auth/java-admin/articleInfo/settingRecommend', {
    method: 'POST',
    data: params,
    ...options
  });
}

export const recommendArticleList = async (params = {}, options = {}) => {
  const { ...rest } = params;
  const res = await request('/auth/java-admin/articleInfo/recommendArticleList', {
    method: 'POST',
    data: {
      ...rest
    },
    ...options
  });

  return {
    data: res.data,
    success: true,
    code:res.code
  }
}



export const adminArticleDetail = async (params = {}, options = {}) => {
  const { ...rest } = params;
  const res = await request('/auth/java-admin/articleInfo/adminArticleDetail', {
    method: 'POST',
    data: {
      ...rest
    },
    ...options
  });

  return {
    data: res.data,
    success: true,
    code:res.code
  }
}




export const saveOrUpdateArticle = (params = {}, options = {}) => {
  return request('/auth/java-admin/articleInfo/saveOrUpdateArticle', {
    method: 'POST',
    data: params,
    ...options
  });
}





