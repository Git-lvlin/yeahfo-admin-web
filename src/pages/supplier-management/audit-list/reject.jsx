import React from 'react';
import {
  ModalForm,
  ProFormTextArea
} from '@ant-design/pro-form';

export default (props) => {
  const { visible, setVisible, callback } = props;
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
      title={`请确认操作`}
      modalProps={{
      }}
      onVisibleChange={setVisible}
      visible={visible}
      width={550}
      onFinish={(values) => {
        callback(values.auditReason)
        return true;
      }}
      labelAlign="right"
      {...formItemLayout}
    >
      <ProFormTextArea
        name="auditReason"
        label="驳回理由"
        placeholder="请输入驳回理由 30个字以内"
        rules={[{ required: true, message: '请输入驳回理由！' }]}
        fieldProps={{
          rows: 4,
          autoSize: false,
          maxLength: 30
        }}
      />
    </ModalForm>
  );
};