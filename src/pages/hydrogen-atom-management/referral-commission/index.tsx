import { useState, useRef } from 'react'
import { PageContainer } from "@ant-design/pro-layout"
import ProTable from "@ant-design/pro-table"

import type { ProColumns } from "@ant-design/pro-table"
import type { PropsTable, PropsExpand, PropsExpandTable } from "./data"
import type { FC } from 'react'
import type { FormInstance } from "@ant-design/pro-form"

import { queryStatisticsCommissionList } from "@/services/hydrogen-atom-management/referral-commission"
import { amountTransform } from '@/utils/utils'
import DevicesDetail from "../components/devices-detail"
import Export from "@/components/export"

function ReferralCommission () {
  const [devicesVisible, setDevicesVisible] = useState<boolean>(false)
  const [type, setType] = useState<number>(0)
  const [memberId, setMemberId] = useState<string>()
  const [memberPhone, setMemberPhone] = useState<string>()
  const  form = useRef<FormInstance>()

  const Expandable: FC<PropsExpandTable> = ({data}) => {
    
    const expandColumns: ProColumns<PropsExpand>[] = [
      {
        title: '被推荐人手机',
        dataIndex: 'buyMobile',
        align: 'center'
      },
      {
        title: '提成金额(元)',
        dataIndex: 'amount',
        align: 'center',
        render: (_) => amountTransform(_, '/')
      },
      {
        title: '最近交易时间',
        dataIndex: 'createTime',
        align: 'center'
      },
      {
        title: '是否社区店主',
        dataIndex: 'memberShop',
        valueType: 'select',
        valueEnum: {
          true: '是',
          false: '否'
        },
        align: 'center'
      },
      {
        title: '店铺名称',
        dataIndex: 'storeName',
        align: 'center'
      },
      {
        title: '社区店ID',
        dataIndex: 'storeId',
        align: 'center'
      },
      {
        title: '产品数量',
        dataIndex: 'driverCount',
        align: 'center',
        render: (_, r) => {
          if(r.driverCount >0) {
            return <a onClick={()=>{ setDevicesVisible(true); setType(5); setMemberId(r.buyId); setMemberPhone(r.buyMobile) }}>{_}</a>
          } else {
            return _
          }
        }
      }
    ]

    return (
      <ProTable
        rowKey='storeId'
        columns={expandColumns}
        dataSource={data}
        pagination={false}
        search={false}
        options={false}
      />
    )
  }

  const columns: ProColumns<PropsTable>[] = [
    {
      title: '邀请人社区店ID',
      dataIndex: 'storeId',
      hideInTable: true
    },
    {
      title: '推荐用户提成数',
      dataIndex: 'totalUser',
      align: 'center',
      hideInSearch: true
    },
    {
      title: '推荐人手机',
      dataIndex: 'pMobile',
      align: 'center'
    },
    {
      title: '总提成金额(元)',
      dataIndex: 'totalAccount',
      align: 'center',
      hideInSearch: true,
      render: (_) => amountTransform(_, '/')
    },
    {
      title: '总产品数',
      dataIndex: 'totalDriverCount',
      align: 'center',
      hideInSearch: true
    },
    {
      title: '最近交易时间',
      dataIndex: 'createTime',
      align: 'center',
      hideInSearch: true
    },
    {
      title: '店铺名称',
      dataIndex: 'storeName',
      align: 'center',
      hideInSearch: true
    },
    {
      title: '社区店ID',
      dataIndex: 'pStoreId',
      align: 'center',
      hideInSearch: true
    },
    {
      title: '提货点地区',
      dataIndex: 'address',
      align: 'center',
      hideInSearch: true
    },
    {
      title: '社区店状态',
      dataIndex: 'storeStatus',
      align: 'center',
      hideInSearch: true
    },
    {
      title: '机器ID',
      dataIndex: 'imei',
      hideInTable: true
    },
    {
      title: '被推荐人手机',
      dataIndex: 'buyMobile',
      hideInTable: true
    },
    {
      title: '操作',
      valueType: 'option',
      align: 'center',
      render: (_, r) => (
        <Export
          type='queryMyCommissionSubListExport'
          conditions={{pMemId: r?.pMemId}}
          slot={<a>导出</a>}
          slotHistory={e => <a onClick={e}>···</a>}
          fileName={`${r.pMobile}的推荐人列表`}
        />
      )
    }
  ]

  return (
    <PageContainer title={false}>
      <ProTable<PropsTable>
        rowKey='pMobile'
        columns={columns}
        request={queryStatisticsCommissionList}
        options={false}
        formRef={form}
        pagination={{
          pageSize: 10,
          showQuickJumper: true
        }}
        search={{
          labelWidth: 'auto',
          optionRender: (searchConfig, props, dom)=> [
            ...dom.reverse(),
            <Export
              type='queryStatisticsCommissionListExport'
              conditions={{...form.current?.getFieldsValue()}}
              key='export'
            />
          ]
        }}
        expandable={{expandedRowRender: (r: PropsTable)=> <Expandable data={r.subs}/>}}
      />
      {
        devicesVisible&&
        <DevicesDetail
          visible={devicesVisible}
          setVisible={setDevicesVisible}
          type={type}
          memberId={memberId}
          memberPhone={memberPhone}
        />
      }
    </PageContainer>
  )
}

export default ReferralCommission
