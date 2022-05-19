import React, { useState, useEffect } from 'react';
import { Form } from 'antd';
import {
  ModalForm,
  ProFormText,
  ProFormSwitch,
  ProFormSelect,
} from '@ant-design/pro-form';
import md5 from 'blueimp-md5';
import { roleList, addAccount, editAccount } from '@/services/supplier-management/supplier-sub-account';

export default (props) => {
  const { visible, setVisible, detailData, callback, onClose, accountId } = props;
  const [rules, setRules] = useState([]);
  const [form] = Form.useForm();
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
    const { password, status, ...rest } = values;
    return new Promise((resolve, reject) => {
      const apiMethod = detailData ? editAccount : addAccount
      apiMethod({
        password: password ? md5(password) : '',
        id: detailData?.id,
        status: status ? 1 : 2,
        accountId: +accountId,
        ...rest,
      }, { showSuccess: true }).then(res => {
        if (res.code === 0) {
          resolve();
          callback();
        } else {
          reject();
        }
      })
    });
  }


  useEffect(() => {
    if (detailData) {
      const { password, ...rest } = detailData;
      form.setFieldsValue({
        ...rest,
        status: detailData.status === 1
      })
    }

    roleList({
      accountId,
      size: 999,
    }).then(res => {
      if (res.code === 0) {
        setRules(res.data.records.map(item => ({ label: item.title, value: item.id })))
      }
    })

  }, [form, detailData, accountId]);

  return (
    <ModalForm
      title={`${detailData ? '编辑' : '新建'}子账号`}
      onVisibleChange={setVisible}
      modalProps={{
        forceRender: true,
        destroyOnClose: true,
        width: 500,
        onCancel: () => {
          onClose();
        }
      }}
      form={form}
      onFinish={async (values) => {
        await submit(values);
        return true;
      }}
      visible={visible}
      initialValues={{
        status: true,
      }}
      {...formItemLayout}
    >
      <ProFormText
        name="nickname"
        label="名称"
        placeholder="请输入名称"
        rules={[{ required: true, message: '请输入名称' }]}
        fieldProps={{
          maxLength: 30,
        }}
      />
      <ProFormText
        name="accountName"
        label="登录账号"
        placeholder="请输入登录账号"
        rules={[{ required: true, message: '请输入登录账号' }]}
        fieldProps={{
          maxLength: 18,
        }}
        disabled={detailData}
      />
      <ProFormText.Password
        name="password"
        label="登录密码"
        placeholder="请输入登录密码"
        rules={[{ required: !detailData, message: '请输入登录密码' }]}
        fieldProps={{
          maxLength: 18,
          visibilityToggle: false,
        }}
      />
      <ProFormSelect
        name="roleId"
        label="角色"
        placeholder="请选择"
        options={rules}
        rules={[{ required: true, message: '请选择角色' }]}
      />
      <ProFormSwitch checkedChildren="开" unCheckedChildren="关" name="status" label="是否开启" />
    </ModalForm>
  );
};