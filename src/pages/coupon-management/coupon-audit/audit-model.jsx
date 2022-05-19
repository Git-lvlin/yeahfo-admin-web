import React, { useState} from 'react';
import { ModalForm,ProFormTextArea} from '@ant-design/pro-form';
import {  couponVerify } from '@/services/coupon-management/coupon-audit';
import { Button,message } from 'antd';
import { history } from 'umi';

export default props=>{
    const {visible,setVisible,status,id,callback}=props
    return (
        <ModalForm
            title={status==3?'审核驳回':'操作确认'}
            onVisibleChange={setVisible}
            visible={visible}
            submitter={{
            render: (props, defaultDoms) => {
                return [
                ...defaultDoms
                ];
            },
            }}
            style={{zIndex:'999'}}
            onFinish={async (values) => {
                couponVerify({id:id,status:status,content:values.content}).then(res=>{
                    if(res.code==0){
                        setVisible(false)
                        callback(true)  
                        message.success('操作成功') 
                    }
                })
            }}
        >
        <p>{status==4?'确认审核通过吗？':null}</p>
        {
            status==3?
            <ProFormTextArea
                width="md"
                name="content"
                label="请填写驳回原因"
                rules={[
                    {
                        validator: (rule, value, callback) => {
                            return new Promise(async (resolve, reject) => {
                                if (value && value.length > 100) {
                                    await reject('不能超过100个字符')
                                } else {
                                    await resolve()
                                }
                            })
                        }
                    }
                ]}
            />
            :null
        }
        
    </ModalForm>
    )
}

