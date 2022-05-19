import React, { useRef, useEffect } from 'react';
import { message, Form } from 'antd';
import ProForm, {
  DrawerForm,
  ProFormText,
} from '@ant-design/pro-form';
import Upload from '@/components/upload';
import { posterUpdata } from '@/services/cms/member/member';

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
      posterUpdata(param).then((res) => {
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
    <DrawerForm
      title={`${detailData ? '编辑' : '新建'}`}
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
          name="title"
          label="海报名称"
          rules={[{ required: true, message: '请输入海报名称' }]}  
        />
      </ProForm.Group>
      <ProForm.Group>
        <Form.Item
          label="添加海报图片"
          name="image"
          required
          rules={
            [{
              required: true,
              message: '请上传海报图片'
            }]
          }
          tooltip={
            <dl>
              <dt>图片要求</dt>
              <dd>设计师直接提供，不做限制</dd>
            </dl>
          }
        >
          <Upload multiple maxCount={1} />
        </Form.Item>
      </ProForm.Group>
      <ProForm.Group>
        <ProFormText
          width="sm"
          name="sort"
          label="排序"
          rules={[{ required: true, message: '请输入排序序号' }]}  
        />

      </ProForm.Group>
      <ProFormText
        name="id"
        label="id"
        hidden
      />
    </DrawerForm>
  );
};