import { useState, useRef } from 'react'
import ProTable from '@ant-design/pro-table';
import type { ProColumns } from '@ant-design/pro-table';
import { storeShareCommission } from '@/services/intensive-store-management/share-the-subsidy'
import { amountTransform } from '@/utils/utils'
import { PageContainer } from '@ant-design/pro-layout';
import Export from '@/pages/export-excel/export'
import type { ConsumerOrderPage } from "./data"
import ExportHistory from '@/pages/export-excel/export-history'
import ShareTheSubsidyOrder from './share-the-subsidy-order';


export default () => {
  const [visit, setVisit] = useState<boolean>(false)
  const [orderVisible, setOrderVisible] = useState<boolean>(false)
  const [orderDetail,setOrderDetail]=useState<ConsumerOrderPage>()
  const ref=useRef()
  const columns:ProColumns<ConsumerOrderPage>[]= [
    {
      title: '店主手机',
      dataIndex: 'storeMobile',
      valueType: 'text',
      fieldProps:{
        placeholder:'请输入用户手机'
      }, 
      order:2,
      hideInTable: true
    },
    {
      title: '店主手机',
      dataIndex: 'storeMobile',
      valueType: 'text',
      hideInSearch: true
    },
    {
      title: '总补贴金额（元）',
      dataIndex: 'totalShareCommission',
      valueType: 'text',
      hideInSearch : true,
      render:(_,data)=>{
          return <a onClick={()=>{setOrderVisible(true);setOrderDetail(data)}}>{amountTransform(_,'/').toFixed(2)}</a>
      }
    },
    {
      title: '总分享订单金额（元）',
      dataIndex: 'totalShareOrderAmount',
      valueType: 'text',
      hideInSearch: true,
      render:(_,data)=>{
          return <a onClick={()=>{setOrderVisible(true);setOrderDetail(data)}}>{amountTransform(_,'/').toFixed(2)}</a>
      }
    },
    {
      title: '总订单数',
      dataIndex: 'sumOrderCount',
      valueType: 'text',
      hideInSearch : true,
    },
    {
      title: '最近交易时间',
      dataIndex: 'lastCommissionTime',
      valueType: 'text',
      hideInSearch: true
    },
    {
      title: '店铺名称',
      dataIndex: 'storeName',
      valueType: 'text',
      fieldProps:{
        placeholder:'请输入店铺名称'
      }, 
      order:1
    },
    {
      title: '社区店ID',
      dataIndex: 'storeNo',
      valueType: 'text',
      fieldProps:{
        placeholder:'请输入店铺ID'
      }, 
      order:3
    },
    {
      title: '提货点地区',
      dataIndex: 'district',
      valueType: 'text',
      hideInSearch: true
    }
  ];
  const getFieldValue = (searchConfig) => {
    const {...rest}=searchConfig.form.getFieldsValue()
    return {
      ...rest,
    }
  }
  return (
    <PageContainer title=' '>
        <ProTable<ConsumerOrderPage>
          actionRef={ref}
          rowKey="storeNo"
          options={false}
          request={storeShareCommission}
          search={{
          defaultCollapsed: false,
          labelWidth: 100,
          optionRender: (searchConfig, formProps, dom) => [
            ...dom.reverse(),
            <Export
                key='export'
                change={(e) => { setVisit(e) }}
                type={'financial-storeShare-commission-export'}
                conditions={()=>{return getFieldValue(searchConfig)}}
              />,
            <ExportHistory key='task' show={visit} setShow={setVisit} type='financial-storeShare-commission-export'/>,
          ],
          }}
          columns={columns}
          pagination={{
            pageSize: 10,
            showQuickJumper: true,
          }}
        />
        {
        orderVisible &&
        <ShareTheSubsidyOrder
          orderDetail={orderDetail}
          visible={orderVisible}
          setVisible={setOrderVisible}
          onClose={()=>{ref?.current?.reload();setOrderDetail(null)}}
        />
      }
  </PageContainer>
  )
}