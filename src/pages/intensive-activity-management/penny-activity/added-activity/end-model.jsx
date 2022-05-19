import React, { useState} from 'react';
import { ModalForm} from '@ant-design/pro-form';
import { Button, message } from 'antd';
import { changeStatus } from '@/services/intensive-activity-management/penny-activity';
import { history,connect } from 'umi';
import { ExclamationCircleFilled } from '@ant-design/icons';

export default props=>{
    const {pennyId,visible,setVisible,callback,onClose,dataSource}=props

    return (
        <ModalForm
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
                  继续
              </Button>
              ];
          },
          }}
          onFinish={async (values) => {
            if(pennyId?.type==1){
              const arr=dataSource.filter(ele=>(
                ele.wsId!=pennyId?.wsId
              ))
              callback(arr)
              setVisible(false)
            }else if(pennyId?.type==2){
              const arr=dataSource.map(ele=>(
                {...ele,status:ele.wsId==pennyId?.wsId?0:ele.status}
              ))
              callback(arr)
              setVisible(false)
            }else{
              const arr=dataSource.map(ele=>(
                {...ele,status:ele.wsId==pennyId?.wsId?1:ele.status}
              ))
              callback(arr)
              setVisible(false)
            }

          }}
      >
        <p><ExclamationCircleFilled style={{color:"#FAAD14"}}/> {pennyId?.type==1?'确认从活动商品列表中剔除此商品么？':pennyId?.type==2?'确认禁用此商品么？':'确认启用此商品么？'}</p>
      </ModalForm>
    )
}

