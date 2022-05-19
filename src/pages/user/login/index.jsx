import {
  LockOutlined,
  UserOutlined,
  SafetyCertificateOutlined,
} from '@ant-design/icons';
import { message } from 'antd';
import React, { useState } from 'react';
import ProForm, { ProFormCheckbox, ProFormText } from '@ant-design/pro-form';
import { Button } from 'antd';
import { history } from 'umi';
import * as api from '@/services/login';
import { getPageQuery } from '@/utils/utils';
import styles from './index.less';
import logo from '@/assets/logo.png'
// import md5 from 'blueimp-md5';

const Login = () => {
  const [randstr, setRandstr] = useState(Math.random());
  const [isVertyfy, setIsVertyfy] = useState(false);
  // const [account] = useState(JSON.parse(window.localStorage.getItem('account')) || {});

  const login = (payload) => {
    const { name, passwd, vertycode } = payload
    api.login({
      name,
      passwd,
      // passwd: md5(passwd),
      vertycode,
      randstr: `${randstr}`,
    }, { showError: true, noAuth: true }).then(res => {
      setIsVertyfy(res?.data?.isVertyfy)
      if (res.code === 0) {

        // if (autoLogin) {
        //   window.localStorage.setItem('account', JSON.stringify({ name, passwd }))
        // } else {
        //   window.localStorage.removeItem('account');
        // }
        window.localStorage.setItem('token', res.data.token)
        window.localStorage.setItem('nickname', res.data.nickname)
        window.localStorage.setItem('user', JSON.stringify({ id: res.data.id, username: res.data.username }))
        const urlParams = new URL(window.location.href);
        const params = getPageQuery();
        message.success('登录成功！');
        let { redirect } = params;

        if (redirect) {
          const redirectUrlParams = new URL(redirect);

          if (redirectUrlParams.origin === urlParams.origin) {
            redirect = redirect.substr(urlParams.origin.length);

            if (redirect.match(/^\/.*#/)) {
              redirect = redirect.substr(redirect.indexOf('#') + 1);
            }
          } else {
            window.location.href = '/';
            return;
          }
        }

        history.replace(redirect || '/');
      }

    })
  }

  const getCaptchaUrl = () => {
    return `${API_URL}/auth/vertycode?randstr=${randstr}`
  }

  const checkIsVertyfy = (value) => {
    api.login({
      name: value
    }, { noAuth: true, showError: false }).then(res => {
      setIsVertyfy(res?.data?.isVertyfy)
    })
  }

  const blur = (e) => {
    const { value } = e.target;

    if (value.trim()) {
      checkIsVertyfy(value)
    }
  }

  const upDateCaptchaImg = () => { setRandstr(Math.random()) }

  // useEffect(() => {
  //   if (account.name) {
  //     checkIsVertyfy(account.name)
  //   }
  // }, [account])

  return (
    <div className={styles.main}>
      <div className={styles.title_wrap}>
        <div className={styles.logo}>
          <img src={logo} />
        </div>
        <div className={styles.title}>
          约购运营管理平台
          <div>始终以数据增长为唯一目标</div>
        </div>
      </div>
      <ProForm
        submitter={{
          render: (props) => {
            return (
              <div className={styles.submit_wrap}>
                <Button size="large" style={{ marginBottom: 10, width: '100%' }} key="1" type="primary" onClick={() => props.form?.submit?.()}>
                  登录
                </Button>
                {/* <ProFormCheckbox noStyle name="autoLogin">
                  记住账号密码
                </ProFormCheckbox> */}
              </div>
            )
          },
        }}
        onFinish={(values) => {
          login(values);
          return Promise.resolve();
        }}
      >
        <ProFormText
          name="name"
          fieldProps={{
            size: 'large',
            prefix: <UserOutlined className={styles.prefixIcon} />,
            onBlur: blur
          }}
          placeholder='请输入账号'
          rules={[
            {
              required: true,
              message: "请输入账号",
            },
          ]}
        />

        <ProFormText.Password
          name="passwd"
          fieldProps={{
            size: 'large',
            prefix: <LockOutlined className={styles.prefixIcon} />,
            visibilityToggle: false,
            allowClear: true,
          }}
          placeholder='请输入密码'
          rules={[
            {
              required: true,
              message: '请输入密码'
            },
          ]}
        />

        {isVertyfy && <div style={{ display: 'flex' }}>
          <ProFormText
            name="vertycode"
            fieldProps={{
              size: 'large',
              prefix: <SafetyCertificateOutlined className={styles.prefixIcon} />,
            }}
            placeholder='请输入图形验证码'
            rules={[
              {
                required: true,
                message: "请输入图形验证码",
              },
            ]}
          />
          <img
            style={{ cursor: 'pointer', width: 80, height: 40, marginLeft: 10 }}
            src={getCaptchaUrl()}
            onClick={upDateCaptchaImg}
          />
        </div>}
      </ProForm>
    </div>
  );
};

export default Login;
