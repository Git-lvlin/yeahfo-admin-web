import React, { useRef, useState } from 'react'
import ProTable from '@ant-design/pro-table'
import { PageContainer } from '@/components/PageContainer';
import { QuestionCircleOutlined } from '@ant-design/icons'
import { DatePicker, Tooltip } from 'antd'

import { supplierDevelopmentData } from '@/services/data-board/supplier-data'
import Export from '@/pages/export-excel/export'
import ExportHistory from '@/pages/export-excel/export-history'

const { RangePicker } = DatePicker

const MDatePicker = ({ value, onChange }) => {
  return (
    <RangePicker
      value={value}
      onChange={(v) => {
        if (v) {
          onChange([v[0].startOf('month'), v[1].endOf('month')])
        } else {
          onChange(v)
        }
      }}
      onCalendarChange={(v)=>{
        if (v?.[0]) {
          onChange([v[0].startOf('month')])
        }
        if (v?.[1]){
          onChange([v[0].startOf('month'), v[1].endOf('month')])
        }
      }}
      picker="month"
      format={'YYYY-MM-DD'}
    />
  )
}

const SupplierDevelopmentData = () => {
  const [visit, setVisit] = useState(false)
  const form = useRef()

  const getFieldValue = () => {
    const { time, ...rest } = form.current.getFieldsValue()
    return {
      startTime: time?.[0]?.format('YYYY-MM-DD'),
      endTime: time?.[1].format('YYYY-MM-DD'),
      ...rest
    }
  }

  const columns = [
    {
      title: '时间范围',
      dataIndex: 'time',
      align: 'center',
      hideInTable: true,
      renderFormItem: () => <MDatePicker />
    },
    {
      title: '采购账号ID',
      dataIndex: 'operateId',
      align: 'center',
      hideInSearch: true
    },
    {
      title: '姓名',
      dataIndex: 'operateName',
      align: 'center',
      hideInSearch: true
    },
    {
      title: '开发供应商数量',
      dataIndex: 'supplierNum',
      align: 'center',
      tooltip: {
        icon: (
          <Tooltip title='按【供应商创建后通过审核的时间】进行汇总'>
            <QuestionCircleOutlined />
          </Tooltip>
        )
      },
      hideInSearch: true
    },
    {
      title: '集约商品审核通过数量（SPU）',
      dataIndex: 'wholesaleApprovedSpuNum',
      align: 'center',
      tooltip: {
        icon: (
          <Tooltip title='按集约商品审核通过时间进行汇总'>
            <QuestionCircleOutlined />
          </Tooltip>
        )
      },
      hideInSearch: true
    },
    {
      title: '集约商品审核未通过数量（SPU）',
      dataIndex: 'wholesaleNotApprovedSpuNum',
      tooltip: {
        icon: (
          <Tooltip title='不受所选时间控制，只依据【未审核状态】进行汇总统计的数量'>
            <QuestionCircleOutlined />
          </Tooltip>
        )
      },
      align: 'center',
      hideInSearch: true
    },
    {
      title: '秒约商品审核通过数量（SPU）',
      dataIndex: 'secondApprovedSpuNum',
      tooltip: {
        icon: (
          <Tooltip title='按秒约商品审核通过时间进行汇总'>
            <QuestionCircleOutlined />
          </Tooltip>
        )
      },
      align: 'center',
      hideInSearch: true
    },
    {
      title: '秒约商品审核未通过数量（SPU）',
      dataIndex: 'secondNotApprovedSpuNum',
      tooltip: {
        icon: (
          <Tooltip title='不受所选时间控制，只依据【未审核状态】进行汇总统计的数量'>
            <QuestionCircleOutlined />
          </Tooltip>
        )
      },
      align: 'center',
      hideInSearch: true
    }
  ]
  return (
    <PageContainer title={false}>
      <ProTable
        rowKey='operateId'
        columns={columns}
        request={supplierDevelopmentData}
        params={{}}
        formRef={form}
        toolbar={{
          settings: false
        }}
        headerTitle='供应商开发数据'
        pagination={{
          showQuickJumper: true,
          pageSize: 10
        }}
        search={{
          labelWidth: 120,
          optionRender: (searchConfig, formProps, dom) => [
            ...dom.reverse(),
            <Export
              change={(e) => { setVisit(e) }}
              key="export"
              type="data-board-supplier-development-data"
              conditions={getFieldValue}
            />,
            <ExportHistory
              key="export-history"
              show={visit} setShow={setVisit}
              type="data-board-supplier-development-data"
            />
          ]
        }}
        style={{
          marginTop: 30
        }}
      />
    </PageContainer>
  )
}

export default SupplierDevelopmentData
