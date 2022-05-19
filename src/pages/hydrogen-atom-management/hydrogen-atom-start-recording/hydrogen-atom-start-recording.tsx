import React, { useState, useEffect, useRef } from 'react'
import ProTable from '@ant-design/pro-table';
import type { ProColumns } from '@ant-design/pro-table';
import { consumerOrderPage } from '@/services/hydrogen-atom-management/hydrogen-atom-start-recording'
import moment from 'moment'
import { amountTransform } from '@/utils/utils'
import { PageContainer } from '@ant-design/pro-layout';
import Export from '@/pages/export-excel/export'
import { useLocation } from 'umi';
import ExportHistory from '@/pages/export-excel/export-history'
import Detail from '@/pages/order-management/normal-order/detail';


type ConsumerOrderPage={
    deviceImei: string;
    id: string;
    occupantId: string;
    orderAmount: string;
    orderSn: string;
    payType: string;
    deviceUseTime: number;
    createTime: string;
    payTypeStr: string;
    storeNo: string;
    storeName: string;
    memberPhone: string;
    occupationMode: number;
    isShopkeeper: boolean;
    occupationModeStr: string;
}

export default () => {
  const [visit, setVisit] = useState<boolean>(false)
  const [subOrderId, setSubOrderId] = useState(null)
  const [orderVisible, setOrderVisible] = useState(false)
  const isPurchase = useLocation().pathname.includes('purchase')
  const ref=useRef()
  const columns:ProColumns<ConsumerOrderPage>[]= [
    {
      title: '机器ID',
      dataIndex: 'deviceImei',
      valueType: 'text',
      fieldProps:{
        placeholder:'请输入机器ID'
      },
      order:5
    },
    {
      title: '交易类型',
      dataIndex: 'occupationMode',
      valueType: 'select',
      hideInTable: true,
      valueEnum:{
          '': "全部",
          1: '租赁',
          2: '购买'
      },
      order:4
    },
    {
      title: '交易类型',
      dataIndex: 'occupationMode',
      valueType: 'select',
      hideInSearch: true,
      valueEnum:{
          1: '租赁',
          2: '购买'
      }
    },
    {
      title: '启动人手机',
      dataIndex: 'memberPhone',
      valueType: 'text',
      fieldProps:{
        placeholder:'请输入用户手机'
      },
      order:6
    },
    {
      title: '社区店主',
      dataIndex: 'isShopkeeper',
      valueType: 'select',
      hideInTable: true,
      valueEnum:{
        "": "全部",
        false: "否",
        true: '是'
      },
      order:1
    },
    {
      title: '社区店主',
      dataIndex: 'isShopkeeper',
      valueType: 'select',
      hideInSearch: true,
      valueEnum:{
        false: "否",
        true: '是'
      }
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
    // {
    //   title: '社区店店铺名称',
    //   dataIndex: 'storeName',
    //   valueType: 'text',
    //   hideInSearch: true
    // },
    {
      title: '启动时间',
      dataIndex: 'dateTimeRange',
      valueType: 'dateTimeRange',
      hideInTable: true,
      order:2
    },
    {
      title: '启动时间',
      dataIndex: 'createTime',
      valueType: 'text',
      hideInSearch: true
    },
    {
      title: '启动时长(分钟)',
      dataIndex: 'deviceUseTime',
      valueType: 'text',
      hideInSearch: true
    },
    {
      title: '启动支付金额',
      dataIndex: 'orderAmount',
      valueType: 'text',
      hideInSearch: true,
      render:(_)=>{
          return amountTransform(_, '/').toFixed(2)
      }
    },
    {
      title: '启动支付方式',
      dataIndex: 'payTypeStr',
      valueType: 'text',
      hideInSearch: true
    },
    {
      title: '启动支付单号',
      dataIndex: 'id',
      valueType: 'text',
      hideInSearch: true,
      render:(_)=>{
          return <a onClick={()=>{setOrderVisible(true);setSubOrderId(_)}}>{_}</a>
      }
    },
  ];
  const getFieldValue = (searchConfig) => {
    const {dateTimeRange,...rest}=searchConfig.form.getFieldsValue()
    return {
      startTime:dateTimeRange&&moment(dateTimeRange[0]).format('YYYY-MM-DD HH:mm:ss'),
      endTime:dateTimeRange&&moment(dateTimeRange[1]).format('YYYY-MM-DD HH:mm:ss'),
      ...rest,
    }
  }
  return (
    <PageContainer>
        <ProTable<ConsumerOrderPage>
          actionRef={ref}
          rowKey="id"
          options={false}
          request={consumerOrderPage}
          search={{
          defaultCollapsed: false,
          labelWidth: 100,
          optionRender: (searchConfig, formProps, dom) => [
            ...dom.reverse(),
            <Export
                key='export'
                change={(e) => { setVisit(e) }}
                type={'queryIotConsumerOrderExport'}
                conditions={()=>{return getFieldValue(searchConfig)}}
              />,
              <ExportHistory key='task' show={visit} setShow={setVisit} type='queryIotConsumerOrderExport'/>,
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
        <Detail
          id={subOrderId}
          visible={orderVisible}
          setVisible={setOrderVisible}
          isPurchase={isPurchase}
        />
      }
  </PageContainer>
  )
}