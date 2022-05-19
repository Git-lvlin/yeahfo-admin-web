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
import { communityStoreSalesRank, communityStoreData } from '@/services/data-board/community-store-data'
import Export from '@/pages/export-excel/export'
import ExportHistory from '@/pages/export-excel/export-history'
import { getTimeDistance } from '@/utils/utils'
import CommunityStoreDataOverview from './community-store-data-overview'
import ServiceCharge from './service-charge'

const CommunityStoreData = () => {
  const [rangePickerValue, setRangePickerValue] = useState(getTimeDistance('nearly-7-days'))
  const [value, setValue] = useState(1)
  const [data, setData] = useState([])
  const [visit, setVisit] = useState(false)
  const [unit, setUnit] = useState('单位： 单')
  const form = useRef()

  useEffect(() => {
    communityStoreSalesRank({
      startTime: moment(rangePickerValue?.[0]).format("YYYY-MM-DD"),
      endTime: moment(rangePickerValue?.[1]).format("YYYY-MM-DD"),
      type: value
    }).then(res => {
      setData(res.data.map(item=>(
        {storeName: item.storeName, value: Number(item.value)}
      )))
    })
    return () => {
      setData([])
    }
  }, [rangePickerValue, value])
  
  const onChange = e => {
    setValue(e.target.value)
    if(e.target.value === 1) {
      setUnit('单位：单')
    } else {
      setUnit('单位：元')
    }
  }

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

  const handleRangePickerChange = (value) => {
    setRangePickerValue(value)
  }

  const columns = [
    {
      title: '社区店名称',
      dataIndex: 'storeName',
      align: 'center',
      width: '15%'
    },
    {
      title: '地区范围',
      dataIndex: 'area',
      renderFormItem: () => (<AddressCascader changeOnSelect/>),
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
          <span>采购订单数量</span>
          <Tooltip title='指参与集约活动下单并支付的订单数量'>
            <QuestionCircleOutlined />
          </Tooltip>
        </Space>
      ),
      dataIndex: 'orderCt',
      hideInSearch: true,
      align: 'center'
    },
    {
      title: '采购总金额',
      dataIndex: 'bSaleTotal',
      hideInSearch: true,
      align: 'center'
    },
    {
      title: '收益总额',
      dataIndex: 'totalAmount',
      hideInSearch: true,
      align: 'center'
    },
    {
      title: '佣金总收益',
      dataIndex: 'suggestCommission',
      hideInSearch: true,
      align: 'center'
    },
    {
      title: ()=>(
        <Space>
          <span>推荐总收益</span>
          <Tooltip title='包含推荐店主的业绩奖励和推荐的消费者购买了非集约商品的奖励'>
            <QuestionCircleOutlined />
          </Tooltip>
        </Space>
      ),
      dataIndex: 'storeCommission',
      hideInSearch: true,
      align: 'center'
    },
    {
      title: '补贴总收益',
      dataIndex: 'storeDeliverFee',
      hideInSearch: true,
      align: 'center'
    },
    {
      title: ()=>(
        <Space>
          <span>可参与集约活动的总数</span>
          <Tooltip title='指平台目前所有正在进行中的集约活动数量'>
            <QuestionCircleOutlined />
          </Tooltip>
        </Space>
      ),
      dataIndex: 'totalWsCt',
      hideInSearch: true,
      align: 'center'
    },
    {
      title: '已参与集约活动的次数',
      dataIndex: 'wsCt',
      hideInSearch: true,
      align: 'center'
    },
    {
      title: ()=>(
        <Space>
          <span>单店集约参与率</span>
          <Tooltip title='已参与的次数/可参与集约活动的总数'>
            <QuestionCircleOutlined/>
          </Tooltip>
        </Space>
      ),
      dataIndex: 'wsRat',
      hideInSearch: true,
      align: 'center'
    },
    {
      title: 'C端销售订单数',
      dataIndex: 'cOrderCt',
      hideInSearch: true,
      align: 'center'
    },
    {
      title: 'C端销售总金额',
      dataIndex: 'cSaleTotal',
      hideInSearch: true,
      align: 'center'
    },
    {
      title: ()=>(
        <Space>
          <span>成功邀请用户数量</span>
          <Tooltip title='已绑定关系的用户数量'>
            <QuestionCircleOutlined/>
          </Tooltip>
        </Space>
      ),
      dataIndex: 'invitUserCt',
      hideInSearch: true,
      align: 'center'
    },
    {
      title: ()=>(
        <Space>
          <span>成功邀请店主数量</span>
          <Tooltip title='成功邀请并已审核通过的店主数量（包含已注销的店主）'>
            <QuestionCircleOutlined/>
          </Tooltip>
        </Space>
      ),
      dataIndex: 'invitStoreCt',
      hideInSearch: true,
      align: 'center'
    }
  ]

  return (
    <PageContainer title={false}>
      <div className={styles.timeSearch}>
        <Space size={20}>
          <h3>社区店销售排名</h3>
          <SelectDate
            selectDate={selectDate}
            rangePickerValue={rangePickerValue}
            handleRangePickerChange={handleRangePickerChange}
            code={value === 1 ? 'data-board-community-orderNum-export' : 'data-board-community-orderAmount-export'}
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
            marginBottom: 30
          }}
        >
          <Radio value={1}>采购订单总量</Radio>
          <Radio value={2}>采购金额</Radio>
        </Radio.Group>
        <BarChart data={data} unit={unit}/>
      </div>
      <CommunityStoreDataOverview/>
      <div className={styles.table}>
        <ProTable
          rowKey="storeName"
          formRef={form}
          search={{
            labelWidth: 120,
            optionRender: (searchConfig, formProps, dom) => [
              ...dom.reverse(),
              <Export
                change={(e)=> {setVisit(e)}}
                key="export" 
                type="data-board-community-store-export"
                conditions={()=>{return getFieldValue(searchConfig)}}
              />,
              <ExportHistory 
                key="export-history" 
                show={visit}
                setShow={setVisit}
                type="data-board-community-store-export"
              />
            ]
          }}
          columns={columns}
          request={communityStoreData}
          params={{}}
          toolbar={{
            settings: false
          }}
          pagination={{
            showQuickJumper: true,
            pageSize: 10
          }}
        />
      </div>
      <ServiceCharge/>
    </PageContainer>
  )
}

export default CommunityStoreData
