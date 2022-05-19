import React, { useEffect } from 'react';
import { circleInsert,circleDetail } from '@/services/community-management/circle-insert';
import { circleUpdateCircle } from '@/services/community-management/circle-update-circle';
import ProForm, { ProFormTextArea,ProFormText,ProFormRadio} from '@ant-design/pro-form';
import { history } from 'umi';
import { message, Form,Button } from 'antd';
import Upload from '@/components/upload';
import styles from './style.less'

export default props => {
 let id = props.location.query.id
 const [form] = Form.useForm()
 useEffect(()=>{
   if(id){
    circleDetail({id}).then(res=>{
      form.setFieldsValue(res.data)
    })

   }
   return undefined
 })
  return (
    <ProForm
        onFinish={async (values) => {
          if(id){
            values.id=id
            circleUpdateCircle(values).then(res=>{
              if(res.code==0){
                history.push('/community-management/circle-management')
                message.success('提交成功');
              }
            })
          }else{
            circleInsert(values).then(res=>{
              if(res.code==0){
                history.push('/community-management/circle-management')
                message.success('提交成功');
              }
            })
          }
        }}
        form={form}
        params={{}}
        className={styles.addcircle}
        submitter={{
          render: (props, doms) => {
            return [
              <Button type="primary" key="submit" onClick={() => props.form?.submit?.()}>
                保存
              </Button>,
              <Button type="default" onClick={() => { window.history.back(); setTimeout(() => { window.location.reload(); }, 200) }}>
                返回
              </Button>
            ];
          }
        }}
        
      >
        <ProFormText
            width="md"
            name="name"
            label="圈子名称"
            tooltip="最长为 24 位"
            rules={[
              { required: true, message: '请输入圈子名称' },
              { validator:(rule,value,callback)=>{
                return new Promise(async (resolve, reject) => {
                if(value&&value.length>15){
                  await reject('圈子名称不超过15个字符')
                }else if (/[%&',;=?$\x22]/.test(value)) {
                  await reject('圈子名称不可以含特殊字符')
                }else {
                    await resolve()
                }
              })
              }}
            ]}
        />
        <ProFormTextArea
            width="md"
            name="describe"
            label="圈子描述"
            rules={[
              { required: true, message: '请输入圈子描述' },
              { validator:(rule,value,callback)=>{
                return new Promise(async (resolve, reject) => {
                if(value&&value.length>50){
                  await reject('圈子描述不超过50个字符')
                }else if (/[%&',;=?$\x22]/.test(value)) {
                    await reject('圈子描述不可以含特殊字符')
                } 
                else {
                  await resolve()
              }
              })
              }}
            ]}
        />
        <Form.Item extra="建议尺寸：宽240px   高240px，支持扩展名：png、jpg、gif，大小不超过1M" label="圈子ICON" name="logo" tooltip="建议尺寸：宽240px   高240px，支持扩展名：png、jpg、gif，大小不超过1M" rules={[{ required: true, message: '请上传图片，限制在375k' }]} >
           <Upload code={204} multiple maxCount={1} accept="image/*" dimension="1:1" size={375} />
        </Form.Item>
        <ProFormRadio.Group
            name="hot"
            label="是否加为热门圈子"
            rules={[{ required: true, message: '请选择是否热门' }]}
            initialValue={false}
            options={[
                {
                label: '是',
                value: true
                },
                {
                label: '否',
                value: false
                },
            ]}
            />
      </ProForm>
  );
};
