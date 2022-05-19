import { useState, useEffect } from 'react';
import { Form, message, Button } from 'antd';
import { formatMessage } from 'umi';
import CouponType from './coupon-type/coupon-type'
import UseScope from './use-scope/use-scope'
import PeriodValidity from './period-validity/period-validity'
import AssignCrowd from './assign-crowd/assign-crowd'
import { couponSub } from '@/services/coupon-construction/coupon-coupon-sub';
import { couponEdit } from '@/services/coupon-construction/coupon-edit';
import ProForm, { ProFormText, ProFormRadio, ProFormDateTimeRangePicker,ProFormTextArea,ProFormDependency,ProFormSelect,DrawerForm } from '@ant-design/pro-form';
import { history, connect } from 'umi';
import moment from 'moment';
import styles from './style.less'
import IssueTypeModel from './issue-type-model'
import AddressMultiCascader from '@/components/address-multi-cascader'
import { PageContainer } from '@/components/PageContainer';
import { getWholesaleArea } from '@/services/intensive-activity-management/intensive-activity-list'
import { flatMap } from 'lodash';
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

const couponConstruction = (props) => {
  const { dispatch, DetailList, UseScopeList,setFormVisible,formVisible,onClose,callback,id,type } = props
  const DetaiIssueType=DetailList.data?.issueType
  const [choose, setChoose] = useState()
  const [submitType, setSubmitType] = useState()
  const [publishType,setPublishType]=useState()
  const [visible, setVisible] = useState(false);
  const [areaData, setAreaData] = useState([]);
  const [addType,setAddType]=useState(null)
  const [types,setTyepes]=useState()
  const [form] = Form.useForm()
  useEffect(()=>{
    if(addType){
      setTyepes(addType)
    }else{
      setTyepes(type)
    }

  },[type,addType])
  useEffect(() => {
    if (id) {
      setTimeout(() => {
        form.setFieldsValue({
          dateRange: [moment(DetailList.data?.limitStartTime).valueOf(), moment(DetailList.data?.limitEndTime).valueOf()],
          dateTimeRange: DetailList.data?.activityStartTime?[moment(DetailList.data?.activityStartTime).valueOf(), moment(DetailList.data?.activityEndTime).valueOf()]:null,
          ...DetailList.data
        })
      }, 1000)
    } else {
      dispatch({
        type: 'UseScopeList/fetchUseScopeList',
        payload: {
          UseScopeObje: {}
        }
      })
    }
    //判断发行方式
    if(types==1){
      setPublishType('会员领取红包')
    }else if(types==2){
      setPublishType('系统发放红包')
    }else if(types==3){
      setPublishType('每日红包')
    }else if(types==4){
      setPublishType('邀请好友红包')
    }else if(types==5){
      setPublishType('生鲜板块新人红包')
    }
  }, [types])
  //红包名称验证规则
  const checkConfirm = (rule, value, callback) => {
    return new Promise(async (resolve, reject) => {
      if (value && value.length > 50) {
        await reject('红包名称不超过50个字符')
      } else if (value&&/[^\u4e00-\u9fa5\0-9]/.test(value)) {
        await reject('只能输入汉字')
      } else {
        await resolve()
      }
    })
  }
  
  const onsubmit = (values) => {
      values.issueType=parseInt(types)|| id&&DetaiIssueType//发放类型
      const parmas={
        ...values,
        couponTypeInfo : {
          usefulAmount: parseInt(values.usefulAmount),//用价格门槛(单位分)
          freeAmount: values.freeAmount,//优惠金额(单位分)
          unit: values.unit,//单位
          usefulNum: parseInt(values.usefulNum),//用件数门槛
          freeDiscount: values.freeDiscount,//折扣
          maxFreeAmount: values.maxFreeAmount,//最多优惠（单位分）
        },
        issueQuantity : parseInt(values.issueQuantity),//发行量
        limitStartTime : values?.dateRange?.[0],//可领取开始时间
        limitEndTime :  values?.dateRange?.[1],//可领取结束时间
        limitQuantity : parseInt(values.limitQuantity),//限领数量
        limitType : values.issueType==3?2:values.issueType==4?1:values.limitType,//限领类型
        issueQuantityType : values.issueType==2?1: values.issueQuantityType,//发行量类型
        activityStartTime :  values?.dateTimeRange?.[0],//有效期开始时间
        activityEndTime :  values?.dateTimeRange?.[1],//有效期结束时间
        activityStartDay : parseInt(values.activityStartDay),//有效期开始天数
        activityEndDay : parseInt(values.activityEndDay),//有效期结束天数
        useTypeInfoM : {//秒约商品详情信息
          goodsType: types==3||DetaiIssueType == 3 && id||types==4||DetaiIssueType == 4 && id?2:values.goodsType,
          spuIds: UseScopeList.UseScopeObje.spuIds,
          classId: parseInt(UseScopeList.UseScopeObje.unit)
        },
        couponCrowdId : UseScopeList.UseScopeObje.CrowdIds,
        memberType : parseInt(values.memberType),
        couponVerifyStatus : submitType
      }
    if (id) {
      couponEdit({ ...parmas, id: id }).then((res) => {
        if (res.code == 0) {
          if(submitType==3){
            message.success('编辑成功');
            callback(true)
            setFormVisible(false)
            dispatch({
              type: 'DetailList/fetchLookDetail',
              payload: {
                id
              }
            })
          }else{
            callback(true)
            setFormVisible(false)
            message.success('编辑成功');
          }
          dispatch({
            type: 'UseScopeList/fetchUseScopeList',
            payload: {
              UseScopeObje: {}
            }
          })
        }
      })
    } else {
      couponSub(parmas).then((res) => {
        if (res.code == 0) {
          callback(true)
          setFormVisible(false)
          message.success('提交成功');
          dispatch({
            type: 'UseScopeList/fetchUseScopeList',
            payload: {
              UseScopeObje: {}
            }
          })
        }
      })
    }

  }

  const disabledDate=(current)=>{
    return current && current < moment().startOf('day');
  }
  const getUncheckableItemValues = () => {
    const data = JSON.parse(JSON.stringify(window.yeahgo_area))
    data.unshift({ name: '全国', id: 0, pid: -1 })
    console.log('data'.data)
    setAreaData(data)
  }

  useEffect(() => {
    getUncheckableItemValues();
  }, [])


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
                <Button style={{marginLeft:'80px'}} type="primary" key="submit" onClick={() => {
                  props.form?.submit?.()
                  setSubmitType(1)
                }}>
                  保存
                </Button>,
                <Button type="primary" key="submitaudit" onClick={() => {
                  props.form?.submit?.()
                  setSubmitType(3)
                }}>
                  提交审核
                </Button>,
                <Button type="default" key='goback' onClick={() => { onClose();setFormVisible(false)}}>
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
        className={styles.discountFrom}
      {...formItemLayout}
    >
        <p className={styles.head}><span style={{borderBottom:'5px solid #666666'}}>基本信息</span></p>
        {
          !id&& <ProFormText
          width="md"
          name="couponName"
          label='发行方式'
          fieldProps={{
            value:publishType,
          }}
          readonly
          extra={ <a onClick={()=>{setVisible(true)}}>修改红包类型</a>}
        />
        }

        {/* 红包名称 */}
        <ProFormText
          width="md"
          name="couponName"
          label='红包名称'
          rules={[
            { required: true, message: '请输入红包名称' },
            { validator: checkConfirm }
          ]}
        />

        {/* 红包类型 */}
        <CouponType id={id} type={types}/>


        {/* 每人限领 */}
         {
           types==3||DetaiIssueType == 3 && id?
           <ProFormText
            width={120}
            label="每人限领"
            readonly
            name="limitQuantity"
            fieldProps={{
              value:'1张/天'
            }}
            initialValue="1"
           />
           :null
         }

         {
           types==1||DetaiIssueType == 1 && id||types==2||DetaiIssueType == 2 && id?
            <>
            <ProFormRadio.Group
              name="limitType"
              label='每人限领'
              rules={[{ required: true, message: '请选择限领方式' }]}
              options={[
                {
                  label: '限领', value: 2
                }]}
            />
              <ProFormDependency name={['limitType']}>
                {({ limitType }) => {
                    if (!limitType) return null;
                    return ( 
                      <div className={styles.unfold}>
                        <ProForm.Group>
                          <ProFormText
                            width={120}
                            name="limitQuantity"
                          />
                          <span>张</span>
                        </ProForm.Group>
                    </div>
                    );
                }}
              </ProFormDependency>
          </>
          :null
         }
        

        {/* 可领取时间 */}
        {
          types==1||DetaiIssueType == 1 && id||types==3||DetaiIssueType == 3 && id||types==4||DetaiIssueType == 4 && id?
            <ProFormDateTimeRangePicker
              label='可领取时间'
              rules={[{ required: true, message: '请选择限领时间' }]}
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
            :null
        }

        {/* 有效期 */}
        <PeriodValidity  id={id} type={types}/>

       {
         types==3||DetaiIssueType == 3 && id?
          <ProFormText
            width={120}
            label="可领条件"
            readonly
            fieldProps={{
              value:'每日首次下单成功'
          }}
        />
        :null
       }
       
       {
         types==4||DetaiIssueType == 4 && id?
          <ProFormText
            width={120}
            label="可领条件"
            readonly
            fieldProps={{
              value:'邀请好友'
          }}
        />
        :null
       }

        {/* 可领红包群体 */}
        <AssignCrowd id={id} type={types} callback={(current)=>setChoose(current)} />

        {/* {
          types==5||DetaiIssueType == 5 && id?
          <ProForm.Item
            name='allowArea'
            label="可领红包区域"
            rules={[{required: true, message: '请选择所在地区'}]}
          >
          <AddressMultiCascader
            data={areaData}
            style={{ width: '640px' }}
            pId={-1}
            placeholder="请选择可领取红包的用户区域"
          />
        </ProForm.Item>
        :null
        } */}


        <p className={styles.head}><span style={{borderBottom:'5px solid #666666'}}>使用设置</span></p>

        {/* 使用范围 */}
        <UseScope id={id} type={types} choose={choose} form={form}/>
   
        {/*使用说明 */}
        <ProFormTextArea
          label='使用说明'
          name="couponRule"
          style={{ minHeight: 32, marginTop: 15 }}
          placeholder='列如红包适用商品、使用限制等信息'
          rules={[{ required: true, message: '请备注使用规则' }]}
          rows={4}
          fieldProps={{
            maxLength:1000
          }}
        />

        {
          visible&&<IssueTypeModel 
          visible={visible} 
          setVisible={setVisible} 
          callback={(val)=>{setAddType(val)}}
          />
        }
      </DrawerForm>
  );
};

export default connect(({ DetailList, UseScopeList }) => ({
  DetailList,
  UseScopeList
}))(couponConstruction);
