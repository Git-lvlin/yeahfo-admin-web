import React, { useState, useEffect } from 'react'
import { Spin, Empty, Drawer } from 'antd'

import { refundOrderDetail, findReturnRecord,getRefundStoreOrderDetail } from '@/services/order-management/after-sales-order'
import OrderDetailStatus from './order-detail-status'
import BasicInformation from './basic-information'
import ReturnGoods from './return-goods'
import ReturnInformation from './return-information'
import NegotiationHistory from './negotiation-history'
import styles from './styles.less'

const Detail = ({id, visible, setVisible }) => {

  const [orderDetail, setOrderDetail] = useState([])
  const [consultationRecord, setConsultationRecord] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(()=>{
    setLoading(true)
    refundOrderDetail({id}).then(res => {
      setOrderDetail(res?.data)
    }).finally(()=>{
      setLoading(false)
    })
  }, [id])

  useEffect(()=>{
    if(orderDetail != ![]) {
      findReturnRecord({id: orderDetail?.id}).then(res=> {
        if(res?.success) {
          setConsultationRecord(res?.data)
        }
      })
    }
    return ()=>{
      setConsultationRecord([])
    }
  }, [orderDetail])

  return (
    <Drawer
      visible={visible}
      onClose={()=>setVisible(false)}
      title={false}
      width={1200}
    >
       <Spin spinning={loading}>
        <OrderDetailStatus 
          orderSn={orderDetail?.orderSn}
          status={orderDetail?.status}
          platformInvolved={orderDetail?.platformInvolved}
        />
        <BasicInformation data={orderDetail}/>
        <ReturnGoods data={orderDetail}/>
        <ReturnInformation
          data={orderDetail}
          status={orderDetail?.afterSalesType}
          type={orderDetail?.status}
        />
        <div className={styles.negotiation}>协商历史</div>
        {
          Object.keys(consultationRecord)?.length === 0 ? 
          <Empty className={styles.empty}/>:
          <NegotiationHistory data={consultationRecord}/>
        }
       </Spin>
    </Drawer>
  )
}
export default Detail