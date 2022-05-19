import React, { useEffect, useState } from 'react'
import ProDescriptions from '@ant-design/pro-descriptions'
import { Drawer, Button } from "antd"

import { amountTransform } from '@/utils/utils'
import { 
  commissionDetail, 
  platformCommissionDetail, 
  goodsAmountDetail, 
  operationCommissionDetail
} from "@/services/financial-management/transaction-detail-management"
import { orderTypes } from '@/services/financial-management/common'
import './styles.less'
import styles from './styles.less'
import { fashionableType } from '../../common-function'

const TransactionDetails = (props) => {
  const {id, type, title, visible, setVisible} = props
  const [loading, setLoading] = useState(false)
  const [info, setInfo] = useState({})
  const [payInfos, setPayInfos] = useState([])
  const [orderType, setOrderType] = useState(null)

  const orderInfoTitle = {
    'commandSalesOrder': '提成比例',
    'hydrogen': '提成比例',
    'hydrogenRent': '提成比例', 
    'wholesaleFresh': '提成比例',
    'wholesaleSeckill': '关联活动',
    'storeShare': '提成比例'
  }

  const orderInfoDataIndex = {
    'commandSalesOrder': 'storeCommissionRatio',
    'hydrogen': 'commissionScaleDesc',
    'hydrogenRent': 'commissionScaleDesc', 
    'wholesaleFresh': 'storeCommissionRatio',
    'wholesaleSeckill': 'relevanceActivity',
    'storeShare': 'commissionScaleDesc'
  }

  const orderInfoRender = (_) => {
    return (
      {
        'commandSalesOrder': `￥${amountTransform(_, '/')}%`,
        'hydrogen': _,
        'hydrogenRent': _,
        'wholesaleFresh': `￥${amountTransform(_, '/')}%`, 
        'wholesaleSeckill': (
          <>
            <div>活动类型：{info?.activityTypeDesc}</div>
            <div>活动ID：{info?.activityId}</div>
          </>
        ),
        'storeShare': _
      }[info?.orderType] || ''
    )
  }

  const goodsInfoTitleSupply = {
    'commandCollect':'商品集约价', 
    'collectFresh': '商品集约价', 
    'hydrogenDeposit': '商品押金', 
    'hydrogenBoot': '商品启动价', 
    'hydrogenRent': '商品租金'
  }

  const goodsInfoDataIndexSupply = {
    'commandCollect': 'saleOrderPrice',
    'collectFresh': 'saleOrderPrice'
  }
  
  const goodsInfoTitleActual = {
    'wholesaleBulk': '商品集约价', 
    'hydrogenRent': '实际租金', 
    'wholesaleFresh': '商品集约价', 
    'commandSalesOrder': '商品集约价', 
    'wholesaleSeckill': '商品集约价'
  }

  const goodsInfoTitleBuy = {
    'wholesaleBulk': '预定数量', 
    'hydrogenRent': '租金期限', 
    'wholesaleFresh': '预定数量', 
    'commandSalesOrder': '预定数量', 
    'wholesaleSeckill': '预定数量'
  }

  const goodsInfoDataIndexBuy = {
    'wholesaleBulk': 'preCount.', 
    'hydrogenRent': 'rentExpire', 
    'wholesaleFresh': 'preCount', 
    'commandSalesOrder': 'preCount', 
    'wholesaleSeckill': 'preCount'
  }

  const goodsInfoTitleDiscounts = {
    'wholesaleBulk': '实际采购数量', 
    'wholesaleFresh': '实际采购数量', 
    'commandSalesOrder': '实际采购数量', 
    'wholesaleSeckill': '实际采购数量'
  }

  const goodsInfoDataIndexDiscounts = {
    'wholesaleBulk': 'paidCount', 
    'wholesaleFresh': 'paidCount', 
    'commandSalesOrder': 'paidCount', 
    'wholesaleSeckill': 'paidCount'
  }

  const goodsInfoRender = (_) => {
    return (
      {
        'wholesaleBulk': _, 
        'wholesaleFresh': _, 
        'commandSalesOrder': _, 
        'wholesaleSeckill': _
      }[info?.orderType] || `￥${amountTransform(_, '/')}`
    )
  }

  const goodsInfoTitleFreight = {
    'hydrogenRent': '额外租金'
  }

  const goodsInfoDataIndexFreight = {
    'hydrogenRent': 'addedRent'
  }


  useEffect(() => {
    orderTypes({}).then(res=>{
      setOrderType(res.data)
    })
    return () => {
      setOrderType(null)
    }
  }, [])

  const apiMethod = type === 'bonus' ? commissionDetail:
  (type === 'commission') ? platformCommissionDetail:
  (type === 'loan') ? goodsAmountDetail : 
  (type === 'operator') ? operationCommissionDetail : ''
  useEffect(()=>{
    setLoading(true)
    apiMethod({orderNo: id}).then(res=> {
      if(res.success) {
        setInfo({...res?.data, ...res?.data?.info})
        setPayInfos(res?.data?.payInfos)
      }
    }).finally(()=> {
      setLoading(false)
    })
    return ()=>{
      setInfo(null)
      setPayInfos([])
    }
  }, [id])

  const orderInfo = [
    {
      title: '订单号',
      dataIndex: 'orderNo'
    },
    {
      title: '订单类型',
      dataIndex: 'orderType',
      valueType: 'select',
      valueEnum: orderType
    },
    {
      title: '受益方会员类型',
      dataIndex: 'accountTypeName'
    },
    {
      title: `${orderInfoTitle[info?.orderType] || ''}`,
      dataIndex: `${orderInfoDataIndex[info?.orderType] || ''}`,
      render: (_) => orderInfoRender(_),
    },
    {
      title: '受益方会员信息',
      dataIndex: 'accountMobile'
    },
    {
      title: '虚拟子账户',
      dataIndex: 'accountSn'
    },
    {
      title: '买家会员类型',
      dataIndex: 'buyerType'
    },
    {
      title: '',
      dataIndex: '',
      render: ()=> ''
    },
    {
      title: '买家会员信息',
      dataIndex: 'buyerMobile'
    },
    {
      title: '虚拟子账户',
      dataIndex: 'buyerSn'
    }
  ]

  const goodsInfo = [
    {
      title: '商品名称',
      dataIndex: 'goodsName'
    },
    {
      title: '购买规格',
      dataIndex: 'skuName'
    },
    {
      title: `${goodsInfoTitleSupply[info?.orderType] || '商品供货价'}`,
      dataIndex: `${goodsInfoDataIndexSupply[info?.orderType] || 'supplyPrice'}`,
      render: (_) => `￥${amountTransform(_, '/')}`
    },
    {
      title: `${goodsInfoTitleActual[info?.orderType] || '实际销售价'}`,
      dataIndex: 'salePrice', 
      render: (_) => `￥${amountTransform(_, '/')}`
    },
    {
      title: `${goodsInfoTitleBuy[info?.orderType] || '购买数量'}`,
      dataIndex: `${goodsInfoDataIndexBuy[info?.orderType] || 'paidCount'}`
    },
    {
      title: `${goodsInfoTitleDiscounts[info?.orderType] || '优惠金额'}`,
      dataIndex: `${goodsInfoDataIndexDiscounts[info?.orderType] || 'couponAmount'}`,
      render: (_) => goodsInfoRender(_)
    },
    {
      title: `${goodsInfoTitleFreight [info?.orderType] || '运费'}`,
      dataIndex: `${goodsInfoDataIndexFreight [info?.orderType] || 'freight'}`,
      render: (_) => `￥${amountTransform(_, '/')}`
    },
    {
      title: '应付金额',
      dataIndex: 'amount',
      render: (_) => `¥${amountTransform(_, '/')}`
    }
  ]

  const payInfo = [
    {
      title: '支付阶段',
      dataIndex: 'stageName'
    },
    {
      title: '支付时间',
      dataIndex: 'payTime'
    },
    {
      title: '支付渠道',
      dataIndex: 'payTpyeName'
    },
    {
      title: '',
      dataIndex: '',
      render: ()=> ''
    },
    {
      title: '实付金额',
      dataIndex: 'amount',
      render: (_, r)=> `¥${amountTransform((Number(_) - Number(r.couponAmount)), '/')}`
    },
    {
      title: '虚拟分账计算',
      dataIndex: 'divideInfo',
      render: (_, data)=> {
        return data?.divideInfos.map(item=> (
          <div key={item?.type}>
            {fashionableType(item?.typeName, item?.amount, item?.fee, item?.couponAmount, item?.realAmount)}
          </div>
        ))
      } 
    },
    {
      title: '支付单号',
      dataIndex: 'payNo'
    },
    {
      title: '资金流水号',
      dataIndex: 'transcationId'
    }
  ]
  const account = [
    {
      title: '汇能虚拟户（佣金户）',
      dataIndex: 'platformAccountSn'
    },
    {
      title: '聚创虚拟户（交易费户）',
      dataIndex: 'platformFeeAccountSn'
    },
  ]
  const CustomList = ({ data, columns }) => {
    return (
      <ProDescriptions
        loading={loading}
        column={2}
        columns={columns}
        style={{
          background:'#fff',
          padding: 20
        }}
        bordered
        dataSource={data}
      />
    )
  }

  return (
    <Drawer
      title={title}
      placement="right"
      width={1400}
      onClose={() => { setVisible(false) }}
      visible={visible}
      
      footer={
        <div style={{ textAlign: 'right' }}>
          <Button onClick={() => { setVisible(false) }}>返回</Button>
        </div>
      }
    >
      <ProDescriptions
        loading={loading}
        column={2}
        columns={orderInfo}
        style={{
          background:'#fff',
          padding: 20
        }}
        bordered
        dataSource={info}
      />
      {
        info.skus &&
        info.skus.map(item => (
          <CustomList data={item} key={item.skuId} columns={goodsInfo}/>
        ))
      }
      {
        payInfos?.map(item=> (
          <CustomList data={item} key={item.stageName} columns={payInfo}/>
        ))
      }
      <ProDescriptions
        loading={loading}
        column={2}
        columns={account}
        style={{
          background:'#fff',
          padding: 20
        }}
        bordered
        dataSource={info}
      />
    </Drawer>
  )
}

export default TransactionDetails
