import React, { useEffect } from 'react';
import { Form,Button } from 'antd';
import ProForm, {
  ProFormTextArea,
  ProFormRadio,
  ProFormText,
  ProFormDependency,
  ModalForm
} from '@ant-design/pro-form';
import { AgentShopDelete,accountDetail } from '@/services/daifa-store-management/list'
import styles from './style.less'
import { InfoCircleOutlined,QuestionCircleOutlined} from '@ant-design/icons';
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
  const { visible, setVisible, callback,storeNoId,onClose} = props;
  const [amount,setAmount]=useState()
  useEffect(()=>{
    accountDetail({accountType:'agentStore',accountId:storeNoId?.data?.storeNo}).then(res=>{
      setAmount(amountTransform(res.data?.commission, '/'))
    })
  },[])
  return (
    <ModalForm
      title={storeNoId?.type==1||amount<5?'确认提示':'信息提示'}
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
      className={styles.cancel_model}
      submitter={{
        render: (props, defaultDoms) => {
          return [
            <div key='cancel'>
              {
                storeNoId?.type==1||amount<5?
                <>
                <Button  key="cacnl" onClick={() =>{setVisible(false);onClose()}}>
                    取消注销
                </Button>
                <Button  type="primary" key="submit" onClick={() => {
                    props.form?.submit?.()
                  }}>
                    确认注销
                </Button>
                </>
                :
                <>
                <Button  key="submit" onClick={() =>props.form?.submit?.()}>
                  强制注销
                </Button>
                <Button  type="primary" key="cacnl" onClick={() => {
                  onClose()
                  setVisible(false)
                  }}>
                    暂不注销
                </Button>
                </>
              }
            </div>
          ];
        },
        }}
        onFinish={async (values) => {
          const params={
            type:storeNoId?.type,
            store:[{
              storeNo:storeNoId?.data?.storeNo,
              amount:amount
            }]
          }
          AgentShopDelete(params).then(res=>{
            if(res.code==0){
              setVisible(false)
              callback(true)
            }
          })
        }}
      {...formItemLayout}
    >
      {
        storeNoId?.type==1||amount<5?
        <>
          <h3 className={styles.tis}><QuestionCircleOutlined style={{color:'#FEA82F'}}/> 是否确定强制注销店铺？</h3>
          <p className={styles.ation}>注销后店铺将不能继续使用，请确认！</p>
        </>
        :
        <>
          <h3 className={styles.tis}><InfoCircleOutlined style={{color:'#57A7FE'}}/> 此店铺余额大于等于5.00元，暂时无法注销</h3>
          <p className={styles.ation}>店铺账号余额小于5元时才可注销</p>
        </>
      }

    </ModalForm >
  );
};