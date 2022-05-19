import React, { useState, useEffect } from 'react'
import { PageContainer } from '@/components/PageContainer';
import { Button, Radio, Spin } from 'antd'
import ProTable from '@ant-design/pro-table'
import { useLocation, history } from 'umi'
import moment from 'moment'

import { moreTypeSaleSumYue } from '@/services/data-board/data-board'
import { amountTransform } from '@/utils/utils'

const SalesDetail = () => {
  const [type, setType] = useState(1)
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false) 
  const { query } = useLocation()
  useEffect(()=>{
    setLoading(true)
    moreTypeSaleSumYue({
      time: moment(Number(query.date)).format('YYYY-MM-DD'),
      type
    }).then(res => {
      setData(res.data)
    }).finally(()=> {
      setLoading(false)
    })
    return ()=> {
      setData([])
    }
  },[type])

  const orderTypeChange = (e) => {
    setType(e.target.value)
  }

  const columns = [
    {
      title: '销售额（￥/元）',
      dataIndex: 'daySale',
      align: 'center',
      render: (_) => amountTransform(Number(_), '/')
    },
    {
      title: '订单数',
      dataIndex: 'payCount',
      align: 'center'
    },
    {
      title: '明细',
      dataIndex: 'detail',
      align: 'center',
      render: ()=> <a onClick={()=>{history.push(`/data-board/sales-order?date=${query.date}&type=${type}`)}}>查看</a>
    }

  ]

  return (
    <PageContainer title={false}>
      <Radio.Group
        buttonStyle="solid"
        optionType="button"
        size="large"
        value={type}
        onChange={orderTypeChange}
        options={[
          {
            label: 'B端集约销售额',
            value: 1
          },
          {
            label: 'C端集约销售额',
            value: 2
          },
          {
            label: '秒约销售额',
            value: 3
          },
          {
            label: '1688销售额',
            value: 4
          }
        ]}
      />
      <Spin spinning={loading}>
        <ProTable 
          rowKey="daySale"
          search={false}
          dataSource={data}
          toolbar={false}
          toolBarRender={false}
          columns={columns}
          pagination={false}
        />
        <Button
          type='primary'
          onClick={
            () => { window.history.back(); setTimeout(() => { window.location.reload(); }, 200) }
          }
        >
          返回
        </Button>
      </Spin>
    </PageContainer>
  )
}

export default SalesDetail
