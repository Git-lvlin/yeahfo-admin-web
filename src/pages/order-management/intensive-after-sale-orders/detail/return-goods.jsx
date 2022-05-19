import React, { useState } from 'react'
import ProTable from '@ant-design/pro-table'
import { amountTransform } from '@/utils/utils'
import { Image } from 'antd'
import { history, useLocation } from 'umi';

import styles from './styles.less'
import Detail from '@/pages/order-management/intensive-order/supplier-order/detail'

const tableRow = props => {
  const imageArr = () => {
    const imgUrl = props[0]?.imageUrl?.split(',')
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
            <span className={styles.summaryItemText}>商家库存不足</span>
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
  const [visible, setVisible] = useState(false)
  const [id, setId] = useState()
  const location = useLocation();
  const isPurchase = location.pathname.includes('purchase')
  const dataSource = Array.isArray(data) ? [] : [data]

  const columns = [
    {
      title: '商品信息',
      dataIndex: 'goodsName',
      align: 'center',
      width: 450,
      render: (_, records) => (
        <div className={styles.goodsInfo}>
          <Image
            width={80}
            height={80}
            src={records?.imageUrl}
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
      dataIndex: 'price',
      align: 'center',
      render: (_) => `¥${amountTransform(Number(_), '/').toFixed(2)}`
    },
    { 
      title: '数量',
      dataIndex: 'totalNum',
      align: 'center' 
    },
    { 
      title: '单位',
      dataIndex: 'unit',
      align: 'center' 
    },
    { 
      title: '退款数量',
      dataIndex: 'returnNum',
      align: 'center' 
    },
    {
      title: '应退金额',
      dataIndex: 'refundMoney',
      align: 'center',
      render: (_) => `¥${amountTransform(Number(_), '/').toFixed(2)}`
    },
    {
      title: '订单状态',
      dataIndex: 'status',
      align: 'center',
      render: (_, records) => (
        <>
          <div>{{0:'待支付',1:'已付预付款',2:'已付尾款/待发货',3:'待收货',4:'会员店已收货(暂时没有用)',5:'订单完成',6:'订单关闭'}[_]}</div>
          <a onClick={()=>{setVisible(true);setId(records?.orderId)}}>查看订单详情</a>
        </>
      )
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
      {visible &&<Detail
        id={id}
        visible={visible}
        setVisible={setVisible}
        isPurchase={isPurchase}
      />
      }
    </>
  )
}

export default ReturnGoods
