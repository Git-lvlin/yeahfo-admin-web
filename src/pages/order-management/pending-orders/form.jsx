import React from 'react';
import { message } from 'antd';
import {
  ModalForm,
  ProFormText,
  ProFormSelect
} from '@ant-design/pro-form';

const waitTime = (time = 100) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, time);
  });
};

export default (props) => {
  const { visible, setVisible } = props;
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
      title="确认发货"
      modalProps={{
        onCancel: () => console.log('run'),
      }}
      onVisibleChange={setVisible}
      visible={visible}
      width={550}
      onFinish={async (values) => {
        await waitTime(2000);
        console.log(values.name);
        message.success('提交成功');
        return true;
      }}
      labelAlign="right"
      {...formItemLayout}
    >
      <ProFormSelect
        name="select"
        label="快递公司"
        fieldProps={{ defaultValue: '1' }}
        valueEnum={{
          1: '全部',
        }}
      />
      <ProFormText
        name="text"
        label="物流单号"
        placeholder="请输入物流单号，不超过20个字符 "
        // rules={[{ required: true, message: '请输入禁用原因！' }]}
        fieldProps={{
          maxLength: 20
        }}
      />
    </ModalForm>
  );
};