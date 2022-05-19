import React, { useState, useRef,useEffect } from 'react';
import { Input, Form, message,Button,InputNumber} from 'antd';
import { EditableProTable } from '@ant-design/pro-table';
import ProCard from '@ant-design/pro-card';
import { editSignRedPacketConfig,getSignRedPacketConfig } from '@/services/sign-activity-management/get-sign-red-packet-config';
import ProForm, { ProFormText, ProFormRadio, ProFormDateTimeRangePicker,ProFormTextArea,ProFormDependency,ProFormSelect } from '@ant-design/pro-form';
import { FormattedMessage, formatMessage } from 'umi';
import { PageContainer } from '@/components/PageContainer';
import moment from 'moment';
import styles from './style.less'
import { amountTransform } from '@/utils/utils'

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
  const [dataSource, setDataSource] = useState([]);
  const [option,setOption]=useState()
  const [save,setSave]=useState(true)
  const [form] = Form.useForm();
  const [cont,setCont]=useState()
  const user=JSON.parse(window.localStorage.getItem('user'))
  const [editableKeys, setEditableKeys] = useState([])
  const [detailList,setDetailList]=useState()

  useEffect(() => {
      getSignRedPacketConfig({}).then(res=>{
        if(res.code==0){
          setDetailList(res.data)
          const data={
            title:'当天红包金额'
          }
          res.data?.fixRedPacketConfigResList.map((ele,index)=>{
            data[`changeValue${index+1}`]=parseInt(ele.changeValue)/100
            data['typeId']=1
          })
          if(res.data?.fixRedPacketConfigResList.length<1){
            for (let index = 0; index < 7; index++) {
              data[`changeValue${index+1}`]=' '
              data['typeId']=1
            }
          }
          const data2={
            title:'连续签到额外奖励金额'
          }
          res.data?.extraPacketConfigResList.map((ele,index)=>{
            data2[`changeValue${index+1}`]=parseInt(ele.changeValue)/100
            data2['typeId']=2
          })
          if(res.data?.extraPacketConfigResList.length<1){
            for (let index = 0; index < 7; index++) {
              data2[`changeValue${index+1}`]=' '
              data2['typeId']=2
            }
          }
          setDataSource([{...data},{...data2}])
          const arr=[]
          res.data?.exTimeList.map(ele=>{
            arr.push({
              value: ele,
              label: `${ele}${parseInt(ele)>=0?'天':''}`
            })
          })
          setOption(arr)
        }
        form.setFieldsValue({
          exTimeStr:res.data.exTime,
          ...res.data
        })
      })
  }, [save,cont])
  const onsubmit=values=>{
    setSave(true)
    const changeData=[
      {
        id:0,
        changeValue:amountTransform(parseFloat(dataSource[0].changeValue1), '*')
      },
      {
        id:1,
        changeValue:amountTransform(parseFloat(dataSource[0].changeValue2), '*')
      },
      {
        id:2,
        changeValue:amountTransform(parseFloat(dataSource[0].changeValue3), '*')
      },
      {
        id:3,
        changeValue:amountTransform(parseFloat(dataSource[0].changeValue4), '*')
      },
      {
        id:4,
        changeValue:amountTransform(parseFloat(dataSource[0].changeValue5), '*')
      },
      {
        id:5,
        changeValue:amountTransform(parseFloat(dataSource[0].changeValue6), '*')
      },
      {
        id:6,
        changeValue:amountTransform(parseFloat(dataSource[0].changeValue7), '*')
      },
      {
        id:15,
        changeValue:amountTransform(parseFloat(dataSource[1].changeValue1), '*')
      },
      {
        id:16,
        changeValue:amountTransform(parseFloat(dataSource[1].changeValue2), '*')
      }, {
        id:17,
        changeValue:amountTransform(parseFloat(dataSource[1].changeValue3), '*')
      }, {
        id:18,
        changeValue:amountTransform(parseFloat(dataSource[1].changeValue4), '*')
      }, {
        id:19,
        changeValue:amountTransform(parseFloat(dataSource[1].changeValue5), '*')
      }, {
        id:20,
        changeValue:amountTransform(parseFloat(dataSource[1].changeValue6), '*')
      }, {
        id:21,
        changeValue:amountTransform(parseFloat(dataSource[1].changeValue7), '*')
      }, 
    ]

    values.status=1
    editSignRedPacketConfig({handler:user.username,changeIds:changeData,...values}).then(res=>{
      if(res.code==0){
        message.success('编辑成功'); 
        setCont(Date.now())
      }
    })
  }
  const columns = [
    {
      title: '签到时间',
      dataIndex: 'title',
      editable:false,
    },
    {
      title: '第1天',
      dataIndex: 'changeValue1',
      valueType: 'text',
      renderFormItem: (_,r) => {
        return  <InputNumber
                  precision='2'
                  stringMode
                  min="0.00000000000001"
                />
        },
      render: (_,r) =>{
        return <p>{_}</p>
      }
    },
    {
      title: '第2天',
      dataIndex: 'changeValue2',
      valueType: 'text',
      renderFormItem: (_,r) => {
        return  <InputNumber
                  precision='2'
                  stringMode
                  min="0.00000000000001"
                />
        },
      render: (_,r) =>{
        return <p>{_}</p>
      }
    }, {
      title: '第3天',
      dataIndex: 'changeValue3',
      valueType: 'text',
      renderFormItem: (_,r) => {
        return  <InputNumber
                  precision='2'
                  stringMode
                  min="0.00000000000001"
                />
        },
      render: (_,r) =>{
        return <p>{_}</p>
      }
    }, {
      title: '第4天',
      dataIndex: 'changeValue4',
      valueType: 'text',
      renderFormItem: (_,r) => {
        return  <InputNumber
                  precision='2'
                  stringMode
                  min="0.00000000000001"
                />
        },
      render: (_,r) =>{
        return <p>{_}</p>
      }
    }, {
      title: '第5天',
      dataIndex: 'changeValue5',
      valueType: 'text',
      renderFormItem: (_,r) => {
        return  <InputNumber
                  precision='2'
                  stringMode
                  min="0.00000000000001"
                />
        },
      render: (_,r) =>{
        return <p>{_}</p>
      }
    }, {
      title: '第6天',
      dataIndex: 'changeValue6',
      valueType: 'text',
      renderFormItem: (_,r) => {
        return  <InputNumber
                  precision='2'
                  stringMode
                  min="0.00000000000001"
                />
        },
      render: (_,r) =>{
        return <p>{_}</p>
      }
    }, {
      title: '第7天',
      dataIndex: 'changeValue7',
      valueType: 'text',
      renderFormItem: (_,r) => {
        return  <InputNumber
                  precision='2'
                  stringMode
                  min="0.00000000000001"
                />
        },
      render: (_,r) =>{
        return <p>{_}</p>
      }
    }, 
  ];
  return (
    <PageContainer>
      <ProForm
        form={form}
        onFinish={async (values)=>{
            await  onsubmit(values);
          return true;
         } }
         {...formItemLayout} 
        submitter={{
          render: (props, doms) => {
            return [
              <>
                {
                  save?<Button type="primary" onClick={() => { setEditableKeys(dataSource.map(item => item.typeId)), setSave(false) }}>编辑</Button>
                  :<Button style={{margin:'30px'}} type="primary" key="submit" onClick={() => {
                    props.form?.submit?.()
                    setEditableKeys([])
                  }}>
                    保存
                  </Button>
                }
              </>     
            ];
          }
        }}
        className={styles.sign_rule}
      >
            
        <EditableProTable
            rowKey="typeId"
            headerTitle="签到红包金额设置(元）"
            value={dataSource}
            recordCreatorProps={false}
            columns={columns}
            editable={{
              editableKeys,
              actionRender: (row, config, defaultDoms) => {
                return [defaultDoms.delete];
              },
              onValuesChange: (record, recordList) => {
                setDataSource(recordList)
              }
            }}
            style={{marginBottom:'30px'}}
        />
        <ProFormSelect
              width="md"
              name="exTimeStr"
              label="红包有效期"
              placeholder="请选择会员昵称"
              extra="超出有效期后将清空用户过期的红包"
              rules={[{ required: true, message: '请选择红包有效期' }]}
              initialValue='1'
              readonly={save}
              options={option}
          />
          <ProFormRadio.Group
              label="可领人群"
              options={[
                  {
                    label: '全部用户',
                    value: 1
                  }
              ]}
              fieldProps={{
                value: "全部用户"
              }}
              readonly
          />
          <ProFormText
              width={120}
              label="发放时间"
              fieldProps={{
                value: "每天签到成功时"
              }}
              readonly
            />
            {
              save?
               <Form.Item
                label="活动规则"
              >
              <pre className={styles.line_feed}>
                {
                  detailList?.remark
                }
              </pre>
              </Form.Item>
                :
              <ProFormTextArea
                name="remark"
                label="活动规则"
                placeholder="列如玩法规则、红包有效期、简单的用户协议"
                rules={[
                  { required: true, message: '请输入活动规则' },
                ]}
                readonly={save}
                fieldProps={
                  {
                    autoSize:true
                  }
                }
            />
            }
          
         {
           !save?
            <ProFormText
            width={120}
            label="生效时间"
            fieldProps={{
              value: "修改后马上生效"
            }}
            readonly
          />
          :null
         }
          {/* <ProFormRadio.Group
              name="status"
              label="活动状态"
              options={[
                  {
                    label: '开启',
                    value: 1
                  },
                  {
                    label: '关闭',
                    value: 0
                  }
              ]}
              readonly={save}
          /> */}
          {
            save?
            <p className={styles.back}>最近一次操作人：{detailList?.lastHandler}      {detailList?.updateTime}</p>
            :null
          }
          
          {/* {
            !save? <p className={styles.hint}>提示：关闭活动后，将清空用户账户里的红包记录，请谨慎操作。</p>
            :null
          } */}
         
       
      </ProForm>
      </PageContainer>
  )
}
