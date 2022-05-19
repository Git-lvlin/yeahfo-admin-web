import React, { useEffect, useState } from 'react'
import { useParams, history } from 'umi'
import ProDescriptions from '@ant-design/pro-descriptions'
import { PageContainer } from '@/components/PageContainer';
import { Button } from 'antd'

import { amountTransform } from '@/utils/utils'
import { refundDetail } from "@/services/financial-management/transaction-detail-management"
import './styles.less'
import styles from './styles.less'
import { tradeType } from '../../common-enum'

const Detail = () => {
  const {id} = useParams()
  const [loading, setLoading] = useState(false)
  const [info, setInfo] = useState({})
  const [data, setData] = useState({})
  const [payInfos, setPayInfos] = useState([])
  useEffect(()=>{
    setLoading(true)
    refundDetail({id}).then(res=> {
      if(res.success) {
        setInfo({...res?.data?.info, ...res?.data})
        setData({...res?.data})
        setPayInfos(res?.data?.payInfos)
      }
    }).finally(()=> {
      setLoading(false)
    })
    return ()=>{
      setInfo({})
      setData([])
      setPayInfos({})
    }
  }, [])


  const back = ()=> {
    window.history.back()
    setTimeout(() => { window.location.reload(); }, 200)
  }
  const fashionableType =(data, amount, fee) =>{
    switch(data){
      case 'goodsAmount':
        return (
          <>
            <span className={styles.amount}>货款: ¥{amountTransform(amount, '/')}</span>
            <span>交易通道费: ¥{amountTransform(fee, '/')}</span>
          </>
        )
      case 'commission':
        return (
          <>
            <span className={styles.amount}>店主收益: ¥{amountTransform(amount, '/')}</span>
            <span>交易通道费: ¥{amountTransform(fee, '/')}</span>
          </>
        )
      case 'platformCommission':
        return (
          <>
            <span className={styles.amount}>平台收益: ¥{amountTransform(amount, '/')}</span>
            <span>交易通道费: ¥{amountTransform(fee, '/')}</span>
          </>
        )
      case 'suggestCommission':
        return (
          <>
            <span className={styles.amount}>上级推荐人收益: ¥{amountTransform(amount, '/')}</span>
            <span>交易通道费: ¥{amountTransform(fee, '/')}</span>
          </>
        )
      case 'agentCompanyCommission':
        return (
          <>
            <span className={styles.amount}>运营商收益: ¥{amountTransform(amount, '/')}</span>
            <span>交易通道费: ¥{amountTransform(fee, '/')}</span>
          </>
        )
      case 'freight':
        return (
          <>
            <span className={styles.amount}>运费: ¥{amountTransform(amount, '/')}</span>
            <span>交易通道费: ¥{amountTransform(fee, '/')}</span>
          </>
        )
      default:
        return ''
    }
  }

  const backCalculation= (data, amount, fee)=> {
    switch(data){
      case 'goodsAmount':
        return (
          <>
            <span className={styles.amount}>货款回退: ¥{amountTransform(amount, '/')}</span>
            <span>交易通道费: ¥{amountTransform(fee, '/')}</span>
          </>
        )
      case 'commission':
        return (
          <>
            <span className={styles.amount}>店主收益回退: ¥{amountTransform(amount, '/')}</span>
            <span>交易通道费: ¥{amountTransform(fee, '/')}</span>
          </>
        )
      case 'platformCommission':
        return (
          <>
            <span className={styles.amount}>平台收益回退: ¥{amountTransform(amount, '/')}</span>
            <span>交易通道费: ¥{amountTransform(fee, '/')}</span>
          </>
        )
      case 'suggestCommission':
        return (
          <>
            <span className={styles.amount}>上级推荐人收益回退: ¥{amountTransform(amount, '/')}</span>
            <span>交易通道费: ¥{amountTransform(fee, '/')}</span>
          </>
        )
      case 'agentCompanyCommission':
        return (
          <>
            <span className={styles.amount}>运营商收益回退: ¥{amountTransform(amount, '/')}</span>
            <span>交易通道费: ¥{amountTransform(fee, '/')}</span>
          </>
        )
      default:
        return ''
    }
  }
  const columns1 = [
    {
      title: '售后订单号',
      dataIndex: 'refundNo'
    },
    {
      title: '交易类型',
      dataIndex: 'tradeType',
      valueType: 'select',
      valueEnum: tradeType
    },
    {
      title: '关联订单类型',
      dataIndex: 'orderType',
      valueEnum: {
        'second': '秒约',
        'commandSalesOrder': '集约批发订单',
        'dropShipping1688': '1688代发订单',
        'commandCollect': '集约零售订单',
        'blindBox': '盲盒订单',
        'signIn': '签到订单'
      }
    },
    {
      title: '关联订单号',
      dataIndex: 'orderNo'
    },
    {
      title: '回退会员类型',
      dataIndex: 'accountType',
      valueType: 'select',
      valueEnum: {
        'store': '店铺',
        'supplier': '供应商家',
        'platform': '平台',
        'member': '会员',
        'agentStore': '代发店',
        'agentCompany': '运营商'
      }
    },
    {
      title: '',
      dataIndex: ''
    },
    {
      title: '回退会员信息',
      dataIndex: 'sellerMobile'
    },
    {
      title: '回退到账时间',
      dataIndex: 'refundTime'
    },
    {
      title: '虚拟子账户',
      dataIndex: 'sellerSn'
    },
    {
      title: '支付渠道',
      dataIndex: 'data',
      render: ()=> '原路退回'
    },
    {
      title: '买家手机号',
      dataIndex: 'buyerMobile'
    },
    {
      title: '买家会员ID',
      dataIndex: 'buyerSn'
    }
  ]
  const columns2 = [
    {
      title: '支付金额',
      dataIndex: 'refundAmount',
      render: (_) => `￥${amountTransform(_, '/')}`
    },
    {
      title: '回退计算',
      dataIndex: 'refundDivideInfos',
      render: (_, data)=> {
        if(data.returnDivideInfos) {
          return data?.returnDivideInfos.map(item=> (
            <div key={item?.type}>{backCalculation(item?.type, item?.amount, item?.fee)}</div>
          ))
        }
      } 
    }
  ]
  const columns3 = [
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
      dataIndex: ''
    },
    {
      title: '支付金额',
      dataIndex: 'amount',
      render: (_) => `￥${amountTransform(_, '/')}`
    },
    {
      title: '虚拟分账计算',
      dataIndex: 'divideInfos',
      render: (_, data)=> (
        <>
          {
            data?.divideInfos.map(item=> (
              <div key={item?.type}>
                {fashionableType(item?.type, item?.amount, item?.fee)}
              </div>
            ))
          }
        </>
      ) 
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
  const columns4 = [
    {
      title: '汇能虚拟户（佣金户）',
      dataIndex: 'platformAccountSn'
    },
    {
      title: '聚创虚拟户（交易费户）',
      dataIndex: 'platformFeeAccountSn'
    },
  ]

  const CustomList = props=> {
    const { data } = props
    return (
      <ProDescriptions
        loading={loading}
        column={2}
        columns={columns3}
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
    <PageContainer title={false}>
      <ProDescriptions
        loading={loading}
        column={2}
        columns={columns1}
        style={{
          background:'#fff',
          padding: 20
        }}
        bordered
        dataSource={info}
      />
      <ProDescriptions
        loading={loading}
        dataSource={data}
        column={2}
        columns={columns2}
        style={{
          background:'#fff',
          padding: 20
        }}
        bordered
      />
      {
        payInfos?.map(item=> (
          <CustomList data={item} key={item.stageName}/>
        ))
      }
      <ProDescriptions
        loading={loading}
        column={2}
        columns={columns4}
        style={{
          background:'#fff',
          padding: 20
        }}
        bordered
        dataSource={info}
      />
      <div style={{background: '#fff', padding: 20}}>
        <Button type='primary' onClick={()=>{back()}}>返回</Button>
      </div>
    </PageContainer>
  )
}

export default Detail
