import React, { useState, useEffect } from 'react'
import { Spin, Empty, Drawer } from 'antd'
import { getRefundStoreOrderDetail } from '@/services/order-management/intensive-after-sale-orders'
import OrderDetailStatus from './order-detail-status'
import BasicInformation from './basic-information'
import ReturnGoods from './return-goods'
import WantSlipsMessage from './want-slips-message'
import styles from './styles.less'

const Detail = ({id, visible, setVisible }) => {

  const [orderDetail, setOrderDetail] = useState([])
  const [consultationRecord, setConsultationRecord] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(()=>{
    setLoading(true)
    getRefundStoreOrderDetail({trSn:id}).then(res => {
      setOrderDetail(res?.data)
    }).finally(()=>{
      setLoading(false)
    })
  }, [id])

  return (
    <Drawer
      visible={visible}
      onClose={()=>setVisible(false)}
      title={false}
      width={1200}
    >
       <Spin spinning={loading}>
        <OrderDetailStatus data={orderDetail}
        />
        <BasicInformation data={orderDetail?.order}/>
        <ReturnGoods data={{...orderDetail?.order,returnNum:orderDetail?.returnNum,refundMoney:orderDetail?.refundMoney,orderId:orderDetail?.orderId}}/>
        <WantSlipsMessage data={orderDetail}/>
       </Spin>
    </Drawer>
  )
}
export default Detail