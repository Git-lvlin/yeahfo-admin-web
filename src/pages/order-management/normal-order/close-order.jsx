import React from 'react'
import { ModalForm } from '@ant-design/pro-form'

import { closeOrderAndRefund } from '@/services/order-management/normal-order'


const CloseOrder = ({
  subOrderId,
  visible,
  setVisible,
  setChange,
  change
}) => {

  const order = () => {
    closeOrderAndRefund({
      id: subOrderId
    },
    {
      showSuccess: true,
      showError: true
    }).then(res => {
      if(res.success) {
        setTimeout(()=>{
          setChange(change+1)
        }, 1000)
      }
    })
  }

  return (
    <ModalForm
      title="操作确认"
      visible={visible}
      onVisibleChange={setVisible}
      width={500}
      modalProps={{
        destroyOnClose: true,
        onCancel: ()=>{setVisible(false)}
      }}
      onFinish={async () => {
        await order()
        return true
      }}
      layout='horizontal'
    >
      <p>本次操作，将会导致当前订单，“待发货”状态修改为“已关闭”状态，并进行退款。<br/>确认要执行此操作吗？</p>
    </ModalForm>
  )
}

export default CloseOrder
