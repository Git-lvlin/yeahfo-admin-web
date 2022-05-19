import React, { useEffect } from 'react';
import { Form } from 'antd';
import {
  ModalForm,
  ProFormText,
  ProFormSelect
} from '@ant-design/pro-form';
import { saveGoodsUnit } from '@/services/product-management/product-unit';

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
      const params = {
        ...values
      }

      if (data) {
        params.id = data.id
      }

      saveGoodsUnit({
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
      })
    } else {
      form.resetFields();
    }

  }, [data, form])

  return (
    <ModalForm
      title={`${data ? '编辑' : '新增'}商品单位 `}
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
        name="name"
        label="单位名称"
        placeholder="请输入单位名称"
        validateFirst={true}
        rules={[
          { type: 'string', required: true, message: '请输入1-2个汉字或字母' },
          () => ({
            validator(_, value) {
              if (/^[\u4e00-\u9fa5a-zA-Z]{1,2}$/.test(value)) {
                return Promise.resolve();
              }
              return Promise.reject(new Error('请输入1-2个汉字或字母'));
            },
          })
        ]}
        fieldProps={{
          maxLength: 2,
        }}
      />
      <ProFormSelect
        name="type"
        options={[
          {
            value: 1,
            label: '基本单位',
          },
          {
            value: 2,
            label: '集采单位',
          }
        ]}
        label="单位类型"
        placeholder="请选择商品的单位类型"
        rules={[
          { required: true, message: '请选择商品的单位类型' },
        ]}
      />
      
    </ModalForm>
  );
};