import React from 'react';
import { Form, Button } from 'antd';
import {
  ModalForm,
  ProFormTextArea,
} from '@ant-design/pro-form';
import { refuse } from '@/services/intensive-store-management/store-review'
import { history } from 'umi';

export default (props) => {
  const { id } = props;
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
    const { status, ...rest } = values;
    return new Promise((resolve, reject) => {
      let userInfo = window.localStorage.getItem('user');
      userInfo = userInfo && JSON.parse(userInfo)
      refuse({
        applyId: id,
        optAdminId: userInfo.id,
        optAdminName: userInfo.username,
        ...rest
      }, { showSuccess: true }).then(res => {
        if (res.code === 0) {
          resolve()
          window.history.back()
          setTimeout(() => { window.location.reload(); }, 200)
        } else {
          reject()
        }
      })
    });
  }


  return (
    <ModalForm
      title={`请确认操作`}
      trigger={<Button type="danger">驳回</Button>}
      width={550}
      form={form}
      onFinish={async (values) => {
        await submit(values);
        return true;
      }}
      {...formItemLayout}
    >
      <ProFormTextArea
        name="auditMsg"
        label="驳回理由"
        placeholder="请输入驳回理由 30个字以内"
        rules={[{ required: true, message: '请输入驳回理由' }]}
      />

    </ModalForm >
  );
};