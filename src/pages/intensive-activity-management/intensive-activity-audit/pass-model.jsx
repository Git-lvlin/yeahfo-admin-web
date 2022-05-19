import React, { useState} from 'react';
import { ModalForm,ProFormTextArea} from '@ant-design/pro-form';
import { Button,message,Space } from 'antd';
import { history } from 'umi';
import { CheckCircleTwoTone,ExclamationCircleOutlined } from '@ant-design/icons'

const formItemLayout = {
    labelCol: { span:4 },
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
    const {visible, setVisible,wsId,type,callback}=props
    return (
        <ModalForm
            width={400}
            title={<Space>
                {
                    type==1?
                    <CheckCircleTwoTone twoToneColor="#52c41a" /> 
                    :
                    <ExclamationCircleOutlined style={{color:"#FAAD14"}} /> 
                }
                <span>审核通过！</span>
                </Space>}
            key={wsId}
            onVisibleChange={setVisible}
            visible={visible}
            submitter={{
            render: (props, defaultDoms) => {
                return [
                <Button type="primary" key="submit" onClick={() => {
                    props.form?.submit?.()
                  }}>
                    确定
                  </Button>
                ];
            },
            }}
            onFinish={async (values) => {
                
              setVisible(false)
              callback()
              return true;        
            }
            }
            {...formItemLayout}
        >
        {
            type==1?
            <p>到达活动开始时间后系统自动开展活动。</p>
            :
            <div style={{color:'red'}}>
             <p>当前已过活动开始时间</p>
             <p>审核通过，活动立即开展！</p>
            </div>
        }
        
    </ModalForm>
    )
}

