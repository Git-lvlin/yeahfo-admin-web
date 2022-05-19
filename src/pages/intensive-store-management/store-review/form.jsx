import React from 'react';
import { Form } from 'antd';
import {
  ModalForm,
  ProFormRadio,
  ProFormTextArea,
  ProFormDependency,
} from '@ant-design/pro-form';
import { approve, refuse } from '@/services/intensive-store-management/store-review'

export default (props) => {
  const { visible, setVisible, callback, data } = props;
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
      const apiMethod = status ? approve : refuse
      apiMethod({
        applyId: data.id,
        ...rest
      }, { showSuccess: true }).then(res => {
        if (res.code === 0) {
          resolve()
        } else {
          reject()
        }
      })
    });
  }


  return (
    <ModalForm
      title={`请确认审核店铺  ${data.details.storeName} （店铺ID：${data.id}）`}
      modalProps={{
      }}
      onVisibleChange={setVisible}
      visible={visible}
      width={550}
      form={form}
      onFinish={async (values) => {
        await submit(values);
        callback();
        return true;
      }}
      initialValues={{
        status: 1,
      }}
      {...formItemLayout}
    >
      <ProFormRadio.Group
        name="status"
        label="审核结果"
        options={[
          {
            label: '通过',
            value: 1,
          },
          {
            label: '驳回',
            value: 0,
          },
        ]}
      />
      <ProFormDependency name={['status']}>
        {({ status }) => {
          return status === 0 && <ProFormTextArea
            name="auditMsg"
            label="驳回理由"
            placeholder="请输入驳回理由 50个字以内"
            rules={[{ required: true, message: '请输入驳回理由' }]}
          />
        }}
      </ProFormDependency>

    </ModalForm >
  );
};