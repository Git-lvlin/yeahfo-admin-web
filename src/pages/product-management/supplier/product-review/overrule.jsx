import React from 'react';
import { Form } from 'antd';
import {
  ModalForm,
  ProFormTextArea
} from '@ant-design/pro-form';

export default (props) => {
  const { visible, setVisible, callback } = props;
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

  return (
    <ModalForm
      title="驳回"
      modalProps={{
        onCancel: () => form.resetFields(),
      }}
      onVisibleChange={setVisible}
      visible={visible}
      width={550}
      form={form}
      onFinish={async (values) => {
        callback(values.text);
        return true;
      }}
      {...formItemLayout}
    >
      <ProFormTextArea
        label="驳回理由"
        width="md"
        rules={[{ required: true, message: '请输入驳回理由！' }]}
        name="text"
        placeholder="请输入驳回理由！"
      />
    </ModalForm >
  );
};