import React, { useRef, useEffect } from 'react';
import { message, Form } from 'antd';
import ProForm, {
  ModalForm,
  ProFormText,
  ProFormRadio,
} from '@ant-design/pro-form';
import Upload from '@/components/upload';
import { posterUpdata } from '@/services/cms/member/member';

export default (props) => {
  const { detailData, setVisible, onClose, visible, refresh, setRefresh } = props;
  const formRef = useRef();
  const [form] = Form.useForm();

  const waitTime = (values) => {
    const { image, ...rest } = values
    const param = {
      ...rest,
      bgImage: {
        url: image,
        width: 375,
        height: 676,
        relativeX: 34,
        relativeY: 162,
      },
      compositeXY: {
        relativeX: 132,
        relativeY: 495,
        qrcodeWidth: 110,
        qrcodeHeight: 110,
      },
      version: 2,
    }
  
    return new Promise((resolve, reject) => {
      posterUpdata(param).then((res) => {
        if (res.code === 0) {
          setRefresh(!refresh);
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
      layout="horizontal"
      title={'上传'}
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
          name="title"
          label="海报名称"
          placeholder={'请输入海报名称，长度3-8个汉字、字母或数字'}
          rules={[{ required: true, message: '请输入海报名称，长度3-8个汉字、字母或数字' }]}
          fieldProps={{
            maxLength: 8,
            minLength: 3,
          }}
        />
      </ProForm.Group>
      <ProForm.Group>
        <Form.Item
          label="上传海报"
          name="image"
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
            <dd>图片要求</dd>
            <dd>大小：不超过2MB</dd>
            <dd>尺寸：750px*1352px</dd>
            <dd>格式：png/jpg</dd>
          </dl>
        </div>
      </ProForm.Group>
      <ProForm.Group>
        <div>
          <p>上传图片示例：</p>
          <p style={{width: 125,height: 225,position: 'relative'}}>
            <img style={{width: '100%',height: '100%'}} src="https://uat-yeahgo.oss-cn-shenzhen.aliyuncs.com/goods/base/rc-upload-1632897787078-269.png?imgHeight=676&imgWidth=375" />
            <div style={{width: '40px',height: '40px',position: 'absolute',bottom: 20,left: 42,border: '6px solid #fff',borderRadius: 6}}></div>
          </p>
        </div>
        <div style={{color: 'red'}}>
          <dl>
            <dd>务必在海报中留出用户二维码位置:</dd>
            <dd>1、二维码宽和高都为220px;</dd>
            <dd>2、二维码居中，且距下边缘142px</dd>
          </dl>
        </div>
      </ProForm.Group>
      <ProFormRadio.Group
        name="state"
        label="是否上架"
        initialValue={1}
        options={[
          {
            label: '立即上架',
            value: 1,
          },
          {
            label: '暂不上架',
            value: 0,
          },
        ]}
      />
    </ModalForm>
  );
};