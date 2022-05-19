import React, { useState, useEffect, useRef } from 'react'
import ProTable from '@ant-design/pro-table';
import type { ProColumns } from '@ant-design/pro-table';
import { consumerOrderPage } from '@/services/hydrogen-atom-management/hydrogen-atom-start-recording'
import moment from 'moment'
import { amountTransform } from '@/utils/utils'
import { PageContainer } from '@ant-design/pro-layout';
import { useLocation } from 'umi';
import Detail from '@/pages/user-management/user-list/detail';


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
  const [detailVisible, setDetailVisible] = useState(false);
  const ref=useRef()
  const columns:ProColumns<ConsumerOrderPage>[]= [
    {
      title: '用户昵称',
      dataIndex: 'deviceImei',
      valueType: 'text',
      fieldProps:{
        placeholder:'请输入用户昵称'
      },
      order:5
    },
    {
      title: '用户手机',
      dataIndex: 'occupationMode',
      valueType: 'text',
      order:4,
      render:(_)=>{
          return <a onClick={()=>{setDetailVisible(true)}}>{_}</a>
      }
    },
    {
      title: '注册时间',
      dataIndex: 'occupationMode',
      valueType: 'text',
      hideInSearch: true,
    },
    {
      title: '注册来源',
      dataIndex: 'memberPhone',
      valueType: 'text',
    },
    {
      title: '是否开店',
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
      title: '是否开店',
      dataIndex: 'isShopkeeper',
      valueType: 'select',
      hideInSearch: true,
      valueEnum:{
        false: "否",
        true: '是'
      }
    },
    {
      title: '注销申请时间',
      dataIndex: 'createTime',
      valueType: 'text',
      hideInSearch: true
    },
    {
      title: '注销原因',
      dataIndex: 'deviceUseTime',
      valueType: 'text',
      hideInSearch: true
    },
    {
      title: '注销申请状态',
      dataIndex: 'orderAmount',
      valueType: 'text',
      hideInSearch: true,
      render:(_)=>{
          return amountTransform(_, '/').toFixed(2)
      }
    },
    {
      title: '注销时间',
      dataIndex: 'createTime',
      valueType: 'text',
      hideInSearch: true
    }
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
            ...dom.reverse()
          ],
          }}
          columns={columns}
          pagination={{
            pageSize: 10,
            showQuickJumper: true,
          }}
        />
        {
        detailVisible &&
        <Detail
        //   id={selectItem?.id}
          visible={detailVisible}
          setVisible={setDetailVisible}
        />
      }
  </PageContainer>
  )
}