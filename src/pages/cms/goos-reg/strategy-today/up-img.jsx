import React, { useRef, useEffect, useState } from 'react';
import { message, Form } from 'antd';
import ProForm, {
  ModalForm,
  ProFormText,
} from '@ant-design/pro-form';
import { cmsImageEdit, cmsImageAdd } from '@/services/cms/member/member';
import Upload from '@/components/upload';

export default (props) => {
  const { detailData, setVisible, setFlag, visible, verifyVersionId } = props;
  const formRef = useRef();
  const [form] = Form.useForm();

  const waitTime = (values) => {
    const { id, image } = values
    const param = {
      image: image
    }
    if (id) {
      param.id = id
    }
    if (verifyVersionId) {
      param.verifyVersionId = verifyVersionId
    }
    let rq = detailData?cmsImageEdit:cmsImageAdd;
    return new Promise((resolve, reject) => {
      rq(param).then((res) => {
        if (res.code === 0) {
          setFlag(true)
          resolve(true);
        } else {
          reject(false)
        }
      })
  
    });
  };

  useEffect(() => {
    if (detailData) {
      console.log('detailData', detailData)
      const { ...rest } = detailData
      form.setFieldsValue({
        ...rest
      })
    }
  }, [form, detailData])

  return (
    <ModalForm
      layout='horizontal'
      width={500}
      title={'上传封面图'}
      onVisibleChange={setVisible}
      formRef={formRef}
      visible={visible}
      form={form}
      drawerprops={{
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
        <Form.Item
          label="上传图片"
          name="image"
          required
          rules={
            [{
              required: true,
              message: '请上传图片'
            }]
          }
        >
          <Upload multiple maxCount={1} code={201} />
        </Form.Item>
        <div style={{position: 'absolute', right: 50, top: 76}}>
          <dl>
            <dt>图片要求</dt>
            <dd>不超过500kb</dd>
            <dd>宽度：104px、高度：148px</dd>
            <dd>只能上传jpg/png/gif格式文件</dd>
          </dl>
        </div>
        <ProFormText
          name="id"
          label="id"
          hidden
        />
    </ModalForm>
  );
};