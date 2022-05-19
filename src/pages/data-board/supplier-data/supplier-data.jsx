import React, { useState, useRef, useEffect } from 'react'
import { PageContainer } from '@/components/PageContainer';
import ProTable from '@ant-design/pro-table'
import { history } from 'umi'
import moment from 'moment'
import { Space, Tooltip, Radio } from 'antd'
import { QuestionCircleOutlined } from '@ant-design/icons'

import { supplierData, supplierSalesRank } from '@/services/data-board/supplier-data'
import Yuan from '../components/Yuan'
import styles from './styles.less'
import Export from '@/pages/export-excel/export'
import ExportHistory from '@/pages/export-excel/export-history'
import SelectDate from '../components/SelectDate'
import { getTimeDistance } from '@/utils/utils'
import BarChart from './bar-chart'
import SupplierDataOverview from './supplier-data-overview'

const SupplierData = () => {
  const [amount, setAmount] = useState(0)
  const form = useRef()
  const [visit, setVisit] = useState(false)
  const [rangePickerValue, setRangePickerValue] = useState(getTimeDistance('nearly-7-days'))
  const [value, setValue] = useState(1)
  const [data, setData] = useState([])
  
  useEffect(() => {
    supplierSalesRank({
      startTime: rangePickerValue?.[0].format('YYYY-MM-DD'),
      endTime: rangePickerValue?.[1].format('YYYY-MM-DD'),
      type: value
    }).then(res=> {
      setData(res.data.map(res => ({...res, supplierId: `供应商ID：${res.supplierId}`, 金额: res.amount})))
    })
    return () => {
      setData([])
    };
  }, [rangePickerValue, value])

  const getFieldValue = () => {
    const { time, ...rest } = form.current.getFieldsValue()
    return {
      startTime: time?.[0]?.format('YYYY-MM-DD'),
      endTime: time?.[1]?.format('YYYY-MM-DD'),
      ...rest
    }
  }

  const selectDate = (type) => {
    setRangePickerValue(getTimeDistance(type))
  }

  const handleRangePickerChange = (value) => {
    setRangePickerValue(value)
  }
  
  const onChange = e => {
    setValue(e.target.value)
  }

  const skipToDeatil = (e, id, name, state) => {
    const { time } = form?.current?.getFieldsValue?.()
    const startTime = time&&moment(time?.[0]).format('YYYY-MM-DD')
    const endTime = time&&moment(time?.[1]).format('YYYY-MM-DD')
    const date = time?`&startTime=${startTime}&endTime=${endTime}`: ''
    const type = state?`&state=${state}`: ''
    history.push(`/data-board/supplier-data/detail?type=${e}&id=${id}&storeName=${name}${date}${type}`)
  }

  const columns = [
    {
      title: '供应商ID',
      dataIndex: 'supplierId',
      align: 'center',
      hideInSearch: true
    },
    {
      title: '供应商ID',
      dataIndex: 'supplierId',
      align: 'center',
      valueType: 'digit',
      hideInTable: true
    },
    {
      title: '统计时间范围',
      dataIndex: 'time',
      valueType: 'dateRange',
      hideInTable: true
    },
    {
      title: '已审核通过SPU数量',
      dataIndex: 'approvedSpuNum',
      align: 'center',
      hideInSearch: true,
      render: (_, r) => <a onClick={()=>skipToDeatil('amount', r?.supplierId, r.supplierName, 1)}>{_}</a>
    },
    {
      title: '已审核通过SKU数量',
      dataIndex: 'approvedSkuNum',
      align: 'center',
      hideInSearch: true,
      render: (_, r) => <a onClick={()=>skipToDeatil('amount', r?.supplierId, r.supplierName, 1)}>{_}</a>
    },
    {
      title: '未审核通过SPU数量',
      dataIndex: 'notApprovedSpuNum',
      align: 'center',
      hideInSearch: true,
      render: (_, r) => <a onClick={()=>skipToDeatil('amount', r?.supplierId, r.supplierName, 0)}>{_}</a>
    },{
      title: '未审核通过SKU数量',
      dataIndex: 'notApprovedSkuNum',
      align: 'center',
      hideInSearch: true,
      render: (_, r) => <a onClick={()=>skipToDeatil('amount', r?.supplierId, r.supplierName, 0)}>{_}</a>
    },
    {
      title: '上架中的SPU数量',
      align: 'center',
      hideInSearch: true,
      children: [
        {
          title: '秒约',
          dataIndex: 'secondSaleSpuNum',
          align: 'center',
          render: (_, r) => <a onClick={()=>skipToDeatil('sales', r?.supplierId, r.supplierName, 2)}>{_}</a>
        },
        {
          title: '集约',
          dataIndex: 'wholesaleSaleSpuNum',
          align: 'center',
          render: (_, r) => <a onClick={()=>skipToDeatil('sales', r?.supplierId, r.supplierName, 1)}>{_}</a>
        }
      ]
    },
    {
      title: '上架中的SKU数量',
      align: 'center',
      hideInSearch: true,
      children: [
        {
          title: '秒约',
          dataIndex: 'secondSaleSkuNum',
          align: 'center',
          render: (_, r) => <a onClick={()=>skipToDeatil('sales', r?.supplierId, r.supplierName, 2)}>{_}</a>
        },
        {
          title: '集约',
          dataIndex: 'wholesaleSaleSkuNum',
          align: 'center',
          render: (_, r) => <a onClick={()=>skipToDeatil('sales', r?.supplierId, r.supplierName, 1)}>{_}</a>
        }
      ]
    },
    {
      title: '秒约销售总额(元)',
      dataIndex: 'secondAmountYuan',
      align: 'center',
      hideInSearch: true,
      render: (_, r) => <a onClick={()=>skipToDeatil('second', r?.supplierId, r.supplierName)}>{_}</a>
    },
    {
      title: 'B端集约销售总额（元）',
      dataIndex: 'wholesaleAmountYuan',
      align: 'center',
      hideInSearch: true,
      render: (_, r) => <a onClick={()=>skipToDeatil('intensive', r?.supplierId, r.supplierName)}>{_}</a>
    },
    {
      title: '总销售额(元)',
      dataIndex: 'totalAmountYuan',
      align: 'center',
      hideInSearch: true
    },
    {
      title: ()=>(
        <Space>
          <span>总货款(元)</span>
          <Tooltip title="已扣除手续费，包含红包补贴的金额（不含盲盒订单）">
            <QuestionCircleOutlined/>
          </Tooltip>
        </Space>
      ),
      dataIndex: 'totalPaymentYuan',
      align: 'center',
      hideInSearch: true
    }
  ]
  
  return (  
    <PageContainer title={false}>
      <div className={styles.timeSearch}>
        <Space size={20}>
          <h3>供应商销售排名</h3>
          <SelectDate
            selectDate={selectDate}
            rangePickerValue={rangePickerValue}
            handleRangePickerChange={handleRangePickerChange}
            code="data-board-supplier-sales-rank"
            type={value}
          />
        </Space>
      </div>
      <div className={styles.radioArea}>
        <Radio.Group 
          onChange={onChange}
          value={value}
          size="large"
          style={{
            marginBottom: 20
          }}
        >
          <Radio value={1}>秒约销售额</Radio>
          <Radio value={2}>集约销售额</Radio>
        </Radio.Group>
        <BarChart data={data}/>
      </div>
      <SupplierDataOverview/>
      <ProTable
        rowKey="supplierId"
        style={{
          marginTop: 30
        }}
        formRef={form}
        request={supplierData}
        params={{}}
        columns={columns}
        postData={(v) => {
          setAmount(v.total)
          return v.records
        }}
        bordered
        pagination={{
          showQuickJumper: true,
          pageSize: 10
        }}
        search={{
          labelWidth: 120,
          optionRender: (searchConfig, formProps, dom)=> [
            ...dom.reverse(),
            <Export
              change={(e)=> {setVisit(e)}}
              key="export" 
              type="supplier-data-statistics-export"
              conditions={getFieldValue}
            />,
            <ExportHistory
              key="export-history" 
              show={visit} setShow={setVisit}
              type="supplier-data-statistics-export"
            />
          ]
        }}
        toolbar={{
          settings: false
        }}
        tableRender={(_, dom) => (
          <>
            { dom }
            { 
              <div className={styles.summary}>
                <span>商家总数：<Yuan>{amount}</Yuan></span>
              </div>
            }
          </>
        )}
      />
    </PageContainer>
  )
}

export default SupplierData
