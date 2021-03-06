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
    //??????????????????
    if(types==1){
      setPublishType('??????????????????')
    }else if(types==2){
      setPublishType('??????????????????')
    }else if(types==3){
      setPublishType('????????????')
    }else if(types==4){
      setPublishType('??????????????????')
    }else if(types==5){
      setPublishType('????????????????????????')
    }
  }, [types])
  //????????????????????????
  const checkConfirm = (rule, value, callback) => {
    return new Promise(async (resolve, reject) => {
      if (value && value.length > 50) {
        await reject('?????????????????????50?????????')
      } else if (value&&/[^\u4e00-\u9fa5\0-9]/.test(value)) {
        await reject('??????????????????')
      } else {
        await resolve()
      }
    })
  }
  
  const onsubmit = (values) => {
      values.issueType=parseInt(types)|| id&&DetaiIssueType//????????????
      const parmas={
        ...values,
        couponTypeInfo : {
          usefulAmount: parseInt(values.usefulAmount),//???????????????(?????????)
          freeAmount: values.freeAmount,//????????????(?????????)
          unit: values.unit,//??????
          usefulNum: parseInt(values.usefulNum),//???????????????
          freeDiscount: values.freeDiscount,//??????
          maxFreeAmount: values.maxFreeAmount,//???????????????????????????
        },
        issueQuantity : parseInt(values.issueQuantity),//?????????
        limitStartTime : values?.dateRange?.[0],//?????????????????????
        limitEndTime :  values?.dateRange?.[1],//?????????????????????
        limitQuantity : parseInt(values.limitQuantity),//????????????
        limitType : values.issueType==3?2:values.issueType==4?1:values.limitType,//????????????
        issueQuantityType : values.issueType==2?1: values.issueQuantityType,//???????????????
        activityStartTime :  values?.dateTimeRange?.[0],//?????????????????????
        activityEndTime :  values?.dateTimeRange?.[1],//?????????????????????
        activityStartDay : parseInt(values.activityStartDay),//?????????????????????
        activityEndDay : parseInt(values.activityEndDay),//?????????????????????
        useTypeInfoM : {//????????????????????????
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
            message.success('????????????');
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
            message.success('????????????');
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
          message.success('????????????');
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
    data.unshift({ name: '??????', id: 0, pid: -1 })
    console.log('data'.data)
    setAreaData(data)
  }

  useEffect(() => {
    getUncheckableItemValues();
  }, [])


  return (
      <DrawerForm
        title={id?'????????????':'????????????'}
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
                  ??????
                </Button>,
                <Button type="primary" key="submitaudit" onClick={() => {
                  props.form?.submit?.()
                  setSubmitType(3)
                }}>
                  ????????????
                </Button>,
                <Button type="default" key='goback' onClick={() => { onClose();setFormVisible(false)}}>
                  ??????
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
        <p className={styles.head}><span style={{borderBottom:'5px solid #666666'}}>????????????</span></p>
        {
          !id&& <ProFormText
          width="md"
          name="couponName"
          label='????????????'
          fieldProps={{
            value:publishType,
          }}
          readonly
          extra={ <a onClick={()=>{setVisible(true)}}>??????????????????</a>}
        />
        }

        {/* ???????????? */}
        <ProFormText
          width="md"
          name="couponName"
          label='????????????'
          rules={[
            { required: true, message: '?????????????????????' },
            { validator: checkConfirm }
          ]}
        />

        {/* ???????????? */}
        <CouponType id={id} type={types}/>


        {/* ???????????? */}
         {
           types==3||DetaiIssueType == 3 && id?
           <ProFormText
            width={120}
            label="????????????"
            readonly
            name="limitQuantity"
            fieldProps={{
              value:'1???/???'
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
              label='????????????'
              rules={[{ required: true, message: '?????????????????????' }]}
              options={[
                {
                  label: '??????', value: 2
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
                          <span>???</span>
                        </ProForm.Group>
                    </div>
                    );
                }}
              </ProFormDependency>
          </>
          :null
         }
        

        {/* ??????????????? */}
        {
          types==1||DetaiIssueType == 1 && id||types==3||DetaiIssueType == 3 && id||types==4||DetaiIssueType == 4 && id?
            <ProFormDateTimeRangePicker
              label='???????????????'
              rules={[{ required: true, message: '?????????????????????' }]}
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

        {/* ????????? */}
        <PeriodValidity  id={id} type={types}/>

       {
         types==3||DetaiIssueType == 3 && id?
          <ProFormText
            width={120}
            label="????????????"
            readonly
            fieldProps={{
              value:'????????????????????????'
          }}
        />
        :null
       }
       
       {
         types==4||DetaiIssueType == 4 && id?
          <ProFormText
            width={120}
            label="????????????"
            readonly
            fieldProps={{
              value:'????????????'
          }}
        />
        :null
       }

        {/* ?????????????????? */}
        <AssignCrowd id={id} type={types} callback={(current)=>setChoose(current)} />

        {/* {
          types==5||DetaiIssueType == 5 && id?
          <ProForm.Item
            name='allowArea'
            label="??????????????????"
            rules={[{required: true, message: '?????????????????????'}]}
          >
          <AddressMultiCascader
            data={areaData}
            style={{ width: '640px' }}
            pId={-1}
            placeholder="???????????????????????????????????????"
          />
        </ProForm.Item>
        :null
        } */}


        <p className={styles.head}><span style={{borderBottom:'5px solid #666666'}}>????????????</span></p>

        {/* ???????????? */}
        <UseScope id={id} type={types} choose={choose} form={form}/>
   
        {/*???????????? */}
        <ProFormTextArea
          label='????????????'
          name="couponRule"
          style={{ minHeight: 32, marginTop: 15 }}
          placeholder='????????????????????????????????????????????????'
          rules={[{ required: true, message: '?????????????????????' }]}
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
