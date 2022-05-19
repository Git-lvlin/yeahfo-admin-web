import React, { useState, useRef,useEffect } from 'react';
import { Input, Form, message,Button,InputNumber} from 'antd';
import { EditableProTable } from '@ant-design/pro-table';
import { couponEverydaySub,couponEverydayEdit,couponEverydayDetail,couponEverydaySelList } from '@/services/activity-management/everyday-red-packet-activity';
import ProForm, { ProFormText, ProFormRadio,ProFormDateTimeRangePicker,ProFormTextArea,ProFormDependency,ProFormSelect,DrawerForm } from '@ant-design/pro-form';
import { FormattedMessage, formatMessage } from 'umi';
import { PageContainer } from '@ant-design/pro-layout';
import ProTable from '@ant-design/pro-table';
import moment from 'moment';
import { history,connect } from 'umi';
import styles from './style.less'

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

  const data=[
    {
      id:1,
      title:'当天红包金额',
    }
  ]


export default (props) =>{
  const {setVisible,visible,onClose,callback,id}=props
  const [dataSource, setDataSource] = useState(() => data);
  const [editableKeys, setEditableRowKeys] = useState(() =>
    data.map((item) => item.id),
  );
  const [onselect,setOnselect]=useState([])
  const [onselect2,setOnselect2]=useState([])
  const [onselect3,setOnselect3]=useState([])
  const [falg,setFalg]=useState(true)
  const [form] = Form.useForm();
  const [detailList,setDetailList]=useState()
 
  useEffect(() => {
    if(!dataSource[0].couponIdOne){
      couponEverydaySelList({}).then(res=>{
        const data={}
        res.data.map(ele=>(
          data[ele.couponId]=ele.name
        ))
        setOnselect(data)
      })
    }else if(dataSource[0].couponIdTwo){
      couponEverydaySelList({couponId:dataSource[0].couponIdTwo}).then(res=>{
        const data={}
        res.data.map(ele=>(
          data[ele.couponId]=ele.name
        ))
        setOnselect3(data)
      })
    }else if(dataSource[0].couponIdOne){
      couponEverydaySelList({couponId:dataSource[0].couponIdOne}).then(res=>{
        const data={}
        res.data.map(ele=>(
          data[ele.couponId]=ele.name
        ))
        setOnselect2(data)
      })
    }


    if(id){
    couponEverydayDetail({id:id}).then(res=>{
      const list=[
        {
          id:1,
          title:'当天红包金额',
          couponIdOne:res.data.couponOneDisplay,
          couponIdTwo:res.data.couponTwoDisplay,
          couponIdThree:res.data.couponThreeDisplay
        }
      ]
      setDetailList({data:res.data,scopeList:list})
      form.setFieldsValue({
        dateRange: [res.data?.activityStartTime, res.data?.activityEndTime],
        ...res.data
      })
    })
    }
  }, [falg,dataSource])
  const onsubmit=values=>{
      values.activityStartTime = values.dateRange ? values.dateRange[0] : null
      values.activityEndTime= values.dateRange ? values.dateRange[1] : null
      delete values.dateRange
      if(id){
        couponEverydayEdit({id:id,...values}).then(res=>{
          if(res.code==0){
            message.success('编辑成功');
            setVisible(false)
            callback(true)
          }
        })
      }else{
        values.couponIdOne=dataSource[0].couponIdOne
        values.couponIdTwo=dataSource[0].couponIdTwo
        values.couponIdThree=dataSource[0].couponIdThree
        couponEverydaySub({...values}).then(res=>{
          if(res.code==0){
            message.success('添加成功'); 
            setVisible(false)
            callback(true)
          }
        })
      }

  }

 
  const columns = [
    {
      title: '连续获得天数',
      dataIndex: 'title',
      editable:false,
    },
    {
      title: '第1天',
      dataIndex: 'couponIdOne',
      valueType: 'select',
      valueEnum: onselect,
      fieldProps: {
        placeholder: '请选择'
      },
    },
    {
      title: '第2天',
      dataIndex: 'couponIdTwo',
      valueType: 'select',
      valueEnum: onselect2,
      fieldProps: {
        placeholder: '请选择'
      },
    }, {
      title: '第3天',
      dataIndex: 'couponIdThree',
      valueType: 'select',
      valueEnum: onselect3,
      fieldProps: {
        placeholder: '请选择'
      },
    }
  ];
  const columns2 = [
    {
      title: '连续获得天数',
      dataIndex: 'title'
    },
    {
      title: '第1天',
      dataIndex: 'couponIdOne',
      valueType: 'text'
    },
    {
      title: '第2天',
      dataIndex: 'couponIdTwo',
      valueType: 'text'
    }, 
    {
      title: '第3天',
      dataIndex: 'couponIdThree',
      valueType: 'text'
    }
  ];
  // const disabledDate=(current)=>{
  //   return current && current < moment().startOf('day');
  // }
  return (
      <DrawerForm
        title={id?'详情':'每日首单红包规则设置'}
        onVisibleChange={setVisible}
        visible={visible}
        width={1200}
        form={form}
        drawerProps={{
          forceRender: true,
          destroyOnClose: true,
          onClose: () => {
            onClose();
          }
        }}
        submitter={{
          render: (props, doms) => {
            return [
              <>
                {
                  id?
                  <>
                    {
                      detailList?.data?.status==1?
                      <>
                        {
                          falg?<Button  type="primary" onClick={() => { setFalg(false) }}>编辑</Button>
                          :<Button  type="primary" key="submit" onClick={() => {
                            props.form?.submit?.()
                          }}>
                            保存
                          </Button>
                        }
                      </> 
                      :null
                    }
                  </>
                  :<Button  type="primary" key="submit" onClick={() => {
                    props.form?.submit?.()
                  }}>
                    保存
                  </Button>
                }
              </>  
            ];
          }
        }}
        onFinish={async (values)=>{
          await  onsubmit(values);
        }}
        className={styles.everyday_packet_rule}
        {...formItemLayout}
      >
        <ProFormText
              width="md"
              name="name"
              label="活动名称"
              placeholder="输入活动名称"
              rules={[{ required: true, message: '请输入活动名称' }]}
              readonly={id&&falg}
              fieldProps={{
                maxLength:50
              }}
          />
          {
            id&&falg?
            <ProFormText
              width="md"
              name="dateRange"
              label="活动时间"
              rules={[{ required: true, message: '请选择活动时间' }]}
              readonly
              fieldProps={{
                value:detailList?.data?.activityStartTime +' 至 '+detailList?.data?.activityEndTime
              }}
            />
           : <ProFormDateTimeRangePicker
              width="md"
              label='活动时间'
              rules={[{ required: true, message: '请选择活动时间' }]}
              name="dateRange"
              fieldProps={{
                //  disabledDate:(current)=>disabledDate(current),
                showTime:{
                  hideDisabledOptions: true,
                  defaultValue: [moment('00:00', 'HH:mm'), moment('11:59', 'HH:mm')],
                },
                format:"YYYY-MM-DD HH:mm"
              }}
              readonly={id&&falg}
              placeholder={[
              formatMessage({
                  id: 'formandbasic-form.placeholder.start',
              }),
              formatMessage({
                  id: 'formandbasic-form.placeholder.end',
              }),
              ]}
          />
          }
          {
            id?<EditableProTable
                headerTitle="每日首单红包发放金额(元）"
                rowKey="id"
                // search={false}
                columns={columns2}
                value={detailList?.scopeList}
                recordCreatorProps={false}
                style={{marginLeft:'50px'}}
                />
             :<EditableProTable
                headerTitle="每日首单红包发放金额(元）"
                columns={columns}
                rowKey="id"
                recordCreatorProps={false}
                value={dataSource}
                onChange={setDataSource}
                editable={{
                  type: 'multiple',
                  editableKeys,
                  actionRender: (row, config, defaultDoms) => {
                    return [defaultDoms.delete];
                  },
                  onValuesChange: (record, recordList) => {
                    setDataSource(recordList);
                  },
                  onChange: setEditableRowKeys,
                }}
                style={{marginLeft:'50px'}}
              />  
          }
          {
            (!falg)||(!id)?<p className={styles.hint2}>提示：中断或连续3天获得了红包重新按第一天金额发放，每次领取的红包不累计，三天的红包金额只可按面值递增选择，不可以选择相同面值的红包，您必须先在运营后台“红包管理"中创建好”每日红包“类型的红包后，且创建的红包有效期必须大于活动有效期，这里才可以选择到创建的红包。</p>
            :null
          }
          <ProFormText
              width={120}
              label="领取条件"
              fieldProps={{
                value: "每日首次下单成功"
              }}
              readonly
            />
            {
              id&&falg?
               <Form.Item
                label="活动规则"
              >
              <pre className={styles.line_feed}>
                {
                  detailList?.data?.activityRule
                }
              </pre>
              </Form.Item>
                :
              <ProFormTextArea
                name="activityRule"
                label="活动规则"
                placeholder="列如玩法规则、红包有效期、简单的用户协议"
                rules={[
                  { required: true, message: '请输入活动规则' },
                ]}
                readonly={id&&falg}
                fieldProps={{
                 maxLength:1000
                }}
            />
            }

            {
              id&&<ProFormRadio.Group
                  name="status"
                  label="活动状态"
                  options={[
                      {
                        label: '开启',
                        value: 1
                      },
                      {
                        label: '关闭',
                        value: 2
                      }
                  ]}
                  readonly={id&&falg}
              />
            }
            {
              id&&!falg? <p className={styles.hint}>提示：关闭活动后，不可再次开启,请谨慎操作</p>
              :null
            }

          {
            id&&falg?
            <p className={styles.back}>最近一次操作人：{detailList?.data?.adminName}     {detailList?.data?.updateTime}</p>
            :null
          }  
      </DrawerForm>
  )
}
