import React, { useState, useEffect,useRef } from 'react';
import { Input, Form, Divider, message, Button,Space } from 'antd';
import { FormattedMessage, formatMessage } from 'umi';
import ProTable from '@ant-design/pro-table';
import ProForm, { ProFormText,ProFormDateTimeRangePicker,ProFormTextArea,ProFormCheckbox,ProFormRadio,DrawerForm } from '@ant-design/pro-form';
import { history, connect } from 'umi';
import { amountTransform } from '@/utils/utils'
import { saveWSCentActiveConfig,getActiveConfigById } from '@/services/intensive-activity-management/penny-activity';
import moment, { now } from 'moment';
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
  const [goosList,setGoosList]=useState()
  const [visible, setVisible] = useState(false);
  const [limitAll,setLimitAll]=useState(200)
  const [batchPrice,setBatchPrice]=useState()
  const [loading,setLoading]=useState(false)
  const [form] = Form.useForm()
  useEffect(() => {
    if (id) {
      getActiveConfigById({id}).then(res=>{
        if(res.data?.endTime<res.data?.time){
          message.error('活动已结束！'); 
          setFormVisible(false)
          onClose()
          return false
        }
        setLimitAll(res.data?.content?.shoperLimitAll)
        setDetailList(res.data)
        form.setFieldsValue({
            dateRange: [moment(res.data?.startTime*1000).valueOf(), moment(res.data?.endTime*1000).valueOf()],
            buyerLimit:res.data?.content?.buyerLimit,
            joinAgainPercent:amountTransform(res.data?.content?.joinAgainPercent,'*'),
            joinBuyerType:res.data?.content?.joinBuyerType,
            joinShopType:[res.data?.content?.joinShopType],
            ruleText:res.data?.content?.ruleText,
            ruleTextC:res.data?.content?.ruleTextC,
            shoperLimitAll:res.data?.content?.shoperLimitAll,
            shoperLimitOnece:res.data?.content?.shoperLimitOnece,
            price:amountTransform(res.data?.content?.price,'/'),
            ...res.data
          })
      })
    }
  }, [loading])
  const activityName = (rule, value, callback) => {
    return new Promise(async (resolve, reject) => {
      if (value&&/[%&',;=?$\x22]/.test(value)) {
        await reject('不可以含特殊字符')
      } else {
        await resolve()
      }
    })
  }
  const checkConfirm=(rule, value, callback)=>{
    return new Promise(async (resolve, reject) => {
    if (value&&value<0.01||value>99999.99) {
        await reject('0.01-99999.99之间数字')
    }else if (value&&`${value}`?.split?.('.')?.[1]?.length > 2) {
      await reject('保留2位小数')
    }else if (value&&value.length>0&&!/^[0-9]+([.]{1}[0-9]+){0,1}$/.test(value)&&value!=0) {
        await reject('只能输入小数和整数')
    }else {
        await resolve()
    }
    })
  }

  const checkConfirm2=(rule, value, callback)=>{
    return new Promise(async (resolve, reject) => {
    if (value&&parseInt(value)<1||parseInt(value)>999999) {
        await reject('1-999999之间整数')
    }else if (value&&value.length>0&&!/^[0-9]*[1-9][0-9]*$/.test(value)&&value!=0) {
        await reject('只能输入整数')
    }else {
        await resolve()
    }
    })
  }

  const checkConfirm3=(rule, value, callback)=>{
    return new Promise(async (resolve, reject) => {
    if (value&&parseInt(value)>parseInt(limitAll)) {
      await reject('小于等于店主总限量')
    }else if (value&&value.length>0&&!/^[0-9]*[1-9][0-9]*$/.test(value)&&value!=0) {
      await reject('只能输入整数')
    }else {
      await resolve()
    }
    })
  }

  const checkConfirm4=(rule, value, callback)=>{
    return new Promise(async (resolve, reject) => {
    if (value&&value<0||value>100) {
        await reject('0-100之间整数')
    }else if (value&&value.length>0&&!/^[0-9]*[1-9][0-9]*$/.test(value)&&value!=0) {
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

  const onsubmit = (values) => {
    if(id){
      let arr=goosList||detailList?.content?.goods
      var max=arr[0]?.minNum
      let stockNum=false
      var flage=false

      var result = [];//追加的数据
      for(var i = 0; i < goosList?.length; i++){
          var obj = goosList[i];
          var num = obj.wsId;
          var isExist = false;
          for(var j = 0; j < detailList?.content?.goods?.length; j++){
              var aj = detailList?.content?.goods[j];
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

      for (let index = 0; index < result?.length; index++) {
        if(result[index]?.actStockNum==0){
          stockNum=true
        }
      }

      for (let index = 0; index < arr.length; index++) {
          if(max<arr[index]?.minNum){
            max=arr[index]?.minNum
          }
          if(arr[index]?.actStockNum%arr[index]?.batchNumber!==0){
            flage=true
          }
      }
      if(stockNum){
        return message.error('活动库存为零！')
      }
      if(values.shoperLimitOnece<max){
        return message.error('每位店主单次限量不能小于集约单次限量的起订量！')
      }
      if(flage){
        return message.error('请输入箱规单位量整倍数')
      }
    }else{
      var max=goosList[0]?.minNum
      var flage=false
      let stockNum=false
      for (let index = 0; index < goosList.length; index++) {
          if(max<goosList[index]?.minNum){
            max=goosList[index]?.minNum
          }
          if(goosList[index]?.actStockNum%goosList[index]?.batchNumber!==0){
            flage=true
          }
          if(goosList[index]?.actStockNum==0){
            stockNum=true
          }
      }
      if(flage){
        return message.error('请输入箱规单位量整倍数')
      }
      if(values.shoperLimitOnece<max){
        return message.error('每位店主单次限量不能小于集约单次限量的起订量！')
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
        joinShopType:values.joinShopType[0],
        joinAgainPercent:amountTransform(values.joinAgainPercent,'/'),
        goods:goosList?.map(ele=>({
          skuId:ele.skuId,
          spuId:ele.spuId,
          wsId:ele.wsId,
          price:amountTransform(ele.price,'*'),
          status:ele.status,
          actStockNum:ele.actStockNum
        }))||detailList?.content?.goods,
        price:amountTransform(values.price,'*'),
        status:1,
      }
      saveWSCentActiveConfig(parmas).then(res=>{
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
                <Button style={{marginLeft:'250px'}} type="primary" key="submit" onClick={() => {
                  props.form?.submit?.()
                }}>
                  确定
                </Button>,
              ];
            }
          }
        }
        onFinish={async (values) => {
            await onsubmit(values);
        }
        }
        className={styles.added_activity}
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
          fieldProps={{
            maxLength:20
          }}
        />

        <ProFormText
          width="md"
          name="price"
          label='活动价'
          rules={[
            { required: true, message: '请输入活动价' },
            { validator: checkConfirm }
          ]}
          fieldProps={{
            addonAfter:"元",
            onChange:(e)=>{
              setBatchPrice(e.target.value)
            }
          }}
          extra={<p style={{color:'#D8BC2C'}}>一键设置所有活动商品的活动价</p>}
        />
        <ProFormText
          width="md"
          name="shoperLimitAll"
          label='每位店主总限量'
          rules={[
            { required: true, message: '请输入每位店主总限量' },
            { validator: checkConfirm2 }
          ]}
          fieldProps={{
            onChange:(e)=>{
              setLimitAll(e.target.value)
            }
          }}
          initialValue={200}
        />
        <ProFormText
          width="md"
          name="shoperLimitOnece"
          label='每位店主单次限量'
          rules={[
            { required: true, message: '请输入每位店主单次限量' },
            { validator: checkConfirm3 }
          ]}
          initialValue={50}
        />
        <ProFormText
          width="md"
          name="buyerLimit"
          label='每位消费者限量'
          rules={[
            { required: true, message: '请输入每位消费者限量' },
            { validator: checkConfirm3 }
          ]}
          initialValue={1}
        />
        <ProFormText
          width="md"
          name="joinAgainPercent"
          label='店主再次参与活动条件'
          rules={[
            { required: true, message: '请输入店主再次参与活动条件' },
            { validator: checkConfirm4 }
          ]}
          fieldProps={{
            addonBefore:'需完成已有推广任务',
            addonAfter:"%",
          }}
          initialValue={90}
        />

        <GoosSet
          detailList={detailList}
          id={id} 
          batchPrice={batchPrice}
          callback={(val)=>{
            setGoosList(val)
          }}
          callLoading={()=>{
            const time=+new Date()
            setLoading(time)
          }}
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
        <ProFormTextArea
          label='店主活动规则'
          name="ruleText"
          style={{ minHeight: 32, marginTop: 15 }}
          placeholder='请输入5-1000个字符'
          rules={[
            { required: true, message: '请备注店主活动规则' },
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
            { required: true, message: '请备注消费者活动规则' },
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
