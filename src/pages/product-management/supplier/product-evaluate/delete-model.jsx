import React, { useState, useEffect,useRef } from 'react';
import { ModalForm,ProFormTextArea} from '@ant-design/pro-form';
import { Button,message } from 'antd';
import { updGoodsComment } from '@/services/product-management/product-evaluate';
import { Space } from 'antd';

export default props=>{
    const {setVisible,visible,callback,onClose}=props
    return (
        <ModalForm
            title='操作确认'
            onVisibleChange={setVisible}
            visible={visible}
            submitter={{
            render: (props, defaultDoms) => {
                return [
                ...defaultDoms
                ];
            },
            }}
            onFinish={async (values) => {
                updGoodsComment({id:record.id,state:record.state}).then(res=>{
                        if(res.code==0){
                            setVisiblePopup(false)   
                            boxref&&boxref.current?.reload()
                            message.success('操作成功')
                            return true;
                        }
                    })
                
            }}
        >
        <p>确认要执行此操作吗？</p>
    </ModalForm>
    )
}

