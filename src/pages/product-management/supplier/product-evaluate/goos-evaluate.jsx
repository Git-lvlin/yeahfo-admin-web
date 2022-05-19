import React, { useRef, useEffect, useState } from 'react';
import { message, Form,Space,Button,Modal,List,Image,Divider,Avatar} from 'antd';
import ProForm, {
  DrawerForm,
  ProFormText,
  ProFormRadio,
  ProFormSelect,
  ProFormTextArea
} from '@ant-design/pro-form';
import { history } from 'umi'
import { findContent } from '@/services/product-management/product-evaluate';
import styles from './style.less'
import Upload from '@/components/upload';


const FromWrap = ({ value, onChange, content, right }) => (
    <div style={{ display: 'flex' }}>
      <div>{content(value, onChange)}</div>
      <div style={{ flex: 1, marginLeft: 10, minWidth: 180 }}>{right(value)}</div>
    </div>
)
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
  const { setVisible, visible,id,callback,onClose } = props;
  const formRef = useRef();
  const ref = useRef();
  const [form] = Form.useForm()
  const [dataList,setDataList]=useState()

  const onsubmit = (values) => {
  };

  useEffect(() => {
    findContent({id:id}).then(res=>{
     if(res.code==0){
      setDataList(res.data)
     }
    })
  }, [])
  return (
    <DrawerForm
      onVisibleChange={setVisible}
      formRef={formRef}
      visible={visible}
      form={form}
      drawerProps={{
        forceRender: true,
        destroyOnClose: true,
      }}
      submitter={
        {
          render: (props, defaultDoms) => {
            return [];
          }
        }
      }
      onFinish={async (values) => {
        await onsubmit(values);
      }}
      {...formItemLayout}
    >
    <ProFormText
        width="md"
        name="name"
        label="用户昵称"
        placeholder="输入用户昵称"
        rules={[{ required: true, message: '请输入用户昵称' }]}
        readonly={id&&falg}
        fieldProps={{
        maxLength:50
        }}
        />
    <ProFormText
        width="md"
        name="name"
        label="被评商品SPUid"
        placeholder="输入被评商品SPUid"
        rules={[{ required: true, message: '请输入被评商品SPUid' }]}
        readonly={id&&falg}
        fieldProps={{
        maxLength:50
        }}
     />
     <ProFormText
        width="md"
        name="name"
        label="被评商品SKUid"
        placeholder="输入被评商品SKUid"
        rules={[{ required: true, message: '请输入被评商品SKUid' }]}
        readonly={id&&falg}
        fieldProps={{
        maxLength:50
        }}
     />
     <ProFormSelect
        name="inviteNum"
        initialValue={1}
        label="评分星级"
        options={[
            {
                value: 1,
                label: '一星',
            },
            {
                value: 2,
                label: '二星',
            },
            {
                value: 3,
                label: '三星',
            },
            {
                value: 4,
                label: '四星',
            },
            {
                value: 5,
                label: '五星',
            }
        ]}
        readonly={id}
      />
     <ProFormTextArea
        label='评价内容'
        name="couponRule"
        style={{ minHeight: 32, marginTop: 15 }}
        placeholder='0/500'
        rules={[{ required: true, message: '请输入评价内容' }]}
        rows={4}
        fieldProps={{
        maxLength:500
        }}
      />
      <Form.Item
        label="评价照片"
        name="bannerImage"
        >
        <FromWrap
            content={(value, onChange) => <Upload multiple value={value} onChange={onChange} size={5*1024}   maxCount={9} accept="image/*"  proportion={{width: 670,height: 284,}} />}
            right={(value) => {
            return (
                <dl>
                <dd>最多9张，支持jpg/png，不超过5M/张</dd>
                </dl>
            )
            }}
        />
       </Form.Item>
    </DrawerForm>
  );
};