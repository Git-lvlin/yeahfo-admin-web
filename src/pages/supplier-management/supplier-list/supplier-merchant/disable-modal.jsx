import React from 'react';
import {
  ModalForm,
  ProFormTextArea
} from '@ant-design/pro-form';

export default (props) => {
  const { visible, setVisible, data = {}, callback } = props;
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

  return (
    <ModalForm
      title={`请确认要${data.status === 1 ? '禁用' : '启用'}：${data.companyUserName}（登录帐号：${data.accountName}）？`}
      modalProps={{
      }}
      onVisibleChange={setVisible}
      visible={visible}
      width={550}
      onFinish={async (values) => {
        callback(values.reason);
        return true;
      }}
      labelAlign="right"
      {...formItemLayout}
    >
      <ProFormTextArea
        name="reason"
        label={`${data.status === 1 ? '禁用' : '启用'}原因`}
        placeholder={`请输入${data.status === 1 ? '禁用' : '启用'}原因 30个字以内`}
        rules={[{ required: true, message: `请输入${data.status === 1 ? '禁用' : '启用'}原因！` }]}
        fieldProps={{
          rows: 4,
          autoSize: false,
          maxLength: 30
        }}
      />
      {data.status === 1 && <div style={{ color: 'red', textIndent: 125 }}>禁用后，将无法登录平台，请谨慎操作！</div>}
    </ModalForm>
  );
};