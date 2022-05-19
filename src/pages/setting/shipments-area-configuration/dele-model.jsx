import React, { useState} from 'react';
import { ModalForm,ProFormTextArea} from '@ant-design/pro-form';
import { Button,message,Space } from 'antd';
import { updateLatedeliveryAreaStatus } from '@/services/setting/shipments-area-configuration'
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
    const {visible, setVisible,cityData,tabelRef,canback}=props
    return (
        <ModalForm
            title={<Space>
                    <ExclamationCircleOutlined style={{color:'#1D93FF'}}/> 
                    <span>确认要删除地区：{cityData.provinceName+' '+cityData.cityName+' '+cityData.districtName}</span>
                  </Space>
                  }
            key={cityData.id}
            onVisibleChange={setVisible}
            visible={visible}
            submitter={{
            render: (props, defaultDoms) => {
                return [
                <Button type="default" key="submit" onClick={() => {
                  setVisible(false)  
                  }}>
                    取消
                </Button>,
                <Button type="primary" key="submit" onClick={() => {
                    props.form?.submit?.()
                  }}>
                    确定删除
                  </Button>
                ];
            },
            }}
            onFinish={async (values) => {
              updateLatedeliveryAreaStatus({
                  type:0,
                  id: cityData.id,
                }, { showSuccess: true })
                  .then(res => {
                    if (res.code === 0) {
                      tabelRef&&tabelRef.current.reload();
                      setVisible(false) 
                      canback()
                    }
                  })       
            }
            }
            {...formItemLayout}
        >
       <p>删除后配置区域内商品收发地下单将不会提示</p>
        
    </ModalForm>
    )
}

