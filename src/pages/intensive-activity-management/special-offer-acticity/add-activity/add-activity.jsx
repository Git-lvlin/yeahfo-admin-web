import React, { useState, useEffect,useRef } from 'react';
import { Input, Form, Divider, message, Button,Space } from 'antd';
import { FormattedMessage, formatMessage } from 'umi';
import ProTable from '@ant-design/pro-table';
import ProForm, { ProFormText,ProFormDateTimeRangePicker,ProFormTextArea,ProFormCheckbox,ProFormRadio,ProFormTimePicker,ProFormDependency,DrawerForm } from '@ant-design/pro-form';
import { history, connect } from 'umi';
import { saveWSDiscountActiveConfig,getActiveConfigById} from '@/services/intensive-activity-management/special-offer-acticity';
import { amountTransform } from '@/utils/utils'
import moment from 'moment';
import styles from './style.less'
import GoosSet from './goos-set'
import { PageContainer } from '@/components/PageContainer';


const formItemLayout = {
  labelCol: { span: 3 },
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

export default (props) => {
  const {setFormVisible,formVisible,onClose,callback,id}=props
  const [detailList,setDetailList]=useState()
  const [falg,setFalg]=useState(true)
  const [goosList,setGoosList]=useState()
  const [visible, setVisible] = useState(false);
  const [form] = Form.useForm()
  const [loading,setLoading]=useState(false)

  const activityName = (rule, value, callback) => {
    return new Promise(async (resolve, reject) => {
      if (value&&/[%&',;=?$\x22]/.test(value)) {
        await reject('不可以含特殊字符')
      } else {
        await resolve()
      }
    })
  }

  const checkConfirm2=(rule, value, callback)=>{
    return new Promise(async (resolve, reject) => {
    if (value&&value.length>0&&!/^[0-9]*[1-9][0-9]*$/.test(value)&&value!=0) {
        await reject('只能输入整数')
    }else {
        await resolve()
    }
    })
  }

  const checkConfirm5=(rule, value, callback)=>{
    return new Promise(async (resolve, reject) => {
    if (value&&value.length<5) {
        await reject('请输入5-1000个字符')
    }else {
        await resolve()
    }
    })
  }
  useEffect(() => {
    if (id) {
      getActiveConfigById({id}).then(res=>{
        if(res.data?.endTime<res.data?.time){
          message.error('活动已结束！'); 
          setFormVisible(false)
          onClose()
          return false
        }
        setDetailList(res.data?.content?.goods)
        form.setFieldsValue({
            dateRange: [moment(res.data?.startTime*1000).valueOf(), moment(res.data?.endTime*1000).valueOf()],
            buyerLimit:res.data?.content?.buyerLimit==999999?'':res.data?.content?.buyerLimit,
            joinAgainPercent:amountTransform(res.data?.content?.joinAgainPercent,'*'),
            joinBuyerType:res.data?.content?.joinBuyerType,
            joinShopType:[res.data?.content?.joinShopType],
            ruleText:res.data?.content?.ruleText,
            ruleTextC:res.data?.content?.ruleTextC,
            shoperLimitAll:res.data?.content?.shoperLimitAll,
            shoperLimitOnece:res.data?.content?.shoperLimitOnece,
            price:res.data?.content?.price,
            buyerType:res.data?.content?.buyerType,
            buyerTimeType:res.data?.content?.buyerTimeType,
            timeRange: res.data?.content?.buyerTimeType==0?[]:[moment(res.data?.content?.buyerStartTime, 'HH:mm:ss'),moment(res.data?.content?.buyerEndTime, 'HH:mm:ss') ],
            ...res.data
          })
      })
    }
  }, [loading])
  const onsubmit = (values) => {
    if(id){
      let arr=goosList||detailList
      var result = [];//追加的数据
      for(var i = 0; i < goosList?.length; i++){
          var obj = goosList[i];
          var num = obj.wsId;
          var isExist = false;
          for(var j = 0; j < detailList?.length; j++){
              var aj = detailList[j];
              var n = aj.wsId;
              if(n == num){
                  isExist = true;
                  break;
              }
          }
          if(!isExist){
              result.push(obj);
          }
      }

      let stockNum=false
      var flage=false
      for (let index = 0; index < arr?.length; index++) {
          if(arr[index]?.actStockNum%arr[index]?.batchNumber!==0){
            flage=true
          }
      }

      for (let index = 0; index < result?.length; index++) {
        if(result[index]?.actStockNum==0){
          stockNum=true
        }
      }

      if(stockNum){
        return message.error('活动库存为零！')
      }
      if(flage){
        return message.error('请输入箱规单位量整倍数')
      }
    }else{
      let stockNum=false
      var flage=false
      for (let index = 0; index < goosList?.length; index++) {
          if(goosList[index]?.actStockNum==0){
            stockNum=true
          }
          if(goosList[index]?.actStockNum%goosList[index]?.batchNumber!==0){
            flage=true
          }
      }
      if(flage){
        return message.error('请输入箱规单位量整倍数')
      }
      if(stockNum){
        return message.error('活动库存为零！')
      }
    }
      const parmas={
        ...values,
        id:id?id:0,
        startTime:moment(values.dateRange[0]).valueOf()/1000,
        endTime:moment(values.dateRange[1]).valueOf()/1000,
        buyerStartTime:values.buyerTimeType==0?'00:00:00':values.timeRange[0],
        buyerEndTime:values.buyerTimeType==0?'23:59:59':values.timeRange[1],
        joinShopType:values.joinShopType[0],
        joinAgainPercent:amountTransform(values.joinAgainPercent,'/'),
        goods:goosList?.map(ele=>({
          skuId:ele.skuId,
          spuId:ele.spuId,
          wsId:ele.wsId,
          price:amountTransform(ele.price,'*'),
          status:ele.status,
          buyLimit:ele.maxNum,
          wholesaleFreight:ele.wholesaleFreight,
          actStockNum:ele.actStockNum
        }))||detailList,
        buyerLimit:values.buyerType==0?999999:values.buyerLimit,
        status:1,
      }
      saveWSDiscountActiveConfig(parmas).then(res=>{
        if(res.code==0){
          message.success(id?'编辑成功':'添加成功'); 
          callback(true)
          setFormVisible(false)
        }
      })
  }

  const disabledDate=(current)=>{
    return current && current < moment().startOf('day');
  }
  return (
      <DrawerForm
        title={id?'编辑活动':'新建活动'}
        onVisibleChange={setFormVisible}
        visible={formVisible}
        form={form}
        width={1500}
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
                <Button style={{marginLeft:'100px'}} type="primary" key="submit" onClick={() => {
                  props.form?.submit?.()
                }}>
                  确定
                </Button>,
                <Button  type="default" key="goback" onClick={() => {
                  setFormVisible(false)
                  onClose()
                }}>
                  返回
                </Button>
              ];
            }
          }
        }
        onFinish={async (values) => {
            await onsubmit(values);
        }
        }
        className={styles.add_activity}
        {...formItemLayout}
      >
        <ProFormText
          width="md"
          name="name"
          label='活动名称'
          placeholder='请输入活动名称'
          rules={[
            { required: true, message: '请输入活动名称' },
            { validator: activityName }
          ]}
        />
        
        <ProFormDateTimeRangePicker
          label='活动时间'
          rules={[{ required: true, message: '请选择活动时间' }]}
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
        />
        <ProFormRadio.Group
          name="buyerType"
          label='C端可购买数量'
          rules={[
            { required: true, message: '请选择限领方式' }
          ]}
          options={[
            {
              label: <ProFormDependency name={['buyerType']}>
                {
                  ({ buyerType }) => (
                    <ProFormText 
                      rules={[ { required: buyerType==0?false:true, message: '请填写购买数量' },{ validator: checkConfirm2 }]}   
                      name="buyerLimit" 
                      fieldProps={{addonAfter:'每人/每天'}}
                    />
                  )
                }
                </ProFormDependency> , value: 1
            },
            {
              label: '不限', value: 0
            }
          ]}
          initialValue={1}
         />
        <ProFormRadio.Group
          name="buyerTimeType"
          label='C端可购买时间'
          rules={[{ required: true, message: '请选择限领方式' }]}
          options={[
            {
              label: <ProFormDependency name={['buyerTimeType']}>
                {
                  ({ buyerTimeType }) => (
                   <ProFormTimePicker.RangePicker rules={[ { required:buyerTimeType==0?false:true, message: '请选择时间区间' }]} name="timeRange" extra='（控件只可选24小时区间）'/>
                  )
                }
                </ProFormDependency>
                , value: 1
            },
            {
              label: '不限', value: 0
            }
          ]}
          initialValue={1}
        />
        <ProFormCheckbox.Group
          name="joinShopType"
          label="参与活动的店铺"
          options={[
            {
              label: '生鲜店铺',
              value: 1,
            },
          ]}
          disabled
          rules={[{ required: true, message: '请选择参与活动的店铺' }]}
          initialValue={[1]}
        />
        <ProFormRadio.Group
          name="joinBuyerType"
          label="参与活动的消费者"
          options={[
            {
              label: '全部消费者',
              value: 1,
            },
            {
              label: '从未下过单的消费者（新人）',
              value: 2,
            },
          ]}
          rules={[{ required: true, message: '请选择参与活动的消费者' }]}
          initialValue={1}
        />
         <GoosSet
          detailList={detailList}
          id={id} 
          callback={(val)=>{
            setGoosList(val)
          }}
          callLoading={()=>{
            const time=+new Date()
            setLoading(time)
          }}
        />
         <ProFormTextArea
          label='店主活动规则'
          name="ruleText"
          style={{ minHeight: 32, marginTop: 15 }}
          placeholder='请输入5-1000个字符'
          rules={[
            { required: true, message: '请备注使用规则' },
            { validator: checkConfirm5 }
          ]}
          rows={4}
          fieldProps={{
            maxLength:1000
          }}
        />
         <ProFormTextArea
          label='消费者活动规则'
          name="ruleTextC"
          style={{ minHeight: 32, marginTop: 15 }}
          placeholder='请输入5-1000个字符'
          rules={[
            { required: true, message: '请备注使用规则' },
            { validator: checkConfirm5 }
          ]}
          rows={4}
          fieldProps={{
            maxLength:1000
          }}
        />
      </DrawerForm>
  );
};
