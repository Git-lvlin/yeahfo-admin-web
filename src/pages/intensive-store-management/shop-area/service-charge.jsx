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
        await reject('????????????0-10????????????')
      }else if (value&&!/^[0-9]+(\.[0-9]{2})?$/.test(value)) {
        await reject('0-10?????????????????????2?????????')
      } else {
        await resolve()
      }
    })
  }
  const checkConfirm2=(rule, value, callback)=>{
    return new Promise(async (resolve, reject) => {
    if (value&&value<1||value>100000){
        await reject('????????????1-10??????????????????')
    }else if (value&&value.length>0&&!/^[0-9]*[1-9][0-9]*$/.test(value)&&value!=0) {
        await reject('??????????????????')
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
        message.success('?????????????????????!')
        actionRef.current.reload()
      }
    })
  }

  const disabledDate=(current)=>{
    return current && current < moment().startOf('day');
  }
  const columns= [
    {
      title: '????????????',
      dataIndex: 'createTime',
      valueType: 'text',
      hideInSearch: true,
      ellipsis:true
    },
    {
      title: '?????????',
      dataIndex: 'optAdminName',
      valueType: 'text',
    },
    {
      title: '???????????????',
      dataIndex: 'currentType',
      valueType: 'text',
      valueEnum: {
        'limitTime': '????????????',
        'limitTopNum': '?????????N?????????'
      },
    },
    {
      title: '??????????????????',
      dataIndex: 'timeQuantumStr',
      valueType: 'text',
      hideInSearch: true,
      ellipsis:true
    },
    {
      title: '???????????????',
      dataIndex: 'discount',
      valueType:'text',
      hideInSearch: true,
      render:(_,data)=>{
        if(!isNaN(_)){
          return <p>{_}???</p>
        }else{
          return <p>-</p>
        }

      }
    },
    {
      title: '??????????????????',
      dataIndex: 'discountMoney',
      valueType: 'text',
      hideInSearch: true,
      render:(_,data)=>{
        if(!isNaN(_)){
          return <p>???{_}</p>
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
      `${ele.beforeValues?.typtList?.limitTime?.timeQuantumStr?.start} ??? ${ele.beforeValues?.typtList?.limitTime?.timeQuantumStr?.end}`
      :
      `${ele.beforeValues?.typtList?.limitTopNum?.timeQuantumStr?.start} ??? ${ele.beforeValues?.typtList?.limitTopNum?.timeQuantumStr?.end}`,
      discount:ele.beforeValues?.currentType=='limitTopNum'?'':ele.beforeValues?.typtList?.limitTime?.discount,
      discountMoney:ele.beforeValues?.currentType=='limitTopNum'?'':ele.beforeValues?.typtList?.limitTime?.discountMoney
    }))
    return arr;
  }

  const timeColumns= [
    {
      title: '??????????????????',
      dataIndex: 'circleNum',
    },
    {
      title: '????????????????????????',
      dataIndex: 'money',
    },
    {
      title: '??????????????????',
      dataIndex: 'min',
      render:(_,data)=>{
        if(data?.id==3){
         return <p>{_}????????????</p>
        }
         return <p>{_}-{data?.max}???</p>
      }
    },  
  ];

  const timeColumns2= [
    {
      title: '??????????????????',
      dataIndex: 'circleNum',
    },
    {
      title: '????????????????????????',
      dataIndex: 'money',
    },
    {
      title: '??????????????????',
      dataIndex: 'profitDirect',
    },
    {
      title: '???????????????????????????',
      dataIndex: 'profitSupplier',
    },
    {
      title: '????????????????????????',
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
                //   ??????
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
        <p style={{fontWeight:'bold'}}>{formDatil?.settingDescribe}{formDatil?.settingValues?.basePoint?.money}??? /{formDatil?.settingValues?.basePoint?.circleNum}{formDatil?.settingValues?.basePoint?.unit}</p>

        <ProFormRadio.Group
                name="currentType"
                label='????????????'
                options={[
                    {
                        label: '????????????',
                        value: 'limitTime'
                    },
                    {
                        label: '?????????N?????????',
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
                            label='???????????????'
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
                            label='????????????'
                            rules={[
                                { validator: checkConfirm }
                            ]}
                            fieldProps={{
                                addonAfter:"???",
                                onChange:(val)=>{
                                  setCalculate(val.target?.value)
                                }
                            }}
                        />
                        <p>??????????????????????????????????????????{
                        calculate?
                        amountTransform(amountTransform(formDatil?.settingValues?.basePoint?.money,'*')*amountTransform(calculate,'*'),'/')/1000
                        :
                        formDatil?.settingValues?.typtList?.limitTime?.discountMoney} 
                        ???</p>
                    </>
                }
                if(currentType==='limitTopNum'){
                    return <>
                        {/* <ProFormDateTimeRangePicker
                            label='???????????????'
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
                          label="???????????????"
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
                          headerTitle="????????????????????????????????????????????????"
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
       headerTitle="????????????"
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
