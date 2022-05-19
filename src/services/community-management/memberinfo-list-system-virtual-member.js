import request from '@/utils/request';

export const listSystemVirtualMember= async (params, options = {}) => {
  const res = await request('/auth/java-admin/memberInfo/listSystemVirtualMember', {
    method: 'POST',
    data: {},
    ...options
  });
  return {
    data: res.data.length?res.data:[],
  }
}