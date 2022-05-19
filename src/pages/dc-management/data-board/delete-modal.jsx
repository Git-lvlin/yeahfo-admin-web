import React, { useState, useEffect,useRef } from 'react';
import { Input, Form, Divider, message, Button,List, Space,Avatar } from 'antd';
import { ModalForm} from '@ant-design/pro-form';

export default props=>{
    const {text,InterFace,title,boxref,id}=props
    const [visible, setVisible] = useState(false);
    const Termination=(record)=>{
        setVisible(true)
    }
    return (
        <ModalForm
            title={title}
            key="model2"
            onVisibleChange={setVisible}
            visible={visible}
            trigger={<a onClick={()=>Termination()}>删除</a>}
            submitter={{
            render: (props, defaultDoms) => {
                return [
                ...defaultDoms
                ];
            },
            }}
            onFinish={async (values) => {
                    InterFace({id:id}).then(res=>{
                        if(res.code==0){
                            setVisible(false)   
                            boxref.current?.reload()
                            message.success('删除成功');
                            return true;
                        }
                    })
                }
               
            }
        >
        <p>{text}</p>
    </ModalForm>
    )
}

