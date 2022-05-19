import React, { useState, useEffect,useRef } from 'react';
import { Input, Form, Divider, message, Button,Space } from 'antd';
import { FormattedMessage, formatMessage } from 'umi';
import ProForm, { ProFormText, ProFormRadio, ProFormDateTimeRangePicker,ProFormTextArea,ProFormDependency,ProFormSelect } from '@ant-design/pro-form';
import { getMemberShopServicepoint,setMemberShopServicepoint,getMemberShopServicepointLog } from '@/services/intensive-store-management/shop-area'
import ProTable from '@ant-design/pro-table';
import moment from 'moment';
import { amountTransform } from '@/utils/utils'

const formItemLayout = {
  labelCol: { span: 1 },
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

export default  () => {
  const [formDatil,setFormDatil]=useState()
  const [form] = Form.useForm()
  const actionRef = useRef();
  const ref=useRef()
  const [currentType,setCurrentType]=useState()
  const [calculate,setCalculate]=useState()
  const [rulelistdata, setRulelistData] = useState([])
  useEffect(() => {
    getMemberShopServicepoint({}).then(res=>{
      if(res.code==0){
        setFormDatil(res.data)
        const data=res?.data?.settingValues?.typtList?.limitTopNum?.rulelist.map((ele,index)=>({
          ...ele,
          id:index,
          money:ele?.basePoint?.money,
          circleNum:`${ele?.basePoint?.circleNum}${ele?.basePoint?.unit}`,
          min:ele?.userLimit?.min,
          max:ele?.userLimit?.max
        }))
        setRulelistData(data)
        form.setFieldsValue({
          dateRange: [(res.data?.settingValues?.typtList?.limitTime?.timeQuantumNum?.start)*1000,(res.data?.settingValues?.typtList?.limitTime?.timeQuantumNum?.end)*1000],
          // dateRange2: [(res.data?.settingValues?.typtList?.limitTopNum?.timeQuantumNum?.start)*1000,(res.data?.settingValues?.typtList?.limitTopNum?.timeQuantumNum?.end)*1000],
          dateRange2: `${moment((res.data?.settingValues?.typtList?.limitTopNum?.timeQuantumNum?.start)*1000).format('YYYY-MM-DD HH:mm:ss')} -- ${moment((res.data?.settingValues?.typtList?.limitTopNum?.timeQuantumNum?.end)*1000).format('YYYY-MM-DD HH:mm:ss')}`,
          discount:res.data?.settingValues?.typtList?.limitTime?.discount,
          currentType:res.data?.settingValues?.currentType
        })
      }
    })
        
  }, [])
  const checkConfirm = (rule, value, callback) => {
    return new Promise(async (resolve, reject) => {
      if (value&&value<0||value>10){
        await reject('只能输入0-10之间数字')
      }else if (value&&!/^[0-9]+(\.[0-9]{2})?$/.test(value)) {
        await reject('0-10之间数字，保留2位小数')
      } else {
        await resolve()
      }
    })
  }
  const checkConfirm2=(rule, value, callback)=>{
    return new Promise(async (resolve, reject) => {
    if (value&&value<1||value>100000){
        await reject('只能输入1-10万之间的整数')
    }else if (value&&value.length>0&&!/^[0-9]*[1-9][0-9]*$/.test(value)&&value!=0) {
        await reject('只能输入整数')
    }else {
        await resolve()
    }
    })
  }
  const onsubmit = (values) => {
    const params={
      currentType:values.currentType,
      start:values.currentType==='limitTime'?moment(values.dateRange[0]).format('YYYY-MM-DD HH:mm:ss'):moment(values.dateRange2[0]).format('YYYY-MM-DD HH:mm:ss'),
      end:values.currentType==='limitTime'?moment(values.dateRange[1]).format('YYYY-MM-DD HH:mm:ss'):moment(values.dateRange2[1]).format('YYYY-MM-DD HH:mm:ss'),
      discount:values.discount,
      rulelist:values.currentType==='limitTime'?'':formDatil?.settingValues?.typtList?.limitTopNum?.rulelist
    }
    setMemberShopServicepoint(params).then(res=>{
      if(res.code==0){
        message.success('设置服务费成功!')
        actionRef.current.reload()
      }
    })
  }

  const disabledDate=(current)=>{
    return current && current < moment().startOf('day');
  }
  const columns= [
    {
      title: '操作时间',
      dataIndex: 'createTime',
      valueType: 'text',
      hideInSearch: true,
      ellipsis:true
    },
    {
      title: '操作人',
      dataIndex: 'optAdminName',
      valueType: 'text',
    },
    {
      title: '原优惠类型',
      dataIndex: 'currentType',
      valueType: 'text',
      valueEnum: {
        'limitTime': '限时折扣',
        'limitTopNum': '限时前N名折扣'
      },
    },
    {
      title: '原优惠时间段',
      dataIndex: 'timeQuantumStr',
      valueType: 'text',
      hideInSearch: true,
      ellipsis:true
    },
    {
      title: '原优惠折扣',
      dataIndex: 'discount',
      valueType:'text',
      hideInSearch: true,
      render:(_,data)=>{
        if(!isNaN(_)){
          return <p>{_}折</p>
        }else{
          return <p>-</p>
        }

      }
    },
    {
      title: '原优惠后金额',
      dataIndex: 'discountMoney',
      valueType: 'text',
      hideInSearch: true,
      render:(_,data)=>{
        if(!isNaN(_)){
          return <p>￥{_}</p>
        }else{
          return <p>-</p>
        }
      }
    },   
  ];
  const postData = (data) => {
    const arr=data.map(ele=>({
      ...ele,
      currentType:ele.beforeValues?.currentType,
      timeQuantumStr:ele.beforeValues?.currentType=='limitTime'?
      `${ele.beforeValues?.typtList?.limitTime?.timeQuantumStr?.start} 至 ${ele.beforeValues?.typtList?.limitTime?.timeQuantumStr?.end}`
      :
      `${ele.beforeValues?.typtList?.limitTopNum?.timeQuantumStr?.start} 至 ${ele.beforeValues?.typtList?.limitTopNum?.timeQuantumStr?.end}`,
      discount:ele.beforeValues?.currentType=='limitTopNum'?'':ele.beforeValues?.typtList?.limitTime?.discount,
      discountMoney:ele.beforeValues?.currentType=='limitTopNum'?'':ele.beforeValues?.typtList?.limitTime?.discountMoney
    }))
    return arr;
  }

  const timeColumns= [
    {
      title: '平台服务期限',
      dataIndex: 'circleNum',
    },
    {
      title: '平台服务费（元）',
      dataIndex: 'money',
    },
    {
      title: '收费优惠条件',
      dataIndex: 'min',
      render:(_,data)=>{
        if(data?.id==3){
         return <p>{_}名及以后</p>
        }
         return <p>{_}-{data?.max}名</p>
      }
    },  
  ];

  const timeColumns2= [
    {
      title: '平台服务期限',
      dataIndex: 'circleNum',
    },
    {
      title: '平台服务费（元）',
      dataIndex: 'money',
    },
    {
      title: '直推人（元）',
      dataIndex: 'profitDirect',
    },
    {
      title: '约购运营中心（元）',
      dataIndex: 'profitSupplier',
    },
    {
      title: '健康事业部（元）',
      dataIndex: 'profitHealth',
    },
  ];

  return (
    <>
      <ProForm
        form={form}
        {...formItemLayout}
        submitter={
          {
            render: (props, defaultDoms) => {
              return [
                // <Button style={{width:'150px',marginTop:'20px'}} type="primary" key="submit" onClick={() => {
                //   props.form?.submit?.()
                // }}>
                //   修改
                // </Button>
              ];
            }
          }
        }
        onFinish={async (values) => {
            await onsubmit(values);
            return true;
        }
        }
      >
        <p style={{fontWeight:'bold'}}>{formDatil?.settingDescribe}{formDatil?.settingValues?.basePoint?.money}元 /{formDatil?.settingValues?.basePoint?.circleNum}{formDatil?.settingValues?.basePoint?.unit}</p>

        <ProFormRadio.Group
                name="currentType"
                label='优惠类型'
                options={[
                    {
                        label: '限时折扣',
                        value: 'limitTime'
                    },
                    {
                        label: '限时前N名折扣',
                        value: 'limitTopNum'
                    }
                ]}
                fieldProps={{
                  onChange:(val)=>{
                    setCurrentType(val.target?.value)
                  }
                }}
                hidden={true}
                initialValue='limitTopNum'
            />  
            <ProFormDependency name={['currentType']}>
                {({ currentType }) => { 
                if(!currentType) return null
                if(currentType==='limitTime'){
                    return  <>
                        <ProFormDateTimeRangePicker
                            label='优惠时间段'
                            name="dateRange"
                            fieldProps={{
                                disabledDate:(current)=>disabledDate(current)
                            }}
                            placeholder={[
                                formatMessage({
                                id: 'formandbasic-form.placeholder.start',
                                }),
                                formatMessage({
                                id: 'formandbasic-form.placeholder.end',
                                }),
                            ]}
                            labelCol={2}
                        />
                        <ProFormText
                            width="md"
                            name="discount"
                            label='优惠折扣'
                            rules={[
                                { validator: checkConfirm }
                            ]}
                            fieldProps={{
                                addonAfter:"折",
                                onChange:(val)=>{
                                  setCalculate(val.target?.value)
                                }
                            }}
                        />
                        <p>优惠后社区店主需缴纳金额为：{
                        calculate?
                        amountTransform(amountTransform(formDatil?.settingValues?.basePoint?.money,'*')*amountTransform(calculate,'*'),'/')/1000
                        :
                        formDatil?.settingValues?.typtList?.limitTime?.discountMoney} 
                        元</p>
                    </>
                }
                if(currentType==='limitTopNum'){
                    return <>
                        {/* <ProFormDateTimeRangePicker
                            label='优惠时间段'
                            name="dateRange2"
                            fieldProps={{
                                disabledDate:(current)=>disabledDate(current)
                            }}
                            placeholder={[
                                formatMessage({
                                id: 'formandbasic-form.placeholder.start',
                                }),
                                formatMessage({
                                id: 'formandbasic-form.placeholder.end',
                                }),
                            ]}
                            readonly={true}
                            labelCol={2}
                        /> */}
                        <ProFormText
                          width="md"
                          name="dateRange2"
                          label="优惠时间段"
                          readonly
                          labelCol={2}
                        />

                        <ProTable
                          actionRef={ref}
                          rowKey="id"
                          options={false}
                          dataSource={rulelistdata}
                          search={false}
                          columns={timeColumns}
                          pagination={false}
                        />
                        <ProTable
                          actionRef={ref}
                          rowKey="id"
                          headerTitle="不同服务费对应不同角色的分成金额"
                          options={false}
                          dataSource={rulelistdata}
                          search={false}
                          columns={timeColumns2}
                          pagination={false}
                        />
                    </>
                }
              }}
            </ProFormDependency>
      </ProForm >
      {/* <ProTable
       headerTitle="操作日志"
       rowKey="id"
       options={false}
       actionRef={actionRef}
       request={getMemberShopServicepointLog}
       postData={postData}
       search={false}
       columns={columns}
       style={{marginTop:'20px'}}
    /> */}
    </>
  );
};
