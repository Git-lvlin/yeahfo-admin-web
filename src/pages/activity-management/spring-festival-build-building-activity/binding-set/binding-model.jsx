import React, { useEffect } from 'react';
import { Form,Button } from 'antd';
import ProForm, {
  ProFormText,
  ModalForm
} from '@ant-design/pro-form';
import { bindingUpdate} from '@/services/activity-management/spring-festival-build-building-activity';

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
  const FromWrap = ({ value, onChange, content, right }) => (
    <div style={{ display: 'flex' }}>
      <div style={{marginLeft:'35px'}}>{content(value, onChange)}</div>
      <div style={{ flex: 1, marginLeft: 10, minWidth: 180 }}>{right(value)}</div>
    </div>
  )

export default (props) => {
  const { visible, setVisible, callback,formDetail,onClose} = props;
  const [form] = Form.useForm();
  useEffect(()=>{
      form.setFieldsValue({
        originalWithdrawAccount:formDetail?.withdrawAccount,
        originalWithdrawRealname:formDetail?.withdrawRealname,
        memberId:formDetail?.memberId
      })
  },[])
  return (
    <ModalForm
      title='编辑绑定支付宝'
      onVisibleChange={setVisible}
      visible={visible}
      width={1000}
      form={form}
      modalProps={{
        forceRender: true,
        destroyOnClose: true,
        onCancel: () => {
          onClose();
        }
      }}
      submitter={{
        render: (props, defaultDoms) => {
            return [
              ...defaultDoms
              ];
        },
        }}
        onFinish={async (values) => {
          const params={
            memberId:values.memberId,
            withdrawAccount:values.withdrawAccount,
            withdrawRealname:values.withdrawRealname
          }
          bindingUpdate(params).then(res=>{
            if(res.code==0){
              setVisible(false)
              callback(true)
            }
          })
        }}
      {...formItemLayout}
      
    >
      <ProFormText
        name="memberId"
        hidden
      />
      <ProFormText
        width={250}
        label="原支付宝账号"
        name="originalWithdrawAccount"
      />
       <FromWrap
        content={(value, onChange) => <ProFormText
        width={250}
        label="原支付宝真实姓名"
        name="originalWithdrawRealname"
        labelCol={7}
      />}
        right={(value) =><p style={{color:'#B0B0B0'}}>绑定时间：{formDetail?.withdrawBindTime}</p>}
      />
      <ProFormText
          width={250}
          label="支付宝账号"
          name="withdrawAccount"
          rules={[{ required: true, message: '请输入支付宝账号' }]}
      />
      <ProFormText
          width={250}
          label="支付宝真实姓名"
          name="withdrawRealname"
          rules={[{ required: true, message: '请输入支付宝真实姓名' }]}
      />
    </ModalForm >
  );
};