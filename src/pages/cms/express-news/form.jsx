import React, { useRef, useEffect } from 'react';
import { message, Form } from 'antd';
import ProForm, {
  DrawerForm,
  ProFormText,
  ProFormRadio,
  ProFormDigit,
} from '@ant-design/pro-form';
import { expressNewsUpdate } from '@/services/cms/member/member';

export default (props) => {
  const { detailData, setVisible, setFlag, visible } = props;
  const formRef = useRef();
  const [form] = Form.useForm()

  const waitTime = (values) => {
    const { id, ...rest } = values
    const param = {
      ...rest
    }
    if (id) {
      param.id = id
    }
    return new Promise((resolve, reject) => {
      expressNewsUpdate(param).then((res) => {
        if (res.code === 0) {
          setFlag(true);
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
      title={`${detailData.title ? '编辑' : '新建'}`}
      onVisibleChange={setVisible}
      formRef={formRef}
      visible={visible}
      form={form}
      drawerProps={{
        forceRender: true,
        destroyOnClose: true,
      }}
      onFinish={async (values) => {
        await waitTime(values);
        message.success('提交成功');
        // 不返回不会关闭弹框
        return true;
      }}
      initialValues={{
        location: 2
      }}
    >
      <ProForm.Group>
        <ProFormText
          width="sm"
          name="title"
          label="消息标题"
          rules={[{ required: true, message: '请输入消息标题' }]}
        />
      </ProForm.Group>
      <ProForm.Group>
        <ProFormText
          width="sm"
          name="actionUrl"
          label="跳转链接"
          validateFirst
          rules={[
            { required: true, message: '请输入跳转链接' },
            () => ({
              validator(_, value) {
                if (/\s/g.test(value)) {
                  return Promise.reject(new Error('链接不能包含空格'));
                }
                return Promise.resolve();
              },
            })
          ]}
        />
      </ProForm.Group>
      <ProForm.Group>
        <ProFormDigit
          width="sm"
          name="sort"
          label="排序"
          rules={[{ required: true, message: '请输入排序序号' }]}
        />
      </ProForm.Group>
      <ProFormRadio.Group
        name="state"
        label="上线/下架"
        required
        options={[
          {
            label: '上线',
            value: 1,
          },
          {
            label: '下架',
            value: 0,
          },
        ]}
      />
      <ProFormRadio.Group
        name="location"
        label="位置"
        required
        options={[
          {
            label: '店铺',
            value: 2,
          },
        ]}
      />
      <ProFormRadio.Group
        name="type"
        label="跳转类型"
        required
        options={[
          {
            label: '无链接',
            value: 1,
          },
          {
            label: '商品详情',
            value: 2,
          },
          {
            label: '活动页面',
            value: 3,
          },
          {
            label: '图片',
            value: 4,
          },
        ]}
      />
      <ProFormText
        name="id"
        label="id"
        hidden
      />
    </DrawerForm>
  );
};