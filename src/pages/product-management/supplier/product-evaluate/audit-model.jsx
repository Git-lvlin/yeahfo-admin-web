import React, { useState, useEffect,useRef } from 'react';
import { ModalForm,ProFormTextArea} from '@ant-design/pro-form';
import { Button,message } from 'antd';
import { updGoodsComment } from '@/services/product-management/product-evaluate';
import { Space } from 'antd';

export default props=>{
    const {record,boxref,setVisiblePopup,visiblePopup,type}=props
    return (
        <ModalForm
            title='操作确认'
            onVisibleChange={setVisiblePopup}
            visible={visiblePopup}
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
        <p style={{display:type==1?'block':'none'}}>确认要执行此操作吗？</p>
        {
            type!=1&&<>
            {
                record.status?
                <p>确认要将本条评价修改为<span style={{color:'red'}}>通过状态</span>吗？</p>
                :
                <p>确认要将本条评价修改成<span style={{color:'red'}}>屏蔽状态</span>吗？</p>
            }
            </>
        }


    </ModalForm>
    )
}

