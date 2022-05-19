import React from 'react';
import { getAuthority } from '@/utils/authority'

const Auth = ({ children, name }) => {
  const auth = getAuthority();
  return <>
    {auth.find(item => item.name === name) && children}
  </>;
}

export default Auth;

