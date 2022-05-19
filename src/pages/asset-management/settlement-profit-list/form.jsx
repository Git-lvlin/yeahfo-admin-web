import React, { useEffect } from 'react';
import { Form } from 'antd';
import {
  ModalForm,
  ProFormText,
} from '@ant-design/pro-form';
import * as api from '@/services/product-management/product-category'

export default (props) => {
  const { visible, setVisible, callback, gcName, id, type } = props;
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
    return new Promise((resolve, reject) => {
      const apiMethod = type === 'add' ? api.categoryAdd : api.categoryEdit;
      const params = {
        ...values,
        gcShow: 1,
      }

      if (type === 'add') {
        params.gcParentId = id
      } else {
        params.id = id;
      }

      apiMethod({
        ...params,
      }, { showSuccess: true, showError: true }).then(res => {
        if (res.code === 0) {
          resolve();
        } else {
          reject();
        }
      })
    });
  }

  useEffect(() => {
    form?.setFieldsValue({
      gcName,
    })
  }, [form, gcName])

  return (
    <ModalForm
      title={'结算分润比例设置'}
      modalProps={{
        onCancel: () => form.resetFields(),
      }}
      onVisibleChange={setVisible}
      visible={visible}
      width={550}
      form={form}
      onFinish={async (values) => {
        await submit(values);
        form.resetFields();
        callback();
        return true;
      }}
      {...formItemLayout}
    >
      <ProFormText
        label="名称"
        width="md"
        rules={[
          { type: 'string', required: true, message: '分类名称长度应大于等于2个汉字，小于等于4个汉字', min: 2, max: 4 },
          () => ({
            validator(_, value) {
              if (/^[\u4e00-\u9fa5]{2,4}$/.test(value)) {
                return Promise.resolve();
              }
              return Promise.reject(new Error('分类名称只支持汉字'));
            },
          })
        ]}
        validateFirst={true}
        name="gcName"
        fieldProps={{
          maxLength: 4,
          
        }}
      />
    </ModalForm >
  );
};