import React, { useState, useRef,useEffect } from 'react';
import { Input, Form, message,Button,InputNumber,Spin,Space,Switch} from 'antd';
import { EditableProTable } from '@ant-design/pro-table';
import { getMemberShopDeliveryCoverage,setMemberShopDeliveryCoverage } from '@/services/intensive-store-management/community-store-setting';
import ProForm, { ProFormSwitch } from '@ant-design/pro-form';
import { PageContainer } from '@/components/PageContainer';
import styles from './style.less'
import './style.less'
import { amountTransform } from '@/utils/utils'

const formItemLayout = {
  labelCol: { span: 2 },
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

 

export default (props) =>{
  const [form] = Form.useForm();
  const [kmNum,setKmNum]=useState()
  
  useEffect(() => {
    getMemberShopDeliveryCoverage({}).then(res=>{
      setKmNum(res.data?.settingValues?.defaultDeliveryCoverage/1000)
      form.setFieldsValue({
        outOffForbidden:res.data?.settingValues?.outOffForbidden===1?true:false,
        switch:res.data?.settingValues?.switch==='on'?true:false
      })
    })
  }, [])
  const onsubmit=values=>{
     const params={
      switch:values.switch?'on':'off',
      outOffForbidden:values.outOffForbidden?1:0,
      defaultDeliveryCoverage:kmNum*1000
     }
    setMemberShopDeliveryCoverage(params).then(res=>{
      if(res.code==0){
        message.success('保存成功')
      }
    })
  }
  return (
    <PageContainer>
      <ProForm
        form={form}
        onFinish={async (values)=>{
            await  onsubmit(values);
          return true;
         } }
         {...formItemLayout} 
        submitter={{
          render: (props, doms) => {
            return [
              <Button style={{}} type="primary" key="submit" onClick={() => {
                props.form?.submit?.()
              }}>
                保存
              </Button>        
            ];
          }
        }}
        className={styles.community_store}
      >
        <ProForm.Group>
          <span>默认社区店配送范围</span>
          <span className={styles.add_subtract} onClick={()=>setKmNum((amountTransform(Number(kmNum),'*')-50)/100)}>-</span>
            <Form.Item style={{margin:0}}>
              <InputNumber 
                min={0.2} 
                max={10}
                onChange={(val)=>{
                  setKmNum(val)
                }}
                precision={2}
                step={0.5}
                value={kmNum}
                controls={true}
              />
            </Form.Item>
            <span className={styles.add_subtract} onClick={()=>setKmNum((amountTransform(Number(kmNum),'*')+50)/100)}>+</span>
          <span>公里</span>
        </ProForm.Group>
        <p className={styles.hint}>店主可手动修改自己店铺的配送范围，没有修改的店主默认用此处设置的配送范围</p>
        <ProForm.Group>
          <span>超出配送范围禁止用户下单</span>
          <ProFormSwitch name="outOffForbidden"/>
        </ProForm.Group>
        <ProForm.Group>
          <span>功能是否启用</span>
          <ProFormSwitch name="switch"/>
        </ProForm.Group>
       </ProForm>
    </PageContainer>
  )
}
