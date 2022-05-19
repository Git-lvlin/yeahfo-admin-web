import React, { useState} from 'react';
import ProForm,{ ModalForm,ProFormTextArea,ProFormText} from '@ant-design/pro-form';
import { Button,message,Form } from 'antd';
import { configTest} from '@/services/resource'
import { history } from 'umi';



const formItemLayout = {
    labelCol: { span: 6},
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
    const {visible,setVisible}=props
    const [detailList,setDetailList]=useState()
    const Termination=()=>{
        setVisible(true)
    }
    return (
        <ModalForm
            title='测试结果验证'
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
                setVisible(false) 
            }}
            {...formItemLayout}
        >
        <ProForm
            onFinish={(values)=>{
                try {
                    const {...rest}=values
                    const pranams={
                        responseTemplate:JSON.parse(values.responseTemplate),
                        ...rest
                    }
                    configTest(pranams).then(res=>{
                        setDetailList(res.data)   
                    })
                } catch (error) {
                    message.error('请输入正确的JSON格式')
                }
               
            return true;
            } }
            {...formItemLayout} 
            submitter={{
            render: (props, doms) => {
                return [
                <Button style={{marginLeft:'180px'}} type="primary" key="submit" onClick={() => {
                    props.form?.submit?.()
                }}>
                    提交
                </Button>
                ];
            }
            }}
        >
        <ProFormText
            width="md"
            name="reportCode"
            label="接口编码"
            placeholder="输入接口编码"
            rules={[{ required: true, message: '请输入接口编码' }]}
        />
         <ProFormTextArea
            name="responseTemplate"
            label="请求参数"
            placeholder="请输入"
            rules={[{ required: true, message: '请输入请求参数' }]}
            />
        {
            detailList&&
            <Form.Item
                label="测试结果"
                readonly
            >
                <pre>
                    {JSON.stringify(detailList,null,'\t')}
                </pre>
            </Form.Item>
        }
        </ProForm>
    </ModalForm>
    )
}

