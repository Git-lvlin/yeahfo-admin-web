import React, { useState, useEffect,useRef } from 'react';
import { ModalForm,ProFormTextArea} from '@ant-design/pro-form';
import { Button,message } from 'antd';

export default props=>{
    const {record,type,text,InterFace,title,boxref,label,state,arrId}=props
    const [byid,setByid]=useState()
    const [visible, setVisible] = useState(false);
    const Termination=(record)=>{
        setByid(record&&record.id)
        setVisible(true)
    }
    return (
        <ModalForm
            title={title}
            key={byid}
            onVisibleChange={setVisible}
            visible={visible}
            trigger={<Button style={{background:state==1?'#2ecc71':'#f39c12',color:'#fff'}} onClick={()=>Termination(record)}>{type==0?label:null}</Button>}
            submitter={{
            render: (props, defaultDoms) => {
                return [
                ...defaultDoms
                ];
            },
            }}
            onFinish={async (values) => {
                if(byid||arrId.length){
                    InterFace({dynamicIds:arrId?arrId:[byid],state,refuseReason:values.refuseReason}).then(res=>{
                        if(res.code==0){
                            setVisible(false)   
                            boxref&&boxref.current?.reload()
                            message.success('操作成功')
                            return true;
                        }
                    })
                }else{
                    message.error('请先选择帖子')
                }
                
            }}
        >
        <p>{text}</p>
        {
            state==2?
            <ProFormTextArea
                width="md"
                name="refuseReason"
                label="原因"
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

