import React from 'react'
import { PageContainer } from '@/components/PageContainer';
import ProTable from '@ant-design/pro-table'
import { Button } from 'antd'
import { history, useLocation } from 'umi'

import { amountTransform } from '@/utils/utils'
import { logPage } from '@/services/financial-management/yeahgo-virtual-account-management'
import { tradeType } from '../../common-enum'

const WithdrawalBalanceDetails = () =>{
  const {query} = useLocation()
  const columns = [
    {
      title: '序号',
      dataIndex: 'serial',
      valueType: 'indexBorder'
    },
    {
      title: 'id',
      dataIndex: 'id',
      hideInTable: true
    },
    {
      title: '虚拟子账户',
      dataIndex: 'accountSn',
    },
    {
      title: '交易类型',
      dataIndex: 'tradeType',
      valueType: 'select',
      valueEnum: tradeType
    },
    {
      title: '订单号',
      dataIndex: 'billNo'
    },
    {
      title: '平台单号',
      dataIndex: 'payNo',
    },
    {
      title: '资金流水号',
      dataIndex: 'transactionId',
    },
    {
      title: '交易时间',
      dataIndex: 'createTime'
    },
    {
      title: '交易金额',
      dataIndex: 'changeAmount',
      render: (_) => amountTransform(_, '/'),
    },
    {
      title: '交易后余额',
      dataIndex: 'balanceAmount',
      render: (_) => amountTransform(_, '/')
    },
    {
      title: '交易描述',
      dataIndex: 'description'
    }
  ]
  return (
    <PageContainer title={false}>
      <ProTable
        rowKey='id'
        columns={columns}
        toolBarRender={false}
        pagination={{
          pageSize: 10,
          hideOnSinglePage: true,
          showQuickJumper: true
        }}
        search={false}
        params={{...query}}
        request={logPage}
      />
      <div
        style={{
          background: 'rgb(255, 255, 255)'
        }}
      >
        <Button
          style={{
            margin: 20
          }}
          type='primary'
          onClick={
            () => { window.history.back(); setTimeout(() => { window.location.reload(); }, 200) }
          }
        >
          返回
        </Button>
      </div>
    </PageContainer>
  )
}

export default WithdrawalBalanceDetails
