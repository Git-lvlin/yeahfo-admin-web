import React, { useState} from 'react';
import { ModalForm,ProFormText} from '@ant-design/pro-form';
import { message,Form,List,Button } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { checkUserExist } from '@/services/activity-management/spring-festival-build-building-activity';
import { useEffect } from 'react';
import { P } from '@antv/g2plot';

export default props=>{
    const {endId,visible,setVisible,callback,phones,falg,dataSource,designateId}=props
    const [form] = Form.useForm()
    const [nickname,setNickname]=useState([])
    const checkConfirm = (rule, value, callback) => {
        return new Promise(async (resolve, reject) => {
          if (value && !/^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/.test(value)) {
            await reject('请输入正确的手机号')
          }else {
            await resolve()
          }
        })
      }
    useEffect(()=>{
      if(endId){
        setNickname(dataSource.length>0&&dataSource?.find(ele=>ele.id==designateId)?.assignPhones?.split(',')||phones?.split(','))
        const prizeNotice=dataSource.length>0&&dataSource?.find(ele=>ele.id==designateId)?.assignPhones?.split(',')||phones?.split(',')
        form.setFieldsValue({
          prizeNotice:prizeNotice?.map(ele=>({phone:ele}))||[{phone: ''}]
        })
      }else{
        setNickname(dataSource.length>0&&dataSource?.find(ele=>ele.id==designateId)?.assignPhones?.split(','))
        const prizeNotice=dataSource.length>0&&dataSource?.find(ele=>ele.id==designateId)?.assignPhones?.split(',')
        form.setFieldsValue({
          prizeNotice:prizeNotice?.map(ele=>({phone:ele}))||[{phone: ''}]
        })
      }
    },[endId,phones])
    return (
        <ModalForm
          title='指定中奖人'
          key={endId}
          form={form}
          onVisibleChange={setVisible}
          visible={visible}
          submitter={{
          render: (props, defaultDoms) => {
            return [
            <p style={{color:'#DD9616',margin:'1px 220px 0 0',}}>从给的手机号中随机选1名中奖，已经中过此奖的不会重复中此奖</p>,
            ...defaultDoms
            ];
          },
          }}
          onFinish={async (values) => {
              let flage=false
              for (let index = 0; index < nickname.length; index++) {
                    if(nickname[index]=='查询不到此用户'){
                      flage=true
                    }
              }
              if(flage){
                message.error('手机号必须是注册过我们约购APP平台的')
              }else{
                const prizePhones=values.prizeNotice.map(ele=>(ele.phone)).toString()
                callback(prizePhones)
                setVisible(false) 
              }

          }}
      >
        <p style={{display:'block'}}>请输入指定中奖人的手机号码</p>
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
                          key="2"
                          fieldProps={{
                            style: {
                              width: 328,
                              border:nickname&&nickname.length&&nickname[field.name]=='查询不到此用户'?'2px solid red':nickname&&nickname.length&&nickname[field.name]?'2px solid #68E11C':''
                            },
                            maxLength:11,
                            onChange:(val)=>{
                              checkUserExist({phone:val.target?.value}).then(res=>{
                              if(res.code==0){
                                const arr=nickname&&nickname.length?[...nickname]:[]
                                if(arr[field.name]){
                                  arr[field.name]=res?.data?.nickname
                                  if(!arr[field.name]){
                                    arr[field.name]='查询不到此用户'
                                  }
                                }else if(res?.data?.nickname){
                                  arr[field.name]=res?.data?.nickname
                                }else{
                                  arr[field.name]='查询不到此用户'
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
                        <span>{nickname&&nickname[field.name]}</span>
                      </List.Item>
                    )
                  })}
                </List>
                <Button icon={<PlusOutlined />} style={{ marginTop: 10,color:'#3986FF',border:'1px solid #3986FF' }} onClick={() => { add() }}>
                  添加
                </Button>
                <p style={{marginTop:'20px'}}>*手机号必须是注册过我们约购APP平台的</p>
              </>
            )}
          </Form.List>
      </ModalForm>
    )
}

