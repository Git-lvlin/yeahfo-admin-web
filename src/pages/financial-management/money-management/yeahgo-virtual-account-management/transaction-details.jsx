import React, { useState, useRef } from 'react'
import { PageContainer } from '@/components/PageContainer';
import ProTable from '@ant-design/pro-table'
import { useLocation, history } from "umi"
import { Button, Drawer } from 'antd'

import { logPage } from '@/services/financial-management/yeahgo-virtual-account-management'
import { amountTransform } from '@/utils/utils'
import { Export,ExportHistory } from '@/pages/export-excel'
import { tradeType } from '../../common-enum'
import Detail from '../../common-popup/order-pay-detail-popup'
import NormalOrderDetail from '@/pages/order-management/normal-order/detail'
import ShopkeeperOrderDetail from '@/pages/order-management/intensive-order/supplier-order/detail'

const TransactionDetails = ({
  visible,
  setVisible,
  query
}) => {
  const [detailVisible, setDetailVisible] = useState(false)
  const [selectItem, setSelectItem] = useState({})
  const [normalOrderVisible, setNormalOrderVisible] = useState(false)
  const [shopkeeperOrderVisible, setShopkeeperOrderVisible] = useState(false)
  const [id, setId] = useState()
  const [visit, setVisit] = useState(false)
  const actionform = useRef()

  const isPurchase = useLocation().pathname.includes('purchase')

  const skipToOrder = (id, type)=> {
    if(type) {
      setId(id)
      setShopkeeperOrderVisible(true)
    } else {
      setId(id)
      setNormalOrderVisible(true)
    }
  }

  const skipToOrderPay = (id) => {
    history.push(`/financial-management/transaction-detail-management/order-pay-detail-management/detail/${id}`)
  }

  const transactionType = () =>{
    if(query.accountId==='platform') {
      return {
        'commission': '店主收益',
        'commissionReturn': '店主收益回退',
        'suggestCommission': '推荐店主收益',
        'suggestCommissionReturn': '推荐店主收益回退',
        'platformCommission': '平台收益',
        'platformCommissionReturn': '平台收益回退',
        'agentCompanyCommission': '运营中心收益',
        'agentCompanyCommissionReturn': '运营中心收益回退',
        'freeze': '冻结',
        'unfreeze': '解冻',
        'withdraw': '提现',
        'yeahCardRecharge': '约卡充值',
        'deposit': '保证金',
        'depositReturn': '保证金回退',
        'chargeFeeCommission': '服务费收益',
        'chargeFeeCommissionReturn': '服务费收益回退'
      }
    }else if(query.accountId==='platformFee'){
      return {
        'fee': '代收交易费',
        'feeReturn': '交易费退回'
      }
    }else if(query.accountId==='platformXinbao'){
      return {
        'recharge': '充值',
        'giveOut': '划扣'
      }
    }else if(query.accountId==='supplyChain'){
      return {
        'goodsAmount': '货款',
        'goodsAmountReturn': '货款回退'
      }
    }
  }

  const orderType = () => {
    if(query.accountId==='platform') {
      return {
        'second': '秒约订单',
        'commandSalesOrder': '集约批发订单',
        'dropShipping1688': '1688代发订单',
        'commandCollect': '集约零售订单',
        'blindBox': '盲盒订单',
        'signIn': '签到订单',
        'settleChargeFee': '入驻服务费订单'
      }
    }
  }

  const getValues = (form) => {
    return {
      accountId: query.accountId,
      accountType: query.accountType,
      amountType: query.amountType,
      begin: form?.getFieldValue().createTime?.[0],
      end: form?.getFieldValue().createTime?.[1],
      ...form?.getFieldValue()
    }
  }

  const columns = [
    {
      title: '序号',
      dataIndex:'id',
      width: '4%',
      hideInSearch: true,
      valueType: 'indexBorder'
    },
    {
      title: '交易类型',
      dataIndex:'tradeType',
      valueType: 'select',
      valueEnum: transactionType(),
      hideInTable: true
    },
    {
      title: '交易类型',
      dataIndex:'tradeTypeDesc',
      width: '7%',
      hideInSearch: true
    },
    {
      title: '订单类型',
      dataIndex:'orderType',
      valueType: 'select',
      valueEnum: orderType(),
      hideInSearch: query.accountId==='platform' ? false : true,
      hideInTable: true
    },
    {
      title: '订单类型',
      dataIndex:'orderTypeDesc',
      hideInSearch: true,
      width: '7%',
      hideInTable: query.accountId==='platform' ? false : true
    },
    {
      title: '订单号',
      dataIndex:'billNo',
      width: '10%',
      render: (_, records) => (
        records.orderId ? 
        <a onClick={()=>skipToOrder(records.orderId, records.isWholesale)}>{_}</a>:
        <span>{_}</span>
      )
    },
    {
      title: '支付单号',
      dataIndex:'payNo',
      width: '10%',
      hideInSearch: query.accountId==='platformXinbao' ? true : false,
      hideInTable: query.accountId==='platformXinbao' ? true : false,
      render: (_, records)=> (
        records.payNoJumpParam ? 
        <a onClick={() => { setSelectItem(records.billNo); setDetailVisible(true); }}>{_}</a>:
        <span>{_}</span>
      )
    },
    {
      title: '资金流水号',
      dataIndex:'transactionId',
      width: '10%'
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
      width={1400}
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
        actionRef={actionform}
        search={{
          defaultCollapsed: false,
          optionRender: ({searchText, resetText}, {form}) => [
            <Button
              key="search"
              type="primary"
              onClick={() => {
                form?.submit()
              }}
            >
              {searchText}
            </Button>,
            <Button
              key="rest"
              onClick={() => {
                form?.resetFields()
                form?.submit()
              }}
            >
              {resetText}
            </Button>,
            <Export
              change={(e)=> {setVisit(e)}}
              key="export" 
              type="financial-account-log-page-export"
              conditions={()=> getValues(form)}
            />,
            <ExportHistory
              key="exportHistory"
              show={visit}
              setShow={setVisit}
              type="financial-account-log-page-export"
            />
          ],
        }}
      />
      {
        detailVisible &&
        <Detail
          id={selectItem}
          visible={detailVisible}
          setVisible={setDetailVisible}
        />
      }
      {
        normalOrderVisible &&
        <NormalOrderDetail
          id={id}
          visible={normalOrderVisible}
          setVisible={setNormalOrderVisible}
          isPurchase={isPurchase}
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

export default TransactionDetails
