import React, { useRef, useEffect, useState } from 'react'
import styles from './styles.less'
import { Button, message, Space } from 'antd'
import ProForm, {
  ModalForm,
  ProFormSelect,
  ProFormTextArea
} from '@ant-design/pro-form'

import { interventionSentence, addressList } from '@/services/order-management/intervention-list'
import Upload from '@/components/upload'

const AfterState = ({status})=> {
  const result = () => {
    switch(status){
      case 1:
        return '介入申请'
      case 2:
        return '介入退款'
      default:
        return ''
    }
  }
  return (
    <div className={styles.detailTitle}>
      {result()}
    </div>
  )
}

const InterventionDetailStatus = props => {
  const {
    orderId,
    id,
    status,
    change,
    supplierId,
    type,
    isArbitration
  } = props
  const [address, setAddress] = useState([])
  useEffect(()=>{
    supplierId&&
    addressList({supplierId}).then(res=> {
      setAddress(res?.data)
    })
    return ()=> { 
      setAddress([])
    }
  }, [supplierId])

  const formRef = useRef()

  const Modal = props => {
    const { 
      title,
      btnType,
      winnerRole
     } = props
    return(
      <ModalForm
        layout="inline"
        title={title}
        width={600}
        formRef={formRef}
        trigger={
          <Button size="large" type={btnType}>{title}</Button>
        }
        modalProps={{
          destroyOnClose: true,
          onCancel: () => formRef.current?.resetFields()
        }}
        onFinish={(values)=> {
          let { platformEvidenceImg } = values
          platformEvidenceImg =  Array.isArray(platformEvidenceImg) ? platformEvidenceImg.join(',') : platformEvidenceImg
          const addrId = address?.filter(item=> item.id === values.address)[0]?.id
          interventionSentence({
            id: id,
            arbitrationResult: winnerRole,
            ...values,
            addressId: addrId,
            voucherPics: platformEvidenceImg
          }).then(res=>{
            if(res.success){
              change(true)
              message.success('提交成功')
              return true
            }
          })
          return true
        }}
      >
        <div className={styles.opinion}>
          <ProFormTextArea
            label="处理意见"
            name="description"
            width='lg'
            placeholder="请输入处理意见"
            rules={[
              {
                required: true,
                message: '请输入处理意见'
              }
            ]}
            fieldProps={{
              showCount: true,
              maxLength: 200
            }}
          />
        </div>
        {
          (winnerRole === 1 && status === 1 && type === 2) &&
          <div className={styles.opinion}>
            <ProFormSelect
              label="收货地址"
              name="address"
              options={address.map(item=>(
                {label: item.address, value: item.id}
              ))}
              placeholder="请选择收货地址"
              rules={[
                {
                  required: true,
                  message: '请选择收货地址'
                }
              ]}
            />
          </div>
        }
        <ProForm.Item
          name="platformEvidenceImg"
          label="处理凭证"
        >
          <Upload
            multiple maxCount={3}
            accept="image/*"
            size={1 * 1024} 
            code={219}
          />
        </ProForm.Item>
      </ModalForm>
    )
  }

  return (
    <div className={styles.interventionDetail}>
      <div>
        <div className={styles.detailTag}>
          售后单号
          <span>{orderId}</span>
        </div>
        <AfterState status={status}/>
      </div>
      {
        isArbitration === 1 &&
        <div className={styles.submitBtn}>
          <Space size='large'>
            <Modal title='买家败诉' btnType='default' winnerRole={2}/>
            <Modal title='买家胜诉' btnType='primary' winnerRole={1}/>
          </Space>
        </div>
      }
    </div>
  )
}

export default InterventionDetailStatus