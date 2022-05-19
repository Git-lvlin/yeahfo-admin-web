import React, { useEffect, useState } from 'react'
import { PageContainer } from '@/components/PageContainer';
import { StatisticCard } from '@ant-design/pro-card'
import ProForm, { ProFormSelect } from '@ant-design/pro-form'
import { Button, Form, Space, Radio } from 'antd'
import moment from 'moment'
import { history } from 'umi'

import TableList from './table-list'
import styles from './styles.less'
import { amountTransform } from '@/utils/utils'
import {
  findYueSales,
  findYueGmv
} from '@/services/data-board/data-board'

const { Group } = StatisticCard

const StatisticCard_ = (props) => {
  const {
    title,
    date,
    Bottom,
    isGMV
  } = props
  const salesNum = (e) => {
    return isGMV ? amountTransform(e.sumGmv, '/') : amountTransform(e.daySale, '/')
  }
  return (
    <div className={styles.statisticCard}>
      <StatisticCard
        statistic={{
          title: <h2>{title}</h2>,
          value: ' ',
          layout: 'inline'
        }}
        footer={
          <>
            {
              date?.map((res, index)=> {
                switch(res.dateType) {
                  case 1:
                    return (
                      <div key={index}>
                        今日：
                        <span>{salesNum(res)}</span>
                      </div>
                    )
                  case 2:
                    return (
                      <div key={index}>
                        本周：
                        <span>{salesNum(res)}</span>
                      </div>
                    )
                  case 3:
                    return (
                      <div key={index}>
                        本月：
                        <span>{salesNum(res)}</span>
                      </div>
                    )
                }
              })
            }
            <Bottom />
          </>
        }
      />
    </div>
  )
}

const skipToRank = (type, orderType) => {
  history.push(`/data-board/rank?type=${type}&orderType=${orderType}`)
}

const ClassOfView = ()=> {
  const dateNow = moment(+new Date()).format('YYYY-MM-DD')
  const [search, setSearch] = useState(0)
  const [type, setType] = useState(1)
  const [gmv, setGmv] = useState([])
  const [sales, setSales] = useState([])
  const [load, setLoad] = useState(false)
  const date = (day) => {
    return moment().subtract(day, 'days').calendar().replaceAll('/', '-')
  }
  const [dateSelect, setDateSelect] = useState(date(7))
  const [form] = Form.useForm()
 
  const handleChange = (v)=> {
    switch(v) {
      case 1: 
        setDateSelect(date(7))
      break
      case 2:
        setDateSelect(date(15))
      break
      case 3:
        setDateSelect(date(30))
      break
    }
  }

  const orderTypeChange = (e) => {
    setType(e.target.value)
  }

  useEffect(()=>{
    setLoad(true)
    findYueGmv({
      time: dateNow
    }).then(res=> {
      if(res.success) setGmv(res.data)
    }).finally(()=> {
      setLoad(false)
    })
    return ()=> {
      setGmv([])
    }
  },[])

  useEffect(()=>{
    findYueSales({
      time: dateNow
    }).then(res=> {
      if(res.success) setSales(res.data)
    })
    return ()=> {
      setSales([])
    }
  },[])

  return (
    <PageContainer title={false}>
      <Group
        title="关键指标"
        loading={load}
      >
        {
          gmv.dateListResponseList?.map((item, idx)=> {
            if(item.type === 1) {
              return (
                <StatisticCard_
                  key={idx}
                  isGMV={true}
                  title="B端集约GMV："
                  date={item.dwdYueGmvResponseList}
                  Bottom={()=>(
                    <Space size="large">
                      <Button
                        className={styles.mt15}
                        onClick={()=>skipToRank(1, 'intensive')}
                      >
                        商家月排名
                      </Button>
                      <Button 
                        className={styles.mt15}
                        onClick={()=>skipToRank(2, 'intensive')}
                      >
                        会员店月排名
                      </Button>
                    </Space>
                  )}
                />
              )
            } else if(item.type === 2) {
              return (
                <StatisticCard_
                  key={idx}
                  isGMV={true}
                  title="C端集约GMV："
                  date={item.dwdYueGmvResponseList}
                  Bottom={()=>(
                    <Button
                      className={styles.mt15}
                      onClick={()=>skipToRank(3, 'intensive')}
                    >
                      会员店月排名
                    </Button>
                  )}
                />
              )
            } else if(item.type === 3) {
              return (
                <StatisticCard_
                  key={idx}
                  isGMV={true}
                  title="秒约GMV："
                  date={item.dwdYueGmvResponseList}
                  Bottom={()=>(
                    <Button
                      className={styles.mt15}
                      onClick={()=>skipToRank(4, 'normal')}
                    >
                      商家月排名
                    </Button>
                  )}
                />
              )
            } else if(item.type === 4) {
              return (
                <StatisticCard_
                  key={idx}
                  isGMV={true}
                  title="1688GMV："
                  date={item.dwdYueGmvResponseList}
                  Bottom={()=>(
                    <Button 
                      className={styles.mt15}
                      onClick={()=>skipToRank(5, 'normal')}
                    >
                      内部店月排名
                    </Button>
                  )}
                />
              )
            } 
          })
        }
      </Group>
      <Group loading={load}>
        {
          sales.salesDateListResponseList?.map((item, idx)=> {
            if(item.type === 1) {
              return (
                <StatisticCard_
                  key={idx}
                  isGMV={false}
                  title="B端集约销售额："
                  date={item.dwdYueGmvResponseList}
                  Bottom={()=>(
                    <Space size="large">
                      <Button 
                        className={styles.mt15}
                        onClick={()=>skipToRank(6, 'intensive')}
                      >
                        商家月排名
                      </Button>
                      <Button
                        className={styles.mt15}
                        onClick={()=>skipToRank(7, 'intensive')}
                      >
                        会员店月排名
                      </Button>
                    </Space>
                  )}
                />
              )
            } else if(item.type === 2) {
              return (
                <StatisticCard_
                  key={idx}
                  isGMV={false}
                  title="C端集约销售额："
                  date={item.dwdYueGmvResponseList}
                  Bottom={()=>(
                    <Button 
                      className={styles.mt15}
                      onClick={()=>skipToRank(8, 'intensive')}
                    >
                      会员店月排名
                    </Button>
                  )}
                />
              )
            } else if(item.type === 3) {
              return (
                <StatisticCard_
                  key={idx}
                  isGMV={false}
                  title="秒约GMV销售额："
                  date={item.dwdYueGmvResponseList}
                  Bottom={()=>(
                    <Button 
                      className={styles.mt15}
                      onClick={()=>skipToRank(9, 'normal')}
                    >
                      商家月排名
                    </Button>
                  )}
                />
              )
            } else if(item.type === 4) {
              return (
                <StatisticCard_
                  key={idx}
                  isGMV={false}
                  title="1688销售额："
                  date={item.dwdYueGmvResponseList}
                  Bottom={()=>(
                    <Button
                      className={styles.mt15}
                      onClick={()=>skipToRank(10, 'normal')}
                    >
                      内部店月排名
                    </Button>
                  )}
                />
              )
            }
            
          })
        }
      </Group>
      <ProForm
        form={form}
        style={{ 
          backgroundColor: '#fff', 
          padding: 10,
          margin: 20,
          marginRight: 0,
          marginLeft: 0
        }}
        submitter={{
          render: ({ form }) => {
            return (
              <div>
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
                      setSearch(0)
                      setDateSelect(date(7))
                    }}
                  >
                    重置
                  </Button>
                </Space>
              </div>
            )
          }
        }}
        layout="inline"
        onFinish={() => {
          setSearch(search + 1)
        }}
      >
        <ProFormSelect
          width="sm"
          name="date"
          initialValue={1}
          options={[
            { 
              value: 1,
              label: '最近7天'
            }, 
            {
              value: 2,
              label: '最近15天'
            },
            {
              value: 3,
              label: '最近30天'
            }
          ]}
          fieldProps={{
            onChange: (e) => {
              handleChange(e)
            },
            onClear:()=> {
              setDateSelect('')
            },
            allowClear: false
          }}
        />
        <div className={styles.date}>
          {dateSelect} 至 {dateNow}
        </div>
      </ProForm>
      <Radio.Group
        buttonStyle="solid"
        optionType="button"
        size="large"
        value={type}
        onChange={orderTypeChange}
        options={[
          {
            label: 'B端集约',
            value: 1
          },
          {
            label: 'C端集约',
            value: 2
          },
          {
            label: '秒约',
            value: 3
          },
          {
            label: '1688',
            value: 4
          }
        ]}
      />
      <TableList
        startTime={dateSelect}
        endTime={ dateNow }
        type={type}
        form={form}
        search={search}
      />
    </PageContainer>
  )
}

export default ClassOfView
