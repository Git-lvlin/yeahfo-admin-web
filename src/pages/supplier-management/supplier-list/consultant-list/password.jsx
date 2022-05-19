import React, { useEffect } from 'react';
import {
  ModalForm,
  ProFormText,
  ProFormDependency,
} from '@ant-design/pro-form';
import { Form } from 'antd';
import { editPwd } from '@/services/supplier-management/supplier-list'
import md5 from 'blueimp-md5';

export default (props) => {
  const { visible, setVisible, data = {} } = props;
  const [form] = Form.useForm()

  const formItemLayout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 14 },
    layout: {
      labelCol: {
        span: 4,
      },
      wrapperCol: {
        span: 14,
      },
    }
  };

  const submit = (password) => {
    editPwd({
      password: md5(password),
      accountId: data.bindAccountId
    }, { showSuccess: true }).then(res => {
      if (res.code === 0) {
        return Promise.resolve()
      }
    })
  }

  useEffect(() => {
    if (data) {
      form.setFieldsValue({
        companyName: data.companyName,
        accountName: data.accountName,
      })
    }
  }, [data, form])

  return (
    <ModalForm
      title={`修改密码`}
      modalProps={{
      }}
      onVisibleChange={setVisible}
      visible={visible}
      width={550}
      onFinish={async (values) => {
        const { password } = values;
        await submit(password);
        return true;
      }}
      form={form}
      labelAlign="right"
      {...formItemLayout}
    >
      <ProFormText
        name="companyName"
        label={`名称`}
        disabled
      />
      <ProFormText
        name="accountName"
        label={`登录账户`}
        disabled
      />
      <ProFormText.Password
        name="password"
        label={`新密码`}
        placeholder="请输入新的登录密码"
        fieldProps={{
          visibilityToggle: false,
          autocomplete: 'new-password'
        }}
        rules={[{ required: true, message: '请输入密码' }]}
      />
      <ProFormDependency name={['password']}>
        {({ password }) => (
          <ProFormText.Password
            name="password1"
            label={`确认新密码`}
            placeholder="请再次输入新的登录密码"
            validateFirst
            fieldProps={{
              visibilityToggle: false,
              autocomplete: 'new-password'
            }}
            rules={[
              { required: true, message: '请输入密码' },
              () => ({
                validator(_, value) {
                  if (password === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('两次输入的密码不一致'));
                },
              })
            ]}
          />
        )}
      </ProFormDependency>

    </ModalForm>
  );
};