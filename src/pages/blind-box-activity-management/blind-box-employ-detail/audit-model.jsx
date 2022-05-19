import React, { useState} from 'react';
import { ModalForm,ProFormTextArea} from '@ant-design/pro-form';
import { Button,message } from 'antd';
import { history } from 'umi';

export default props=>{
    const {InterFace,title,boxref,label,id}=props
    const [visible, setVisible] = useState(false);
    const Termination=()=>{
        setVisible(true)
    }
    return (
        <ModalForm
            title={title}
            onVisibleChange={setVisible}
            visible={visible}
            trigger={<a  onClick={()=>Termination()}>{label}</a>}
            submitter={{
            render: (props, defaultDoms) => {
                return [
                    <Button  key="submit" onClick={() =>setVisible(false)}>
                        取消
                    </Button>,
                    <Button  type="primary" key="submit" onClick={() => {
                        props.form?.submit?.()
                      }}>
                        确认回收
                    </Button>
                ];
            },
            }}
            onFinish={async (values) => {
                InterFace({id:id,reclaimMsg:values.reclaimMsg}).then(res=>{
                    if(res.code==0){
                        setVisible(false)   
                        boxref&&boxref.current?.reload()
                        message.success('操作成功')
                        return true;    
                    }
                })
            }}
        >
            <ProFormTextArea
                width="md"
                name="reclaimMsg"
                rules={[
                    { required: true, message: '请输入回收原因' },
                    {
                        validator: (rule, value, callback) => {
                            return new Promise(async (resolve, reject) => {
                                if (value && value.length > 100||value.length<3) {
                                    await reject('最多100个字，最少3个字')
                                } else {
                                    await resolve()
                                }
                            })
                        }
                    }
                ]}
                placeholder="回收原因必填，最多100个字，最少3个字"
            />
    </ModalForm>
    )
}

