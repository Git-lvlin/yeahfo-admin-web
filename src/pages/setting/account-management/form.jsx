import React, { useState, useEffect } from 'react';
import {
  ModalForm,
  ProFormText,
  ProFormRadio,
  ProFormSelect,
} from '@ant-design/pro-form';
import { Form, Select } from 'antd';
import { adminAdd, adminEdit } from '@/services/setting/account-management'
import { history } from 'umi';

const FromWrap = ({ value, onChange, content, right }) => (
  <div style={{ display: 'flex' }}>
    <div>{content(value, onChange)}</div>
    <div style={{ flex: 1, marginLeft: 10, minWidth: 180 }}>{right}</div>
  </div>
)

export default (props) => {
  const { visible, setVisible, adminGroupList, callback, onClose, data } = props;
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

  const submit = (values) => {
    return new Promise((resolve, reject) => {
      const apiMethod = data ? adminEdit : adminAdd;
      const obj = { ...values };
      if (data) {
        obj.id = data.id;
      }
      apiMethod(obj, { showSuccess: true })
        .then(res => {
          if (res.code === 0) {
            resolve();
          } else {
            reject();
          }
        })
    });
  }

  useEffect(() => {
    if (data) {
      form.setFieldsValue({
        group_id: data.groupId,
        username: data.username,
        nickname: data.nickname,
        status: data.status,
        mobile: data.mobile,
      });
    }
  }, [data, form])

  return (
    <ModalForm
      title={`${data ? '编辑' : '新建'}账号`}
      modalProps={{
        onCancel: () => onClose(),
      }}
      onVisibleChange={setVisible}
      visible={visible}
      width={550}
      onFinish={async (values) => {
        await submit(values);
        callback();
        return true;
      }}
      form={form}
      labelAlign="right"
      {...formItemLayout}
      initialValues={{
        status: 1,
      }}
    >
      <ProFormText
        name="nickname"
        label="名称"
        placeholder="请输入名称"
        rules={[{ required: true, message: '请输入名称' }]}
        disabled={!!data}
      />

      <ProFormText
        name="username"
        label="登录账号"
        placeholder="请输入登录账号"
        validateFirst
        rules={[
          { required: true, message: '请输入登录账号' },
          { required: true, pattern: /^[a-zA-Z]+$/, message: '登录账号必须为字母' },
        ]}
        disabled={!!data}
      />

      <ProFormText.Password
        name="password"
        label="登录密码"
        placeholder="请输入登录密码"
        fieldProps={{
          visibilityToggle: false,
        }}
        rules={[{ required: !data, message: '请输入登录密码' }]}
      />

      <Form.Item
        name="group_id"
        label="选择角色"
        rules={[{ required: true, message: '请选择角色' }]}
      >
        <FromWrap
          content={(value, onChange) => <Select value={value} style={{ width: 290 }} placeholder="请选择" onChange={onChange} options={adminGroupList} />}
          right={
            <a onClick={() => { history.push('/setting/role-management') }}>角色管理</a>
          }
        />
      </Form.Item>

      {/* <ProFormSelect
        options={adminGroupList}
        
      /> */}

      <ProFormRadio.Group
        required
        name="status"
        label="状态"
        options={[
          {
            label: '启用',
            value: 1,
          },
          {
            label: '禁用',
            value: 0,
          },
        ]}
      />
      <ProFormText
        name="mobile"
        label="手机号码"
        placeholder="请输入手机号码"
        fieldProps={{
          maxLength: 11
        }}
      />
    </ModalForm>
  );
};