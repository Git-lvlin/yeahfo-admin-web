import React, { useState, useEffect } from 'react'
import { PageContainer } from '@/components/PageContainer';
import ProCard from '@ant-design/pro-card'

import styles from './styles.less'
import {
  findDwdMemberCount,
  gmvPayRat,
  skuAccount,
  dwdMau
} from '@/services/data-board/data-board'
import { amountTransform } from '@/utils/utils'

const DataBord = ()=> {
  const [memberCount, setMemberCount] = useState({})
  const [gmv, setGmv] = useState({})
  const [sku, setSku] = useState({})
  const [mau, setMau] = useState({})
  const [loading, setLoading] = useState(false)
  useEffect(()=> {
    setLoading(true)
    findDwdMemberCount().then(res => {
      if(res.success) setMemberCount(res.data)
    }).finally(()=>{
      setLoading(false)
    })
    return ()=> {
      setMemberCount({})
    }
  },[])
  useEffect(()=> {
    gmvPayRat().then(res => {
      if(res.success) setGmv(res.data)
    })
    return ()=> {
      setGmv({})
    }
  },[])
  useEffect(()=> {
    skuAccount().then(res => {
      if(res.success) setSku(res.data)
    })
    return ()=> {
      setSku({})
    }
  },[])
  useEffect(()=> {
    dwdMau().then(res => {
      if(res.success) setMau(res.data)
    })
    return ()=> {
      setMau({})
    }
  },[])
  return (
    <PageContainer title={false}>
      <ProCard 
        gutter={[24, 24]}
        wrap
        loading={loading}
      >
        <ProCard 
          colSpan={{ xs: 24, sm: 12, md: 12, lg: 12, xl: 12 }}
          bordered
        >
          <div className={styles.card}>
            <div className={styles.line}>
              <div>
                普通会员： 
                <span>{memberCount.memberCount}</span>
              </div>
              <div>
                会员店：
                <span>{memberCount.memeberStoreCount}</span>
              </div>
            </div>
            <div className={styles.line}>
              <div>
                商家：
                <span>{memberCount.businessCount}</span>
              </div>
              <div>
                内部店：
                <span>{memberCount.agentCount}</span>
              </div>
            </div>
          </div>
        </ProCard>
        <ProCard 
          colSpan={{ xs: 24, sm: 12, md: 12, lg: 12, xl: 12 }}
          bordered
        >
          <div className={styles.card}>
            <div className={styles.title}>
              本月GMV：
              <span>{amountTransform(gmv.monthGmv, '/')}元</span>
            </div>
            <div className={styles.turnover}>
              交易额：
              <span>{amountTransform(gmv.dealPay, '/')}元</span>
            </div>
            <div className={styles.pay}>
              支付完成率：
              <span>{amountTransform(gmv.payRatio, '*')}%</span>
            </div>
          </div>
        </ProCard>
        <ProCard 
          colSpan={{ xs: 24, sm: 12, md: 12, lg: 12, xl: 12 }} 
          bordered
        >
          <div className={styles.bottom}>
            <div>
              商家可售商品SKU：
              <span>{sku.supplierSkuCount}</span>
            </div>
            <div>
              内部店可售商品SKU：
              <span>{sku.agentSkuCount}</span>
            </div>
          </div>
        </ProCard>
        <ProCard 
          colSpan={{ xs: 24, sm: 12, md: 12, lg: 12, xl: 12 }}
          bordered
        >
          <div className={styles.bottom}>
            <div>
              本月MAU：
              <span>{mau.loginAccount}</span>
            </div>
            <div className={styles.pay}>（月登陆1次或以上）</div>
          </div>
        </ProCard>
      </ProCard>
    </PageContainer>
  )
}

export default DataBord
