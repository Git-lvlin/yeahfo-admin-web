import React, { useEffect, useState} from 'react';
import { ModalForm,ProFormText,ProFormRadio,ProFormDependency} from '@ant-design/pro-form';
import { Button, message,Form } from 'antd';
import { updateActStock } from '@/services/intensive-activity-management/penny-activity';
import { history,connect } from 'umi';
import { ExclamationCircleFilled } from '@ant-design/icons';
import { amountTransform } from '@/utils/utils'

const formItemLayout = {
    labelCol: { span: 6 },
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

export default props=>{
    const {record,visible,setVisible,callback,id}=props
    const [form] = Form.useForm()
    const [kmNum,setKmNum]=useState(0)
    const checkConfirm=(rule, value, callback)=>{
      return new Promise(async (resolve, reject) => {
      if (value&&value.length>0&&!/^[0-9]*[1-9][0-9]*$/.test(value)&&value!=0) {
          await reject('只能输入正整数')
      }else if (value&&value>record?.totalStockNum) {
        await reject('请输入小于等于当前可用集约库存')
      }else if (value&&value<0) {
        await reject('不能小于0')
      }else {
          await resolve()
      }
      })
   }
   const checkConfirm2=(rule, value, callback)=>{
    return new Promise(async (resolve, reject) => {
    if (value&&value.length>0&&!/^[0-9]*[1-9][0-9]*$/.test(value)&&value!=0) {
        await reject('只能输入正整数')
    }else if (value&&value>record?.actStockNum) {
      await reject('请输入小于等于当前可用活动库存')
    }else {
        await resolve()
    }
    })
 }
    useEffect(()=>{
      form.setFieldsValue({
        ...record,
        num:0
      })
    },[])
   const onSubmit=(values)=>{
     const parmas={
       id:id,
       skuId:record?.skuId,
       wsId:record?.wsId,
       changeStockNum:values.goodsType==1?values.num:-values.num
     }
     updateActStock(parmas).then(res=>{
       if(res.code==0){
        setVisible(false)
        callback(true)
       }
     })
   }
    return (
        <ModalForm
          onVisibleChange={setVisible}
          title={<p>编辑1分钱活动商品可用库存 <span style={{color:'#D8D8D8',fontSize:'10px'}}>{record?.goodsName}（spuID：{record?.spuId}/skuID：{record?.skuId}）</span></p>}
          visible={visible}
          form={form}
          modalProps={{
            forceRender: true,
            destroyOnClose: true,
          }}
          submitter={{
          render: (props, defaultDoms) => {
              return [
              <Button  key="cacnl" onClick={() =>{setVisible(false)}}>
                  取消
              </Button>,
              <ProFormDependency name={['goodsType']}>
                {({ goodsType }) => {
                  return <Button disabled={goodsType==1&&record?.totalStockNum==0||goodsType==2&&record?.actStockNum==0} type="primary" key="submit" onClick={() => {
                    props.form?.submit?.()
                  }}>
                    确定
                  </Button>
                }}
              </ProFormDependency>
              ];
          },
          }}
          onFinish={async (values) => {
              await onSubmit(values) 
          }}
          {...formItemLayout}
      >
       <ProFormText
          width="md"
          name="totalStockNum"
          label='当前集约活动可用库存'
          readonly
          fieldProps={{
            value:`${record?.totalStockNum}${record?.unit}`
          }}
        />
        <ProFormText
          width="md"
          name="actStockNum"
          label='当前1分钱活动可用库存'
          readonly
          fieldProps={{
            value:`${record?.actStockNum}${record?.unit}`
          }}
        />
        <ProFormRadio.Group
            name="goodsType"
            label='操作类型'
            options={[
            {
                label:'增加活动库存',
                value: 1,
            },
            {
                label: '减少活动库存',
                value: 2,
            }
            ]}
            initialValue={1}

        />
        <ProFormDependency name={['goodsType','num']}>
          {({ goodsType,num }) => {
              if (goodsType==1) return(
                <ProFormText
                  name="num"
                  label='操作1分钱活动库存数量'
                  placeholder='请输入<=当前可用集约库存'
                  fieldProps={{
                    addonBefore:<span style={{cursor:'pointer'}} onClick={()=>{
                      if(record?.totalStockNum!=0&&num>=0){
                        form.setFieldsValue({num:(amountTransform(Number(num),'*')+100)/100})
                      }
                    }}>+</span>,
                    addonAfter:record?.unit,
                  }}
                  disabled={record?.totalStockNum==0}
                  rules={[{validator: checkConfirm}]}
                  extra={ record?.totalStockNum==0?<span style={{color:'red'}}>当前商品集约活动可用库存为0，不能追加活动库存</span>:null}
              />
              )
              if(goodsType==2){
                return(
                  <ProFormText
                    name="num"
                    label='操作1分钱活动库存数量'
                    placeholder='请输入<=当前可用活动库存'
                    fieldProps={{
                      addonBefore:<span style={{cursor:'pointer'}} onClick={()=>{
                        if(record?.actStockNum!=0&&num>0){
                          form.setFieldsValue({num:(amountTransform(Number(num),'*')-100)/100})
                        }
                      }}>-</span>,
                      addonAfter:record?.unit,
                    }}
                    disabled={record?.actStockNum==0}
                    rules={[{validator: checkConfirm2}]}
                    extra={ record?.actStockNum==0?<span style={{color:'red'}}>当前商品1分钱活动可用库存为0，不能减少活动库存</span>:null}
                  />
                )
              }
                
          }}
        </ProFormDependency>


        <ProFormDependency name={['num','goodsType']}>
          {({ num,goodsType }) => {
            return(
              <ProFormText
                width="md"
                name="actStockNum"
                label='操作后1分钱活动可用库存'
                fieldProps={{
                    value:`${goodsType==1?parseInt(record?.actStockNum)+parseInt(num):parseInt(record?.actStockNum)-parseInt(num)}${record?.unit}`
                }}
                readonly
              />
              ) 
          }}
        </ProFormDependency>

        <ProFormDependency name={['num','goodsType']}>
          {({ num,goodsType }) => {
            return(
              <ProFormText
                width="md"
                name="totalStockNum"
                label='操作后集约活动可用库存'
                fieldProps={{
                    value:`${goodsType==1?parseInt(record?.totalStockNum)-parseInt(num):parseInt(record?.totalStockNum)+parseInt(num)}${record?.unit}`
                }}
                readonly
              />
              ) 
          }}
        </ProFormDependency>
      </ModalForm>
    )
}

