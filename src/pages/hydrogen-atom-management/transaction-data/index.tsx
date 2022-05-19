import { useState, useRef } from "react"
import { PageContainer } from "@ant-design/pro-layout"
import ProDescriptions from "@ant-design/pro-descriptions"
import ProTable from "@ant-design/pro-table"
import { Image } from "antd"

import type { ProColumns } from "@ant-design/pro-table"
import type { ProDescriptionsItemProps } from "@ant-design/pro-descriptions"
import type { FormInstance } from "@ant-design/pro-form"
import type { DescriptionsProps, TableProps } from "./data"

import { findMemberDeviceTotal, findMemberDevicePage } from "@/services/hydrogen-atom-management/transaction-data"
import DevicesDetail from "../components/devices-detail"
import { getPageQuery } from "@/utils/utils"
import Export from "@/components/export"

export default function TransactionData () {
  const [devicesVisible, setDevicesVisible] = useState<boolean>(false)
  const [type, setType] = useState<number>(0)
  const [memberId, setMemberId] = useState<string>()
  const [memberPhone, setMemberPhone] = useState<string>()
  const form = useRef<FormInstance>()

  const getFieldValue = () => {
    return {
      ...form.current?.getFieldsValue()
    }
  }

  const descriptionsColumns: ProDescriptionsItemProps<DescriptionsProps>[] = [
    {
      title: '销售用户数',
      dataIndex: 'payImeiUserSum',
      render: (_) => _
    },
    {
      title: '租赁用户数',
      dataIndex: 'leaseImeiUserSum',
      render: (_) => _
    },
    {
      title: '销售产品数',
      dataIndex: 'payImeiSum',
      render: (_) => _
    },
    {
      title: '销售总金额',
      dataIndex: 'payOrderAmount'
    },
    {
      title: '租赁产品数',
      dataIndex: 'leaseImeiSum',
      render: (_) => _
    },
    {
      title: '租赁总押金',
      dataIndex: 'leaseOrderAmount'
    },
    {
      title: '租赁产品占比',
      dataIndex: 'leaseImeiScale'
    },
    {
      title: '租赁用户占比',
      dataIndex: 'leaseImeiUserScale'
    },
    {
      title: '产品总启用次数',
      dataIndex: 'startSum',
      render: (_)=> _
    },
    {
      title: '已启用产品数',
      dataIndex: 'startImeiSum',
      render: (_)=> _
    },
    {
      title: '产品总启用付费金额',
      dataIndex: 'scanAmountSum'
    },
    {
      title: '产品总启用时长(h)',
      dataIndex: 'scanTimeSum'
    },
    {
      title: '已缴租产品数',
      dataIndex: 'doneLeaseImeiSum',
      render: (_) => _
    },
    {
      title: '产品总缴租天数',
      dataIndex: 'leaseDaySum',
      render: (_) => _
    },
    {
      title: '租赁总缴租金额',
      dataIndex: 'leaseAmountSum'
    },
    {
      title: '租赁总缴租次数',
      dataIndex: 'leasePaySum',
      render: (_) => _
    },
    {
      title: '已启用用户数',
      dataIndex: 'scanImeiUserSum',
      render: (_) => _
    },
    {
      title: '已启用店主数',
      dataIndex: 'scanImeiStoreSum',
      render: (_) => _
    },
    {
      title: '已缴租店主数',
      dataIndex: 'leaseStoreSum',
      render: (_) => _
    },
    {
      title: '获得提成店主数',
      dataIndex: 'commissionStoreSum',
      render: (_) => _
    },
    {
      title: '店主总提成金额',
      dataIndex: 'commissionSum'
    },
    {
      title: '交额外管理费总金额',
      dataIndex: 'serviceFee'
    },
    {
      title: '交额外管理费店主数',
      dataIndex: 'serviceStoreSum',
      render: (_) => _
    },
     {
      title: '启动产品占比',
      dataIndex: 'startImeiSumScale'
    }
  ]

  const tableColumns: ProColumns<TableProps>[] = [
    {
      title: '手机号码',
      dataIndex: 'memberPhone',
      align: 'center'
    },
    {
      title: '店主ID',
      dataIndex: 'memberId',
      align: 'center',
      initialValue: getPageQuery().memberId,
      hideInTable: true
    },
    {
      title: '头像',
      dataIndex: 'icon',
      align: 'center',
      hideInSearch: true,
      render: (_, r) => <Image width={80} height={80} src={r.icon}/>
    },
    {
      title: '昵称',
      dataIndex: 'nickName',
      align: 'center',
      hideInSearch: true
    },
    {
      title: '是否为社区店主',
      dataIndex: 'userType',
      align: 'center',
      hideInSearch: true,
      render: (_, r) => r.userType === 1 ? '是' : '否'
    },
    {
      title: '社区店ID',
      dataIndex: 'storeNo',
      align: 'center'
    },
    {
      title: '社区店名称',
      dataIndex: 'storeName',
      align: 'center',
      hideInSearch: true
    },
    {
      title: '购买产品数',
      dataIndex: 'payImeiSum',
      align: 'center',
      hideInSearch: true,
      render: (_, r)=> {
        if(r.payImeiSum > 0) {
          return <a onClick={()=>{ setDevicesVisible(true); setType(2); setMemberId(r.memberId); setMemberPhone(r.memberPhone) }}>{_}</a>
        } else {
          return _
        }
      }
    },
    {
      title: '租赁产品数',
      dataIndex: 'leaseImeiSum',
      align: 'center',
      hideInSearch: true,
      render: (_, r)=> {
        if(r.leaseImeiSum > 0) {
          return <a onClick={()=>{ setDevicesVisible(true); setType(1); setMemberId(r.memberId); setMemberPhone(r.memberPhone) }}>{_}</a>
        } else {
          return _
        }
      }
    },
    {
      title: '总缴租次数',
      dataIndex: 'leasePaySum',
      align: 'center',
      hideInSearch: true,
      render: (_, r)=> {
        if(r.leasePaySum > 0) {
          return <a onClick={()=>{ setDevicesVisible(true); setType(3); setMemberId(r.memberId); setMemberPhone(r.memberPhone) }}>{_}</a>
        } else {
          return _
        }
      }
    },
    {
      title: '总启动次数',
      dataIndex: 'startSum',
      align: 'center',
      hideInSearch: true,
      render: (_, r)=> {
        if(r.startSum > 0) {
          return <a onClick={()=>{ setDevicesVisible(true); setType(4); setMemberId(r.memberId); setMemberPhone(r.memberPhone) }}>{_}</a>
        } else {
          return _
        }
      }
    }
  ]

  return (
    <PageContainer title={false}>
      <ProDescriptions<DescriptionsProps>
        column={8}
        bordered
        layout='vertical'
        columns={descriptionsColumns}
        request={findMemberDeviceTotal}
      />
      <ProTable<TableProps>
        rowKey="memberId"
        columns={tableColumns}
        request={findMemberDevicePage}
        columnEmptyText={false}
        formRef={form}
        pagination={{
          pageSize: 10
        }}
        options={false}
        search={{
          optionRender: (searchConfig, props, dom)=> [
            ...dom.reverse(),
            <Export
              key="1"
              type='imei_member_data_list_export'
              conditions={getFieldValue}
            />
          ]
        }}
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
