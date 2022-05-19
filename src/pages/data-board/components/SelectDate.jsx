import React, { useState } from 'react'
import { Space, Radio, DatePicker } from 'antd'

import styles from './style.less'
const { RangePicker } = DatePicker
import Export from '@/pages/export-excel/export'
import ExportHistory from '@/pages/export-excel/export-history'

const SelectDate = ({
  rangePickerValue,
  handleRangePickerChange,
  selectDate, 
  code,
  type
}) => {
  const [visit, setVisit] = useState(false)

  const getFieldValue = () => {
    return {
      startTime: rangePickerValue?.[0].format('YYYY-MM-DD'),
      endTime: rangePickerValue?.[1].format('YYYY-MM-DD'),
      type
    }
  }

  const handleChange = (v)=> {
    switch(v.target.value) {
      case 7:
        selectDate('nearly-7-days')
      break
      case 15: 
        selectDate('nearly-15-days')
      break
      case 30:
        selectDate('nearly-a-month')
      break
      case 90:
        selectDate('nearly-3-month')
      break
    }
  }
  return (
    <div className={styles.selectDate}>
      <Space size={10}>
        <Radio.Group
          defaultValue={7}
          buttonStyle="solid"
          onChange= {
            (e) => {
              handleChange(e)
            }
          }
        >
          <Radio.Button value={7}>近7天</Radio.Button>
          <Radio.Button value={15}>近15天</Radio.Button>
          <Radio.Button value={30}>近30天</Radio.Button>
          <Radio.Button value={90}>近3个月</Radio.Button>
        </Radio.Group>
        <RangePicker
          value={rangePickerValue}
          onChange={handleRangePickerChange}
          style={{
            width: 256,
          }}
          allowClear={false}
        />
        <Export
          change={(e)=> {setVisit(e)}}
          key="export" 
          type={code}
          conditions={getFieldValue}
        />
        <ExportHistory 
          key="export-history" 
          show={visit} setShow={setVisit}
          type={code}
        />
      </Space>
    </div>
  )
}

export default SelectDate
