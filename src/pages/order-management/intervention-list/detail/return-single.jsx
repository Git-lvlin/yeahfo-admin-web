import React, {useEffect, useState} from 'react'
import { Button, Timeline, Empty } from 'antd'
import ProDescriptions from '@ant-design/pro-descriptions'
import { ModalForm } from '@ant-design/pro-form'
import moment from 'moment'

import { amountTransform } from '@/utils/utils'
import { expressInfo } from '@/services/order-management/intervention-list'

import styles from './styles.less'
const { Item } = Timeline

const ReturnSingle = props => {
  const { data, type } = props
  const [address, setAddress] = useState({})
  const showLastStatus = lastStatus => {
    if(lastStatus){
      return lastStatus?.map((item)=>(
        <Item key={item.time}>
          <span className={styles.time}>{item.time}</span>
          {item.content}
        </Item>
      ))
    } else {
      return <Empty className={styles.empty}/>
    }
  }
  useEffect(()=>{
    data?.returnShippingCode&&
    expressInfo({
      shippingCode: data?.returnShippingCode,
      expressType: data?.returnExpressType,
      mobile: data?.returnPhone,
      deliveryTime: data?.returnTime
    }).then(res => {
      setAddress(res?.data)
    })
    return () => {
      setAddress({})
    }
  }, [data])

  const isRefunds = ()=> {
    return type === 2 ? false : true
  }

  const columns =[
    {
      title: '商品退回方式',
      dataIndex: 'afterSalesType',
      valueType: 'select',
      valueEnum: {
        1: '无需退回',
        2: '快递寄送'
      }
    },
    {
      title: '售后类型',
      dataIndex: 'afterSalesType',
      valueEnum: {
        1: '退款',
        2: '退款退货'
      },
    },
    {
      title: '买家收货地址',
      dataIndex: 'receiveAddress',
      render: (_, records) => records.buyerDeliveryInfo?.fullAddress
    },
    {
      title: '买家昵称',
      dataIndex: 'buyerNickname'
    },
    {
      title: '买家手机号',
      dataIndex: 'buyerPhone'
    },
    {
      title: '申请时间',
      dataIndex: 'applyTime',
      valueType: 'dataTime',
      render: (_) => moment(_).format('YYYY-MM-DD HH:mm:ss')
    },
    {
      title: '订单编号',
      dataIndex: 'subOrderSn'
    },
    {
      title: '退款总金额',
      dataIndex: 'returnAmount',
      render:(_) =>`¥${amountTransform(_, '/').toFixed(2)}`
    },
    {
      title: '退货物流信息',
      dataIndex: 'returnGoodsInfo',
      hideInDescriptions: isRefunds(),
      render: () => {
        return(
          <div style={{display: 'flex', alignItems:'center'}}>
            <div>
              <div style={{marginBottom: 10}}>
                快递公司：
                <span style={{marginRight: 20}}>
                  {address?.expressName}
                </span>
              </div>
              <div>运单编号：
                <span style={{marginRight: 20}}>
                  {address?.shippingCode}
                </span>
              </div>
            </div>
            <ModalForm
              title='快递消息'
              width={800}
              modalProps={{
                closable: true,
                destroyOnClose: true
              }}
              trigger={
                <Button size="large" type="default">查看快递详情</Button>
              }
              onFinish={()=> true}
            >
              <Timeline className={styles.timelineWarp}>
                {showLastStatus(address?.deliveryList)}
              </Timeline>
            </ModalForm>
          </div>
        )
      }
    },
    { 
      title: '商家收件人名称',
      dataIndex: 'receiveMan',
      hideInDescriptions: isRefunds()
    },
    {
      title: '商家收货手机号',
      dataIndex: 'receivePhone',
      hideInDescriptions: isRefunds()
    },
    {
      title: '商家收货地址',
      dataIndex: 'receiveAddress',
      hideInDescriptions: isRefunds()
    },
    {
      title: '商家收货时间',
      dataIndex: 'receiveTime',
      hideInDescriptions: isRefunds(),
      render: (_) => {
        if(_) return moment(_).format('YYYY-MM-DD HH:mm:ss')
        return ''
      }
    }
  ]

  return (
    <ProDescriptions
      rowKey='orderNumber'
      className={styles.description}
      dataSource={data}
      layout='horizontal'
      bordered
      title='退货单信息'
      column={1}
      columns={columns}
    />
  )
}

export default ReturnSingle
