import React, { useState, useEffect } from 'react'
import ProCard from '@ant-design/pro-card'
import { PageContainer } from '@/components/PageContainer';
import { useLocation, history } from 'umi'
import { Button, Drawer } from 'antd'

import { detail } from '@/services/financial-management/supplier-fund-management'
import styles from './styles.less'
import { amountTransform } from '@/utils/utils'
import PaymentDetails from '../payment-details'

const Details = ({visible, setVisible, query}) => {
  const [data, setData] = useState({})
  const [loading, setLoading] = useState(false)
  const [paymentVisible, setPaymentVisible] = useState(false)
  const [paymentQuery, setPaymentQuery] = useState(null)

  useEffect(()=>{
    setLoading(true)
    detail({...query}).then(res => {
      if(res?.success){
        setData(res?.data)
      }
    }).finally(()=> {
      setLoading(false)
    })
    return ()=>{
      setData({})
    }
  }, [])

  const card = () => {
    if(query.accountType==='supplier'){
      return '供应商家银行账户'
    } else if(query.accountType==='store'){
      return '社区店银行账户'
    }else if(query.accountType==='agentStore'){
      return '代发店银行账户'
    }else{
      return ''
    }
  }
  const leftCard = () => {
    if(query.accountType==='supplier'){
      return '供应商虚拟子账户'
    } else if(query.accountType==='store'){
      return '社区店虚拟子账户'
    }else if(query.accountType==='agentStore'){
      return '代发店虚拟子账户'
    }else{
      return ''
    }
  }

  const skipToDetail = ({accountType, accountId}) => {
    setPaymentQuery({accountType, accountId})
    setPaymentVisible(true)
  }

  return (
    <Drawer
      visible={visible}
      onClose={()=>{setVisible(false)}}
      width={1200}
      closable={false}
    >
      <ProCard
        gutter={[16, 16]} 
        bordered
        loading={loading}
      >
        <ProCard 
          colSpan={{ xs: 24, sm: 12, md: 12, lg: 12, xl: 12 }}
          bordered
          style={{ height: 280 }}
          title={card()}
        >
           <div className={styles.bindCard}>
            <div>账户名称： <span>{data?.realname}</span></div>
            <div>账户号码： <span>{data?.cardNo}</span></div>
            <div>开户银行： <span>{data?.bankName}</span></div>
          </div>
        </ProCard>
        <ProCard
          colSpan={{ xs: 24, sm: 12, md: 12, lg: 12, xl: 12 }}
          style={{ height: 280 }}
          bordered
          title={leftCard()}
        >
           <div className={styles.platform}>
            <div>账户号码： </div>
            <div><span className={styles.sn}>{data?.sn}</span></div>
            <div className={styles.balance}>
              <div>
                交易总额： 
                <span>
                  {
                    query.accountType==='store'?
                    `${amountTransform((parseInt(data?.balance)+parseInt(data?.balanceSumWithdraw)+parseInt(data?.commission)+parseInt(data?.commissionSumWithdraw)), '/')}元`:
                    `${amountTransform((parseInt(data?.balance)+parseInt(data?.commission)), '/')}元`
                  }
                </span>
              </div>
              <Button 
                type='default'
                onClick={()=>{skipToDetail({accountType: data?.accountType, accountId: data?.accountId})}}
              >
                交易明细
              </Button>
            </div>
            {
              query.accountType==='supplier'&&
              <div className={styles.balance}>
                <div>
                  可提现余额： <span>{`${amountTransform(data?.balanceAvailable, '/')}元`}</span>
                </div>
                <div>
                  冻结余额： <span>{`${amountTransform(data?.balanceFreeze, '/')}元`}</span>
                </div>
              </div>
            }
            {
              query.accountType==='store'&&
              <>
                <div className={styles.balance}> 
                  <div>
                    货款可提现余额： <span>{`${amountTransform(data?.balanceAvailable, '/')}元`}</span>
                  </div>
                  <div>
                    货款已提现余额： <span>{`${amountTransform(data?.balanceSumWithdraw, '/')}元`}</span>
                  </div>
                  <div>
                    货款冻结余额： <span>{`${amountTransform(data?.balanceFreeze, '/')}元`}</span>
                  </div>
                </div>
                <div className={styles.balance}> 
                  <div>
                    收益可提现金额： <span>{`${amountTransform(data?.commissionAvailable, '/')}元`}</span>
                  </div>
                  <div>
                    收益已提现金额： <span>{`${amountTransform(data?.commissionSumWithdraw, '/')}元`}</span>
                  </div>
                  <div>
                    收益冻结余额： <span>{`${amountTransform(data?.commissionFreeze, '/')}元`}</span>
                  </div>
                </div>
              </>
            }
          </div>
        </ProCard>
      </ProCard>
      {
        paymentVisible&&
        <PaymentDetails
          query={paymentQuery}
          visible={paymentVisible}
          setVisible={setPaymentVisible}
        />
      }
    </Drawer>
  )
}

export default Details
