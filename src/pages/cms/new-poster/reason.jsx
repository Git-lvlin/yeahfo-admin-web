import React, { useRef, useEffect } from 'react';
import { message, Form } from 'antd';
import ProForm, {
  ModalForm,
  ProFormText,
} from '@ant-design/pro-form';
import { posterUpData } from '@/services/cms/member/member';

export default (props) => {
  const { detailData, setVisible, onClose, visible, refresh, setRefresh, type } = props;
  const formRef = useRef();
  const [form] = Form.useForm();

  const waitTime = (values) => {
    const { ...rest } = values
    const param = {
      ...rest,
      state: 0,
      version: 3,
      type: type
    }
    return new Promise((resolve, reject) => {
      posterUpData(param).then((res) => {
        if (res.code === 0) {
          setRefresh(!refresh)
          resolve(true);
        } else {
          reject(false);
        }
      })
  
    });
  };

  useEffect(() => {
    if (detailData) {
      const { id } = detailData;
      form.setFieldsValue({
        id
      })
    }
  }, [form, detailData])

  return (
    <ModalForm
      title={`请确认要下架海报：${detailData.title}？`}
      width={400}
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
        // 不返回不会关闭弹框
        return true;
      }}
    >
      <ProForm.Group>
        <ProFormText 
          width="sm"
          name="offDesc"
          label="下架原因"
          fieldProps={{
            maxLength: 15,
            minLength: 5,
          }}
          rules={[{ required: true, message: '请输入下架原因5-15个汉字' }]}
        />
      </ProForm.Group>
      <ProFormText
        name="id"
        label="id"
        hidden
      />
    </ModalForm>
  );
};