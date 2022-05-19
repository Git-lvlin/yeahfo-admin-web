import React, { useState, useEffect } from 'react'
import { 
  Chart, 
  Line, 
  Point, 
  Tooltip, 
  Legend,
  Interval,
  Axis
} from 'bizcharts'
import ProCard, { CheckCard } from '@ant-design/pro-card'
import { Empty, Space, Typography, Tooltip as Tp, Radio } from 'antd'
import { useRequest } from 'umi'
import { QuestionCircleOutlined } from '@ant-design/icons'

import Yuan from '../components/Yuan'
import { briefCount, briefCountDetail } from '@/services/data-board/summary-of-data'
import { amountTransform } from '@/utils/utils'
import styles from './style.less'

const { Paragraph, Title, Text } = Typography

const RealTime = () => {
  const [title, setTitle] = useState("支付金额")
  const [unit, setUnit] = useState('单位：元')
  const [lineData, setLineData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [code, setCode] = useState("payAmount")
  const [type, setType] = useState(1)
  const { data } = useRequest(briefCount)
 
  useEffect(() => {
    setLoading(true)
    briefCountDetail({
      listType: type,
      code
    }).then(res=> {
      const arr = res&&res.data.map(item=> {
        if(item) {
          return {timeName: item?.timeName, countTime: item?.countTime, value: Number(item?.value)}
        } else {
          return false
        }
      })
      setLineData(arr)
    }).finally(()=> {
      setLoading(false)
    })
    return ()=> {
      setLineData(null)
    }
  }, [code, type])

  const onChange = (e) => {
    setType(e.target.value)
  }

  const scale = {
    value: {
      min: 0,
      alias: unit
    }
  }

  const chartUnit = {
    style: {
      fontSize: 12,
      textAlign: 'center',
      fill: '#E66101'
    },
    position: 'end',
    rotate: 0,
		offset: 80
  }

  return (
    <ProCard
      title="今日实时"
      headerBordered
    >
      <ProCard colSpan="50%">
        <ProCard 
          title={title}
          style={{ height: 500 }}
          loading={loading}
        >
          {
            (lineData&&lineData?.[0]) ? 
            <>
              {
                code === 'newUser' || code === 'newStore' ?
                <Chart 
                  height={400}
                  padding="auto" 
                  data={lineData} 
                  autoFit
                  scale={scale}
                >
                  <Axis
                    name='value'
                    title={chartUnit}
                  />
                  <Interval
                    adjust={[
                      {
                        type: 'dodge',
                        marginRatio: 0,
                      },
                    ]}
                    color="timeName"
                    position="countTime*value"
                    label={[
                      "value",
                      ()=>({
                        position: "middle",
                        style: {
                          fill: "#fff"
                        }
                      })
                    ]}
                  />
                  <Tooltip shared />
                </Chart>:
                <>
                  <span>趋势图类型：</span>
                  <Radio.Group 
                    onChange={onChange}
                    value={type}
                    size="large"
                  >
                    <Radio value={1}>各时间点不相加</Radio>
                    <Radio value={2}>各时间点相加</Radio>
                  </Radio.Group>
                  <Chart
                    scale={scale}
                    autoFit
                    height={440}
                    data={lineData}
                    interactions={['element-active']}
                    forceUpdate
                  >
                    <Axis
                      name="value"
                      title={chartUnit}
                    />
                    <Point
                      position="countTime*value"
                      color="timeName"
                      shape='circle' 
                    />
                    <Line 
                      shape="line"
                      position="countTime*value"
                      color="timeName"
                    />
                    <Tooltip
                      shared
                      showCrosshairs
                    />
                    <Legend
                      position="top"
                      background={{
                        style: {
                          fill: '#fff',
                          stroke: '#fff'
                        }
                      }}
                      itemName={{
                        style: {
                          fontSize: 16
                        }
                      }}
                    />
                  </Chart>
                </>
              }
            </>:
            <Empty />
          }
        </ProCard>
      </ProCard>
      <CheckCard.Group
        onChange={(value) => {
          switch(value) {
            case 'payAmount':
              setCode(value)
              setTitle('支付金额')
              setUnit('单位：元')
              break
            case 'orderCode':
              setCode(value)
              setTitle('支付订单数')
              setUnit('单位：笔')
              break
            case 'orderMember':
              setCode(value)
              setUnit('单位：人')
              setTitle('下单用户数')
              break
            case 'registerMember':
              setCode(value)
              setUnit('单位：人')
              setTitle('新增用户数')
              break
            case 'registerStore':
              setCode(value)
              setUnit('单位：人')
              setTitle('新增店主数')
              break
            case 'newUser':
              setCode('newUser')
              setUnit('单位：人')
              setTitle('截止到今日累计用户数')
              break
            case 'newStore':
              setCode('newStore')
              setUnit('单位：人')
              setTitle('截止到今日累计店主数')
              break
          }
        }}
        value={code}
      >
        <ProCard 
          gutter={[36, 36]}
          wrap
        >
          <CheckCard 
            style={{ width: "36%", height: 110, position: 'relative' }}
            bordered
            description={
              <>
                <Paragraph>
                  <Space size={20}>
                    <Text>支付金额</Text>
                    <Title level={3}>
                      ￥<Yuan>{amountTransform(data?.payAmount?.today, '/')}</Yuan>
                    </Title>
                  </Space>
                  <div className={styles.checkCard}>
                    <Tp title='当天所有已支付的订单总金额'>
                      <QuestionCircleOutlined />
                    </Tp>
                  </div>
                </Paragraph>
                <Paragraph>
                  <Space size={20}>
                    <Text>昨日全天</Text>
                    <span>
                      ￥<Yuan>{amountTransform(data?.payAmount?.yestoday, '/')}</Yuan>
                    </span>
                  </Space>
                </Paragraph>
              </>
            }
            value={data?.payAmount?.code}
          />
          <CheckCard 
            style={{ width: "36%", height: 110, position: 'relative' }}
            bordered
            description={
              <>
                <Paragraph>
                  <Space size={20}>
                    <Text>支付订单数</Text>
                    <Title level={3}>
                      <Yuan>{data?.orderCount?.today}</Yuan>
                    </Title>
                  </Space>
                  <div className={styles.checkCard}>
                    <Tp title='当天所有已支付的订单总数'>
                      <QuestionCircleOutlined />
                    </Tp>
                  </div>
                </Paragraph>
                <Paragraph>
                  <Space size={20}>
                    <Text>昨日全天</Text>
                    <Yuan>{data?.orderCount?.yestoday}</Yuan>
                  </Space>
                </Paragraph>
              </>
            }
            value={ data?.orderCount?.code }
          />
          <CheckCard 
            style={{ width: "36%", height: 110, position: 'relative' }}
            bordered
            description={
              <>
                <Paragraph>
                  <Space size={20}>
                    <Text>下单用户数</Text>
                    <Title level={3}>
                      <Yuan>{data?.orderMember?.today}</Yuan>
                    </Title>
                  </Space>
                  <div className={styles.checkCard}>
                    <Tp title='当天所有支付成功的下单总人数'>
                      <QuestionCircleOutlined />
                    </Tp>
                  </div>
                </Paragraph>
                <Paragraph>
                  <Space size={20}>
                    <Text>昨日全天</Text>
                    <Yuan>{data?.orderMember?.yestoday}</Yuan>
                  </Space>
                </Paragraph>
              </>
            }
            value={data?.orderMember?.code}
          />
         <CheckCard 
            style={{ width: "36%", height: 110, position: 'relative' }}
            bordered
            disabled
            description={
              <>
                <Paragraph>
                  <Space size={20}>
                    <Text>访客数</Text>
                    <Title level={3}>
                      <Yuan>{data?.accessCount?.today}</Yuan>
                    </Title>
                  </Space>
                  <div className={styles.checkCard}>
                    <Tp title='当天打开app进行访问的人数，每人只计算1次'>
                      <QuestionCircleOutlined />
                    </Tp>
                  </div>
                </Paragraph>
                <Paragraph>
                  <Space size={20}>
                    <Text>昨日全天</Text>
                    <Yuan>{data?.accessCount?.yestoday}</Yuan>
                  </Space>
                </Paragraph>
              </>
            }
            value={data?.accessCount?.code}
          />
          <CheckCard 
            style={{ width: "36%", height: 110, position: 'relative' }}
            bordered
            description={
              <>
                <Paragraph>
                  <Space size={20}>
                    <Text>新增用户数</Text>
                    <Title level={3}>
                      <Yuan>{data?.registerMember?.today}</Yuan>
                    </Title>
                  </Space>
                  <div className={styles.checkCard}>
                    <Tp title='当天注册成功的用户数'>
                      <QuestionCircleOutlined />
                    </Tp>
                  </div>
                </Paragraph>
                <Paragraph>
                  <Space size={20}>
                    <Text>昨日全天</Text>
                    <Yuan>{data?.registerMember?.yestoday}</Yuan>
                  </Space>
                </Paragraph>
              </>
            }
            value={data?.registerMember?.code}
          />
          <CheckCard 
            style={{ width: "36%", height: 110, position: 'relative' }}
            bordered
            description={
              <>
                <Paragraph>
                  <Space size={20}>
                    <Text>新增店主数</Text>
                    <Title level={3}>
                      <Yuan>{data?.registerStore?.today}</Yuan>
                    </Title>
                  </Space>
                  <div className={styles.checkCard}>
                    <Tp title='当天人工审核通过，开店成功的店主数'>
                      <QuestionCircleOutlined />
                    </Tp>
                  </div>
                </Paragraph>
                <Paragraph>
                  <Space size={20}>
                    <Text>昨日全天</Text>
                    <Yuan>{data?.registerStore?.yestoday}</Yuan>
                  </Space>
                </Paragraph>
              </>
            }
            value={data?.registerStore?.code}
          />
          <CheckCard 
            style={{ width: "36%", height: 110, position: 'relative' }}
            bordered
            description={
              <>
                <Paragraph>
                  <Space size={20}>
                    <Text>截止到今天累计用户数</Text>
                    <Title level={3}>
                      <Yuan>{data?.totalUser?.today}</Yuan>
                    </Title>
                  </Space>
                </Paragraph>
                <Paragraph>
                  <Space size={20}>
                    <Text>截止到昨日</Text>
                    <Yuan>{data?.totalUser?.yestoday}</Yuan>
                  </Space>
                </Paragraph>
              </>
            }
            value='newUser'
          />
          <CheckCard 
            style={{ width: "36%", height: 110, position: 'relative' }}
            bordered
            description={
              <>
                <Paragraph>
                  <Space size={20}>
                    <Text>截止到今天累计审核通过店主数</Text>
                    <Title level={3}>
                      <Yuan>{data?.totalStore?.today}</Yuan>
                    </Title>
                  </Space>
                </Paragraph>
                <Paragraph>
                  <Space size={20}>
                    <Text>截止到昨日</Text>
                    <Yuan>{data?.totalStore?.yestoday}</Yuan>
                  </Space>
                </Paragraph>
              </>
            }
            value='newStore'
          />
        </ProCard>
      </CheckCard.Group>
    </ProCard>
  )
}

export default RealTime
