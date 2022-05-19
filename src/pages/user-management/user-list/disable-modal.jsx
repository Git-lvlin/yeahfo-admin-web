import React from 'react';
import {
  ModalForm,
  ProFormTextArea
} from '@ant-design/pro-form';
import { changeMemberStatus } from '@/services/user-management/user-list';

export default (props) => {
  const { visible, setVisible, data, callback } = props;
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
      changeMemberStatus({
        ...values,
        status: 0,
        id: data.id,
      }).then(res => {
        if (res.code === 0) {
          resolve()
          callback();
        } else {
          reject()
        }
      }).catch(() => {
        reject()
      })
    });
  }

  return (
    <ModalForm
      title={`请确认要禁用会员：${data.nickName}（手机号：${data.phoneNumber}）？`}
      modalProps={{
      }}
      onVisibleChange={setVisible}
      visible={visible}
      width={550}
      onFinish={async (values) => {
        await submit(values);
        return true;
      }}
      labelAlign="right"
      {...formItemLayout}
    >
      <ProFormTextArea
        name="banReason"
        label="禁用原因"
        placeholder="请输入禁用原因 30个字以内"
        rules={[{ required: true, message: '请输入禁用原因！' }]}
        fieldProps={{
          rows: 4,
          autoSize: false,
          maxLength: 30
        }}
      />
      <div style={{ color: 'red', textIndent: 125 }}>禁用后，会员将无法登录平台，请谨慎操作！</div>
    </ModalForm>
  );
};