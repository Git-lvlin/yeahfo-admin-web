import React, { useState } from 'react'
import ProTable from '@ant-design/pro-table'
import { amountTransform } from '@/utils/utils'
import { Image } from 'antd'

import styles from './styles.less'
import NormalOrderDetail from '@/pages/order-management/normal-order/detail'
import ShopkeeperOrderDetail from '@/pages/order-management/intensive-order/supplier-order/detail'

const tableRow = props => {
  const imageArr = () => {
    const imgUrl = props[0]?.proofImageUrl?.split(',')
    return imgUrl?.map(url => {
      if(url) {
        return(
          <Image
            key={url}
            width={80}
            height={80}
            src={url}
          />
        )
      }
    })
  }
  return (
    <ProTable.Summary.Row>
      <ProTable.Summary.Cell colSpan={8}>
        <div className={styles.summary}>
          <div className={styles.summaryItem}>
            售后原因：
            <span className={styles.summaryItemText}>{props[0]?.reason}</span>
          </div>
          <div className={styles.summaryItem}>
            售后描述：
            <span className={styles.summaryItemText}>{props[0]?.description}</span>
          </div>
          <div className={styles.summaryImg}>
            <div className={styles.summaryItemTxt}>售后凭证：</div>
            <div className={styles.summaryItemPic}>
              <Image.PreviewGroup>
                { imageArr() }  
              </Image.PreviewGroup>
            </div>
          </div>
        </div>
      </ProTable.Summary.Cell>
    </ProTable.Summary.Row>
  )
}

const ReturnGoods = ({data}) => {
  const [normalOrderVisible, setNormalOrderVisible] = useState(false)
  const [shopkeeperOrderVisible, setShopkeeperOrderVisible] = useState(false)
  const [id, setId] = useState()

  const dataSource = Array.isArray(data) ? [] : [data]


  const skipToOrderDetail = (type, id) => {
    switch(type){
      case 1:
      case 2:
      case 3:
      case 4:
      case 11:
        setId(id)
        setNormalOrderVisible(true)
      break
      case 15:
      case 16:
        setId(id)
        setShopkeeperOrderVisible(true)
      break
      default:
        return ''
    }
  }

  const columns = [
    {
      title: '商品信息',
      dataIndex: 'goodsInfo',
      align: 'center',
      width: 450,
      render: (_, records) => (
        <div className={styles.goodsInfo}>
          <Image
            width={80}
            height={80}
            src={records?.goodsImageUrl}
          />
          <div className={styles.goodsContent}>
            <div>{records?.goodsName}</div>
            <div className={styles.skuName}>{records?.skuName}</div>
          </div>
        </div>
      )
    },
    {
      title: '单价',
      dataIndex: 'skuSalePrice',
      align: 'center',
      render: (_) => `¥${amountTransform(Number(_), '/').toFixed(2)}`
    },
    { 
      title: '数量',
      dataIndex: 'returnNum',
      align: 'center' 
    },
    { 
      title: '单位',
      dataIndex: 'unit',
      align: 'center' 
    },
    {
      title: '小计',
      dataIndex: 'subtotal',
      align: 'center',
      render: (_, records) => `¥${amountTransform((records?.skuSalePrice * records?.returnNum), '/').toFixed(2)}`
    },
    {
      title: '实付金额',
      dataIndex: 'payAmount',
      align: 'center',
      render: (_) => `¥${amountTransform(Number(_), '/').toFixed(2)}`
    },
    {
      title: '订单状态',
      dataIndex: 'orderStatusStr',
      align: 'center',
      render: (_, records) => (
        <>
          <div>{_}</div>
          <a onClick={()=>skipToOrderDetail(records?.orderType, records?.subOrderId)}>查看订单详情</a>
        </>
      )
    },
    {
      title: '应退金额',
      dataIndex: 'returnAmount',
      align: 'center',
      render: (_) => `¥${amountTransform(Number(_), '/').toFixed(2)}`
    }
  ]

  return (
    <>
      <ProTable
        rowKey="orderItemId"
        pagination={false}
        columns={columns}
        bordered
        options={false}
        headerTitle="订单商品"
        search={false}
        dataSource={dataSource}
        summary={tableRow}
      />
      {
        normalOrderVisible &&
        <NormalOrderDetail
          id={id}
          visible={normalOrderVisible}
          setVisible={setNormalOrderVisible}
        />
      }
      {
        shopkeeperOrderVisible &&
        <ShopkeeperOrderDetail
          id={id}
          visible={shopkeeperOrderVisible}
          setVisible={setShopkeeperOrderVisible}
        />
      }
    </>
  )
}

export default ReturnGoods
