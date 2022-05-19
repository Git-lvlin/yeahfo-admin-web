import React, { useRef, useEffect } from 'react';
import { message, Form } from 'antd';
import ProForm, {
  DrawerForm,
  ProFormText,
} from '@ant-design/pro-form';
import { marketUpdata } from '@/services/cms/member/member';

export default (props) => {
  const { detailData, setVisible, onClose, visible } = props;
  const formRef = useRef();
  const [form] = Form.useForm();

  const waitTime = (values) => {
    const { id, ...rest } = values
    console.log('rest', rest)
    const param = {
      ...rest
    }
    if (id) {
      param.id = id
    }
    param.actionUrl = `${MARKET_URL}/web/market`
    return new Promise((resolve) => {
      marketUpdata(param).then((res) => {
        if (res.code === 0) {
          resolve(true);
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
          label="标题"
          rules={[{ required: true, message: '请输入标题' }]}  
        />
      </ProForm.Group>
      <ProForm.Group>
        <ProFormText 
          width="sm"
          name="desc"
          label="描述"
          rules={[{ required: true, message: '请输入描述' }]}  
        />
      </ProForm.Group>
      <ProForm.Group>
        <ProFormText
          width="sm"
          name="sort"
          label="排序"
          rules={[{ required: true, message: '请输入排序序号' }]}  
        />

      </ProForm.Group>
      {/* <ProForm.Group>
        <ProFormText 
            width="sm"
            name="actionUrl"
            label="跳转链接"
            rules={[{ required: false, message: '请输入跳转链接' }]}  
          />
      </ProForm.Group> */}
        <ProFormText
          name="id"
          label="id"
          hidden
        />
    </DrawerForm>
  );
};