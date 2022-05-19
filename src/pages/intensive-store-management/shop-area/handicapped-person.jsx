import React, { useState, useEffect,useRef } from 'react';
import { Input, Form, Divider, message, Button,Space } from 'antd';
import { FormattedMessage, formatMessage } from 'umi';
import ProForm, { ProFormText, ProFormRadio, ProFormDateTimeRangePicker,ProFormTextArea,ProFormDependency,ProFormSelect } from '@ant-design/pro-form';
import { history, connect } from 'umi';
import { getMemberShopDeformed,setMemberShopDeformed,getMemberShopDeformedLog } from '@/services/intensive-store-management/shop-area'
import ProTable from '@ant-design/pro-table';
import moment from 'moment';

const formItemLayout = {
  labelCol: { span: 1 },
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

export default  () => {
  const [form] = Form.useForm()
  const [formDatil,setFormDatil]=useState()
  const actionRef = useRef();
  useEffect(() => {
    getMemberShopDeformed({}).then(res=>{
      if(res.code==0){
        setFormDatil(res.data)
        form.setFieldsValue({
          depositAmount:res.data?.settingValues?.depositAmount,
          serviceAmount:res.data?.settingValues?.serviceAmount
        })
      }
    })
  }, [])
  const checkConfirm=(rule, value, callback)=>{
    return new Promise(async (resolve, reject) => {
    if (value&&value<0||value>100000){
        await reject('只能输入0-10万之间的整数')
    }else if (value&&value.length>0&&!/^[0-9]*[1-9][0-9]*$/.test(value)&&value!=0) {
        await reject('只能输入整数')
    }else {
        await resolve()
    }
    })
  }
  const onsubmit = (values) => {
    setMemberShopDeformed(values).then(res=>{
      if(res.code==0){
        message.success('缴费设置成功!')
        actionRef.current.reload()
      }
    })
  }
  const columns= [
    {
      title: '操作时间',
      dataIndex: 'createTime',
      valueType: 'text',
      hideInSearch: true,
      ellipsis:true
    },
    {
      title: '操作人',
      dataIndex: 'optAdminName',
      valueType: 'text',
    },
    {
      title: '原保证金金额',
      dataIndex: 'depositAmount',
      valueType:'text',
      hideInSearch: true,
      render:(_,data)=>{
        return <p>￥{_}</p>
      }
    },
    {
      title: '原服务金金额',
      dataIndex: 'serviceAmount',
      valueType: 'text',
      hideInSearch: true,
      render:(_,data)=>{
        return <p>￥{_}</p>
      }
    },   
  ];

  const postData = (data) => {
    const arr=data.map(ele=>({
      ...ele,
      depositAmount:ele.beforeValues?.depositAmount,
      serviceAmount:ele.beforeValues?.serviceAmount
    }))
    return arr;
  }
  return (
    <>
      <ProForm
        form={form}
        {...formItemLayout}
        submitter={
          {
            render: (props, defaultDoms) => {
              return [
                <Button style={{width:'150px'}} type="primary" key="submit" onClick={() => {
                  props.form?.submit?.()
                }}>
                  修改
                </Button>
              ];
            }
          }
        }
        onFinish={async (values) => {
            await onsubmit(values);
            return true;
        }
        }
      >
        <p style={{fontWeight:'bold'}}>{formDatil?.settingDescribe}</p>
        <ProFormText
            width="md"
            name="depositAmount"
            label='保证金金额'
            rules={[
                { validator: checkConfirm }
            ]}
            fieldProps={{
                addonAfter:"元"
            }}
            labelCol={2}
        />
        <ProFormText
            width="md"
            name="serviceAmount"
            label='服务费金额'
            rules={[
                { validator: checkConfirm }
            ]}
            fieldProps={{
                addonAfter:"元/3年"
            }}
            labelCol={2}
        />
      </ProForm >
      <ProTable
       headerTitle="操作日志"
       rowKey="id"
       options={false}
       actionRef={actionRef}
       request={getMemberShopDeformedLog}
       search={false}
       postData={postData}
       columns={columns}
       style={{marginTop:'20px'}}
    />
    </>
  );
};
