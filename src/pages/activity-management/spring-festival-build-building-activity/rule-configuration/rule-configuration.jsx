import React, { useState, useRef,useEffect } from 'react';
import { Input, Form, message,Button,InputNumber,Spin,Space,DatePicker} from 'antd';
import { saveBHActiveConfig,getActiveConfigById } from '@/services/activity-management/spring-festival-build-building-activity';
import ProForm, { ProFormText, ProFormRadio,ProFormDateTimeRangePicker,ProFormTextArea,ProFormDateTimePicker,ProFormSelect,DrawerForm} from '@ant-design/pro-form';
import { FormattedMessage, formatMessage } from 'umi';
import { PageContainer } from '@/components/PageContainer';
import moment from 'moment';
import { history,connect } from 'umi';
import styles from './style.less'
import EndModel from './end-model'
import Upload from '@/components/upload';
import ProCard from '@ant-design/pro-card';
import UploadingList from './uploading-list'
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
  const {setDetailVisible,detailVisible,onClose,callback,id}=props
  const [falg,setFalg]=useState(true)
  const [form] = Form.useForm();
  const [detailList,setDetailList]=useState()
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [listVisible, setListVisible] = useState(false);
  const [phoneList,setPhoneList]=useState()
  const [probability1,setProbability1]=useState()
  const [probability2,setProbability2]=useState()
  const [probability3,setProbability3]=useState()
  const [probability4,setProbability4]=useState()
  const [probability5,setProbability5]=useState()
  const [probability6,setProbability6]=useState()
  const [probability7,setProbability7]=useState()
  const [probability8,setProbability8]=useState()
  const [tierEnd1,setTierEnd1]=useState()
  const [tierEnd2,setTierEnd2]=useState()
  const [tierEnd3,setTierEnd3]=useState()
  const FromWrap = ({ value, onChange, content, right }) => (
    <div style={{ display: 'flex' }}>
      <div>{content(value, onChange)}</div>
      <div style={{ flex: 1, marginLeft: 10, minWidth: 180 }}>{right(value)}</div>
    </div>
  )
  const checkConfirm=(rule, value, callback)=>{
    return new Promise(async (resolve, reject) => {
    if (value&&value<=0) {
        await reject('????????????0')
    }else if (value&&value.length>0&&!/^[0-9]*[1-9][0-9]*$/.test(value)&&value!=0) {
        await reject('??????????????????')
    }else {
        await resolve()
    }
    })
  }
  const checkConfirm2=(rule, value, callback)=>{
    return new Promise(async (resolve, reject) => {
    if (value&&value<=0) {
        await reject('????????????0')
    }else if (value&&value.length>0&&!/^[0-9]+([.]{1}[0-9]+){0,1}$/.test(value)&&value!=0) {
        await reject('???????????????????????????')
    }else {
        await resolve()
    }
    })
  }
  const disabledDate=(current)=>{
    return current && current < moment().startOf('day');
  }
 
  useEffect(() => {
    if(id){
      getActiveConfigById({id:id}).then(res=>{
      const content=res.data.content
      setDetailList({data:res.data})
      form.setFieldsValue({
        dateRange: [res.data?.startTime*1000, res.data?.endTime*1000],
        moneyAll:amountTransform(content.moneyAll, '/'),
        moneyDay:amountTransform(content.moneyDay, '/'),
        sendPlayTime:content.sendPlayTime,
        withdrawTime:4102415999,
        validiteHour:24,
        testNum:content.testNum,
        imgUrl:content.imgUrl,
        ruleText:content.ruleText,
        virtualNum:content.virtualNum,
        prizeMoney:amountTransform(content?.rewardsSet?.luckyOne?.prizeMoney, '/'),
        tierEnd1:content?.rewardsSet?.tiersSet?.[0]?.tierEnd,
        general_probability1:content?.rewardsSet?.tiersSet?.[0]?.general?.probability,
        general_moneyRange1_win1:amountTransform(content?.rewardsSet?.tiersSet?.[0]?.general?.moneyRange?.[0], '/'),
        general_moneyRange1_win2:amountTransform(content?.rewardsSet?.tiersSet?.[0]?.general?.moneyRange?.[1], '/'),
        general_moneyRange1_win3:amountTransform(content?.rewardsSet?.tiersSet?.[0]?.general?.moneyRange?.[2], '/'),
        general_moneyRange1_win4:amountTransform(content?.rewardsSet?.tiersSet?.[0]?.general?.moneyRange?.[3], '/'),
        lucky_probability1:content?.rewardsSet?.tiersSet?.[0]?.lucky?.probability,
        lucky_moneyRange1_win1:amountTransform(content?.rewardsSet?.tiersSet?.[0]?.lucky?.moneyRange?.[0], '/'),
        lucky_moneyRange1_win2:amountTransform(content?.rewardsSet?.tiersSet?.[0]?.lucky?.moneyRange?.[1], '/'),
        lucky_moneyRange1_win3:amountTransform(content?.rewardsSet?.tiersSet?.[0]?.lucky?.moneyRange?.[2], '/'),
        lucky_moneyRange1_win4:amountTransform(content?.rewardsSet?.tiersSet?.[0]?.lucky?.moneyRange?.[3], '/'),


        tierEnd2:content?.rewardsSet?.tiersSet?.[1]?.tierEnd,
        general_probability2:content?.rewardsSet?.tiersSet?.[1]?.general?.probability,
        general_moneyRange2_win1:amountTransform(content?.rewardsSet?.tiersSet?.[1]?.general?.moneyRange?.[0], '/'),
        general_moneyRange2_win2:amountTransform(content?.rewardsSet?.tiersSet?.[1]?.general?.moneyRange?.[1], '/'),
        general_moneyRange2_win3:amountTransform(content?.rewardsSet?.tiersSet?.[1]?.general?.moneyRange?.[2], '/'),
        general_moneyRange2_win4:amountTransform(content?.rewardsSet?.tiersSet?.[1]?.general?.moneyRange?.[3], '/'),
        lucky_probability2:content?.rewardsSet?.tiersSet?.[1]?.lucky?.probability,
        lucky_moneyRange2_win1:amountTransform(content?.rewardsSet?.tiersSet?.[1]?.lucky?.moneyRange?.[0], '/'),
        lucky_moneyRange2_win2:amountTransform(content?.rewardsSet?.tiersSet?.[1]?.lucky?.moneyRange?.[1], '/'),
        lucky_moneyRange2_win3:amountTransform(content?.rewardsSet?.tiersSet?.[1]?.lucky?.moneyRange?.[2], '/'),
        lucky_moneyRange2_win4:amountTransform(content?.rewardsSet?.tiersSet?.[1]?.lucky?.moneyRange?.[3], '/'),



        tierEnd3:content?.rewardsSet?.tiersSet?.[2]?.tierEnd,
        general_probability3:content?.rewardsSet?.tiersSet?.[2]?.general?.probability,
        general_moneyRange3_win1:amountTransform(content?.rewardsSet?.tiersSet?.[2]?.general?.moneyRange?.[0], '/'),
        general_moneyRange3_win2:amountTransform(content?.rewardsSet?.tiersSet?.[2]?.general?.moneyRange?.[1], '/'),
        general_moneyRange3_win3:amountTransform(content?.rewardsSet?.tiersSet?.[2]?.general?.moneyRange?.[2], '/'),
        general_moneyRange3_win4:amountTransform(content?.rewardsSet?.tiersSet?.[2]?.general?.moneyRange?.[3], '/'),
        lucky_probability3:content?.rewardsSet?.tiersSet?.[2]?.lucky?.probability,
        lucky_moneyRange3_win1:amountTransform(content?.rewardsSet?.tiersSet?.[2]?.lucky?.moneyRange?.[0], '/'),
        lucky_moneyRange3_win2:amountTransform(content?.rewardsSet?.tiersSet?.[2]?.lucky?.moneyRange?.[1], '/'),
        lucky_moneyRange3_win3:amountTransform(content?.rewardsSet?.tiersSet?.[2]?.lucky?.moneyRange?.[2], '/'),
        lucky_moneyRange3_win4:amountTransform(content?.rewardsSet?.tiersSet?.[2]?.lucky?.moneyRange?.[3], '/'),


        tierEnd4:content?.rewardsSet?.tiersSet?.[3]?.tierEnd,
        general_probability4:content?.rewardsSet?.tiersSet?.[3]?.general?.probability,
        general_moneyRange4_win1:amountTransform(content?.rewardsSet?.tiersSet?.[3]?.general?.moneyRange?.[0], '/'),
        general_moneyRange4_win2:amountTransform(content?.rewardsSet?.tiersSet?.[3]?.general?.moneyRange?.[1], '/'),
        general_moneyRange4_win3:amountTransform(content?.rewardsSet?.tiersSet?.[3]?.general?.moneyRange?.[2], '/'),
        general_moneyRange4_win4:amountTransform(content?.rewardsSet?.tiersSet?.[3]?.general?.moneyRange?.[3], '/'),
        lucky_probability4:content?.rewardsSet?.tiersSet?.[3]?.lucky?.probability,
        lucky_moneyRange4_win1:amountTransform(content?.rewardsSet?.tiersSet?.[3]?.lucky?.moneyRange?.[0], '/'),
        lucky_moneyRange4_win2:amountTransform(content?.rewardsSet?.tiersSet?.[3]?.lucky?.moneyRange?.[1], '/'),
        lucky_moneyRange4_win3:amountTransform(content?.rewardsSet?.tiersSet?.[3]?.lucky?.moneyRange?.[2], '/'),
        lucky_moneyRange4_win4:amountTransform(content?.rewardsSet?.tiersSet?.[3]?.lucky?.moneyRange?.[3], '/'),


        inviteNum:content?.accessGain?.inviteFriends?.inviteNum,
        prizeNum1:content?.accessGain?.inviteFriends?.prizeNum,
        prizeNum:content?.accessGain?.friendPlay?.prizeNum,
        ...res.data
      })
    })
    }
  }, [falg,loading])
  const onsubmit=values=>{
     try {
      const params={
        id:id?id:0,
        startTime:values.dateRange ? moment(values.dateRange[0]).valueOf()/1000 : null,
        endTime:values.dateRange ? moment(values.dateRange[1]).valueOf()/1000 : null,
        name:values.name,
        status:values.status,
        moneyAll:amountTransform(values.moneyAll, '*'),
        moneyDay:amountTransform(values.moneyDay, '*'),
        sendPlayTime:values.sendPlayTime,
        withdrawTime:values.withdrawTime,
        validiteHour:values.validiteHour,
        testNum:values.testNum,
        imgUrl:values.imgUrl,
        ruleText:values.ruleText,
        virtualNum:values.virtualNum,
        rewardsSet:{
          luckyOne:{
            prizeNum:1,
            prizeMoney:amountTransform(values.prizeMoney, '*'),
            prizePhones:phoneList||detailList?.data?.content?.rewardsSet?.luckyOne?.prizePhones
          },
          tiersSet:[
            {
            tierStart:3,
            tierEnd:values.tierEnd1,
            general:{
              probability:values.general_probability1,
              moneyRange:[
                amountTransform(values.general_moneyRange1_win1, '*'),
                amountTransform(values.general_moneyRange1_win2, '*'),
                amountTransform(values.general_moneyRange1_win3, '*'),
                amountTransform(values.general_moneyRange1_win4, '*')
              ]
            },
            lucky:{
              probability:values.lucky_probability1,
              moneyRange:[
                amountTransform(values.lucky_moneyRange1_win1, '*'),
                amountTransform(values.lucky_moneyRange1_win2, '*'),
                amountTransform(values.lucky_moneyRange1_win3, '*'),
                amountTransform(values.lucky_moneyRange1_win4, '*')
              ]
            },
            losing:{
              probability:(10000-(amountTransform(Number(values.general_probability1),'*')+amountTransform(Number(values.lucky_probability1),'*')))/100
            }
          },
          {
            tierStart:parseInt(values.tierEnd1)+1,
            tierEnd:values.tierEnd2,
            general:{
              probability:values.general_probability2,
              moneyRange:[
                amountTransform(values.general_moneyRange2_win1, '*'),
                amountTransform(values.general_moneyRange2_win2, '*'),
                amountTransform(values.general_moneyRange2_win3, '*'),
                amountTransform(values.general_moneyRange2_win4, '*')
              ]
            },
            lucky:{
              probability:values.lucky_probability2,
              moneyRange:[
                amountTransform(values.lucky_moneyRange2_win1, '*'),
                amountTransform(values.lucky_moneyRange2_win2, '*'),
                amountTransform(values.lucky_moneyRange2_win3, '*'),
                amountTransform(values.lucky_moneyRange2_win4, '*')
              ]
            },
            losing:{
              probability:(10000-(amountTransform(Number(values.general_probability2),'*')+amountTransform(Number(values.lucky_probability2),'*')))/100
            }
          },
          {
            tierStart:parseInt(values.tierEnd2)+1,
            tierEnd:values.tierEnd3,
            general:{
              probability:values.general_probability3,
              moneyRange:[
                amountTransform(values.general_moneyRange3_win1, '*'),
                amountTransform(values.general_moneyRange3_win2, '*'),
                amountTransform(values.general_moneyRange3_win3, '*'),
                amountTransform(values.general_moneyRange3_win4, '*')
              ]
            },
            lucky:{
              probability:values.lucky_probability3,
              moneyRange:[
                amountTransform(values.lucky_moneyRange3_win1, '*'),
                amountTransform(values.lucky_moneyRange3_win2, '*'),
                amountTransform(values.lucky_moneyRange3_win3, '*'),
                amountTransform(values.lucky_moneyRange3_win4, '*')
              ]
            },
            losing:{
              probability:(10000-(amountTransform(Number(values.general_probability3),'*')+amountTransform(Number(values.lucky_probability3),'*')))/100
            }
          },
          {
            tierStart:parseInt(values.tierEnd3)+1,
            tierEnd:values.tierEnd4,
            general:{
              probability:values.general_probability4,
              moneyRange:[
                amountTransform(values.general_moneyRange4_win1, '*'),
                amountTransform(values.general_moneyRange4_win2, '*'),
                amountTransform(values.general_moneyRange4_win3, '*'),
                amountTransform(values.general_moneyRange4_win4, '*')
              ]
            },
            lucky:{
              probability:values.lucky_probability4,
              moneyRange:[
                amountTransform(values.lucky_moneyRange4_win1, '*'),
                amountTransform(values.lucky_moneyRange4_win2, '*'),
                amountTransform(values.lucky_moneyRange4_win3, '*'),
                amountTransform(values.lucky_moneyRange4_win4, '*')
              ]
            },
            losing:{
              probability:(10000-(amountTransform(Number(values.general_probability4),'*')+amountTransform(Number(values.lucky_probability4),'*')))/100
            }
          }
        ]
        },
        accessGain:{
          inviteFriends:{
            inviteNum:values.inviteNum,
            prizeNum:values.prizeNum1,
            switch:1
          },
          friendPlay:{
            prizeNum:parseInt(values.prizeNum),
            playerNum:1,
            switch:1
          }
        }
       }
      if(id){
        saveBHActiveConfig(params).then(res=>{
          if(res.code==0){
            message.success('????????????'); 
            setDetailVisible(false)
            callback(true)
          }
        })
      }else{
        saveBHActiveConfig(params).then(res=>{
          if(res.code==0){
            message.success('????????????'); 
            setDetailVisible(false)
            callback(true)
          }
        })
      }
       
     } catch (error) {
       console.log('error',error)
     }

  }
  const limitDecimalsF =(value)=>{
    return value&&parseInt(value)
  };
  return (
    <PageContainer>
      <Spin spinning={loading}>
      <DrawerForm
        title={id?'??????':'????????????'}
        onVisibleChange={setDetailVisible}
        visible={detailVisible}
        width={1400}
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
                          falg?<Button style={{marginRight:'10px'}} type="primary" onClick={() => { setFalg(false) }}>??????</Button>
                          :<>
                            <Button style={{marginRight:'10px'}} type="primary" key="submit" onClick={() => {
                              props.form?.submit?.()
                            }}>
                              ??????
                            </Button>
                            <Button style={{marginRight:'10px'}} type="default" onClick={()=>setVisible(true)}>
                              ????????????
                            </Button>
                          </>
                        }
                      </> 
                      :null
                    }
                  </>
                  :<Button style={{marginRight:'10px'}} type="primary" key="submit" onClick={() => {
                    props.form?.submit?.()
                  }}>
                    ??????
                  </Button>
                }
                <Button type="default"  onClick={() => { setDetailVisible(false);onClose() }}>??????</Button>
              </>  
            ];
          }
        }}
        onFinish={async (values)=>{
          await  onsubmit(values);
        }}
        initialValues={{
          prizeNotice:[{
            imageUrl: '',
            name: ''
          }],
          ruleItems: [{
            imageUrl: '',
            name: ''
          }]
        }}
        className={styles.rule_configuration}
        {...formItemLayout}
      >
        <ProFormText
            width="md"
            name="name"
            label="????????????"
            placeholder="??????????????????"
            rules={[{ required: true, message: '?????????????????????' }]}
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
              label="????????????"
              rules={[{ required: true, message: '?????????????????????' }]}
              readonly
              fieldProps={{
                value:moment(detailList?.data?.startTime*1000).format('YYYY-MM-DD HH:mm:ss')+' ??? '+moment(detailList?.data?.endTime*1000).format('YYYY-MM-DD HH:mm:ss')
              }}
            />  
          : <ProFormDateTimeRangePicker
              width="md"
              label='????????????'
              rules={[{ required: true, message: '?????????????????????' }]}
              name="dateRange"
              fieldProps={{
                disabledDate:(current)=>disabledDate(current),
                showTime:{
                  hideDisabledOptions: true,
                  defaultValue: [moment('00:00', 'HH:mm'), moment('11:59', 'HH:mm')],
                },
                format:"YYYY-MM-DD HH:mm"
              }}
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
          <div style={{width:'100%',overflowX: 'auto'}}>
          <ProCard
            title={<p><span style={{color:'red'}}>*</span> ?????????????????????</p>}
            headerBordered
            split='horizontal'
            className={styles.list}
          >
            <ProCard split="horizontal">
              <ProCard split="horizontal">
                <ProCard split='vertical'>
                  <ProCard colSpan="111px" layout="center" style={{background:'none'}}>????????????</ProCard>
                  <ProCard colSpan="400px" bordered  layout="center">
                    <Space>
                      <span>3 -</span>
                      <Form.Item
                        name="tierEnd1"
                      >
                      <InputNumber min="0" formatter={limitDecimalsF}  onChange={(val)=>{setTierEnd1(val)}} readonly={id&&falg?'readonly':false } style={{width:'100px'}} placeholder="____________" bordered={false} />
                      </Form.Item>
                      <span>???</span>
                    </Space>
                  </ProCard>
                  <ProCard colSpan="400px" bordered  layout="center">
                    <Space>
                      <span>{tierEnd1&&parseInt(tierEnd1)+1||detailList?.data?.content?.rewardsSet?.tiersSet?.[1]?.tierStart} -</span>
                      <Form.Item
                        name="tierEnd2"
                      >
                      <InputNumber min="0" formatter={limitDecimalsF} onChange={(val)=>{setTierEnd2(val)}} readonly={id&&falg?'readonly':false } style={{width:'100px'}} placeholder="____________" bordered={false} />
                      </Form.Item>
                      <span>???</span>
                    </Space>
                  </ProCard>
                  <ProCard colSpan="400px" bordered  layout="center">
                    <Space>
                      <span>{tierEnd2&&parseInt(tierEnd2)+1||detailList?.data?.content?.rewardsSet?.tiersSet?.[2]?.tierStart} -</span>
                      <Form.Item
                        name="tierEnd3"
                      >
                      <InputNumber min="0" formatter={limitDecimalsF} onChange={(val)=>{setTierEnd3(val)}} readonly={id&&falg?'readonly':false } style={{width:'100px'}} placeholder="____________" bordered={false} />
                      </Form.Item>
                      <span>???</span>
                    </Space>
                  </ProCard>
                  <ProCard colSpan="400px" bordered layout="center">
                  <Space>
                      <span>{tierEnd3&&parseInt(tierEnd3)+1||detailList?.data?.content?.rewardsSet?.tiersSet?.[3]?.tierStart} -</span>
                      <Form.Item
                        name="tierEnd4"
                      >
                      <InputNumber min="0" formatter={limitDecimalsF} readonly={id&&falg?'readonly':false } style={{width:'100px'}} placeholder="____________" bordered={false} />
                      </Form.Item>
                      <span>???</span>
                    </Space>
                  </ProCard>
                </ProCard>
                <ProCard split="vertical">
                  <ProCard colSpan="111px" layout="center" style={{background:'none',borderTop:'2px solid #E6E6E6'}}>?????????</ProCard>
                  <ProCard style={{textAlign:'center'}} bordered colSpan="400px">
                    <Space>
                      <span>??????</span>
                      <Form.Item
                        name="general_probability1"
                      >
                       <InputNumber min="0" readonly={id&&falg?'readonly':false } onChange={(val)=>setProbability1(val)} style={{width:'80px'}} placeholder="_________" bordered={false} />
                      </Form.Item>
                      <span>%</span>
                    </Space>
                    <Space>
                      <Form.Item
                        name="general_moneyRange1_win1"
                      >
                       <InputNumber min="0" readonly={id&&falg?'readonly':false } style={{width:'80px'}} placeholder="_________" bordered={false} />
                      </Form.Item>
                      <Form.Item
                        name="general_moneyRange1_win2"
                      >
                       <InputNumber min="0" readonly={id&&falg?'readonly':false } style={{width:'80px'}} placeholder="_________" bordered={false} />
                      </Form.Item>
                      <Form.Item
                        name="general_moneyRange1_win3"
                      >
                       <InputNumber min="0" readonly={id&&falg?'readonly':false } style={{width:'80px'}} placeholder="_________" bordered={false} />
                      </Form.Item>
                      <Form.Item
                        name="general_moneyRange1_win4"
                      >
                       <InputNumber min="0" readonly={id&&falg?'readonly':false } style={{width:'80px'}} placeholder="_________" bordered={false} />
                      </Form.Item>
                    </Space>
                  </ProCard>
                  <ProCard style={{textAlign:'center'}} bordered colSpan="400px">
                    <Space>
                      <span>??????</span>
                      <Form.Item
                        name="general_probability2"
                      >
                      <InputNumber min="0" readonly={id&&falg?'readonly':false } onChange={(val)=>setProbability3(val)} style={{width:'80px'}} placeholder="_________" bordered={false} />
                      </Form.Item>
                      <span>%</span>
                    </Space>
                    <Space>
                      <Form.Item
                        name="general_moneyRange2_win1"
                      >
                       <InputNumber min="0" readonly={id&&falg?'readonly':false } style={{width:'80px'}} placeholder="_________" bordered={false} />
                      </Form.Item>
                      <Form.Item
                        name="general_moneyRange2_win2"
                      >
                       <InputNumber min="0" readonly={id&&falg?'readonly':false } style={{width:'80px'}} placeholder="_________" bordered={false} />
                      </Form.Item>
                      <Form.Item
                        name="general_moneyRange2_win3"
                      >
                       <InputNumber min="0" readonly={id&&falg?'readonly':false } style={{width:'80px'}} placeholder="_________" bordered={false} />
                      </Form.Item>
                      <Form.Item
                        name="general_moneyRange2_win4"
                      >
                       <InputNumber min="0" readonly={id&&falg?'readonly':false } style={{width:'80px'}} placeholder="_________" bordered={false} />
                      </Form.Item>
                    </Space>
                  </ProCard>
                  <ProCard style={{textAlign:'center'}} bordered colSpan="400px">
                    <Space>
                      <span>??????</span>
                      <Form.Item
                        name="general_probability3"
                      >
                      <InputNumber min="0" readonly={id&&falg?'readonly':false } onChange={(val)=>setProbability5(val)} style={{width:'80px'}} placeholder="_________" bordered={false} />
                      </Form.Item>
                      <span>%</span>
                    </Space>
                    <Space>
                      <Form.Item
                        name="general_moneyRange3_win1"
                      >
                       <InputNumber min="0" readonly={id&&falg?'readonly':false } style={{width:'80px'}} placeholder="_________" bordered={false} />
                      </Form.Item>
                      <Form.Item
                        name="general_moneyRange3_win2"
                      >
                       <InputNumber min="0" readonly={id&&falg?'readonly':false } style={{width:'80px'}} placeholder="_________" bordered={false} />
                      </Form.Item>
                      <Form.Item
                        name="general_moneyRange3_win3"
                      >
                       <InputNumber min="0" readonly={id&&falg?'readonly':false } style={{width:'80px'}} placeholder="_________" bordered={false} />
                      </Form.Item>
                      <Form.Item
                        name="general_moneyRange3_win4"
                      >
                       <InputNumber min="0" readonly={id&&falg?'readonly':false } style={{width:'80px'}} placeholder="_________" bordered={false} />
                      </Form.Item>
                    </Space>
                  </ProCard>
                  <ProCard style={{textAlign:'center'}} bordered colSpan="400px">
                    <Space>
                      <span>??????</span>
                      <Form.Item
                        name="general_probability4"
                      >
                      <InputNumber min="0" readonly={id&&falg?'readonly':false } onChange={(val)=>setProbability7(val)} style={{width:'80px'}} placeholder="_________" bordered={false} />
                      </Form.Item>
                      <span>%</span>
                    </Space>
                    <Space>
                      <Form.Item
                        name="general_moneyRange4_win1"
                      >
                       <InputNumber min="0" readonly={id&&falg?'readonly':false } style={{width:'80px'}} placeholder="_________" bordered={false} />
                      </Form.Item>
                      <Form.Item
                        name="general_moneyRange4_win2"
                      >
                       <InputNumber min="0" readonly={id&&falg?'readonly':false } style={{width:'80px'}} placeholder="_________" bordered={false} />
                      </Form.Item>
                      <Form.Item
                        name="general_moneyRange4_win3"
                      >
                       <InputNumber min="0" readonly={id&&falg?'readonly':false } style={{width:'80px'}} placeholder="_________" bordered={false} />
                      </Form.Item>
                      <Form.Item
                        name="general_moneyRange4_win4"
                      >
                       <InputNumber min="0" readonly={id&&falg?'readonly':false } style={{width:'80px'}} placeholder="_________" bordered={false} />
                      </Form.Item>
                    </Space>
                  </ProCard>
                </ProCard>
                <ProCard split="vertical">
                  <ProCard colSpan="111px" layout="center" style={{background:'none',borderTop:'2px solid #E6E6E6'}}>?????????</ProCard>
                  <ProCard style={{textAlign:'center'}} bordered colSpan="400px">
                    <Space>
                      <span>??????</span>
                      <Form.Item
                        name="lucky_probability1"
                      >
                      <InputNumber min="0" readonly={id&&falg?'readonly':false } onChange={(val)=>setProbability2(val)} style={{width:'80px'}} placeholder="_________" bordered={false} />
                      </Form.Item>
                      <span>%</span>
                    </Space>
                    <Space>
                      <Form.Item
                        name="lucky_moneyRange1_win1"
                      >
                       <InputNumber min="0" readonly={id&&falg?'readonly':false } style={{width:'80px'}} placeholder="_________" bordered={false} />
                      </Form.Item>
                      <Form.Item
                        name="lucky_moneyRange1_win2"
                      >
                       <InputNumber min="0" readonly={id&&falg?'readonly':false } style={{width:'80px'}} placeholder="_________" bordered={false} />
                      </Form.Item>
                      <Form.Item
                        name="lucky_moneyRange1_win3"
                      >
                       <InputNumber min="0" readonly={id&&falg?'readonly':false } style={{width:'80px'}} placeholder="_________" bordered={false} />
                      </Form.Item>
                      <Form.Item
                        name="lucky_moneyRange1_win4"
                      >
                       <InputNumber min="0" readonly={id&&falg?'readonly':false } style={{width:'80px'}} placeholder="_________" bordered={false} />
                      </Form.Item>
                    </Space>
                  </ProCard>
                  <ProCard style={{textAlign:'center'}} bordered colSpan="400px">
                    <Space>
                      <span>??????</span>
                      <Form.Item
                        name="lucky_probability2"
                      >
                      <InputNumber min="0" readonly={id&&falg?'readonly':false } onChange={(val)=>setProbability4(val)} style={{width:'80px'}} placeholder="_________" bordered={false} />
                      </Form.Item>
                      <span>%</span>
                    </Space>
                    <Space>
                      <Form.Item
                        name="lucky_moneyRange2_win1"
                      >
                       <InputNumber min="0" readonly={id&&falg?'readonly':false } style={{width:'80px'}} placeholder="_________" bordered={false} />
                      </Form.Item>
                      <Form.Item
                        name="lucky_moneyRange2_win2"
                      >
                       <InputNumber min="0" readonly={id&&falg?'readonly':false } style={{width:'80px'}} placeholder="_________" bordered={false} />
                      </Form.Item>
                      <Form.Item
                        name="lucky_moneyRange2_win3"
                      >
                       <InputNumber min="0" readonly={id&&falg?'readonly':false } style={{width:'80px'}} placeholder="_________" bordered={false} />
                      </Form.Item>
                      <Form.Item
                        name="lucky_moneyRange2_win4"
                      >
                       <InputNumber min="0" readonly={id&&falg?'readonly':false } style={{width:'80px'}} placeholder="_________" bordered={false} />
                      </Form.Item>
                    </Space>
                  </ProCard>
                  <ProCard style={{textAlign:'center'}} bordered colSpan="400px">
                    <Space>
                      <span>??????</span>
                      <Form.Item
                        name="lucky_probability3"
                      >
                      <InputNumber min="0" readonly={id&&falg?'readonly':false } onChange={(val)=>setProbability6(val)} style={{width:'80px'}} placeholder="_________" bordered={false} />
                      </Form.Item>
                      <span>%</span>
                    </Space>
                    <Space>
                      <Form.Item
                        name="lucky_moneyRange3_win1"
                      >
                       <InputNumber min="0" readonly={id&&falg?'readonly':false } style={{width:'80px'}} placeholder="_________" bordered={false} />
                      </Form.Item>
                      <Form.Item
                        name="lucky_moneyRange3_win2"
                      >
                       <InputNumber min="0" readonly={id&&falg?'readonly':false } style={{width:'80px'}} placeholder="_________" bordered={false} />
                      </Form.Item>
                      <Form.Item
                        name="lucky_moneyRange3_win3"
                      >
                       <InputNumber min="0" readonly={id&&falg?'readonly':false } style={{width:'80px'}} placeholder="_________" bordered={false} />
                      </Form.Item>
                      <Form.Item
                        name="lucky_moneyRange3_win4"
                      >
                       <InputNumber min="0" readonly={id&&falg?'readonly':false } style={{width:'80px'}} placeholder="_________" bordered={false} />
                      </Form.Item>
                    </Space>
                  </ProCard>
                  <ProCard style={{textAlign:'center'}} bordered colSpan="400px">
                    <Space>
                      <span>??????</span>
                      <Form.Item
                        name="lucky_probability4"
                      >
                      <InputNumber min="0" readonly={id&&falg?'readonly':false } onChange={(val)=>setProbability8(val)} style={{width:'80px'}} placeholder="_________" bordered={false} />
                      </Form.Item>
                      <span>%</span>
                    </Space>
                    <Space>
                      <Form.Item
                        name="lucky_moneyRange4_win1"
                      >
                       <InputNumber min="0" readonly={id&&falg?'readonly':false } style={{width:'80px'}} placeholder="_________" bordered={false} />
                      </Form.Item>
                      <Form.Item
                        name="lucky_moneyRange4_win2"
                      >
                       <InputNumber min="0" readonly={id&&falg?'readonly':false } style={{width:'80px'}} placeholder="_________" bordered={false} />
                      </Form.Item>
                      <Form.Item
                        name="lucky_moneyRange4_win3"
                      >
                       <InputNumber min="0" readonly={id&&falg?'readonly':false } style={{width:'80px'}} placeholder="_________" bordered={false} />
                      </Form.Item>
                      <Form.Item
                        name="lucky_moneyRange4_win4"
                      >
                       <InputNumber min="0" readonly={id&&falg?'readonly':false } style={{width:'80px'}} placeholder="_________" bordered={false} />
                      </Form.Item>
                    </Space>
                  </ProCard>
                </ProCard>
                <ProCard split="vertical">
                  <ProCard colSpan="111px" layout="center" style={{background:'none',borderTop:'2px solid #E6E6E6'}}>????????????</ProCard>
                  <ProCard layout="center" bordered colSpan="1600px">
                    <Space>
                      <span>??????????????????</span>
                      <Form.Item
                        name="prizeMoney"
                      >
                      <InputNumber min="0" readonly={id&&falg?'readonly':false } style={{width:'100px'}} placeholder="____________" bordered={false} />
                      </Form.Item>
                      <span>???????????????????????????????????????????????????????????????????????????????????????</span>
                    </Space>
                    <Button style={{marginLeft:'200px'}} type="primary" onClick={()=>setListVisible(true)}>{id&&falg?'????????????':'????????????'}</Button>
                  </ProCard>
                </ProCard>
                <ProCard split="vertical">
                  <ProCard colSpan="400px" bordered  layout="center" colSpan="111px" style={{background:'none',borderTop:'2px solid #E6E6E6'}}>?????????</ProCard>
                  <ProCard colSpan="400px" bordered  layout="center">
                    ??????{
                    typeof probability1=== 'number'&&typeof probability2=== 'number'&&(10000-(amountTransform(Number(probability1),'*')+amountTransform(Number(probability2),'*')))/100===0?'0': typeof probability1 === 'number'&&typeof probability2=== 'number'&&(10000-(amountTransform(Number(probability1),'*')+amountTransform(Number(probability2),'*')))/100||
                    typeof probability1=== 'number'&&(10000-(amountTransform(Number(probability1),'*')+amountTransform(Number(detailList?.data?.content?.rewardsSet?.tiersSet?.[0]?.lucky?.probability),'*')))/100||
                    typeof probability2=== 'number'&&(10000-(amountTransform(Number(detailList?.data?.content?.rewardsSet?.tiersSet?.[0]?.general?.probability),'*')+amountTransform(Number(probability2),'*')))/100||
                    detailList?.data?.content?.rewardsSet?.tiersSet?.[0]?.losing?.probability
                    }%</ProCard>
                  <ProCard colSpan="400px" bordered  layout="center">
                    ??????{
                    typeof probability3=== 'number'&&typeof probability4=== 'number'&&(10000-(amountTransform(Number(probability3),'*')+amountTransform(Number(probability4),'*')))/100===0?'0':typeof probability3=== 'number'&&typeof probability4=== 'number'&&(10000-(amountTransform(Number(probability3),'*')+amountTransform(Number(probability4),'*')))/100||
                    typeof probability3=== 'number'&&(10000-(amountTransform(Number(probability3),'*')+amountTransform(Number(detailList?.data?.content?.rewardsSet?.tiersSet?.[1]?.lucky?.probability),'*')))/100||
                    typeof probability4=== 'number'&&(10000-(amountTransform(Number(detailList?.data?.content?.rewardsSet?.tiersSet?.[1]?.general?.probability),'*')+amountTransform(Number(probability4),'*')))/100||
                    detailList?.data?.content?.rewardsSet?.tiersSet?.[1]?.losing?.probability
                    }%</ProCard>
                  <ProCard colSpan="400px" bordered  layout="center">
                    ??????{
                    typeof probability5=== 'number'&&typeof probability6=== 'number'&&(10000-(amountTransform(Number(probability5),'*')+amountTransform(Number(probability6),'*')))/100===0?'0':typeof probability5=== 'number'&&typeof probability6=== 'number'&&(10000-(amountTransform(Number(probability5),'*')+amountTransform(Number(probability6),'*')))/100||
                    typeof probability5=== 'number'&&(10000-(amountTransform(Number(probability5),'*')+amountTransform(Number(detailList?.data?.content?.rewardsSet?.tiersSet?.[2]?.lucky?.probability),'*')))/100||
                    typeof probability6=== 'number'&&(10000-(amountTransform(Number(detailList?.data?.content?.rewardsSet?.tiersSet?.[2]?.general?.probability),'*')+amountTransform(Number(probability6),'*')))/100||
                    detailList?.data?.content?.rewardsSet?.tiersSet?.[2]?.losing?.probability
                    }%</ProCard>
                  <ProCard colSpan="400px" bordered  layout="center">
                    ??????{
                    typeof probability7=== 'number'&&typeof probability8=== 'number'&&(10000-(amountTransform(Number(probability7),'*')+amountTransform(Number(probability8),'*')))/100===0?'0':typeof probability7=== 'number'&&typeof probability8=== 'number'&&(10000-(amountTransform(Number(probability7),'*')+amountTransform(Number(probability8),'*')))/100||
                    typeof probability7=== 'number'&&(10000-(amountTransform(Number(probability7),'*')+amountTransform(Number(detailList?.data?.content?.rewardsSet?.tiersSet?.[3]?.lucky?.probability),'*')))/100||
                    typeof probability8=== 'number'&&(10000-(amountTransform(Number(detailList?.data?.content?.rewardsSet?.tiersSet?.[3]?.general?.probability),'*')+amountTransform(Number(probability8),'*')))/100||
                    detailList?.data?.content?.rewardsSet?.tiersSet?.[3]?.losing?.probability
                    }%</ProCard>
                </ProCard>
              </ProCard>
            </ProCard>
          </ProCard>
          </div>
          {
            id&&falg?
            <ProFormText
              width="sm"
              name="moneyAll"
              label="??????????????????"
              rules={[{ required: true, message: '?????????' }]}
              readonly={id&&falg}
              fieldProps={{
                value:`${amountTransform(detailList?.data?.content?.moneyAll, '/')}???`
              }}
            />
          :
          <ProFormText
            width="sm"
            name="moneyAll"
            label="??????????????????"
            rules={[
              { required: true, message: '?????????' },
              {validator: checkConfirm}
            ]}
            fieldProps={{
              addonAfter:"???"
            }}
          />
          }
          {
            id&&falg?
            <ProFormText
              width="sm"
              label="????????????"
              name="moneyDay"
              readonly={id&&falg}
              rules={[{ required: true, message: '?????????' }]}
              fieldProps={{
                value:`${amountTransform(detailList?.data?.content?.moneyDay, '/')}???`
              }}
            />
            :
            <ProFormText
              width="sm"
              label="????????????"
              name="moneyDay"
              rules={[
                { required: true, message: '?????????' },
                {validator: checkConfirm}
              ]}
              fieldProps={{
                addonAfter:"???"
              }}
            />
          }

          {
            id&&falg?
            <ProFormText
              width="sm"
              name="sendPlayTime"
              label="????????????????????????"
              labelCol={2}   
              readonly={id&&falg}
              rules={[{ required: true, message: '?????????' }]}
              fieldProps={{
                value:`${detailList?.data?.content?.sendPlayTime}???`
                
              }}
            />
            :
            <ProFormText
              width="sm"
              name="sendPlayTime"
              label="????????????????????????"
              labelCol={2}
              rules={[
                { required: true, message: '?????????' },
                {validator: checkConfirm}
              ]}
              fieldProps={{
                addonAfter:"???"
              }}
            />
          }
          {
            id&&falg?
            <ProFormText
              width="sm"
              name="inviteNum"
              label="?????????"
              readonly={id&&falg}
              rules={[{ required: true, message: '?????????' }]}
              fieldProps={{
                value:`${detailList?.data?.content?.accessGain?.inviteFriends?.inviteNum}??????????????????????????????${detailList?.data?.content?.accessGain?.inviteFriends?.prizeNum}???`
              }}
            />
            :
            <ProForm.Group>
              <ProFormSelect
                name="inviteNum"
                initialValue={1}
                labelCol={3}
                width="sm"
                label='?????????'
                rules={[{ required: true, message: '?????????' }]}
                options={[
                    {
                        value: 1,
                        label: '1????????????',
                    },
                    {
                        value: 2,
                        label: '2????????????',
                    },
                    {
                        value: 3,
                        label: '3????????????',
                    },
                    {
                        value: 4,
                        label: '4????????????',
                    },
                    {
                        value: 5,
                        label: '5????????????',
                    },
                    {
                        value: 6,
                        label: '6????????????',
                    },
                    {
                        value: 7,
                        label: '7????????????',
                    },
                    {
                        value: 8,
                        label: '8????????????',
                    }
                ]}
              />
              <span>??????????????????</span>
              <ProFormSelect
                name="prizeNum1"
                initialValue={1}
                width="sm"
                rules={[{ required: true, message: '?????????' }]}
                options={[
                    {
                        value: 1,
                        label: '1???',
                    },
                    {
                        value: 2,
                        label: '2???',
                    },
                    {
                        value: 3,
                        label: '3???',
                    },
                    {
                        value: 4,
                        label: '4???',
                    },
                    {
                        value: 5,
                        label: '5???',
                    },
                    {
                        value: 6,
                        label: '6???',
                    },
                    {
                        value: 8,
                        label: '8???',
                    },
                    {
                        value: 10,
                        label: '10???',
                    },
                    {
                        value: 12,
                        label: '12???',
                    },
                    {
                        value: 16,
                        label: '16???',
                    },
                    {
                        value: 20,
                        label: '20???',
                    },
                    {
                        value: 50,
                        label: '50???',
                    },
                ]}
              />
            </ProForm.Group>
          }

          <ProFormDateTimePicker
            label="??????????????????"
            name="withdrawTime"
            readonly={id&&falg}
            rules={[{ required: true, message: '????????????' }]}
            fieldProps={{
              disabledDate:(current)=>disabledDate(current),
            }}
            hidden={true}
            initialValue={4102415999}
          />
          <ProFormText
              width="sm"
              name="validiteHour"
              label="?????????????????????"
              rules={[
                { required: true, message: '?????????' },
                {validator: checkConfirm2}
              ]}
              fieldProps={{
                addonAfter:"??????"
              }}
              initialValue={24}
              hidden
            />
          {
            id&&falg?
            <ProFormText
              width="sm"
              name="testNum"
              label="????????????"
              readonly={id&&falg}
              rules={[{ required: true, message: '?????????' }]}
              fieldProps={{
                value:`${detailList?.data?.content?.testNum}???`
              }}
            />
            : 
            <ProFormText
              width="sm"
              name="testNum"
              label="????????????"
              rules={[
                { required: true, message: '?????????' },
                {validator: checkConfirm}
              ]}
              fieldProps={{
                addonAfter:"???"
              }}
            />
          }
         
          {
            id&&falg?
            <ProFormText
              width="lg"
              name="prizeNum"
              label="?????????????????????"
              labelCol={2}
              readonly={id&&falg}
              rules={[{ required: true, message: '?????????' }]}
              fieldProps={{
                value:`??????1?????????????????????????????????????????????${detailList?.data?.content?.accessGain?.friendPlay?.prizeNum}???`
              }}
            />
            :
            <ProFormText
              width="lg"
              name="prizeNum"
              label="?????????????????????"
              labelCol={2}
              rules={[
                { required: true, message: '?????????' },
                {validator: checkConfirm}
              ]}
              fieldProps={{
                addonBefore:'??????1?????????????????????????????????????????????',
                addonAfter:"???"
              }}
            />
          }
          {
            id&&falg?
            <ProFormText
              width="sm"
              name="virtualNum"
              label="??????????????????"
              readonly={id&&falg}
              rules={[{ required: true, message: '?????????' }]}
              fieldProps={{
                value:`${detailList?.data?.content?.virtualNum}??????`
              }}
            />
            :
            <ProFormText
              width="sm"
              name="virtualNum"
              label="??????????????????"
              rules={[
                { required: true, message: '?????????' },
                {validator: checkConfirm}
              ]}
              fieldProps={{
                addonAfter:"??????"
              }}
            />
          }

         
          <Form.Item
            label="????????????"
            name="imgUrl"
            rules={[{ required: true, message: '???????????????' }]}
          >
            <FromWrap
              content={(value, onChange) => <Upload multiple value={value} disabled={id&&falg} onChange={onChange}   maxCount={1} accept="image/*"  proportion={{width: 670,height: 284,}} />}
              right={(value) => {
                return (
                  <dl>
                    <dd>??? 670 x ??? 284</dd>
                  </dl>
                )
              }}
            />
          </Form.Item>
          {
            id&&falg?
              <Form.Item
              name="ruleText"
              label="????????????"
              rules={[
                { required: true, message: '?????????????????????' },
              ]}
            >
            <pre className={styles.line_feed}>
              {
                detailList?.data?.content?.ruleText
              }
            </pre>
            </Form.Item>
              :
            <ProFormTextArea
              name="ruleText"
              label="????????????"
              placeholder="????????????????????????????????????????????????????????????"
              rules={[
                { required: true, message: '?????????????????????' },
              ]}
              readonly={id&&falg}
              fieldProps={{
                maxLength:1000
              }}
            />
          }
          <ProFormRadio.Group
            name="status"
            label="????????????"
            options={[
                {
                  label: '??????',
                  value: 1
                },
                {
                  label: '??????',
                  value: 0
                },
            ]}
            initialValue={1}
            hidden
          />
          {
            id&&falg&&<ProFormText
                name="statusStr"
                label="????????????"
                readonly={id&&falg}
              />
          }

          {
            id&&falg?
            <p className={styles.back}>????????????????????????{detailList?.data?.lastEditor}     {moment(detailList?.data?.updateTime*1000).format('YYYY-MM-DD HH:mm:ss')}</p>
            :null
          }  
       </DrawerForm>
      </Spin>
      {
        visible&&<EndModel visible={visible} setVisible={setVisible}  endId={id} canBlack={(e)=>{
          setLoading(e)
          setFalg(true)
        }}/>
      }
       {listVisible&&<UploadingList 
        visible={listVisible} 
        setVisible={setListVisible} 
        phones={detailList?.data?.content?.rewardsSet?.luckyOne?.prizePhones}  
        endId={id}
        falg={falg} 
        canBlack={(val)=>{
          setPhoneList(val)
        }}/>
      }
      </PageContainer>
  )
}
