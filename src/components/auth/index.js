import Auth from './auth';
import { getAuthority } from '@/utils/authority'

const getAuth = (name) => {
  const auth = getAuthority()
  return auth.find(item => item.name === name)
}

export {
  getAuth,
}

export default Auth;
