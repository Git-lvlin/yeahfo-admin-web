import React, { useState, useEffect } from 'react';
import ProForm, {
  ModalForm,
  ProFormTextArea
} from '@ant-design/pro-form';
import { Descriptions } from 'antd';

interface types{
    text:string
}

const formItemLayout = {
    labelCol: { span: 2 },
    wrapperCol: { span: 14 },
    layout: {
      labelCol: {
        span: 10,
      },
      wrapperCol: {
        span: 14,
      },
    }
};

export default (props) => {
  const {visible,setVisible,callback,onClose,type}=props
  const waitTime = (values:types) => {
    callback(values)
    setVisible(false)
  };
  return (
    <ModalForm<{
      text: string;
    }>
      title="意见理由"
      onVisibleChange={setVisible}
      visible={visible}
      modalProps={{
        forceRender: true,
        destroyOnClose: true,
        onCancel: () => {
          onClose();
        }
      }}
      onFinish={async (values) => {
        await waitTime(values);
      }}
      {...formItemLayout}
    >
     <ProFormTextArea
        name="text"
        label="备注"
    />
    </ModalForm>
  );
};