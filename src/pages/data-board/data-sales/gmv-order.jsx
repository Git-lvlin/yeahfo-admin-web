import React, { useState, useEffect } from 'react'
import { PageContainer } from '@/components/PageContainer';
import ProTable from '@ant-design/pro-table'
import { history, useLocation } from 'umi'
import { Button, Spin } from 'antd'
import moment from 'moment'

import { gmvOrder } from '@/services/data-board/data-board'
import { amountTransform } from '@/utils/utils'

const GmvOrder = () => {
  const [orderData, setOrderData] = useState([])
  const [loading, setLoading] = useState(false) 
  const { query } = useLocation()
  const  time = moment(Number(query.date)).format('YYYY-MM-DD')
  const type = query.type

  const skipToOrderDetail = (e) => {
    if(type === '1') {
      history.push(`/order-management/intensive-order/supplier-order-detail/${e.subId}`)
    } else {
      history.push(`/order-management/normal-order-detail/${e.subId}`)
    }
  }

  useEffect(() => {
    setLoading(true)
    gmvOrder({
      time,
      type
    }).then(res => {
      setOrderData(res.data)
    }).finally(() => {
      setLoading(false)
    })
    return () => {
      setOrderData([])
    }
  }, [])

  const columns = [
    {
      title: '序号',
      dataIndex: 'serialNum',
      valueType: 'indexBorder'
    },
    {
      title: '订单号',
      dataIndex: 'subId',
      align: 'center'
    },
    {
      title: '订单金额（￥/元）',
      dataIndex: 'totalAmount',
      align: 'center',
      render: (_) => amountTransform(_, '/')
    },
    {
      title: '订单详情',
      dataIndex: 'option',
      align: 'center',
      render: (_, records)=> <a onClick={()=>skipToOrderDetail(records)}>查看</a>
    },
  ]

  return (
    <PageContainer title={false}>
      <Spin spinning={loading}>
        <ProTable
          rowKey='subId'
          columns={columns}
          search={false}
          toolBarRender={false}
          toolbar={false}
          dataSource={orderData}
          pagination={false}
        />
      </Spin>
      <Button
        type='primary'
        onClick={
          () => { window.history.back(); setTimeout(() => { window.location.reload(); }, 200) }
        }
      >
        返回
      </Button>
    </PageContainer>
  )
}

export default GmvOrder
