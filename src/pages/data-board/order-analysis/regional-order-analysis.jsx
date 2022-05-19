import React, { useState, useEffect } from 'react'
import ProForm, { ProFormDateRangePicker } from '@ant-design/pro-form'
import { Space, Radio, Button } from 'antd'
import moment from 'moment'

import Histogram from './histogram'
import styles from './styles.less'
import { areaOrderAnalysis } from '@/services/data-board/order-analysis'
import AddressCascader from '@/components/address-cascader'

const now = new Date()
const oneDay = 1000 * 60 * 60 * 24
const theMonth = () => {
  let day = now.getDay()
  now.setHours(0)
  now.setMinutes(0)
  now.setSeconds(0)

  if (day === 0) {
    day = 6
  } else {
    day -= 1
  }

  const beginTime = now.getTime() - day * oneDay
  return [moment(beginTime), moment(beginTime + (7 * oneDay - 1000))]
}

const RegionalOrderAnalysis = () => {
  const [histogramValue, setHistogramValue] = useState(1)
  const [data, setData] = useState([])
  const [times, setTimes] = useState(theMonth().map(item=> moment(item).format("YYYY-MM-DD")))
  const [area, setArea] = useState(null)
  const [unit, setUnit] = useState('单位：单')

  useEffect(()=> {
    areaOrderAnalysis({
      startTime: times?.[0], 
      endTime: times?.[1], 
      province_id: area?.[0]?.value,
      city_id: area?.[1]?.value,
      type: histogramValue
    }).then(res => {
      if(res.success) {
        const arr = res.data.map(item=> {
          if(item) {
            return {reportName: item?.reportName, cityName: item?.cityName, value: Number(item?.value)}
          } else {
            return false
          }
        })
        setData(arr)
      }
    })
    return () => {
      setData([])
    }
  }, [histogramValue, times, area])

  const histogramChange = e => {
    setHistogramValue(e.target.value)
    if(e.target.value === 1) {
      setUnit('单位：单')
    } else {
      setUnit('单位：元')
    }
  }

  return (
    <>
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
              </Space>
            )
          }
        }}
        layout="inline"
        onFinish={(value) => {
          setTimes(value?.time)
          setArea(value.area)
        }}
      >
        <h3 className={styles.title}>地区订单分析</h3>
        <ProFormDateRangePicker 
          label="统计时间范围"
          name="time"
          initialValue={times}
        />
        <ProForm.Item
          name="area"
          label="地区范围"
        >
          <AddressCascader areaData={window.yeahgo_area.filter(item=>item.deep !== 3)}/>
        </ProForm.Item>
      </ProForm>
      <div className={styles.radioArea}>
        <Radio.Group 
          onChange={histogramChange}
          value={histogramValue}
          size="large"
        >
          <Radio value={1}>订单数</Radio>
          <Radio value={2}>交易额</Radio>
        </Radio.Group>
        <Histogram
          data={data} 
          unit={unit}
        />
      </div>
    </>
  )
}

export default RegionalOrderAnalysis
