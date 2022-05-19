import React, { useState, useRef,useEffect } from 'react';
import { Input, Form, message,Button} from 'antd';
import { EditableProTable } from '@ant-design/pro-table';
import ProForm, {
    ProFormText,
    ProFormFieldSet,
    ProFormDateRangePicker,
    DrawerForm
  } from '@ant-design/pro-form';
import ProCard from '@ant-design/pro-card';
import { couponCrowdSub,couponCrowdDetail,couponCrowdEdit } from '@/services/crowd-management/coupon-crowd';
import { history} from 'umi';
import CrowdModel from './crowd-model'
import {formatMessage,connect} from 'umi';
import  './style.less'

const formItemLayout = {
  labelCol: { span: 2 },
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


export default (props) =>{
  const {setVisible,visible,onClose,callback,id}=props
  const [editableKeys, setEditableRowKeys] = useState([]);
  const [dataSource, setDataSource] = useState([]);
  const [falg1,setFalg1]=useState(false)
  const [falg2,setFalg2]=useState(false)
  const [falg3,setFalg3]=useState(false)
  const [levelId,setLevelId]=useState()
  const [form] = Form.useForm();
  const ref=useRef()
  const Callback=val=>{
    setLevelId(val)
  }
  useEffect(()=>{
    if(id){
      couponCrowdDetail({id:id}).then(res=>{
        form.setFieldsValue({name:res.data.name})
        const arr=[]
        res.data.crowdInfo.map(ele=>{
          if(ele.type==1){
            setFalg1(true)
          }else if(ele.type==2){
            setFalg2(true)
          }
          else if(ele.type==3){
            setFalg3(true)
          }
          arr.push({
            id:ele.crowdInfoId,
            state:ele.isContain,
            title:ele.type==1?'会员等级':ele.type==2?'消费次数':'累计消费',
            labels:ele.type==2?[ele.numStart,ele.numEnd]:ele.type==3&&[ele.moneyStart,ele.moneyEnd],
            userLevel:ele.userLevel,
            userLevelDisplay:ele.userLevelDisplay
          })
        })
        setDataSource(arr)
      })
    }
  },[])
  const onsubmit=values=>{
      try {
        dataSource.map(ele=>{
          if(ele.title=='会员等级'){
            values.userLevelInfo={
              isContain: ele.state||1,
              userLevel: levelId&&levelId.userLevel.toString()||ele.userLevel    
            }
          }else if(ele.title=='消费次数'){
            values.consumeNumInfo={
              isContain: ele.state||1,
              numStart: ele.labels[0],
              numEnd: ele.labels[1],
              // validTimeStart:ele.labels[2][0],
              // validTimeEnd:ele.labels[2][1]
            }
          }else if(ele.title=='累计消费'){
            values.consumeLjInfo={
              isContain: ele.state||1,
              moneyStart: ele.labels[0],
              moneyEnd: ele.labels[1],
              // validTimeStart:ele.labels[2][0],
              // validTimeEnd:ele.labels[2][1]
            }
          }
        })
      } catch (error) {
        console.log('error',error)
      }
      if(id){
        couponCrowdEdit({...values,id:id}).then(res=>{
          if(res.code==0){
            setVisible(false)
            message.success('编辑成功')
          }
        })
      }else{
        couponCrowdSub(values).then(res=>{
          if(res.code==0){
            setVisible(false)
            message.success('操作成功')
          }
        })
      }
  }
  const columns= [
    {
      title: '选项',
      dataIndex: 'title',
      width: '30%',
      renderFormItem:(_,data)=>{
        return <p>{_.entry.title}</p>
      }
    },
    {
      title: '范围',
      key: 'state',
      dataIndex: 'state',
      valueEnum: {
        1: '包含',
        2: '不包含',
      }
    },
    {
      title: '条件',
      dataIndex: 'labels',
      renderFormItem: (_, row) => {
        if(_.entry.title=='会员等级'){
              if(levelId){
                return <>
                  <p className='grade'>{
                    levelId?.userLevel.map(ele=>{
                      return <span>V{ele}等级、</span>
                      })
                    }
                  </p>
                <CrowdModel Callback={Callback}/>
                </>
              }else{
                return <CrowdModel Callback={Callback}/>
              }
        }else if(_.entry.title=='消费次数'){
        return <ProFormFieldSet>
                  <Input className='nums' suffix="次" /> 
                  至 
                  <Input className='nums' suffix="次" />
                  {/* <ProFormDateRangePicker
                    name='dateRange'
                    placeholder={[
                        formatMessage({id: 'formandbasic-form.placeholder.start'}),
                        formatMessage({id: 'formandbasic-form.placeholder.end'}),
                    ]}
                /> */}
                </ProFormFieldSet>;
        }
        return <ProFormFieldSet> 
                  <Input name='min' className='nums' suffix="元" />
                  至 
                  <Input name='max' className='nums' suffix="元" />
                  {/* <ProFormDateRangePicker
                    name='dateTimeRange'
                    placeholder={[
                        formatMessage({id: 'formandbasic-form.placeholder.start'}),
                        formatMessage({id: 'formandbasic-form.placeholder.end'}),
                    ]}
                /> */}
                </ProFormFieldSet>;
      },
      render: (_, row) =>{
        if(row.title=='会员等级'){
          return <p>{levelId?.userLevel.map(ele=>{
            return <span>V{ele}等级、</span>
          })||row.userLevelDisplay}</p>;
          }else if(row.title=='消费次数'){
            return <>
                    <p>{row.labels[0]}次 至 {row.labels[1]}次</p>
                    {/* <p>{row.labels[2][0]} 到 {row.labels[2][1]}</p> */}
                  </>;
          }
            return <>
                    <p>{row.labels[0]}元 至 {row.labels[1]}元</p>
                    {/* <p>{row.labels[2][0]} 到 {row.labels[2][1]}</p> */}
                  </>;
      }
    },
    {
      title: '操作',
      valueType: 'option',
      width: 250,
      render: (_,record) => [
        <a
          key="delete"
          onClick={() => {
            if(record.title=='会员等级'){
              setFalg1(false)
            }else if(record.title=='消费次数'){
              setFalg2(false)
            }
            else if(record.title=='累计消费'){
              setFalg3(false)
            }
            setDataSource(dataSource.filter((item) => item.id !== record.id));
          }}
        >
          删除
        </a>
      ],
    }
  ];
  return (
      <>
       <DrawerForm
          title='群体管理配置'
          onVisibleChange={setVisible}
          visible={visible}
          form={form}
          width={1200}
          drawerProps={{
            forceRender: true,
            destroyOnClose: true,
            onClose: () => {
              onClose();
            }
          }}
          submitter={
            {
              render: (props, defaultDoms) => {
                return [
                  <Button style={{margin:'30px'}} type="primary" key="submit" onClick={() => {
                    props.form?.submit?.()
                  }}>
                    保存
                  </Button>,
                  <Button type="default" onClick={() => {onClose();setVisible(false)}}>
                    返回
                  </Button>
                ];
              }
            }
          }
          onFinish={async (values)=>{
            await  onsubmit(values);
          }}
          {...formItemLayout}
      >
        <ProCard
          title="基础设置"
          bordered
          headerBordered
          collapsible
        >
        <ProFormText
          name="name"
          width="200px"
          label="群体名称"
          placeholder="请输入名称"
          rules={[
            { required: true, message: '请输入群体名称' },
            { validator:(rule,value,callback)=>{
              return new Promise(async (resolve, reject) => {
              if(value&&value.length>20){
                await reject('群体名称不超过20个字符')
              }else {
                  await resolve()
              }
            })
            }}
          ]}
          />
        </ProCard>
        <ProCard
            title="选项设置"
            bordered
            headerBordered
            collapsible
            className='sets'
            >
            <h4 className='memberMsg'>会员基本信息</h4>
            <Button 
                type={falg1?"primary":"default"}  
                onClick={() => {
                  setFalg1(true)
                  let falg=dataSource.some(ele=>ele.title=='会员等级')
                  if(dataSource.length==0||!falg){
                    ref.current?.addEditRecord?.({
                    id: '1',
                    title: '会员等级',
                    });
                  }else{
                    message.error('已有该选项')
                  }
                }}
                style={{margin:"20px 0 20px 50px"}}
                >
                  会员等级
            </Button>
            <h4 className='memberMsg'>会员消费情况</h4>
            <Button
              type={falg2?"primary":"default"}  
              style={{margin:"20px 0 20px 50px"}}
              onClick={() => {
                  setFalg2(true)
                  let falg=dataSource.some(ele=>ele.title=='消费次数')
                  if(dataSource.length==0||!falg){
                    ref.current?.addEditRecord?.({
                    id: '2',
                    title: '消费次数',
                    });
                  }else{
                    message.error('已有该选项')
                  }
              }}
              >
                消费次数
            </Button>
            <Button 
              type={falg3?"primary":"default"}
              style={{margin:"20px"}}
              onClick={() => {
                  setFalg3(true)
                  let falg=dataSource.some(ele=>ele.title=='累计消费')
                  if(dataSource.length==0||!falg){
                    ref.current?.addEditRecord?.({
                    id: '3',
                    title: '累计消费',
                    });
                  }else{
                    message.error('已有该选项')
                  }
              }}>
                累计消费
            </Button>
        </ProCard>
        <ProCard
            title="群体设置"
            bordered
            headerBordered
            collapsible
            className='sets'
            style={{marginTop:'20px'}}
          >
            <EditableProTable
              actionRef={ref}
              rowKey="id"
              options={false}
              recordCreatorProps={false}
              value={dataSource}
              onChange={setDataSource}
              maxLength={3}
              editable={{
                editableKeys,
                onChange: setEditableRowKeys,
                onlyAddOneLineAlertMessage:'不能同时新增多行',
                onSave: async (rowKey, data, row) => {
                },
                onCancel:async (rowKey, data, row) => {
                  if(rowKey==1){
                    setFalg1(false)
                  }else if(rowKey==2){
                    setFalg2(false)
                  }else if(rowKey==3){
                    setFalg3(false)
                  }
                }
              }}
              search={false}
              columns={columns}
            />
        </ProCard>
    </DrawerForm>
    </>
  )
}
