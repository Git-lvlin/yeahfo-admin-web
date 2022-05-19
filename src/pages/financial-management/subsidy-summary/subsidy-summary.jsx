import React from 'react'
import { PageContainer } from '@/components/PageContainer';
import ProTable from '@ant-design/pro-table'
import { history } from 'umi'

import { allowance } from '@/services/financial-management/subsidy-summary'
import { amountTransform } from '@/utils/utils'

const skipToSettlement = (e) => {
  history.push(`/financial-management/subsidy-summary/detail/${e}`)
}

const text = (e) => {
  if(e.status === 'unSettle') {
    return '立即结算'
  } else {
    return '查看详情'
  }
}

const SubsidySummary = ()=> {

  const columns = [
    {
      title: '补贴单',
      dataIndex: 'sn',
      align: 'center'
    },
    {
      title: '商家名称',
      dataIndex: 'accountName',
      align: 'center',
      hideInSearch: true
    },
    {
      title: '订单数量',
      dataIndex: 'orderCount',
      align: 'center',
      hideInSearch: true
    },
    {
      title: '补贴结算金额',
      dataIndex: 'allowanceAmount',
      align: 'center',
      hideInSearch: true,
      render: (_) => `￥${amountTransform(_, '/')}`
    },
    {
      title: '结算状态',
      dataIndex: 'status',
      align: 'center',
      valueType: 'select',
      valueEnum: {
        0: '全部',
        'counting': '待统计',
        'unSettle': '待结算',
        'settled': '已结算'
      }
    },
    {
      title: '开始周期',
      dataIndex: 'beginPeriod',
      colSize: .2,
      align: 'center',
      valueType: 'dateMonth',
      hideInTable: true
    },
    {
      title: '结束周期',
      dataIndex: 'endPeriod',
      colSize: .2,
      align: 'center',
      valueType: 'dateMonth',
      hideInTable: true
    },
    {
      title: '结算周期',
      dataIndex: 'period',
      align: 'center',
      valueType: 'dateMonth',
      hideInSearch: true
    },
    {
      title: '结算人员',
      dataIndex: 'settleMan',
      align: 'center',
      hideInSearch: true
    },
    {
      title: '操作',
      valueType: 'option',
      align: 'center',
      render: (_, records) => <a onClick={()=> {skipToSettlement(records.id)}}>
        { text(records) }
      </a>
    }
  ]
  return (
    <PageContainer title={false}>
      <ProTable
        columns={columns}
        pagination={{
          pageSize: 10,
          hideOnSinglePage: true
        }}
        rowKey='sn'
        toolBarRender={false}
        params={{}}
        request={allowance}
      />
    </PageContainer>
  )
}

export default SubsidySummary
