import React, { useEffect } from 'react';
import { Form,Button,List,DatePicker } from 'antd';
import ProForm, {
  ModalForm
} from '@ant-design/pro-form';
import { withdrawPage } from '@/services/activity-management/spring-festival-build-building-activity';
import moment from 'moment'
import { useState } from 'react';
import { amountTransform } from '@/utils/utils'

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
  const { visible, setVisible, callback,recordId,onClose} = props;
  const [withdraw,setWithdraw]=useState()
  const [date,setDate]=useState()
  useEffect(()=>{
    withdrawPage({memberId:recordId?.memberId,date:moment(date).format('YYYY-MM')}).then(res=>{
      if(res.code==0){
        setWithdraw(res.data)
      }
    })
  },[date])
  return (
    <ModalForm
      title='提现记录：'
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
      submitter={{
        render: (props, defaultDoms) => {
          return [
                <Button type="primary" key="cancel" onClick={() =>{setVisible(false);onClose()}}>
                 知道了
                </Button>
          ];
        },
        }}
        onFinish={async (values) => {
        }}
      {...formItemLayout}
    >
      <DatePicker onChange={(itme)=>setDate(itme)} picker="month" />
      <List
        size="small"
        dataSource={withdraw}
        renderItem={item => 
        <List.Item>
          <p>
          {item?.createTime} &nbsp;&nbsp;&nbsp; 提现至{{'alipay':'支付宝'}[item?.paymentMethod]}  &nbsp;&nbsp;&nbsp; {amountTransform(item?.amount, '/')}元 &nbsp;&nbsp;&nbsp; {{
          'auditing':'待审核',
          'waitPay':'待执行',
          'paid':'已执行',
          'arrived':'已到帐',
          'unPass':'审核拒绝', 
          'failure':'提现失败'
        }[item?.status]}
        </p>
        </List.Item>}
      />

    </ModalForm >
  );
};