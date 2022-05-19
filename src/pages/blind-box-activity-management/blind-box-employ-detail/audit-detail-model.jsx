import React, { useState} from 'react';
import { ModalForm,ProFormTextArea} from '@ant-design/pro-form';
import { Button,message } from 'antd';
import { history } from 'umi';

export default props=>{
    const {data,title}=props
    const [visible, setVisible] = useState(false);
    const Termination=()=>{
        setVisible(true)
    }
    return (
        <ModalForm
            title={title}
            onVisibleChange={setVisible}
            visible={visible}
            trigger={<a  onClick={()=>Termination()}>官方回收</a>}
            submitter={{
            render: (props, defaultDoms) => {
                return [
                    <Button type="primary" key="submit" onClick={() => {
                        props.form?.submit?.()
                      }}>
                        知道了
                    </Button>
                ];
            },
            }}
            onFinish={async (values) => {
                 setVisible(false)   

            }}
        >
        <p>
            {data?.reclaimMsg}
        </p>
    </ModalForm>
    )
}

