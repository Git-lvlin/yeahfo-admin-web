import React, { useState, useEffect } from 'react'
import ProForm, { ProFormDateRangePicker } from '@ant-design/pro-form'
import ProCard from '@ant-design/pro-card'
import { Typography } from 'antd'
import moment from 'moment'

import styles from './styles.less'
import Yuan from '../components/Yuan'
import { supplierDataOverview } from '@/services/data-board/supplier-data'
import Export from '@/pages/export-excel/export'
import ExportHistory from '@/pages/export-excel/export-history'

const { Text, Title } = Typography

const CardTitle = ({times, setTimes}) => {
  const [visit, setVisit] = useState(false)

  const getValues = () => {
    return {
      startTime: times?.[0],
      endTime: times?.[1],
      type: 'export'
    }
  }

  return (
    <ProForm
      style={{ 
        backgroundColor: '#fff', 
        padding: 10,
      }}
      submitter={{
        render: (props, doms) => {
          return [
            ...doms.reverse(),
            <Export
              change={(e)=> {setVisit(e)}}
              key="export" 
              type="data-board-supplier-data-overview"
              conditions={getValues}
            />,
            <ExportHistory 
              key="export-history" 
              show={visit} setShow={setVisit}
              type="data-board-supplier-data-overview"
            />
          ]
        }
      }}
      layout="inline"
      onFinish={(value) => {
        setTimes(value?.time)
      }}
    >
      <h3 className={styles.title}>供应商数据总览</h3>
      <ProFormDateRangePicker 
        label="时间范围"
        name="time"
        initialValue={times}
        allowClear={false}
      />
    </ProForm>
  )
}

const SupplierDataOverview = () => {
  const dateNow = moment(+new Date()).format('YYYY-MM-DD')
  const startTimes = moment('20200101').format('YYYY-MM-DD')
  const [times, setTimes] = useState([startTimes, dateNow])
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(()=>{
    setLoading(true)
    supplierDataOverview({
      startTime: times?.[0],
      endTime: times?.[1]
    }).then(res=> {
      setData(res.data)
    }).finally(()=> {
      setLoading(false)
    })
    return ()=>{
      setData(null)
    }
  }, [times])

  return (
    <div className={styles.community}>
      <ProCard
        gutter={[36, 36]}
        headerBordered
        title={<CardTitle times={times} setTimes={setTimes}/>}
      >
        <ProCard bordered loading={loading}>
          <Text>未审核的供应商数量</Text>
          <Title level={3}>
            <Yuan>{data?.notApprovedNum}</Yuan>
          </Title>
        </ProCard>
        <ProCard bordered loading={loading}>
          <Text>已审核未开户的供应商</Text>
          <Title level={3}>
            <Yuan>{data?.approvedNotAccountNum}</Yuan>
          </Title>
        </ProCard>
        <ProCard bordered loading={loading}>
          <Text>已审核已开户的供应商</Text>
          <Title level={3}>
            <Yuan>{data?.approvedOpenAccountNum}</Yuan>
          </Title>
        </ProCard>
      </ProCard>
    </div>
  )
}

export default SupplierDataOverview
