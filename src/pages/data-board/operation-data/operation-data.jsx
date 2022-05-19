import React, { useState, useEffect, useRef } from 'react'
import { PageContainer } from '@/components/PageContainer';
import { Space, Radio, Tooltip } from 'antd'
import moment from 'moment'
import ProTable from '@ant-design/pro-table'
import { QuestionCircleOutlined } from '@ant-design/icons'

import BarChart from './bar-chart'
import styles from './styles.less'
import SelectDate from '../components/SelectDate'
import AddressCascader from '@/components/address-cascader'
import { operationsCenterData, operationsCenterRank } from '@/services/data-board/operation-data'
import Export from '@/pages/export-excel/export'
import ExportHistory from '@/pages/export-excel/export-history'
import { getTimeDistance } from '@/utils/utils'
import OperationDataOverview from './operation-data-overview'
import { amountTransform } from '@/utils/utils'

const OperationData = () => {
  const [rangePickerValue, setRangePickerValue] = useState(getTimeDistance('nearly-7-days'))
  const [value, setValue] = useState(1)
  const [charData, setCharData] = useState([])
  const [visit, setVisit] = useState(false)
  const [unit, setUnit] = useState('单位：单')
  const form = useRef()

  const getFieldValue = () => {
    const { time, area, storeName, ...rest } = form.current.getFieldsValue()
    return {
      startTime: time?.[0]?.format('YYYY-MM-DD'),
      endTime: time?.[1]?.format('YYYY-MM-DD'),
      province: area?.[0],
      city: area?.[1],
      area: area?.[2],
      name: storeName,
      ...rest
    }
  }

  const selectDate = (type) => {
    setRangePickerValue(getTimeDistance(type))
  }

  useEffect(()=> {
    operationsCenterRank({
      startTime: moment(rangePickerValue?.[0]).format("YYYY-MM-DD"),
      endTime: moment(rangePickerValue?.[1]).format("YYYY-MM-DD"),
      type: value
    }).then(res=> {
      setCharData(res.data.map(item=>(
        {companyName: item.companyName, value: Number(item.value)}
      )))
    })
    return ()=> {
      setCharData([])
    }
  }, [value, rangePickerValue])
  
  const onChange = e => {
    setValue(e.target.value)
    if(e.target.value === 1) {
      setUnit('单位：单')
    } else {
      setUnit('单位：元')
    }
  }

  const handleRangePickerChange = (value) => {
    setRangePickerValue(value)
  }

  const columns = [
    {
      title: '运营中心名称',
      dataIndex: 'companyName',
      align: 'center'
    },
    {
      title: ()=>(
        <Space>
          <span>创建时间</span>
          <Tooltip title='在平台进行创建账号的时间'>
            <QuestionCircleOutlined/>
          </Tooltip>
        </Space>
      ),
      dataIndex: 'createTime',
      align: 'center',
      hideInSearch: true
    },
    {
      title: '地区范围',
      dataIndex: 'area',
      renderFormItem: () => (<AddressCascader areaData={window.yeahgo_area.filter(item=>item.deep !== 3)} />),
      hideInTable: true
    },
    {
      title: '统计时间范围',
      dataIndex: 'time',
      valueType: 'dateRange',
      hideInTable: true
    },
    {
      title: ()=>(
        <Space>
          <span>绑定社区店数量</span>
          <Tooltip title='指定时间范围内和运营中心进行绑定且通过审核的店主数量'>
            <QuestionCircleOutlined/>
          </Tooltip>
        </Space>
      ),
      dataIndex: 'storeCt',
      hideInSearch: true,
      align: 'center'
    },
    {
      title: ()=>(
        <Space>
          <span>运营中心集约率</span>
          <Tooltip title='有下单的店主数/店主总数量'>
            <QuestionCircleOutlined/>
          </Tooltip>
        </Space>
      ),
      dataIndex: 'wsRat',
      hideInSearch: true,
      align: 'center',
      render: (_)=> amountTransform(Number(_), '*') + '%' 
    },
    {
      title: '社区店采购订单总量',
      dataIndex: 'payCt',
      hideInSearch: true,
      align: 'center'
    },
    {
      title: '社区店采购订单总额',
      dataIndex: 'payTotal',
      hideInSearch: true,
      align: 'center'
    },
    {
      title: '总收益额',
      dataIndex: 'totalAmount',
      hideInSearch: true,
      align: 'center'
    },
    {
      title: '佣金总收益',
      dataIndex: 'agentCompanyCommission',
      hideInSearch: true,
      align: 'center'
    },
    {
      title: '补贴总收益',
      dataIndex: 'agentCompanyDeliverFee',
      hideInSearch: true,
      align: 'center'
    }
  ]

  return (
    <PageContainer title={false}>
      <div className={styles.timeSearch}>
        <Space size={20}>
          <h3>运营中心排名</h3>
          <SelectDate
            selectDate={selectDate}
            rangePickerValue={rangePickerValue}
            handleRangePickerChange={handleRangePickerChange}
            code= {value === 1 ? 'data-board-operations-orderNum-export,' : 'data-board-operations-totalfee-export'}
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
          <Radio value={1}>
            <Space>
              <span>社区店采购订单总量</span>
              <Tooltip title='指参与集约活动下单并支付的订单数量总和(所有已绑定关系的社区店)'>
                <QuestionCircleOutlined/>
              </Tooltip>
            </Space>
          </Radio>
          <Radio value={2}>
            <Space>
              <span>总收益排名</span>
              <Tooltip title='从创建账号进行收益分账算起，某个时间段内获的收益总额'>
                <QuestionCircleOutlined/>
              </Tooltip>
            </Space>
          </Radio>
        </Radio.Group>
        <BarChart data={charData} unit={unit}/>
      </div>
      <OperationDataOverview/>
      <ProTable
        rowKey="companyName"
        style={{
          marginTop: 30
        }}
        formRef={form}
        search={{
          labelWidth: 120,
          optionRender: (searchConfig, formProps, dom) => [
            ...dom.reverse(),
            <Export
              change={(e)=> {setVisit(e)}}
              key="export" 
              type="data-board-operations-centers-export"
              conditions={getFieldValue}
            />,
            <ExportHistory 
              key="export-history" 
              show={visit} setShow={setVisit}
              type="data-board-operations-centers-export"
            />
          ]
        }}
        columns={columns}
        request={operationsCenterData}
        params={{}}
        toolbar={{
          settings: false
        }}
        pagination={{
          showQuickJumper: true,
          pageSize: 10
        }}
      />
    </PageContainer>
  )
}

export default OperationData
