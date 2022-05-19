import request from '@/utils/request';

export function login(params, options = {}) {
  const { randstr, ...rest } = params;
  const obj = {
    ...rest
  };
  
  if (rest.vertycode) {
    obj.randstr = randstr;
  }

  return request('/auth/login/checkLogin', {
    method: 'POST',
    data: obj,
    ...options
  });
}


export async function LoginOut() {
  return request('/auth/login/LoginOut');
}
