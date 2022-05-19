import request from '@/utils/request';

export const saveOrUpdateArticleType = (params = {}, options = {}) => {
    return request('/auth/java-admin/articleType/saveOrUpdateArticleType', {
      method: 'POST',
      data: params,
      ...options
    });
  }

export const articleTypeAdd = async (params = {}, options = {}) => {
const { ...rest } = params;
const res = await request('/auth/java-admin/articleType/saveOrUpdateArticleType', {
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

export const articleTypeDetail = async (params = {}, options = {}) => {
const { ...rest } = params;
const res = await request('/auth/java-admin/articleType/articleTypeDetail', {
    method: 'POST',
    data: {
    ...rest
    },
    ...options
});

return {
    data: res.data,
    success: true,
}
}