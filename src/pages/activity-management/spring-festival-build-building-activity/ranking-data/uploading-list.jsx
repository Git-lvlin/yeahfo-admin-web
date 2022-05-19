import React, { useState} from 'react';
import { ModalForm,ProFormText,ProFormSelect} from '@ant-design/pro-form';
import { message,Form,List,Button } from 'antd';
import { setVirtualInvite,checkUserExist,getActiveConfigList } from '@/services/activity-management/spring-festival-build-building-activity';
import { PlusOutlined } from '@ant-design/icons';
import { useEffect } from 'react';

export default props=>{
    const {visible,setVisible,callback,onClose}=props
    const [form] = Form.useForm()
    const [nickname,setNickname]=useState([])
    const [onselect,setOnselect]=useState([])
    const [activityId,setActivityId]=useState()
    const checkConfirm = (rule, value, callback) => {
        return new Promise(async (resolve, reject) => {
          if (value && !/^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/.test(value)) {
            await reject('请输入正确的手机号')
          }else {
            await resolve()
          }
        })
      }
    const checkConfirm2 = (rule, value, callback) => {
      return new Promise(async (resolve, reject) => {
        if (value && !/^[0-9]*[1-9][0-9]*$/.test(value)) {
          await reject('只能输入正整数')
        }else {
          await resolve()
        }
      })
    }
    useEffect(()=>{
      getActiveConfigList({page:1,size:100}).then(res=>{
        setOnselect(res.data?.map(ele=>(
          {label:ele.name,value:ele.id}
        )))
      })
    },[])
    return (
        <ModalForm
          title='上传邀请用户排名：（仅计算邀请新用户注册APP）'
          key='uplist'
          form={form}
          onVisibleChange={setVisible}
          visible={visible}
          modalProps={{
            forceRender: true,
            destroyOnClose: true,
            onCancel: () => {
              onClose();
            }
          }}
          submitter={{
          render: (props, defaultDoms) => {
              return [
              ...defaultDoms
              ];
          },
          }}
          onFinish={async (values) => {
              const params={
                list:values.prizeNotice.map(ele=>({activityId:activityId,...ele}))
              }
              setVirtualInvite(params).then(res=>{
                if(res.code==0){
                  setVisible(false) 
                  callback(true)
                  message.success('操作成功')
                }
              })
          }}
        initialValues={{
        prizeNotice:[{
            phone: '',
            inviteNums:''
        }],
        }}
      >
         <ProFormSelect
          width="md"
          name="activityId"
          options = {onselect}
          placeholder="选择活动"
          fieldProps={{
            onChange:(val)=>{
              setActivityId(val)
            }
          }}
        />
        <Form.List name="prizeNotice">
            {(fields, { add, remove }) => (
              <>
                <List
                  itemLayout="horizontal"
                >
                  {fields.map((field) => {
                    return (
                      <List.Item
                        key={field.key}
                        extra={fields.length !== 1 &&
                          <Button style={{ marginLeft: 10, width: 80,color:'#D9001B',border:'1px solid #D9001B' }} onClick={() => {
                             remove(field.name) 
                             const arr=nickname.filter((ele,index)=>index!=field.name)
                             setNickname(arr)
                          }} danger>
                            删除
                          </Button>}
                      >
                          <ProFormText
                            {...field}
                            name={[field.name, 'phone']}
                            fieldKey={[field.fieldKey, 'phone']}
                            placeholder='输入用户手机号'
                            key="phone"
                            fieldProps={{
                              style: {
                                width: 200
                              },
                              maxLength:11,
                              onChange:(val)=>{
                                  checkUserExist({phone:val.target?.value}).then(res=>{
                                  if(res.code==0){
                                    const arr=[...nickname]
                                    if(arr[field.name]){
                                      arr[field.name]=res?.data?.nickname
                                    }else if(res?.data?.nickname){
                                      arr.push(res?.data?.nickname)
                                    }else{
                                      arr.push('查询不到此用户')
                                    }
                                    const arr2=arr.filter((item) => item!== '')
                                    setNickname(arr2)
                                  }
                                })
                              },
                            }}
                            rules={[
                              { required: true, message: '请输入用户手机号' },
                              { validator: checkConfirm}
                            ]}
                          />
                          <span>{nickname[field.name]}</span>
                          <ProFormText
                            {...field}
                            name={[field.name, 'inviteNums']}
                            fieldKey={[field.fieldKey, 'inviteNums']}
                            placeholder='输入邀请新用户数'
                            key="inviteNums"
                            fieldProps={{
                              style: {
                                width: 200
                              },
                            }}
                            rules={[
                              { required: true, message: '输入邀请新用户数' },
                              {validator: checkConfirm2}
                            ]}
                          />
                            <ProFormText
                            {...field}
                            name={[field.name, 'activityId']}
                            fieldKey={[field.fieldKey, 'activityId']}
                            fieldProps={{
                              value:activityId
                            }}
                            hidden
                          />
                          <span>人</span>
                      </List.Item>
                    )
                  })}
                </List>
                <Button icon={<PlusOutlined />} style={{ marginTop: 10,color:'#3986FF',border:'1px solid #3986FF' }} onClick={() => { add() }}>
                  添加
                </Button>
              </>
            )}
          </Form.List>
        <p style={{marginTop:'20px'}}>*手机号必须是注册过我们约购APP平台的</p>
      </ModalForm>
    )
}

