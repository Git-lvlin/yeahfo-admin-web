import React, { useRef, useEffect, useState } from 'react';
import { message, Form } from 'antd';
import ProForm, {
  ModalForm,
  ProFormText,
} from '@ant-design/pro-form';
import { goodsSortTopOld } from '@/services/cms/member/member';

export default (props) => {
  const { detailData, setVisible, onClose, visible, callback } = props;
  const formRef = useRef();
  const [form] = Form.useForm();
  const waitTime = (values) => {
    const { sort, wsSkuId } = values;
    const { type } = detailData;
    const param = {
      wsSkuId: wsSkuId,
      type: type,
      sort: sort,
    }
    return new Promise((resolve, reject) => {
      goodsSortTopOld(param).then((res) => {
        if (res.code === 0) {
          callback();
          resolve(true);
        } else {
          reject(false);
        }
      })
    });
  };

  useEffect(() => {
    if (detailData) {
      const { ...rest } = detailData;
      form.setFieldsValue({
        ...rest
      })
    }
  }, [form, detailData])

  return (
    <ModalForm
      title={'编辑排序'}
      onVisibleChange={setVisible}
      formRef={formRef}
      visible={visible}
      form={form}
      drawerProps={{
        forceRender: true,
        destroyOnClose: true,
        onClose: () => {
          onClose();
        }
      }}
      onFinish={async (values) => {
        await waitTime(values);
        message.success('提交成功');
        return true;
      }}
    >
      <ProForm.Group>
        <ProFormText
          width="sm"
          name="sort"
          label="排序"
          rules={[{ required: true, message: '请输入排序序号' }]}  
        />
      </ProForm.Group>
      <ProFormText
        name="wsSkuId"
        label="wsSkuId"
        hidden
      />
    </ModalForm>
  );
};