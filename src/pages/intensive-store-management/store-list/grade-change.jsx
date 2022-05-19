import React, { useState } from 'react';
import {
  ModalForm,
  ProFormSelect,
  ProFormTextArea
} from '@ant-design/pro-form';
import { gradeChange } from '@/services/intensive-store-management/store-list'

export default ({ storeNo, callback, visible, setVisible}) => {
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
      gradeChange({
        storeNo,
        ...values,
      }, { showSuccess: true }).then(res => {
        if (res.code === 0) {
          resolve()
          callback()
        } else {
          reject()
        }
      })
    });
  }

  return (
    <ModalForm
      title="店铺等级调整"
      modalProps={{
        onCancel: () => {
          setVisible(false)
        }
      }}
      width={500}
      onFinish={async (values) => {
        await submit(values);
        setVisible(false)
        return true;
      }}
      visible={visible}
      // trigger={trigger}
      {...formItemLayout}
    >
      <ProFormSelect
        label="等级"
        name="levelNum"
        placeholder="请选择要调整到的等级"
        rules={[{ required: true, message: '请选择要调整到的等级' }]}
        options={[
          {
            label: '1',
            value: 1,
          },
          {
            label: '2',
            value: 2,
          },
          {
            label: '3',
            value: 3,
          },
          {
            label: '4',
            value: 4,
          },
          {
            label: '5',
            value: 5,
          },
        ]}
      />
      <ProFormTextArea
        label="备注"
        rules={[{ required: true, message: '请输入备注' }]}
        name="remark"
      />
    </ModalForm>
  );
};