import React, { useRef, useEffect } from 'react';
import { message, Form } from 'antd';
import ProForm, {
  ModalForm,
  DrawerForm,
  ProFormText,
  ProFormTextArea,
} from '@ant-design/pro-form';
import Upload from '@/components/upload';
import { storyUpdata } from '@/services/cms/member/member';

export default (props) => {
  const { detailData, setVisible, onClose, visible } = props;
  const formRef = useRef();
  const [form] = Form.useForm();

  const waitTime = (values) => {
    const { id, ...rest } = values
    const param = {
      ...rest
    }
    if (id) {
      param.id = id
    }
  
    return new Promise((resolve, reject) => {
      storyUpdata(param).then((res) => {
        if (res.code === 0) {
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
      title={`编辑`}
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
          width="lg"
          name="storeName"
          label="店铺名称"
          rules={[{ required: true, message: '请输入店铺名称' }]}  
        />
      </ProForm.Group>
      <ProForm.Group>
        <Form.Item
          label="店铺Logo"
          name="logo"
          required
          rules={
            [{
              required: true,
              message: '请上传海报图片'
            }]
          }
        >
          <Upload multiple maxCount={1} />
        </Form.Item>
        <div>
            <dl>
              <dt>图片要求</dt>
              <dd>1.图片大小100kb以内</dd>
              <dd>2.图片比例1:1</dd>
              <dd>3.图片格式png/jpg/gif</dd>
            </dl>
          </div>
      </ProForm.Group>
      <ProForm.Group>
        <ProFormText
          width="lg"
          name="storeUserName"
          label="店主姓名"
          rules={[{ required: true, message: '请输入店主姓名' }]}  
        />

      </ProForm.Group>
      <ProForm.Group>
      <ProFormTextArea
          width="lg"
          name="storeStory"
          label="故事内容"
          validateFirst
          rules={[
            { required: true, message: '请输入10-500个汉字、标点符号或字母' }
          ]}
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