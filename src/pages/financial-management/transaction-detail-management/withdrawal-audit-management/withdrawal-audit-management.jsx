import React, { useState } from 'react'
import { PageContainer } from '@/components/PageContainer';
import ProTable from '@ant-design/pro-table'
import { history } from 'umi'
import { Button } from 'antd'

import { amountTransform } from '@/utils/utils'
import { withdrawPage } from '@/services/financial-management/transaction-detail-management'
import { Export, ExportHistory } from '@/pages/export-excel'

const WithdrawalAuditManagement = () => {
  const [visit, setVisit] = useState(false)
  const skipToDetail = data => {
    history.push(`/financial-management/transaction-detail-management/withdrawal-audit-management/detail/${data}`)
  }

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
      title: '序号',
      dataIndex: 'serial',
      hideInSearch: true,
      valueType: 'indexBorder'
    },
    {
      title: '会员ID',
      dataIndex: 'accountId',
    },
    {
      title: '注册手机号',
      dataIndex: 'registMobile',
    },
    {
      title: '用户类型',
      dataIndex: 'accountType',
      valueType: 'select',
      valueEnum: {
        'store': '社区店',
        'supplier': '商家',
        'platform': '平台',
        'agentStore': '内部店',
        'agentCompany': '运营商'
      }
    },
    {
      title: '帐户类型',
      dataIndex: 'bankAcctType',
      valueType: 'select',
      valueEnum: {
        'business': '公司户',
        'person': '个人户'
      }
    },
    {
      title: '提现类型',
      dataIndex: 'withdrawType',
      valueType: 'select',
      valueEnum: {
        'goodsAmount': '货款提现',
        'commission': '收益提现'
      }
    },
    {
      title: '提现账户名',
      dataIndex: 'withdrawAccountName',
    },
    {
      title: '提现银行卡',
      dataIndex: 'withdrawAccount',
    },
    {
      title: '账户所属行',
      dataIndex: 'bankName',
      hideInSearch: true
    },
    {
      title: '资金流水号',
      dataIndex: 'voucher'
    },
    {
      title: '提现单号',
      dataIndex: 'sn',
    },
    {
      title: '提现时间',
      dataIndex: 'createTime',
      valueType: 'dateRange',
      hideInTable: true
    },
    {
      title: '提现时间',
      dataIndex: 'createTime',
      hideInSearch: true
    },
    {
      title: '提现金额',
      dataIndex: 'amount',
      render: (_)=> amountTransform(_, '/'),
      hideInSearch: true
    },
    {
      title: '提现状态',
      dataIndex: 'status',
      valueType: 'select',
      valueEnum: {
        'auditing': '待审核',
        'waitPay': '待执行',
        'arrived': '已到账',
        'unPass': '审核不通过',
        'paid': '已打款',
        'failure': '提现失败'
      }
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, records) => (
        <a onClick={()=>{skipToDetail(records?.id)}}>详情</a>
      )
    }
  ]
  return (
    <PageContainer title={false}>
      <ProTable
        rowKey='sn'
        columns={columns}
        toolBarRender={false}
        pagination={{
          pageSize: 10,
          hideOnSinglePage: true,
          showQuickJumper: true
        }}
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
              type="financial-withdraw-page-export"
              conditions={() => getFieldValue(form)}
            />,
            <ExportHistory
              key="exportHistory" 
              show={visit}
              setShow={setVisit}
              type="financial-withdraw-page-export"
            />
          ],
        }}
        params={{}}
        request={withdrawPage}
      />
    </PageContainer>
  )
}

export default WithdrawalAuditManagement
