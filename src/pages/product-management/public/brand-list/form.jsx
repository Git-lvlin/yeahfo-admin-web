import React, { useEffect } from 'react';
import { Form } from 'antd';
import {
  ModalForm,
  ProFormText,
} from '@ant-design/pro-form';
import Upload from '@/components/upload'
import { brandAdd, brandEdit } from '@/services/product-management/brand-list';

export default (props) => {
  const { visible, setVisible, callback, onCancel, data } = props;
  const [form] = Form.useForm()
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
      const apiMethod = data ? brandEdit : brandAdd;
      const params = {
        ...values
      }

      if (data) {
        params.brandId = data.brandId
      }

      apiMethod({
        ...params,
      }, { showSuccess: true }).then(res => {
        if (res.code === 0) {
          resolve()
        } else {
          reject()
        }
      }).catch(() => {
        reject()
      })
    });
  }

  useEffect(() => {
    if (data) {
      form.setFieldsValue({
        ...data,
        brandLogo: data.brandLogo
      })
    } else {
      form.resetFields();
    }

  }, [data, form])

  return (
    <ModalForm
      title={`${data ? '编辑' : '添加'}品牌`}
      modalProps={{
        onCancel: () => onCancel(),
      }}
      onVisibleChange={setVisible}
      visible={visible}
      width={550}
      onFinish={async (values) => {
        await submit(values);
        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
        callback && callback();
        return true;
      }}
      form={form}
      labelAlign="right"
      {...formItemLayout}
    >
      <ProFormText
        name="brandName"
        label="品牌名称"
        placeholder="请输入品牌名称"
        rules={[{ required: true, message: '请输入品牌名称' }]}
        fieldProps={{
          maxLength: 12,
        }}
      />
      <Form.Item
        label="品牌logo"
        name="brandLogo"
        rules={[{ required: true, message: '请上传品牌logo' }]}
        tooltip={
          <dl>
            <dt>图片要求</dt>
            <dd>1.图片大小5MB以内</dd>
            <dd>2.图片格式png/jpg</dd>
          </dl>
        }
      >
        <Upload
          maxCount={1}
          accept="image/*"
          code={217}
          size={5 * 1024}
        />
      </Form.Item>
    </ModalForm>
  );
};