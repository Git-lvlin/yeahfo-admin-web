import React, { useRef, useEffect } from 'react';
import { message, Form } from 'antd';
import ProForm, {
  ModalForm,
  ProFormText,
} from '@ant-design/pro-form';
import { saveSortModify } from '@/services/cms/member/member';

export default (props) => {
  const { detailData, setVisible, setFlag, visible } = props;
  const formRef = useRef();
  const [form] = Form.useForm();

  const waitTime = (values) => {
    const { id, sort } = values
    const param = {
      sortInfo:[
        {
          id:id,
          sort: sort
        }
      ]
    }
    return new Promise((resolve, reject) => {
      saveSortModify(param).then((res) => {
        if (res.code === 0) {
          setFlag(true)
          resolve(true);
        } else {
          reject(false)
          return
        }
      })
  
    });
  };

  useEffect(() => {
    if (detailData) {
      const { id, sort } = detailData
      form.setFieldsValue({
        id,
        sort
      })
    }
  }, [form, detailData])

  return (
    <ModalForm
      title={'排序'}
      onVisibleChange={setVisible}
      formRef={formRef}
      visible={visible}
      form={form}
      drawerprops={{
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
    </ModalForm>
  );
};