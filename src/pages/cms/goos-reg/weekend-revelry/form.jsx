import React, { useRef, useEffect } from 'react';
import { message, Form } from 'antd';
import ProForm, {
  ModalForm,
  ProFormText,
  ProFormRadio,
} from '@ant-design/pro-form';
import CrazyAddActivityReg from '@/components/crazy-add-activity-reg';
import { cmsWeekSub } from '@/services/cms/member/weekend-revelry';

export default (props) => {
  const { detailData, setVisible, setFlag, visible } = props;
  const formRef = useRef();
  const [form] = Form.useForm()

  const waitTime = (values) => {
    const { ...rest } = values
    const param = {
      ...rest
    }
    return new Promise((resolve, reject) => {
      cmsWeekSub(param).then((res) => {
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
    if (detailData?.id) {
      const { subtitle ,...rest } = detailData;
      if (rest.title.includes('(')) {
        rest.title = rest.title.split('(')[0]
      }
      form.setFieldsValue({
        ...rest
      })
    }
  }, [])

  return (
    <ModalForm
      key="add"
      width={600}
      title={`${detailData ? '编辑活动' : '新增活动'}`}
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
    >
      <ProForm.Group>
        <ProFormText
          name="title"
          label="活动标题"
          placeholder="请输入活动标题"
          rules={[{ required: true, message: '请输入活动标题' }]}
        />
      </ProForm.Group>
      <ProFormRadio.Group
          name="status"
          label="上线/下架"
          required
          options={[
            {
              label: '上线',
              value: 2,
            },
            {
              label: '下架',
              value: 1,
            },
          ]}
        />
      <ProFormText
          name="id"
          label="id"
          hidden
        />
    </ModalForm>
  );
};