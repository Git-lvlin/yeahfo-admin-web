import React, { useEffect,useState } from 'react';
import { Form } from 'antd';
import {
  ModalForm,
  ProFormRadio,
  ProFormTextArea,
  ProFormDependency,
  ProFormText
} from '@ant-design/pro-form';
import { changeStatus } from '@/services/intensive-store-management/store-list';
import { accountDetail } from '@/services/daifa-store-management/list'
import Upload from '@/components/upload';
import { amountTransform } from '@/utils/utils'

const FromWrap = ({ value, onChange, content, right }) => (
  <div style={{ display: 'flex' }}>
    <div>{content(value, onChange)}</div>
    <div style={{ flex: 1, marginLeft: 10, minWidth: 180 }}>{right(value)}</div>
  </div>
)

const checkConfirm=(rule, value, callback)=>{
  return new Promise(async (resolve, reject) => {
  if (value&&value.length<5) {
      await reject('最少输入5个字符')
  }else {
      await resolve()
  }
  })
}

export default (props) => {
  const { visible, setVisible, callback, data,onClose } = props;
  const [form] = Form.useForm();
  const [amount,setAmount]=useState()
  const formItemLayout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 14 },
    layout: {
      labelCol: {
        span: 4,
      },
      wrapperCol: {
        span: 14,
      },
    }
  };

  useEffect(() => {
    if (data) {
      form.setFieldsValue({
        toStatus: data.toStatus,
      })
    }
  }, [data])

  useEffect(()=>{
    accountDetail({accountType:'store',accountId:data?.storeNo}).then(res=>{
      setAmount(amountTransform(res.data?.total, '/'))
    })
  },[data])

  const submit = (values) => {
    return new Promise((resolve, reject) => {
      let userInfo = window.localStorage.getItem('user');
      userInfo = userInfo && JSON.parse(userInfo)
      changeStatus({
        storeNo: data.storeNo,
        optAdminId: userInfo.id,
        optAdminName: userInfo.username,
        checkFinancial:values.toStatus==4?0:values.toStatus==2?1:'',
        toStatus:values.toStatus==4?2:values.toStatus,
        reason:values.reason,
        attachList:values.attachList,
        balance:amount?amount:''
      }, { showSuccess: true }).then(res => {
        if (res.code === 0) {
          resolve()
        } else {
          reject()
        }
      })
    });
  }

  const options=[
    {
      label: '开启',
      value: 1,
    },
    {
      label: '关闭',
      value: 3,
    },
    {
      label: '注销',
      value: 2,
    }
  ]
  const options2=[
    {
      label: '开启',
      value: 1,
    },
    {
      label: '关闭',
      value: 3,
    },
    {
      label: '注销',
      value: 2,
    },
    {
      label: '有余额注销',
      value: 4,
    }
  ]

  return (
    <ModalForm
      title={`请确认店铺状态  ${data.storeName} （店铺ID：${data.id}）`}
      modalProps={{
      }}
      onVisibleChange={setVisible}
      visible={visible}
      width={650}
      form={form}
      onFinish={async (values) => {
        await submit(values);
        callback();
        return true;
      }}
      modalProps={{
        forceRender: true,
        destroyOnClose: true,
        onCancel: () => {
          onClose();
        }
      }}
      initialValues={{
        toStatus: 1,
      }}
      {...formItemLayout}
    >
      <ProFormRadio.Group
        name="toStatus"
        label="操作结果"
        rules={[{ required: true, message: '请选择操作' }]}
        options={amount>0?options2:options}
      />
      <ProFormDependency name={['toStatus']}>
        {({ toStatus }) => {
          if(toStatus === 2){
            return <div style={{ color: 'red', marginLeft: 130, marginTop: '-25px', marginBottom: 20 }}>注销后不能再开启，请谨慎操作！</div>
          }else if(toStatus === 4){
            return <div style={{ color: 'red', marginLeft: 130, marginTop: '-25px', marginBottom: 20 }}>注销后不能再开启，请谨慎操作！</div>
          }
        }}
      </ProFormDependency>

      <ProFormDependency name={['toStatus']}>
        {({ toStatus }) => {
          return toStatus === 4 && <>
            <ProFormText
              width="sm"
              label="当前账号余额"
              readonly={true}
              fieldProps={{
                value:`${amount}元`
              }}
            />
            <Form.Item
              label="附件"
              name="attachList"
              rules={[{ required: true, message: '请上传附件' }]}
            >
              <FromWrap
                content={(value, onChange) => <Upload  value={value} onChange={onChange}   maxCount={9} accept="image/*"  size={10 * 1024} />}
                right={(value) => {
                  return (
                    <dl>
                      <dd>不超过9张图片</dd>
                      <dd>每张小于10M</dd>
                      <dd>还有余额的社区店注销时需上传注销申请审核通过的审批文件（需盖章）、与店主的沟通记录截图文件</dd>
                    </dl>
                  )
                }}
              />
            </Form.Item>
          </>
        }}
      </ProFormDependency>

      <ProFormDependency name={['toStatus']}>
        {({ toStatus }) => {
          return toStatus !== 1 && <ProFormTextArea
            name="reason"
            label="理由"
            placeholder="请输入 5-20个字符"
            rules={[
              { required: true, message: '请输入理由' },
              {validator: checkConfirm}
            ]}
            fieldProps={{
              maxLength:20,
            }}
          />
        }}
      </ProFormDependency>

    </ModalForm >
  );
};