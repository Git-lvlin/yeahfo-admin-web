import React, { useState, useEffect} from 'react';
import { Form, Button, message} from 'antd';
import ProForm,{
  ProFormText,
  ProFormSelect,
  DrawerForm
} from '@ant-design/pro-form';
import Upload from '@/components/upload';
import {  agent_bank_detail, storeList,agent_bank_edit,get_bank_data} from '@/services/daifa-store-management/list';
import { getBanks } from '@/services/supplier-management/supplier-list';

const formItemLayout = {
  labelCol: { span: 5 },
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
  const {storeNo,setVisible,visible,onClose}=props
  const [form] = Form.useForm()
  const [detailData, setDetailData] = useState(null);
  const [bankData,setBankData]=useState([])

  const onsubmit = (values) => {
    bankData.map(ele=>{
      if(values.bankCode==ele.bankCode){
        values.bankName=ele.bankName
      }
    })
    agent_bank_edit({storeNo,...values}).then(res=>{
      if(res.code==0){
        message.success('编辑成功'); 
        setVisible(false)
        onClose()
      }
    })
  }

  useEffect(() => {
    agent_bank_detail({storeNo}).then(res=>{
        form.setFieldsValue(res.data)
        setDetailData(res.data)
    })
    get_bank_data({}).then(res=>{
      setBankData(res.data)
    })
  }, []);
  return (
        <DrawerForm
            title='再次认证'
            visible={visible}
            onVisibleChange={setVisible}
            drawerProps={{
              forceRender: true,
              destroyOnClose: true,
              width: 800,
              onClose: () => {
                onClose();
              }
            }}
            form={form}
            submitter={
            {
                render: (props, doms) => {
                return [
                    <Button type="primary" key="submit" onClick={() => props.form?.submit?.()}>
                      提交
                    </Button>,
                    <Button key="goback" type="default" onClick={()=>{setVisible(false);onClose()}}>
                      返回
                    </Button>  
                ];
                }
            }
            }
            onFinish={async (values)=>{
            await  onsubmit(values);
            return true;
            }
            }
            {...formItemLayout}
        >
      <ProFormText
        name="storeName"
        width="md"
        label="店铺名称"
        placeholder="请输入店铺名称"
        rules={[
            { required: true, message: '请输入店铺名称' },
            { validator:(rule,value,callback)=>{
              return new Promise(async (resolve, reject) => {
              const res = await storeList({storeName:value})
              if(detailData&&detailData.storeName!=value){
                if(res.data.length==1){
                  await reject(`店铺名称已存在，请重新输入`);
                }else if(value&&value.length>30){
                  await reject('店铺名称不超过30个字符')
                }
              }
                await resolve()
            })
          }}
        ]}
        disabled={!!detailData}
      />
      <ProFormText
        width="md"
        name="realname"
        label="店主姓名"
        placeholder="请输入店主姓名"
        rules={[
          { required: true, message: '请输入店主姓名' },
          { validator:(rule,value,callback)=>{
              return new Promise(async (resolve, reject) => {
              const res = await storeList({realname:value})
              if(detailData&&detailData.realname!=value){
                if(res.data.length==1){
                  await reject(`店主姓名已存在，请重新输入`);
                }else if(value&&value.length>30){
                  await reject('店主姓名不超过30个字符')
                }
              }
               await resolve()
            })
          }}
        ]}
        disabled={!!detailData}
      />
       <ProFormSelect
          width="md"
          name="bankCode"
          label="账户结算银行"
          placeholder="请选择结算收款银行"
          request={getBanks}
          rules={[{ required: true, message: '请选择账户结算银行' }]}
          initialValue={detailData?.bankCode} 
      />
      <ProFormText
          width="md"
          name="bankCard"
          label="结算银行卡号"
          placeholder="请输入结算银行卡号"
          rules={[{ required: true, message: '请输入结算银行卡号' }]}
          fieldProps={{
            maxLength: 16,
          }}
      />
       <ProFormText
          width="md"
          name="bankUserName"
          label="结算银行卡开户名"
          placeholder="请输入结算银行卡开户名"
          rules={[{ required: true, message: '请输入结算银行卡开户名' }]}
      />
      <Form.Item
        label="结算银行卡正面照"
        name="bankFront"
        rules={[{ required: true }]}
        tooltip={
          <dl>
            <dt>图片要求</dt>
            <dd>1.图片大小1MB以内</dd>
            <dd>2.图片格式png/jpg/gif</dd>
          </dl>
        }
        extra="1.图片大小1MB以内 2.图片格式png/jpg/gif"
      >
        <Upload code={304}  multiple maxCount={1} accept="image/*" size={1 * 1024} />
      </Form.Item>
      <Form.Item
        label="结算银行卡背面照"
        name="bankBack"
        rules={[{ required: true }]}
        tooltip={
          <dl>
            <dt>图片要求</dt>
            <dd>1.图片大小1MB以内</dd>
            <dd>2.图片格式png/jpg/gif</dd>
          </dl>
        }
        extra="1.图片大小1MB以内 2.图片格式png/jpg/gif"
      >
        <Upload code={304}  multiple maxCount={1} accept="image/*" size={1 * 1024} />
      </Form.Item>
    </DrawerForm>
  );
};