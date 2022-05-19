import React, { useEffect } from 'react';
import { Form,message } from 'antd';
import ProForm, {
  ProFormTextArea,
  ProFormRadio,
  ModalForm,
  ProFormText
} from '@ant-design/pro-form';
import { cancelReasonSave,cancelReasonUpdate} from '@/services/intensive-store-management/cancel-reason';


const formItemLayout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 14 },
    layout: {
      labelCol: {
        span: 10,
      },
      wrapperCol: {
        span: 14,
      },
    }
  };

export default (props) => {
  const { visible, setVisible, callback,onClose,formDetail} = props;
  const [form] = Form.useForm()
  useEffect(() => {
    if(formDetail?.id){
      form.setFieldsValue({
        ...formDetail,
        status:formDetail.status?.code
      })
    }
  }, [])
  const checkConfirm = (rule, value, callback) => {
    return new Promise(async (resolve, reject) => {
      if (value && value.length < 3) {
        await reject('最小长度为3')
      } else if (value&&/[%&',;=?$\x22]/.test(value)) {
        await reject('不可以含特殊字符')
      } else {
        await resolve()
      }
    })
  }
  return (
    <ModalForm
      title={`${formDetail?.id?'编辑':'新增'}注销原因`}
      onVisibleChange={setVisible}
      visible={visible}
      width={1000}
      modalProps={{
        forceRender: true,
        destroyOnClose: true,
        onCancel: () => {
          onClose();
        }
      }}
      form={form}
      submitter={{
        render: (props, defaultDoms) => {
            return [
            ...defaultDoms
            ];
        },
        }}
        onFinish={async (values) => {
          if(formDetail?.id){
            cancelReasonUpdate(values).then(res=>{
              if(res.code==0){
                message.success('编辑成功')
                setVisible(false)
                callback(true)
              }
            })
          }else{
            cancelReasonSave(values).then(res=>{
              if(res.code==0){
                message.success('添加成功')
                setVisible(false)
                callback(true)
              }
            })
          }

        }}
      {...formItemLayout}
    >
      <ProFormRadio.Group
        name="status"
        label='注销对象'
        rules={[{ required: true, message: '请选择注销对象' }]}
        options={[
            {
                label:'集约社区店铺',
                value: 1,
            },
            {
                label: '用户',
                value: 2,
            },
        ]}
      />
      <ProFormTextArea
        label='注销原因'
        name="reason"
        style={{ minHeight: 32, marginTop: 15 }}
        placeholder='请输入3-30个汉字、字母、数字或字符'
        rules={[
          { required: true, message: '请输入注销原因' },
          { validator: checkConfirm }
        ]}
        rows={4}
        fieldProps={{
            maxLength:30
        }}
      />
      <ProFormRadio.Group
        name="status"
        label='状态'
        rules={[{ required: true, message: '是否启用' }]}
        options={[
            {
                label:'启用',
                value: 1,
            },
            {
                label: '禁用',
                value: 2,
            },
        ]}
      />
      <ProFormText 
        width="md"
        name="id"
        label="id"
        hidden
      />
    </ModalForm >
  );
};