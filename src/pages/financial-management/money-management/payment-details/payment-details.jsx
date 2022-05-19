import React, { useState } from 'react'
import { PageContainer } from '@/components/PageContainer';
import ProTable from '@ant-design/pro-table'
import { useLocation, history } from "umi"
import { Drawer } from 'antd'

import { logPage } from '@/services/financial-management/yeahgo-virtual-account-management'
import { amountTransform } from '@/utils/utils'
import { tradeType } from '../../common-enum'
import NormalOrderDetail from '@/pages/order-management/normal-order/detail'
import ShopkeeperOrderDetail from '@/pages/order-management/intensive-order/supplier-order/detail'

const PaymentDetails = ({query, visible, setVisible}) => {
  const [normalOrderVisible, setNormalOrderVisible] = useState(false)
  const [shopkeeperOrderVisible, setShopkeeperOrderVisible] = useState(false)
  const [id, setId] = useState()

  const skipToOrder = (id, type)=> {
    console.log(type)
    if(type) {
      setId(id)
      setShopkeeperOrderVisible(true)
    } else {
      setId(id)
      setNormalOrderVisible(true)
    }
  }

  const columns = [
    {
      title: '序号',
      dataIndex:'id',
      hideInSearch: true,
      width: '4%',
      valueType: 'indexBorder'
    },
    {
      title: '虚拟子账户',
      dataIndex:'accountSn',
      width: '10%',
      hideInSearch: true,
    },
    {
      title: '交易类型',
      dataIndex:'tradeType',
      valueType: 'select',
      valueEnum: tradeType,
      hideInTable: true
    },
    {
      title: '交易类型',
      dataIndex:'tradeType',
      valueType: 'select',
      valueEnum: tradeType,
      width: '7%',
      hideInSearch: true
    },
    {
      title: '订单号',
      dataIndex:'billNo',
      width: '10%',
      render: (_, records)=> (
        records.orderId ? 
        <a onClick={()=>skipToOrder(records.orderId, records.isWholesale)}>{_}</a>:
        <span>{_}</span>
      )
    },
    {
      title: '平台单号',
      dataIndex:'payNo',
      width: '10%',
    },
    {
      title: '资金流水号',
      dataIndex: 'transactionId',
      width: '10%',
      hideInSearch: true
    },
    {
      title: '交易时间',
      dataIndex: 'createTime',
      width: '10%',
      hideInSearch: true
    },
    {
      title: '交易时间',
      dataIndex: 'createTime',
      valueType: 'dateRange',
      hideInTable: true
    },
    {
      title: '分账金额',
      dataIndex: 'divideAmount',
      width: '5%',
      render: (_) => amountTransform(Number(_), '/'),
      hideInSearch: true
    },
    {
      title: '手续费',
      dataIndex: 'fee',
      width: '5%',
      render: (_) => amountTransform(Number(_), '/'),
      hideInSearch: true
    },
    {
      title: '其他扣款',
      dataIndex: 'deductAmount',
      width: '5%',
      render: (_) => amountTransform(Number(_), '/'),
      hideInSearch: true
    },
    {
      title: '交易金额',
      dataIndex: 'changeAmount',
      width: '5%',
      render: (_) => amountTransform(Number(_), '/'),
      hideInSearch: true
    },
    {
      title: '交易后余额',
      dataIndex: 'balanceAmount',
      width: '5%',
      render: (_) => amountTransform(Number(_), '/'),
      hideInSearch: true
    },
    {
      title: '交易描述',
      dataIndex: 'description',
      width: '5%',
      hideInSearch: true
    }
  ]
  return (
    <Drawer
      visible={visible}
      onClose={()=>{setVisible(false)}}
      width={1200}
    >
      <ProTable
        rowKey='id'
        toolBarRender={false}
        pagination={{
          hideOnSinglePage: true,
          pageSize: 10,
          showQuickJumper: true
        }}
        scroll={{x: "max-content"}}
        columns={columns}
        params={{...query}}
        request={logPage}
        search={{
          defaultCollapsed: false
        }}
      />
      {
        normalOrderVisible &&
        <NormalOrderDetail
          id={id}
          visible={normalOrderVisible}
          setVisible={setNormalOrderVisible}
        />
      }
      {
        shopkeeperOrderVisible &&
        <ShopkeeperOrderDetail
          id={id}
          visible={shopkeeperOrderVisible}
          setVisible={setShopkeeperOrderVisible}
        />
      }
    </Drawer>
  )
}

export default PaymentDetails
