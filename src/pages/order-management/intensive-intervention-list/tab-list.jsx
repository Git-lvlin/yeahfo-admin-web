import React from 'react'
import ProTable from '@ant-design/pro-table'
import { history } from 'umi'
import moment from 'moment'

import { interventionList } from '@/services/order-management/intensive-intervention-list'

const TabList =({done})=> {
  const columns =[
    {
      title: '售后编号',
      dataIndex: 'refundId',
      align: 'center',
      
    },
    {
      title: '订单编号',
      dataIndex: 'orderId',
      align: 'center',
    },
    {
      title: '售后类型',
      dataIndex: 'refundType',
      valueType: 'select',
      align: 'center',
      hideInSearch: true,
      valueEnum:{
        1: '退款',
        2: '退款退货'
      }
    },
    {
      title: '处理时间',
      dataIndex: 'applyTime',
      valueType: 'dateRange',
      hideInTable: true
    },
    {
      title: '处理时间',
      dataIndex: 'applyTime',
      valueType: 'date',
      colSize: .8,
      align: 'center',
      hideInSearch: true,
      render: (_)=>{
        return(
          <>{moment(_.props.text).format('YYYY-MM-DD HH:mm:ss')}</>
        )
      }
    },
    {
      title: '申请介入类型',
      dataIndex: 'joinTypeDesc',
      colSize: .8,
      align: 'center',
      hideInSearch: true
    },
    {
      title: '介入类型',
      dataIndex: 'joinType',
      valueType: 'select',
      colSize: .8,
      align: 'center',
      hideInTable: true,
      valueEnum: {
        1: '介入申请',
        2: '介入退款'
      }
    },
    {
      title: '状态',
      dataIndex: 'statusDesc',
      align: 'center',
      hideInSearch: true,
    },
    {
      title: '操作',
      valueType: 'option',
      align: 'center',
      dataIndex: 'option',
      render:(_, data)=>{
        return (
          <>
            <a onClick={()=>history.push(`/order-management/intensive-intervention-list/details/${data?.id}`)}>查看详情</a>
          </>
        )
      }
    },
  ]
  return (
    <ProTable
      rowKey='refundId'
      columns={columns}
      headerTitle="数据列表"
      options={false}
      params={{status: done}}
      request={interventionList}
      pagination={{
        hideOnSinglePage: true,
        showQuickJumper: true,
        pageSize: 10
      }}
      search={{
        span: 5,
        defaultCollapsed: true,
        collapseRender: false
      }}
    />
  )
}

export default TabList
