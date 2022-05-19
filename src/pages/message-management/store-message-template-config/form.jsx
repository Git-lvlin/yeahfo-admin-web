import React, { useEffect, useState } from 'react'
import {
  ModalForm,
  ProFormSelect,
  ProFormText,
  ProFormTextArea
} from '@ant-design/pro-form'
import { Form } from 'antd'

import * as api from '@/services/message-management/message-template-config';

export default (props) => {
  const { visible, setVisible, callback, onClose, data } = props
  const [form] = Form.useForm()
  const [popupSelect, setPopupSelect] = useState([])

  const formItemLayout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 14 },
    layout: {
      labelCol: {
        span: 4
      },
      wrapperCol: {
        span: 14
      },
    }
  }

  const submit = (values) => {
    const pushType = values.pushType.join(',')
    const obj = {toType:2, ...values, pushType}
    return api.updeTemplate(obj, { showSuccess: true })
  }

  useEffect(() => {
    api.popupConfigAll().then(res=>{
      setPopupSelect(res.data.map(item => ({label: item.name, value: item.id})))
    })
    return ()=> {
      setPopupSelect([])
    }
  }, [])
  

  useEffect(() => {
    data && form.setFieldsValue({
      name: data.name,
      templateTitle: data.templateTitle,
      templateCopywritingContent: data.templateCopywritingContent,
      pushType: data.pushType,
      type: data.type,
      popupConfigId: data.popupConfigId
    })
    return undefined
  }, [data, form])

  return (
    <ModalForm
      title="消息模板配置"
      modalProps={{
        onCancel: () => onClose(),
        destroyOnClose: true
      }}
      onVisibleChange={setVisible}
      visible={visible}
      width={550}
      onFinish={async (values) => {
        await submit(values)
        callback()
        return true
      }}
      form={form}
      labelAlign="right"
      {...formItemLayout}
      initialValues={{
        status: 1
      }}
    >
      <ProFormText
        name="name"
        label="消息名称"
        readonly
        width="md"
      />
      <ProFormText
        name="type"
        label="消息类型"
        readonly
        hidden
        width="md"
      />
      
      <ProFormText
        key="templateTitle"
        name="templateTitle"
        label="消息标题"
        placeholder="请输入消息标题"
        width="md"
        rules={[
          {
            required: true,
            message: '请输入5-18个字符'
          }
        ]}
      />

      <ProFormTextArea
        key='templateCopywritingContent'
        name="templateCopywritingContent"
        label="消息内容"
        placeholder="请输入消息内容"
        width="md"
        rules={[
          {
            required: true,
            message: '请输入至少6个字符'
          },
        ]}
        fieldProps={{
          showCount: true,
          maxLength: 84,
          minLength:6
        }}
      />
      <ProFormSelect
        name="pushType"
        label="推送渠道"
        width="md"
        valueType="select"
        valueEnum={{
          1: '站内信',
          2: '推送消息',
          3: '短信',
          4: '小程序'
        }}
        readonly
      />
      <ProFormSelect
        name="popupConfigId"
        label="弹窗模板"
        width="md"
        valueType="select"
        options={popupSelect}
      />
    </ModalForm>
  )
}