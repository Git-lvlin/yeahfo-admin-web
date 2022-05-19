import React, { useState, useEffect, useRef } from 'react'
import { PageContainer } from '@/components/PageContainer';
import ProForm,{
  ModalForm,
  ProFormText,
  ProFormRadio,
  ProFormTextArea
} from '@ant-design/pro-form'
import ProTable from '@ant-design/pro-table'
import { Form, Space } from 'antd'

import { freshApplyPage, approve, refuse, detail } from '@/services/intensive-store-management/fresh-store-review'
import AddressCascader from '@/components/address-cascader'
import Upload from '@/components/upload'
import styles from './styles.less'

const FormWrap = ({ value, onChange, content, top }) => (
  <div style={{ position:'relative' }}>
    <div style={{ display: 'flex' }}>{content(value, onChange)}</div>
    <div style={{ position: 'absolute', top: -20, minWidth: 180 }}>{top?.(value)}</div>
  </div>
)

const Apply = ({visit, onVisibleChange, id, actRef}) => {
  const [checked, setChecked] = useState(0)
  const [data, setData] = useState(null)

  const [form] = Form.useForm()

  useEffect(()=>{
    detail({applyId: id}).then(res => {
      if(res?.success) {
        setData(res.data)
      }
    })
  }, [id])
  
  useEffect(()=>{
    data?.details?.isOrdered === 0 ?
    form.setFieldsValue({
      applyId: data?.id,
      storeName: data?.storeName,
      storeAddress: data?.provinceName + data?.cityName + data?.regionName + data?.address,
      condition: data?.details?.attachList
    }) :
    form.setFieldsValue({
      applyId: data?.id,
      storeName: data?.storeName,
      storeAddress: data?.provinceName + data?.cityName + data?.regionName + data?.address
    })
    return undefined
  }, [data])

  const orderStatus = (v) => {
    switch(v) {
      case 1: 
        return '待付款'
      case 2: 
        return '待发货'
      case 3: 
        return '已发货'
      case 4: 
        return '已完成'
      case 5: 
        return '已关闭'
    }
  }

  const submitForm = (v) => {
    if(v?.result === 1) {
      approve({
        applyId: v.applyId
      },{
        showSuccess: true,
        showError: true
      }).then(res => {
        if(res.success) {
          actRef.current.reload()
        }
      })
    } else {
      refuse({
        applyId: v.applyId,
        auditMsg: v.auditMsg
      },{
        showSuccess: true,
        showError: true
      }).then(res => {
        if(res.success) {
          actRef.current.reload()
        }
      })
    }
  }
  
  return (
    <ModalForm
      title="审核生鲜店铺申请"
      modalProps={{
        destroyOnClose: true
      }}
      visible={visit}
      onVisibleChange={onVisibleChange}
      form={form}
      width={500}
      layout='horizontal'
      onFinish={async (values) => {
        await submitForm(values)
        return true
      }}
    >
      <ProFormText
        name="applyId"
        width="md"
        hidden
      />
      <ProFormText
        name="storeName"
        width="md"
        label="店铺名称"
        readonly
      />
      <ProFormText
        name="storeAddress"
        width="md"
        label="店铺地址"
        readonly
      />
      <ProForm.Item
        name="condition"
        label="配套条件"
      >
        {
          data?.details?.isOrdered === 0 ?
          <FormWrap 
            content={(value)=><Upload value={value} disabled/>}
            top={()=> '已有生鲜柜'}
          /> :
          <>
            <div>已购买平台生鲜柜</div>
            <div>订单号：{data?.details?.order?.orderSn}</div>
            <div>订单状态：{orderStatus(data?.details?.order?.status)}</div>
          </>
        }
      </ProForm.Item>
      {
        data?.details?.giftOrder?.isGiftOrdered === 1 ?
        <ProForm.Item
          label="礼包订单"
        >
          <div>订单号：{data?.details?.giftOrder?.orderSn}</div>
          <div>订单状态：{orderStatus(data?.details?.giftOrder?.status)}</div>
        </ProForm.Item>:
        <ProForm.Item
          label="礼包订单"
        >
          没有购买记录
        </ProForm.Item>
      }
      <ProFormRadio.Group
        name="result"
        label="审核结果"
        rules={[{required: true, message: '请选择审核结果'}]}
        options={[
          {
            label: '通过',
            value: 1
          },
          {
            label: '拒绝',
            value: 2
          }
        ]}
        fieldProps={{
          onChange: (v)=>{
            setChecked(v.target.value)
          }
        }}
      />
      {
        checked === 2&&
        <ProFormTextArea
          name="auditMsg"
          label="拒绝原因"
          rules={[{required: true, message: '请输入拒绝原因'}]}
          placeholder='请输入拒绝原因'
        />
      }
    </ModalForm>
  )
}

const Detail = ({visit, onVisibleChange, id}) => {
  const [data, setData] = useState(null)
  const [form] = Form.useForm()

  useEffect(()=>{
    detail({applyId: id}).then(res => {
      if(res?.success) {
        setData(res.data)
      }
    })
  }, [id])
  
  useEffect(()=>{
    form.setFieldsValue({
      applyId: data?.id,
      storeName: data?.storeName,
      storeAddress: data?.provinceName + data?.cityName + data?.regionName + data?.address,
      optAdminName: data?.optAdminName,
      condition: data?.details?.isOrdered === 0 ? data?.details?.attachList : '',
      result: data?.verifyStatusCode,
      optAdminName: data?.optAdminName,
      auditTime: data?.auditTime
    })
    return undefined
  }, [data])

  const orderStatus = (v) => {
    switch(v) {
      case 1: 
        return '待付款'
      case 2: 
        return '待发货'
      case 3: 
        return '已发货'
      case 4: 
        return '已完成'
      case 5: 
        return '已关闭'
    }
  }
  
  return (
    <ModalForm
      title="生鲜店铺详情"
      modalProps={{
        destroyOnClose: true
      }}
      visible={visit}
      onVisibleChange={onVisibleChange}
      form={form}
      width={500}
      layout='horizontal'
      onFinish={() => true}
    >
      <ProFormText
        name="applyId"
        width="md"
        hidden
      />
      <ProFormText
        name="storeName"
        width="md"
        label="店铺名称"
        readonly
      />
      <ProFormText
        name="storeAddress"
        width="md"
        label="店铺地址"
        readonly
      />
      <ProForm.Item
        name="condition"
        label="配套条件"
      >
        {
          data?.details?.isOrdered === 0 ?
          <FormWrap 
            content={(value)=><Upload value={value} disabled/>}
            top={()=> '已有生鲜柜'}
          /> :
          <>
            <div>已购买平台生鲜柜</div>
            <div>订单号：{data?.details?.order?.orderSn}</div>
            <div>订单状态：{orderStatus(data?.details?.order?.status)}</div>
          </>
        }
      </ProForm.Item>
      {
        data?.details?.giftOrder?.isGiftOrdered === 1 ?
        <ProForm.Item
          label="礼包订单"
        >
          <div>订单号：{data?.details?.giftOrder?.orderSn}</div>
          <div>订单状态：{orderStatus(data?.details?.giftOrder?.status)}</div>
        </ProForm.Item>:
         <ProForm.Item
          label="礼包订单"
        >
          没有购买记录
        </ProForm.Item>
      }
      <ProFormRadio.Group
        name="result"
        label="审核结果"
        readonly
        options={[
          {
            label: '未申请',
            value: 0
          },
          {
            label: '审核通过',
            value: 1
          },
          {
            label: '审核拒绝',
            value: 2
          },
          {
            label: '审核取消',
            value: 5
          },
          {
            label: '待审核',
            value: 6
          }
        ]}
      />
      <ProFormText
        name="optAdminName"
        width="md"
        label="审核人"
        readonly
      />
      <ProFormText
        name="auditTime"
        width="md"
        label="审核时间"
        readonly
      />
    </ModalForm>
  )
}

const FreshStoreReview = () => {
  const [modalVisit, setModalVisit] = useState(false)
  const [detailVisit, setDetailVisit] = useState(false)
  const [data, setData] = useState(null)
  const [applyId, setApplyId] = useState(null)
  const actionRef = useRef()

  const columns = [
    {
      dataIndex: 'storeId',
      title: '店铺ID',
      align: 'center',
      hideInSearch: true
    },
    {
      dataIndex: 'storeName',
      title: '店铺名称',
      align: 'center'
    },
    {
      dataIndex: 'memberPhone',
      title: '店主手机号',
      align: 'center',
      hideInSearch: true
    },
    {
      dataIndex: 'phone',
      title: '店主手机号',
      align: 'center',
      hideInTable: true
    },
    {
      dataIndex: 'realname',
      title: '店主姓名',
      align: 'center',
      hideInSearch: true
    },
    {
      dataIndex: 'communityName',
      title: '店铺提货点所在地区',
      align: 'center',
      hideInSearch: true,
      render: (_, records) => <>{records?.provinceName}{records?.cityName}{records?.regionName}</>
    },
    {
      dataIndex: 'area',
      title: '所在地区',
      align: 'center',
      hideInTable: true,
      renderFormItem: () => <AddressCascader/>
    },
    {
      dataIndex: 'address',
      title: '店铺提货点详细地址',
      align: 'center',
      hideInSearch: true
    },
    {
      dataIndex: 'createTime',
      title: '申请时间',
      align: 'center',
      hideInSearch: true
    },
    {
      dataIndex: 'verifyStatusCode',
      title: '审核状态',
      align: 'center',
      valueEnum: {
        '0': '未申请',
        '1': '审核通过',
        '2': '审核拒绝',
        '5': '取消申请',
        '6': '待审核'
      }
    },
    {
      valueType: 'option',
      title: '操作',
      align: 'center',
      render: (_, records) => {
        return (
          <Space>
            {
              records.verifyStatusCode === 6?
              <a onClick={() => {setModalVisit(true); setData(records?.id)}}>审核</a>:
              <span className={styles.disabled}>审核</span>
            }
            <a onClick={() => {setDetailVisit(true); setApplyId(records?.id)}}>详情</a>
          </Space>
        )
      }
    }
  ]
  return (
    <PageContainer title={false}>
      <ProTable
        rowKey='storeId'
        actionRef={ actionRef }
        columns={columns}
        pagination={{
          showQuickJumper: true,
          pageSize: 10
        }}
        params={{}}
        request={freshApplyPage}
        bordered
        search={{
          labelWidth: 120,
          optionRender: (searchConfig, formProps, dom) => [
            ...dom.reverse()
          ]
        }}
        toolbar={{
          settings: false
        }}
      />
      {
        modalVisit&&
        <Apply
          visit={modalVisit}
          onVisibleChange={setModalVisit}
          id={data}
          actRef={actionRef}
        />
      }
       {
        detailVisit&&
        <Detail
          visit={detailVisit}
          onVisibleChange={setDetailVisit}
          id={applyId}
        />
      }
    </PageContainer>
  )
}
export default FreshStoreReview
