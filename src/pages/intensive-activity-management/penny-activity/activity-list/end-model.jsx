import React, { useState} from 'react';
import { ModalForm} from '@ant-design/pro-form';
import { Button, message } from 'antd';
import { changeStatus } from '@/services/intensive-activity-management/penny-activity';
import { history,connect } from 'umi';
import { ExclamationCircleFilled } from '@ant-design/icons';

export default props=>{
    const {pennyId,visible,setVisible,canBlack,onClose}=props

    return (
        <ModalForm
          title={<p><ExclamationCircleFilled style={{color:"#FAAD14"}}/> 请确认要终止活动</p>}
          key={pennyId}
          onVisibleChange={setVisible}
          visible={visible}
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
                  确认终止
              </Button>
              ];
          },
          }}
          onFinish={async (values) => {
            changeStatus({id:pennyId,actCode:'wsCentActiveCode',status:0}).then(res=>{
            if(res.code==0){
              setVisible(false) 
              canBlack(true) 
              message.success('操作成功')
              return true;
            }
          })
        
          }}
      >
        <p><span style={{color:"red"}}>终止后无法开启</span>，你还要继续吗？</p>
      </ModalForm>
    )
}

