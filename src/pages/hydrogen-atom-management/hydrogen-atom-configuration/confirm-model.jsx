import React, { useEffect } from 'react';
import { Form,message,  Button } from 'antd';
import ProForm, {
  ModalForm,
  ProFormText
} from '@ant-design/pro-form';
import { updateByCode } from '@/services/hydrogen-atom-management/hydrogen-atom-configuration';
import { ExclamationCircleFilled} from '@ant-design/icons';
import { amountTransform } from '@/utils/utils'

export default (props) => {
  const { visible, setVisible, callback,onClose,paramsType} = props;
  const [form] = Form.useForm()
  const handleChange = (v)=> {
      if(v=='AGAIN_RENT_CHANGE'){ 
        return JSON.stringify(
          {
            afterMonth:{
              month:paramsType.month,
              arrive:amountTransform(paramsType.arrive,'*'),
              rentCheap:amountTransform(paramsType.rentCheap,'*')
            },
            other:{
              arrive:amountTransform(paramsType.arrive2,'*'),
              rentCheap:amountTransform(paramsType.rentCheap2,'*')
            }
          }
        )
     }else if(v=='AGAIN_RENT_NOTICE_TIME'){
       return JSON.stringify(
        {
          times:paramsType.times,
          cron:paramsType.cron
        }
      )
     }else if(v=='AGAIN_RENT_NOTICE_CONTENT'){
       return paramsType.value
     }else if(v=='SUPPLY_RENT_NOTICE_TIME'){
       return JSON.stringify(
        {
          days:paramsType.days.toString(),
          time:paramsType.time
        }
      )
     }else if(v=='SUPPLY_RENT_NOTICE_CONTENT'){
      return paramsType.value
     }else if(v=='SERVICE_OR_MANAGER_NOTICE'){
      return JSON.stringify(
       {
         phone:paramsType.phone,
         managerId:paramsType.managerId
       }
     )
     }else if(v=='SERVICE_NOTICE_CONTENT'){
      return paramsType.value
     }
  }
  return (
    <ModalForm
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
              <Button  key="cacnl" onClick={() =>{setVisible(false);onClose()}}>
                  取消
              </Button>,
              <Button  type="primary" key="submit" onClick={() => {
                  props.form?.submit?.()
                }}>
                  确认
              </Button>
            ];
        },
        }}
        onFinish={async (values) => {
          const params={
            code:paramsType.code,
            value:await handleChange(paramsType.code)
          }
          await  updateByCode(params).then(res=>{
              if(res.code==0){
                message.success('更新成功！')
                setVisible(false)
                callback(true)
              }
            })
        }}
    >
        <p><ExclamationCircleFilled style={{color:'#FEA82F'}}/> 确定要更新么？</p>
    </ModalForm >
  );
};