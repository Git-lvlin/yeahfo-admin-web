import React, { useEffect } from 'react';
import { Form,Button } from 'antd';
import ProForm, {
  ModalForm
} from '@ant-design/pro-form';
import { buildhouseAccountSub } from '@/services/activity-management/spring-festival-build-building-activity';
import styles from './style.less'
import { CloseCircleFilled,ExclamationCircleFilled} from '@ant-design/icons';

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
  return (
    <ModalForm
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
            ...defaultDoms
          ];
        },
        }}
        onFinish={async (values) => {
          const params={
            activityId:storeNoId?.configId,
            memberId:storeNoId?.memberId,
            isFreeze:storeNoId?.isFreeze?0:1,
            chanceId:storeNoId?.id
          }
          buildhouseAccountSub(params).then(res=>{
            if(res.code==0){
              setVisible(false)
              callback(true)
            }
          })
        }}
      {...formItemLayout}
    >
      {
        storeNoId?.isFreeze?
        <>
          <h3 className={styles.tis}><CloseCircleFilled style={{color:'#FF3700'}}/> 你是否确认解冻这项内容</h3>
          <p className={styles.ation}>解冻后奖励金可以提现使用</p>
        </>
        :
        <>
          <h3 className={styles.tis}><ExclamationCircleFilled style={{color:'#FBC550'}}/> 你确定要冻结该笔奖励金吗？</h3>
          <p className={styles.ation}>冻结后奖励金不可再提现使用，请先解冻</p>
        </>
      }

    </ModalForm >
  );
};