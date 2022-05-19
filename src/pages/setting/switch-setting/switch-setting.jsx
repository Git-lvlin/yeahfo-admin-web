import React, { useState, useEffect,useRef } from 'react';
import { Form, message, Button, Space,Spin} from 'antd';
import { setLadderConfig,getLadderConfig } from '@/services/setting/switch-setting';
import { PageContainer } from '@/components/PageContainer';
import ProForm, { ProFormRadio} from '@ant-design/pro-form';
import styles from './style.less'


const formItemLayout = {
  labelCol: { span: 3 },
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

export default (props) => {
  const [form] = Form.useForm()
  const ref=useRef()
  const onsubmit = (values) => {
    setLadderConfig(values).then(res=>{
      if(res.code==0){
        message.success('配置成功')
      }
    })
  }
  useEffect(()=>{
    getLadderConfig({}).then(res=>{
      form.setFieldsValue(res.data)
    })
  },[])
  return (
    <PageContainer  
       header={{
       title:'集采批发商品阶梯优惠供货参数开关设置',
    }}>
      <ProForm
        form={form}
        {...formItemLayout}
        formRef={ref}
        submitter={
          {
            render: (props, defaultDoms) => {
              return [
                <Space className={styles.submit}>
                    <Button type="primary" key="submit" onClick={() => {
                      props.form?.submit?.()
                      }}>
                      保存
                    </Button>
                </Space>
              ];
            }
          }
        }
        onFinish={async (values) => {
            await onsubmit(values);
            return true;
        }
        }
        className={styles.switch_setting}
      >
        <ProFormRadio.Group
                name="ladderSwitch"
                label='供应商可以设置阶梯优惠'
                rules={[{ required: true, message: '请设置' }]}
                options={[
                    {
                        label:'不开启（不可以设置阶梯优惠）',
                        value: 0,
                    },
                    {
                        label: '开启（可以设置阶梯优惠）',
                        value: 1,
                    },
                ]}
            />
      </ProForm >
      </PageContainer>
  );
};
