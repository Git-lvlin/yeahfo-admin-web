import React, { useState, useEffect } from 'react'
import { PageContainer } from '@/components/PageContainer';
import ProTable from '@ant-design/pro-table'
import { history, useLocation, useParams } from 'umi'
import { Button, Spin } from 'antd'

import {
  gmvFindByStoreId,
  gmvFindBySupperId,
  saleFindByStoreId,
  saleFindBySupperId
} from '@/services/data-board/ranking'
import { amountTransform } from '@/utils/utils'

const orderList = () => {
  const [orderData, setOrderData] = useState([])
  const [loading, setLoading] = useState(false) 
  const { query } = useLocation()
  const { id } = useParams()

  const skipToOrderDetail = (e) => {
    if(query.no === '1' || query.no === '2' || query.no === '6' || query.no === '7') {
      history.push(`/order-management/intensive-order/supplier-order-detail/${e.subId}`)
    } else {
      history.push(`/order-management/normal-order-detail/${e.subId}`)
    }
  }

  useEffect(() => {
    setLoading(true)
    if(query.no <= 5 && query.orderType === 'storeId') {
      gmvFindByStoreId({
        storeNo: id,
        type: query.type
      }).then(res=> {
        if(res.success){
          setOrderData(res.data)
        } else {
          setOrderData([])
        }
      }).finally(()=> {
        setLoading(false)
      })
    } else if(query.no <= 5 && query.orderType === 'supplierId') {
      console.log(2);
      gmvFindBySupperId({
        supplierId: id,
        type: query.type
      }).then(res=> {
        if(res.success){
          setOrderData(res.data)
        } else {
          setOrderData([])
        }
      }).finally(()=> {
        setLoading(false)
      })
    } else if(query.no >= 5 && query.orderType === 'storeId') {
      saleFindByStoreId({
        storeNo: id,
        type: query.type
      }).then(res=> {
        if(res.success){
          setOrderData(res.data)
        } else {
          setOrderData([])
        }
      }).finally(()=> {
        setLoading(false)
      })
    } else if(query.no >= 5 && query.orderType === 'supplierId') {
      saleFindBySupperId({
        supplierId: id,
        type: query.type
      }).then(res=> {
        if(res.success){
          setOrderData(res.data)
        } else {
          setOrderData([])
        }
      }).finally(()=> {
        setLoading(false)
      })
    }
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

export default orderList
