import React, { useEffect, useState } from 'react'
import { PageContainer } from '@/components/PageContainer';
import { StatisticCard } from '@ant-design/pro-card'
import ProForm, { ProFormSelect } from '@ant-design/pro-form'
import { Button, Form, Space } from 'antd'
import moment from 'moment'
import { history } from 'umi'

import FormTable from './form'
import styles from './styles.less'
import {
  sumDayGmv,
  sumWeekGmv,
  sumMonthGmv,
  sumDaySales,
  sumWeekSales,
  sumMonthSales,
  sumDayOrderCount,
  sumWeekOrderCount,
  sumMonthOrderCount,
  sumDayPayCount,
  sumWeekPayCount,
  sumMonthPayCount,
} from '@/services/data-board/data-board'
import { amountTransform } from '@/utils/utils'

const { Divider, Group } = StatisticCard

const SalesData = ()=> {
  const dateNow = moment(+new Date()).format('YYYY-MM-DD')
  const [search, setSearch] = useState(0)
  const [dayGmv, setDayGmv] = useState(0)
  const [weekGmv, setWeekGmv] = useState(0)
  const [monthkGmv, setMonthGmv] = useState(0)
  const [daySales, setDaySales] = useState(0)
  const [weekSales, setWeekSales] = useState(0)
  const [monthSales, setMonthSales] = useState(0)
  const [dayOrder, setDayOrder] = useState(0)
  const [weekOrder, setWeekOrder] = useState(0)
  const [monthOrder, setMonthOrder] = useState(0)
  const [dayPay, setDayPay] = useState(0)
  const [weekPay, setWeekPay] = useState(0)
  const [monthPay, setMonthPay] = useState(0)
  const [load, setLoad] = useState(false)
  const date = (day) => {
    return moment().subtract(day, 'days').calendar().replaceAll('/', '-')
  }
  const [dateSelect, setDateSelect] = useState(date(7))
  const [form] = Form.useForm()
  
  useEffect(()=>{
    setLoad(true)
    sumDayGmv({time: dateNow}).then(res=> {
      if(res.success) {
        setDayGmv(res.data)
      } else {
        setDayGmv({})
      }
    }).finally(()=> {
      setLoad(false)
    })
    sumWeekGmv({time: dateNow}).then(res=> {
      if(res.success) {
        setWeekGmv(res.data)
      } else {
        setWeekGmv({})
      }
    })
    sumMonthGmv({time: dateNow}).then(res=> {
      if(res.success) {
        setMonthGmv(res.data)
      } else {
        setMonthGmv({})
      }
    })
    sumDaySales({time: dateNow}).then(res=> {
      if(res.success) {
        setDaySales(res.data)
      } else {
        setDaySales({})
      }
    })
    sumWeekSales({time: dateNow}).then(res=> {
      if(res.success) {
        setWeekSales(res.data)
      } else {
        setWeekSales({})
      }
    })
    sumMonthSales({time: dateNow}).then(res=> {
      if(res.success) {
        setMonthSales(res.data)
      } else {
        setMonthSales({})
      }
    })
    sumDayOrderCount({time: dateNow}).then(res=> {
      if(res.success) {
        setDayOrder(res.data)
      } else {
        setDayOrder({})
      }
    })
    sumWeekOrderCount({time: dateNow}).then(res=> {
      if(res.success) {
        setWeekOrder(res.data)
      } else {
        setWeekOrder({})
      }
    })
    sumMonthOrderCount({time: dateNow}).then(res=> {
      if(res.success) {
        setMonthOrder(res.data)
      } else {
        setMonthOrder({})
      }
    })
    sumDayPayCount({time: dateNow}).then(res=> {
      if(res.success) {
        setDayPay(res.data)
      } else {
        setDayPay({})
      }
    })
    sumWeekPayCount({time: dateNow}).then(res=> {
      if(res.success) {
        setWeekPay(res.data)
      } else {
        setWeekPay({})
      }
    })
    sumMonthPayCount({time: dateNow}).then(res=> {
      if(res.success) {
        setMonthPay(res.data)
      } else {
        setMonthPay({})
        setWeekGmv({})
        setMonthGmv({})
        setDaySales({})
        setWeekSales({})
        setMonthSales({})
        setDayOrder({})
        setWeekOrder({})
        setMonthOrder({})
        setDayPay({})
        setWeekPay({})
        setMonthPay({})
      }
    })
    return()=> {
      setDayGmv({})
    }
  },[])

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
  const skipToClassOfView = ()=> {
    history.push('/data-board/class-of-view')
  }
  return (
    <PageContainer title={false}>
      <Group
        title="????????????"
        direction="row"
        loading={load}
        extra={
          <Button onClick={()=>skipToClassOfView()}>
            ????????????
          </Button>
        }
      >
        <StatisticCard
          statistic={{
            title: <h2>GMV???</h2>,
            value: ' ',
            layout: 'inline'
          }}
          footer={
            <>
              <div>
                ?????????
                <span>{amountTransform(dayGmv.sumGmv, '/')}</span>
              </div>
              <div>
                ?????????
                <span>{amountTransform(weekGmv.sumGmv, '/')}</span>
              </div>
              <div>
                ?????????
                <span>{amountTransform(monthkGmv.sumGmv, '/')}</span>
              </div>
            </>
          }
        />
        <Divider />
        <StatisticCard
          statistic={{
            title: <h2>GMV????????????</h2>,
            value: ' ',
            layout: 'inline'
          }}
          footer={
            <>
              <div>
                ?????????
                <span>{dayOrder.gmvOrderCount}</span>
              </div>
              <div>
                ?????????
                <span>{weekOrder.gmvOrderCount}</span>
              </div>
              <div>
                ?????????
                <span>{monthOrder.gmvOrderCount}</span>
              </div>
            </>
          }
        />
        <Divider />
        <StatisticCard
          statistic={{
            title: <h2>????????????</h2>,
            value: ' ',
            layout: 'inline'
          }}
          footer={
            <>
              <div>
                ?????????
                <span>{amountTransform(daySales.sumSale, '/')}</span>
              </div>
              <div>
                ?????????
                <span>{amountTransform(weekSales.sumSale, '/')}</span>
              </div>
              <div>
                ?????????
                <span>{amountTransform(monthSales.sumSale, '/')}</span>
              </div>
            </>
          }
        />
        <Divider />
        <StatisticCard
          statistic={{
            title: <h2>??????????????????</h2>,
            value: ' ',
            layout: 'inline'
          }}
          footer={
            <>
              <div>
                ?????????
                <span>{dayPay.payCount}</span>
              </div>
              <div>
                ?????????
                <span>{weekPay.payCount}</span>
              </div>
              <div>
                ?????????
                <span>{monthPay.payCount}</span>
              </div>
            </>
          }
        />
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
                    ??????
                  </Button>
                  <Button
                    onClick={() => {
                      form?.resetFields()
                      setSearch(0)
                      setDateSelect(date(7))
                    }}
                  >
                    ??????
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
              label: '??????7???'
            }, 
            {
              value: 2,
              label: '??????15???'
            },
            {
              value: 3,
              label: '??????30???'
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
          {dateSelect} ??? {dateNow}
        </div>
      </ProForm>
      <FormTable
        startTime={dateSelect}
        endTime={ dateNow }
        form={form}
        search={search}
      />
    </PageContainer>
  )
}

export default SalesData
