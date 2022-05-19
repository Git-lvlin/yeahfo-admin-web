import React, { useEffect, useState, useRef } from 'react'
import ProDescriptions from '@ant-design/pro-descriptions'
import { Button, Space, Progress, Drawer } from 'antd'
import { LoadingOutlined } from '@ant-design/icons'

import { amountTransform } from '@/utils/utils'
import { orderPageDetail } from "@/services/financial-management/transaction-detail-management"
import { createExportTask, findById } from "@/services/export-excel/export-template"
import styles from './styles.less'
import './styles.less'
import { orderTypes } from '@/services/financial-management/common'
import { fashionableType } from '../common-function'

const OrderPayDetailPopup = ({ id, visible, setVisible, title }) => {
  const [loading, setLoading] = useState(false)
  const [info, setInfo] = useState(null)
  const [payInfos, setPayInfos] = useState([]) 
  const [data, setData] = useState(null)
  const [down, setDown] = useState(false)
  const [isDown, setIsDown] = useState(false)
  const [taskId, setTaskId] = useState(null)
  const [process, setProcess] = useState(0)
  const [orderType, setOrderType] = useState(null)
  const timer = useRef()

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
    orderTypes({}).then(res => {
      setOrderType(res.data)
    })
    return () => {
      setOrderType(null)
    }
  }, [])
  
  useEffect(()=>{
    setLoading(true)
    orderPageDetail({orderNo: id}).then(res=> {
      if(res.success) {
        setInfo(res?.data?.info)
        setPayInfos(res?.data?.payInfos)
      }
    }).finally(()=> {
      setLoading(false)
    })
    return ()=>{
      setInfo([])
      setPayInfos([])
    }
  }, [id])

  const downTrade = (e) => {
    createExportTask({
      code: 'financial-huifu-payment-export',
      fileName: 'financial-huifu-payment-export' + +new Date() + '.xlsx',
      queryParamStr: JSON.stringify({orderNo: e.payNo})
    }).then(res => {
      setDown(true)
      setTaskId(res.data.taskId)
    })
  }

  const getData = () => {
    findById({
      id: taskId
    }).then(res => {
      setProcess(res.data.process)
      if(res.data.fileUrl) {
        setDown(false)
        setIsDown(true)
        setData(res.data)
      }
    })
  }

  useEffect(()=> {
    clearInterval(timer.current)
    if(down) {
      timer.current = setInterval(()=> {
        getData()
      }, 500)
    }
    return ()=> {
      clearInterval(timer.current)
      setData(null)
    }
  }, [taskId, down])

  const DownExport = () => {
    if(isDown) {
      return <a href={data?.fileUrl}>下载</a>
    } else if(process !== 100 && down){
      return (
        <div style={{ width: 170 }}>
          <Progress percent={process} size='small'/>
        </div>
      )
    } else if(data?.state === 3 && !down){
      return (
        <Tooltip title={data?.exceptionDes}>
          <span className={styles.fail}>导出失败</span>
        </Tooltip>
      )
    } else {
      return ''
    }
  }

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
      title: '买家会员类型',
      dataIndex: 'buyerType'
    },
    {
      title: `${orderInfoTitle[info?.orderType] || ''}`,
      dataIndex: `${orderInfoDataIndex[info?.orderType] || ''}`,
      render: (_) => orderInfoRender(_),
    },
    {
      title: '买家会员信息',
      dataIndex: 'buyerMobile'
    },
    {
      title: '虚拟子账户',
      dataIndex: 'buyerSn'
    },
    {
      title: '卖家会员类型',
      dataIndex: 'sellerType'
    },
    {
      title: '',
      dataIndex: '',
      render: () => ''
    },
    {
      title: '卖家会员信息',
      dataIndex: 'sellerMobile'
    },
    {
      title: '虚拟子账户',
      dataIndex: 'sellerSn'
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
      render: (_) => `￥${amountTransform(_, '/')}`
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
      render: (_, records) => `¥${amountTransform((Number(_)-Number(records.couponAmount)), '/')}`
    },
    {
      title: '虚拟分账计算',
      dataIndex: 'divideInfo',
      render: (_, data)=> (
        <>
          {
            data?.divideInfos?.map(item=> (
              <div key={item?.type}>
                {fashionableType(item?.typeName, item?.amount, item?.fee, item?.couponAmount, item?.realAmount)}
              </div>
            ))
          }
        </>
      )
    },
    {
      title: '支付单号',
      dataIndex: 'payNo',
      render: (_, records) => (
        <>
          <Space size='large'>
            <span>{_}</span>
            {
              _?
              <Button 
                onClick={
                  ()=> downTrade(records)
                }
                disabled={down}
                type='primary'
              >
                {
                  down&&
                  <LoadingOutlined />
                }
                导出汇付交易单
              </Button>:
              '-'
            }
            <DownExport />
          </Space>
        </>
      )
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
  
  const CustomList = ({data, columns}) => {
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
      title={title || "订单支付明细"}
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
          background: '#fff',
          padding: 20
        }}
        bordered
        dataSource={info}
      />
      {
        info?.skus &&
        info?.skus.map(item => (
          <CustomList data={item} key={item.skuId} columns={goodsInfo} />
        ))
      }
      {
        payInfos?.map(item => (
          <CustomList data={item} key={item.stageName} columns={payInfo} />
        ))
      }
      <ProDescriptions
        loading={loading}
        column={2}
        columns={account}
        style={{
          background: '#fff',
          padding: 20
        }}
        bordered
        dataSource={info}
      />
    </Drawer>
  )
}

export default OrderPayDetailPopup
