import React, { useState } from 'react'
import { PageContainer } from '@/components/PageContainer'
import ProTable from '@ant-design/pro-table'
import { Button } from 'antd'

import { amountTransform } from '@/utils/utils'
import { commissionPage } from '@/services/financial-management/transaction-detail-management'
import { Export, ExportHistory } from '@/pages/export-excel'
import Detail from '../../common-popup/order-pay-detail-popup'
import RoyaltyDetails from "../royalty-details"

// bonus detail
const BonusDetailManagement = () =>{
  const [detailVisible, setDetailVisible] = useState(false)
  const [royaltyVisible, setRoyaltyVisible] = useState(false)
  const [selectItem, setSelectItem] = useState({})
  const [visit, setVisit] = useState(false)
  const [type, setType] = useState('')

  const getFieldValue = (form) => {
    const { createTime, ...rest } = form.getFieldsValue()
    return {
      begin: createTime?.[0]?.format('YYYY-MM-DD'),
      end: createTime?.[1]?.format('YYYY-MM-DD'),
      ...rest
    }
  }

  const columns = [
    {
      title: 'id',
      dataIndex: 'id',
      hideInSearch: true,
      hideInTable: true
    },
    {
      title: '序号',
      dataIndex: 'serial',
      valueType: 'indexBorder'
    },
    {
      title: '受益方类型',
      dataIndex: 'accountType',
      valueType: 'select',
      valueEnum: {
        'store': '社区店',
        'agentStore': '内部店'
      }
    },
    {
      title: '受益方ID',
      dataIndex: 'accountId'
    },
    {
      title: '受益方手机',
      dataIndex: 'accountMobile'
    },
    {
      title: '交易类型',
      dataIndex:'tradeType',
      valueType: 'select',
      valueEnum: {
        'commission': '店主收益',
        'suggestCommission': '推荐收益',
        'chargeFeeCommission': '服务费收益',
        'shareCommission': '店铺分享收益'
      },
      hideInTable: true
    },
    {
      title: '交易类型',
      dataIndex: 'tradeTypeDesc',
      hideInSearch: true
    },
    {
      title: '订单类型',
      dataIndex: 'orderType',
      valueType: 'select',
      valueEnum: {
        'second': '秒约订单',
        'commandSalesOrder': '集约批发订单',
        'dropShipping1688': '1688代发订单',
        'settleChargeFee': '入驻服务费订单',
        'wholesaleFresh': '集约批发-生鲜订单',
        'hydrogenRent': '氢原子租金订单',
        'hydrogen': '氢原子销售订单',
        'storeShare': '分享订单'
      },
      hideInTable: true
    },
    {
      title: '订单类型',
      dataIndex: 'orderTypeDesc',
      hideInSearch: true
    },
    {
      title: '订单号',
      dataIndex: 'orderNo'
    },
    {
      title: '平台单号',
      dataIndex: 'payNo',
      render: (_, records) => (
        records?.orderNo?
        <a onClick={() => { setSelectItem(records.orderNo); setDetailVisible(true); }}>{_}</a>:
        <span>{_}</span>
      )
    },
    {
      title: '资金流水号',
      dataIndex: 'transactionId'
    },
    {
      title: '金额',
      dataIndex: 'amount',
      render: (_)=> amountTransform(_, '/'),
      hideInSearch: true
    },
    {
      title: '手续费',
      dataIndex: 'fee',
      render: (_)=> amountTransform(_, '/'),
      hideInSearch: true
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      hideInSearch: true
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      valueType: 'dateRange',
      hideInTable: true
    },
    {
      title: '操作',
      dataIndex: 'optoion',
      valueType: 'option',
      render: (_, records)=> <a onClick={()=> {setRoyaltyVisible(true); setSelectItem(records?.orderNo); setType('bonus')}}>详情</a>
    }

  ]
  return (
    <PageContainer title={false}>
      <ProTable
        rowKey='id'
        columns={columns}
        toolBarRender={false}
        search={{
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
              type="financial-trans-commission-page-export"
              conditions={() => getFieldValue(form)}
            />,
            <ExportHistory
              key="exportHistory"
              show={visit}
              setShow={setVisit}
              type="financial-trans-commission-page-export"
            />
          ]
        }}
        pagination={{
          pageSize: 10,
          hideOnSinglePage: true,
          showQuickJumper: true
        }}
        params={{}}
        request={commissionPage}
      />
      {
        detailVisible &&
        <Detail
          id={selectItem}
          visible={detailVisible}
          setVisible={setDetailVisible}
          title='店铺收益明细'
        />
      }
      {
        royaltyVisible &&
        <RoyaltyDetails
          id={selectItem}
          visible={royaltyVisible}
          setVisible={setRoyaltyVisible}
          title='店铺收益明细'
          type={type}
        />
      }
    </PageContainer>
  )
}

export default BonusDetailManagement
