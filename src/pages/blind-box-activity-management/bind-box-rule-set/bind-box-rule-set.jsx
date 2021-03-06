import React, { useState, useEffect } from 'react';
import { Input, Form, Divider, message, Button,List, Space,Avatar } from 'antd';
import { FormattedMessage, formatMessage,history } from 'umi';
import { PlusOutlined, MinusOutlined } from '@ant-design/icons';
import GainType from './gain-type/gain-type'
import PeriodValidity from './period-validity/period-validity'
import PrizeSet from './prize-set/prize-set'
import Upload from '@/components/upload';
import { saveActiveConfig } from '@/services/blind-box-activity-management/blindbox-save-active-config';
import { getActiveConfigById } from '@/services/blind-box-activity-management/blindbox-get-active-config-list';
import ProForm, { ProFormText, ProFormRadio,ProFormDateRangePicker,ProFormDateTimeRangePicker,ProFormTextArea,ProFormDependency,ProFormSelect,DrawerForm,ProFormDigit } from '@ant-design/pro-form';
import moment from 'moment';
import styles from './style.less'
import { PageContainer } from '@/components/PageContainer';
import { amountTransform } from '@/utils/utils'


const formItemLayout = {
  labelCol: { span: 4 },
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

const FromWrap = ({ value, onChange, content, right }) => (
  <div style={{ display: 'flex' }}>
    <div>{content(value, onChange)}</div>
    <div style={{ flex: 1, marginLeft: 10, minWidth: 180 }}>{right(value)}</div>
  </div>
)

export default (props) => {
  const {setVisible,visible,onClose,callback,id}=props
  const [detailList,setDetailList]=useState()
  const [goosList,setGoosList]=useState()
  const [form] = Form.useForm()
  const [falg,setFalg]=useState(true)
  const [del,setDel]=useState('')
  useEffect(() => {
    if (id) {
      getActiveConfigById({id:id}).then(res=>{
        setDetailList(res.data)
        let sum=0
        res.data?.skus?.map(ele=>{
          if(ele.status&&!ele.assignType){
            sum=amountTransform(amountTransform(sum, '*')+amountTransform(ele.probability, '*'),'/')
          }
        })
        form.setFieldsValue({
          switch1:res.data.content?.accessGain.inviteFriends.switch,
          switch2:res.data.content?.accessGain.signIn.switch,
          switch3:res.data.content?.accessGain.orderConsume.switch,
          switch4:res.data.content?.accessGain.shopperConsume.switch,
          probability1:res.data.content?.accessGain.inviteFriends.probability,
          probability2:res.data.content?.accessGain.signIn.probability,
          probability3:res.data.content?.accessGain.orderConsume.probability,
          probability4:res.data.content?.accessGain.shopperConsume.probability,
          inviteNum:res.data.content?.accessGain.inviteFriends.inviteNum,
          signInNum:res.data.content?.accessGain.signIn.signInNum,
          consumeNum:res.data.content?.accessGain.orderConsume.consumeNum,
          consumeNum2:amountTransform(res.data.content?.accessGain.shopperConsume.consumePrice, '/'),
          dayGainMax:res.data.content?.accessGain.inviteFriends.dayGainMax,
          dayMaxNum:res.data.content?.accessGain.shopperConsume.dayMaxNum,
          ruleText:res.data.content?.ruleText,
          validiteType:res.data.content?.validiteType,
          validiteHour:res.data.content?.validiteHour,
          redeemEarlyDay:res.data.content?.redeemEarlyDay,
          maxPrizeNum:res.data.content?.maxPrizeNum,
          prizeNotice:res.data.content?.prizeNotice,
          imgUrl:res.data.content?.imgUrl,
          dateRange: [ moment(res.data.startTime*1000).format('YYYY-MM-DD HH:mm:ss'), moment(res.data.endTime*1000).format('YYYY-MM-DD HH:mm:ss')],
          appTips:res.data.content?.appTips,
          prob:`${amountTransform(10000-amountTransform(sum, '*'),'/')}%`,
          ...res.data
        })
      })
    } 
  }, [])
  const checkConfirm=(rule, value, callback)=>{
    return new Promise(async (resolve, reject) => {
    if (value&&value.length>0&&!/^[0-9]*[1-9][0-9]*$/.test(value)&&value!=0) {
        await reject('??????????????????')
    } else {
        await resolve()
    }
    })
}
  const checkConfirm2 = (rule, value, callback) => {
    return new Promise(async (resolve, reject) => {
      if (value && value.length > 1000) {
        await reject('?????????????????????1000?????????')
      }else {
        await resolve()
      }
    })
  }
  const checkConfirm3 = (rule, value, callback) => {
    return new Promise(async (resolve, reject) => {
      if (value && value.length > 6) {
        await reject('????????????6????????????')
      }else {
        await resolve()
      }
    })
  }
  const onsubmit = (values) => {
    try {
      const arr = [];
      let sum=0
      goosList?.forEach(item => {
        arr.push({
          id: item.id==item.skuId||`${item.id}`.length>10?0:item.id,
          probability:item.assignType?0:item.probability,
          status: item.status?1:0,
          skuId: item.skuId,
          spuId: item.spuId,
          stockNum: item.stockNum,
          baseStockNum:item.baseStockNum,
          goodsName: item.goodsName,
          imageUrl: item.imageUrl,
          salePrice: item.salePrice,
          retailSupplyPrice: item.retailSupplyPrice,
          assignPhones:item.assignPhones,
          goodsType:item.goodsType,
          assignType:item.assignType
        })
      })
      if(del){
        values.skus=arr
      }else{
        values.skus=arr.length>0&&arr||detailList?.skus
      }
      values.skus.map(ele=>{
        if(ele.status&&!ele.assignType){
          sum=amountTransform(amountTransform(sum, '*')+amountTransform(ele.probability, '*'),'/')
        }
      })
    if(sum>100){
      message.error('????????????????????????????????????100')
    }else{
      if(values.skus.length==0){
        message.error('????????????????????????');
      }else{
        const params={
          ...values,
          id:id||0,
          startTime:values.dateRange ?values.dateRange[0]:null,
          endTime:values.dateRange ?values.dateRange[1]:null,
          validiteHour:values.validiteType?values.validiteHour:0,
          accessGain:{
            inviteFriends:{
              switch:values.switch1,
              inviteNum:values.inviteNum,
              prizeNum:1,
              dayGainMax:values.dayGainMax,
              probability:values.probability1
            },
            signIn:{
              switch:values.switch2,
              signInNum:values.signInNum,
              prizeNum:1,
              probability:values.probability2
            },
            orderConsume:{
              switch:values.switch3,
              consumeNum:values.consumeNum,
              prizeNum:1,
              probability:values.probability3
            },
            shopperConsume:{
              switch:values.switch4,
              consumeNum:1,
              consumePrice:amountTransform(values.consumeNum2, '*'),
              prizeNum:1,
              probability:values.probability4,
              dayMaxNum:values.dayMaxNum,
            }
          },
          skus:values.skus,
        }
        saveActiveConfig(params).then(res=>{
          if (res.code == 0) {
            setVisible(false)
            callback(true)
            if(id){
              setDel(false)
              message.success('????????????');
            }else{
              message.success('????????????');
              setDel(false)
            }
           
          }
        })
      }

    }
      
    } catch (error) {
      console.log('error',error)
    }
  }

  const disabledDate=(current)=>{
    return current && current < moment().startOf('day');
  }
  return (
       <DrawerForm
        title={id?'??????':'??????????????????'}
        onVisibleChange={setVisible}
        visible={visible}
        width={1500}
        form={form}
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
               <Space>
                 {
                  id?
                  <>
                     {
                       detailList?.status==1?
                       <div>
                       {
                         falg?<Button key='edit' type="primary"  onClick={()=>{
                           setFalg(false)
                          }}>
                         ??????
                        </Button>
                        :<Button  type="primary" key="submit" onClick={() => {
                          props.form?.submit?.()
                        }}>
                          ??????
                        </Button>
                       }
                       </div>
                       :null
                     }
                  </>
                  :
                    <Button type="primary" key="submit" onClick={() => {
                      props.form?.submit?.()
                    }}>
                      ??????
                    </Button>
                 }
               </Space>
              ];
            }
          }
        }
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
        className={styles.bindBoxRuleSet}
        {...formItemLayout}
      >
        {/* ???????????? */}
        <ProFormText
            width={300}
            label="????????????"
            placeholder="??????????????????"
            name="name"
            readonly={id&&falg}
            rules={[
              { required: true, message: '?????????????????????' },
            ]}
        />
        {/* ???????????? */}
        <ProFormDateTimeRangePicker
            label='????????????'
            rules={[{ required: true, message: '?????????????????????' }]}
            name="dateRange"
            extra="????????????????????????????????????????????????????????????"
            fieldProps={{
               disabledDate:(current)=>disabledDate(current),
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
        <Form.Item
          label="????????????"
          name="imgUrl"
          rules={[{ required: true, message: '?????????????????????' }]}
        >
          <FromWrap
            content={(value, onChange) => <Upload multiple value={value} disabled={id&&falg} onChange={onChange}   maxCount={1} accept="image/*"  proportion={{width: 670,height: 284,}} />}
            right={(value) => {
              return (
                <dl>
                  <dd>670 x 284</dd>
                </dl>
              )
            }}
          />
        </Form.Item>
        <PeriodValidity id={id} falg={falg}/>
        <ProFormText
            label={<><span style={{color:'#FF7E7E',fontSize:'20px',marginTop:'5px'}}>*&nbsp;</span>??????????????????????????????</>}
            readonly
            fieldProps={{
              value:' '
           }}
        />
        <div className={styles.unfold}>
            <ProForm.Group>
            <span>?????????</span>
            <ProFormText
                name="redeemEarlyDay"
                readonly={id} 
                rules={[
                  {validator: checkConfirm},
                  { required: true, message: '????????????????????????' }
                ]}
            />
            <span>????????????</span>
            </ProForm.Group>
            <p className={styles.give}>???????????????????????????????????????????????????</p>
        </div>

        {/* ??????????????????????????? */}
        <GainType id={id} falg={falg}/>

        {/* ???????????? */}
        <ProForm.Group>
            <span className={styles.back}><span style={{color:'#FF7E7E',fontSize:'20px',marginTop:'5px'}}>*&nbsp;</span>??????????????????????????????</span>
            <ProFormText 
                name="maxPrizeNum"
                readonly={id&&falg}
                rules={[
                  {validator: checkConfirm},
                  { required: true, message: '?????????????????????' }
                ]}
            />
            <span>??????????????????????????????????????????????????????????????????</span>
        </ProForm.Group>

        {/* ???????????? */}
        <PrizeSet
          detailList={detailList}
          id={id} 
          falg={falg} 
          callback={(recordList,sum)=>{
            form.setFieldsValue({
              prob:`${amountTransform(10000-amountTransform(sum, '*'),'/')}%`
            })
            setGoosList(recordList)
            setDel(true)
          }}
        />
        
        <ProFormText
          width={300}
          name="prob"
          label={ <><span style={{color:'#FF7E7E',fontSize:'20px',marginTop:'5px'}}>*&nbsp;</span>??????????????????</>}
          readonly={true}
        />

        {/* ???????????? */}
        <Form.Item label={<><span style={{color:'#FF7E7E',fontSize:'20px',marginTop:'5px'}}>*&nbsp;</span>?????????????????????200x156???</>}>
          {
            id&&falg?
            <List
              itemLayout="horizontal"
              dataSource={detailList?.content?.prizeNotice}
              renderItem={item => (
                <List.Item>
                  <List.Item.Meta
                    avatar={<Avatar src={item.imageUrl} />}
                    title={<p>{item.name}</p>}
                  />
                </List.Item>
              )}
            />
            : <Form.List name="prizeNotice">
            {(fields, { add, remove }) => (
              <>
                <List
                  bordered
                  itemLayout="horizontal"
                >
                  {fields.map((field) => {
                    return (
                      <List.Item
                        key={field.key}
                        extra={fields.length !== 1 &&
                          <Button style={{ marginLeft: 10, width: 80 }} onClick={() => { remove(field.name) }} type="primary" danger>
                            ??????
                          </Button>}
                      >
                        <ProForm.Group>
                          <Form.Item  key="1" {...field} name={[field.name, 'imageUrl']} fieldKey={[field.fieldKey, 'imageUrl']}>
                            <Upload dimension={{width:200,height:156}} code={204} multiple maxCount={1} accept="image/*" size={1 * 1024} />
                          </Form.Item>
                          &nbsp;
                          <ProFormText
                            {...field}
                            name={[field.name, 'name']}
                            fieldKey={[field.fieldKey, 'name']}
                            placeholder='????????????6????????????'
                            key="2"
                            fieldProps={{
                              style: {
                                width: 328
                              }
                            }}
                            rules={[
                              { required: true, message: '?????????????????????' },
                              {validator: checkConfirm3}
                            ]}
                          />
                        </ProForm.Group>
                      </List.Item>
                    )
                  })}
                </List>
                <Button icon={<PlusOutlined />} style={{ marginTop: 10 }} onClick={() => { add() }}>
                  ????????????
                </Button>
              </>
            )}
          </Form.List>
          }
          </Form.Item>

        <ProFormText 
          label='????????????'
          name="appTips"
          // width={300}
          readonly={id&&falg}
          placeholder="?????????????????????????????????"
          rules={[{ required: true, message: '?????????????????????' }]}
          fieldProps={{
            maxLength:40
          }}
        />

        {/* ???????????? */}
        {
          id&&falg?
          <Form.Item
            label={<><span style={{color:'#FF7E7E',fontSize:'20px',marginTop:'5px'}}>*&nbsp;</span>????????????</>}
          >
          <pre className={styles.line_feed}>
            {
              detailList?.content?.ruleText
            }
          </pre>
          </Form.Item>
        :<ProFormTextArea 
              label='????????????'
              name="ruleText"
              style={{ minHeight: 32, marginTop: 15 }}
              placeholder='??????????????????????????????????????????'
              rules={[
                { required: true, message: '?????????????????????' },
                {validator: checkConfirm2}
              ]}
              rows={4}
              readonly={id&&falg}
          />
        }

      
       
        {
          id&&falg?
          <p className={styles.back}>????????????????????????{detailList?.lastEditor}     {moment(detailList?.updateTime*1000).format('YYYY-MM-DD HH:mm:ss')}</p>
          :null
        }
        
        {/* ???????????? */}
        <ProFormRadio.Group
          name="status"
          label='????????????'
          options={[
              {
                  label:'??????',
                  value: 1,
              },
              {
                  label: '??????',
                  value: 0,
              }
          ]}
          readonly={id&&falg}
          initialValue={1}
      />
      {
        id&&falg?null
        :<p className={styles.hint}>??????????????????????????????????????????????????????????????????????????????</p>
      }
      </DrawerForm>
  );
};


