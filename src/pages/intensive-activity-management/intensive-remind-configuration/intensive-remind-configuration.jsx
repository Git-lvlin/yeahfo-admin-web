import React, { useState, useEffect,useRef } from 'react';
import { Form, message, Button, Space,Spin} from 'antd';
import { remindSetConfig,remindGetConfig } from '@/services/intensive-activity-management/intensive-remind-configuration';
import { PageContainer } from '@/components/PageContainer';
import ProForm, { ProFormText} from '@ant-design/pro-form';
import styles from './style.less'


const formItemLayout = {
  labelCol: { span: 6 },
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
  const checkConfirm = (rule, value, callback) => {
    return new Promise(async (resolve, reject) => {
      if (value && value > 9999||parseInt(value)<1) {
        await reject('范围1-9999')
      } else if (value&&value.length>0&&!/^[0-9]*[1-9][0-9]*$/.test(value)&&value!=0) {
          await reject('只能输入整数')
      }else {
        await resolve()
      }
    })
  }
  const onsubmit = (values) => {
    remindSetConfig({smsCount:parseInt(values.smsCount)}).then(res=>{
      if(res.code==0){
        message.success('配置成功')
      }
    })
  }
  useEffect(()=>{
    remindGetConfig({}).then(res=>{
      form.setFieldsValue(res.data)
    })
  },[])
  return (
    <PageContainer>
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
                      提交
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
        className={styles.remindConfiguration}
      >
        <h3 className={styles.head}>基本设置</h3>
        <ProFormText
          width={400}
          name="smsCount"
          label='需发短信的最低商品提醒数量'
          placeholder='请输入需要发送给店主的最低商品提醒数量，范围1-9999'
          rules={[
            { required: true, message: '请输入最低商品提醒数量' },
            { validator: checkConfirm }
          ]}
        />
      </ProForm >
      </PageContainer>
  );
};
