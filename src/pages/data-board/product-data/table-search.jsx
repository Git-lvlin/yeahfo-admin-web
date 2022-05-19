import React from 'react'
import ProForm, { ProFormSelect } from '@ant-design/pro-form'
import { Space, Button, DatePicker } from 'antd'

import styles from './styles.less'

const { RangePicker } = DatePicker

const TableSearch = ({
  rangePickerValue,
  isActive,
   handleRangePickerChange,
  selectDate,
  selectType
}) => {
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
            </Space>
          )
        }
      }}
      layout="inline"
      onFinish={(v) => {
        selectType(v.type)
      }}
    >
      <h3 className={styles.title}>商品分类统计</h3>
      <ProForm.Item
        name="time"
        label="统计时间范围"
      >
        <div className={styles.salesExtraWrap}>
          <div className={styles.salesExtra}>
            <a className={isActive('yesterday')} onClick={() => selectDate('yesterday')}>
              昨天
            </a>
            <a className={isActive('week')} onClick={() => selectDate('week')}>
              本周
            </a>
            <a className={isActive('month')} onClick={() => selectDate('month')}>
              本月
            </a>
            <a className={isActive('year')} onClick={() => selectDate('year')}>
              本年
            </a>
          </div>
          <RangePicker
            value={rangePickerValue}
            onChange={handleRangePickerChange}
            style={{
              width: 256,
            }}
            allowClear={false}
          />
        </div>
      </ProForm.Item>
      <ProFormSelect
        name="type"
        label="商品类型"
        width="md"
        initialValue="1"
        proFieldProps={{
          allowClear: false
        }}
        options={[
          {
            label: '全部商品',
            value: '1'
          },
          {
            label: '集约商品',
            value: '15'
          },
          {
            label: '秒约商品',
            value: '2'
          }
        ]}
      />
    </ProForm>
  )
}

export default TableSearch
