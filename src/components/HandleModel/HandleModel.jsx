import React, { useState, useEffect,useRef } from 'react';
import { ModalForm,ProFormSwitch} from '@ant-design/pro-form';
import { Button } from 'antd';

export default props=>{
    const {record,text,InterFace,title,boxref,label,status,arrId}=props
    const [byid,setByid]=useState()
    const [visible, setVisible] = useState(false);
    const Termination=(record)=>{
        setByid(record&&record.sourceId)
        setVisible(true)
    }
    return (
        <ModalForm
            title={title}
            key={byid}
            onVisibleChange={setVisible}
            visible={visible}
            trigger={<Button disabled={status==2&&record?.delete?true:false}  style={{marginRight:'10px'}} onClick={()=>Termination(record)}>{label}</Button>}
            submitter={{
            render: (props, defaultDoms) => {
                return [
                ...defaultDoms
                ];
            },
            }}
            onFinish={async (values) => {
                InterFace({sourceIds:arrId?arrId:[byid],status}).then(res=>{
                    if(res.code==0){
                        setVisible(false)   
                        boxref&&boxref.current?.reload()
                        return true;
                    }
                })
            }}
        >
        <p>{text}</p>
    </ModalForm>
    )
}

