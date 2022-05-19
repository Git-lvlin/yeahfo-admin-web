import React, { useState, useEffect } from 'react'
import ProForm, { ProFormDateRangePicker } from '@ant-design/pro-form'
import ProCard from '@ant-design/pro-card'
import { Space, Button, Typography, Tooltip } from 'antd'
import { QuestionCircleOutlined } from '@ant-design/icons'
import moment from 'moment'
import { communityStoreDataOverview } from '@/services/data-board/community-store-data'

import styles from './styles.less'
import Yuan from '../components/Yuan'
import { amountTransform } from '@/utils/utils'
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
        render: ({ form }) => {
          return (
            <Space>
              <Button
                type="primary"
                onClick={() => {
                  form?.submit()
                }}
              >
                查询
              </Button>
              <Button
                onClick={() => {
                  form?.resetFields()
                  form?.submit()
                }}
              >
                重置
              </Button>
              <Export
                change={(e)=> {setVisit(e)}}
                key="export" 
                type="data-board-community-store-data-overview"
                conditions={getValues}
              />
              <ExportHistory 
                key="export-history" 
                show={visit} setShow={setVisit}
                type="data-board-community-store-data-overview"
              />
            </Space>
          )
        }
      }}
      layout="inline"
      onFinish={(value) => {
        setTimes(value?.time)
      }}
    >
      <h3 className={styles.title}>社区店数据总览</h3>
      <ProFormDateRangePicker 
        label="时间范围"
        name="time"
        initialValue={times}
        allowClear={false}
      />
    </ProForm>
  )
}

const CommunityStoreDataOverview = () => {
  const dateNow = moment(+new Date()).format('YYYY-MM-DD')
  const startTimes = moment('20200101').format('YYYY-MM-DD')
  const [times, setTimes] = useState([startTimes, dateNow])
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(()=>{
    setLoading(true)
    communityStoreDataOverview({
      startTime: times?.[0],
      endTime: times?.[1]
    }).then(res => {
      setData(res.data?.[0])
    }).finally(()=>{
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
          <Text>店主申请总数</Text>
          <Title level={3}>
            <Yuan>{data?.applyCommunityStoreNum}</Yuan>
          </Title>
        </ProCard>
        <ProCard bordered loading={loading}>
          <Text>已审核通过的店主总数</Text>
          <Title level={3}>
            <Yuan>{data?.passApplyNum}</Yuan>
          </Title>
        </ProCard>
        <ProCard bordered loading={loading}>
          <Text>已注销的店主总数</Text>
          <Title level={3}>
            <Yuan>{data?.hasStoreCancelNum}</Yuan>
          </Title>
        </ProCard>
        <ProCard bordered style={{position: 'relative'}} loading={loading}>
          <Text>店主集约率</Text>
          <Title level={3}>
            {data?.wsRat}
          </Title>
          <div className={styles.checkCard}>
            <Tooltip title='下单的店主数/总店主数（已审核的店主）'>
              <QuestionCircleOutlined />
            </Tooltip>
          </div>
        </ProCard>
        <ProCard bordered loading={loading}>
          <Text>未绑运营中心的店主数量</Text>
          <Title level={3}>
            <Yuan>{data?.unboundedOperationsStoresNum}</Yuan>
          </Title>
        </ProCard>
      </ProCard>
    </div>
  )
}

export default CommunityStoreDataOverview
