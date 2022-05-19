import React, { useState, useEffect } from 'react'
import { PageContainer } from '@/components/PageContainer';
import { Button, Space, message } from 'antd'
import { ModalForm, ProFormText, ProFormDigit } from '@ant-design/pro-form'
import ProCard from '@ant-design/pro-card'
import { history } from 'umi'

import styles from './styles.less'
import { amountTransform } from '@/utils/utils'
import { platforms, platformWithdraw, supplyChainWithdraw } from '@/services/financial-management/yeahgo-virtual-account-management'
import Detail from './transaction-details'

const WithdrawalModal = ({ val, change, update, type }) => {
  const withdrawal = (v) => {
    const money = amountTransform(v.amount, '*')
    if(type === 'platform') {
      platformWithdraw({
        amount: money
      }).then(res => {
        if (res?.success) {
          update(change + 1)
          message.success('提现成功')
        }
      })
    } else if(type === 'supplyChain') {
      supplyChainWithdraw({
        amount: money
      }).then(res => {
        if (res?.success) {
          update(change + 1)
          message.success('提现成功')
        }
      })
    }
  }
  return (
    <ModalForm
      title="提现"
      layout='horizontal'
      width={500}
      trigger={
        <Button>提现</Button>
      }
      modalProps={{
        destroyOnClose: true
      }}
      onFinish={async (values) => {
        await withdrawal(values)
        return true
      }}
    >
      <Space align="baseline">
        <ProFormDigit
          label="提现金额"
          name="amount"
          rules={[{ required: true }]}
          width="md"
        />
        <span>元</span>
      </Space>
      <ProFormText
        name="realName"
        label="提现账户名"
        initialValue={val?.realname}
        readonly
      />
      <ProFormText
        name="cardNo"
        initialValue={val?.cardNo}
        label="提现账号"
        readonly
      />
      <ProFormText
        name="bankName"
        label="所属银行"
        initialValue={val?.bankName}
        readonly
      />
      <ProFormText
        name="mobile"
        label="银行预留手机号"
        initialValue={val?.mobile}
        readonly
      />
    </ModalForm>
  )
}

const YeahgoVirtualAccountManagement = () => {
  const [account, setAccount] = useState({})
  const [loading, setLoading] = useState(false)
  const [visable, setVisable] = useState(false)
  const [change, setChange] = useState(1)
  const [query, setQuery] = useState(null)

  useEffect(() => {
    setLoading(true)
    platforms().then(res => {
      if (res.success) {
        setAccount(res?.data)
      }
    }).finally(() => {
      setLoading(false)
    })
  }, [])

  const skipToDetail = ({ accountType, accountId, amountType }) => {
    setQuery({accountType, accountId, amountType})
    setVisable(true)
  }

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
          title='汇能银行账户'
        >
          <div className={styles.bindCard}>
            <div>账户名称： <span>{account?.bindCard?.realname}</span></div>
            <div>账户号码： <span>{account?.bindCard?.cardNo}</span></div>
            <div>开户银行： <span>{account?.bindCard?.bankBranchName}</span></div>
          </div>
        </ProCard>
        <ProCard
          colSpan={{ xs: 24, sm: 12, md: 12, lg: 12, xl: 12 }}
          bordered
          title='汇能虚拟户'
        >
          <div className={styles.withdrawal}>
            {
              account?.bindCard?.cardNo &&
              <WithdrawalModal
                val={account?.bindCard}
                update={setChange}
                change={change}
                type="platform"
              />
            }
          </div>
          <div className={styles.platform}>
            <div>账户号码： </div>
            <div><span className={styles.sn}>{account?.platform?.sn}</span></div>
            <div className={styles.balance}>
              <div>
                <span>总余额：{`${amountTransform(account?.platform?.balance, '/')}元`}</span>
              </div>
              <Button
                type='default'
                onClick={() => {
                  skipToDetail({ accountId: account?.platform?.accountId, accountType: account?.platform?.accountType })
                }}
              >
                交易明细
              </Button>
            </div>
            <div className={styles.balanceBootom}>
              <Space size="middle">
                <span>可提现余额：{`${amountTransform(account?.platform?.balanceAvailable, '/')}元`}</span>
                <Button
                  type='default'
                  onClick={() => {
                    skipToDetail({ accountId: account?.platform?.accountId, accountType: account?.platform?.accountType, amountType: 'available'})
                  }}
                >
                  交易明细
                </Button>
              </Space>
              <Space size="middle">
                <span>冻结余额：{`${amountTransform(account?.platform?.balanceFreeze, '/')}元`}</span>
                <Button
                  type='default'
                  onClick={() => {
                    skipToDetail({ accountId: account?.platform?.accountId, accountType: account?.platform?.accountType, amountType: 'freeze'  })
                  }}
                >
                  交易明细
                </Button>
              </Space>
            </div>
          </div>
        </ProCard>
        <ProCard
          colSpan={{ xs: 24, sm: 12, md: 12, lg: 12, xl: 12 }}
          bordered
          title='交易费账户（聚创）'
        >
          <div className={styles.platformFee}>
            <div>账户号码： </div>
            <div><span className={styles.sn}>{account?.platformFee?.sn}</span></div>
            <div className={styles.balance}>
              <div>
                余额： <span>{`${amountTransform(account?.platformFee?.balance, '/')}元`}</span>
              </div>
              <Button
                type='default'
                onClick={() => {
                  skipToDetail({ accountId: account?.platformFee?.accountId, accountType: account?.platformFee?.accountType })
                }}
              >
                交易明细
              </Button>
            </div>
          </div>
        </ProCard>
        <ProCard
          colSpan={{ xs: 24, sm: 12, md: 12, lg: 12, xl: 12 }}
          bordered
          title='薪宝虚拟户'
        >
          <div className={styles.platformXinbao}>
            <div>账户号码: </div>
            <div><span className={styles.sn}>{account?.platformXinbao?.sn}</span></div>
            <div className={styles.balance}>
              <div>
                余额： <span>{`${amountTransform(account?.platformXinbao?.balance, '/')}元`}</span>
              </div>
              <Button
                type='default'
                onClick={() => {
                  skipToDetail({ accountId: account?.platformXinbao?.accountId, accountType: account?.platformXinbao?.accountType })
                }}
              >
                交易明细
              </Button>
            </div>
          </div>
        </ProCard>
        <ProCard
          colSpan={{ xs: 24, sm: 12, md: 12, lg: 12, xl: 12 }}
          title={false}
        />
        <ProCard
          colSpan={{ xs: 24, sm: 12, md: 12, lg: 12, xl: 12 }}
          bordered
          title='汇意虚拟户'
        >
          <div className={styles.withdrawal}>
            {
              account?.supplyChain?.bindCard?.cardNo &&
              <WithdrawalModal
                val={account?.supplyChain?.bindCard}
                update={setChange}
                change={change}
                type="supplyChain"
              />
            }
          </div>
          <div className={styles.platform}>
            <div>账户号码： </div>
            <div><span className={styles.sn}>{account?.supplyChain?.sn}</span></div>
            <div className={styles.balance}>
              <div>
                余额： <span>{`${amountTransform(account?.supplyChain?.balance, '/')}元`}</span>
              </div>
              <Button
                type='default'
                onClick={() => {
                  skipToDetail({ accountId: account?.supplyChain?.accountId, accountType: account?.supplyChain?.accountType })
                }}
              >
                交易明细
              </Button>
            </div>
            <div className={styles.balanceBootom}>
              <Space size="middle">
                <span>可提现余额：{`${amountTransform(account?.supplyChain?.balanceAvailable, '/')}元`}</span>
                <Button
                  type='default'
                  onClick={() => {
                    skipToDetail({ accountId: account?.supplyChain?.accountId, accountType: account?.supplyChain?.accountType, amountType: 'available'})
                  }}
                >
                  交易明细
                </Button>
              </Space>
              <Space size="middle">
                <span>冻结余额：{`${amountTransform(account?.supplyChain?.balanceFreeze, '/')}元`}</span>
                <Button
                  type='default'
                  onClick={() => {
                    skipToDetail({ accountId: account?.supplyChain?.accountId, accountType: account?.supplyChain?.accountType, amountType: 'freeze'})
                  }}
                >
                  交易明细
                </Button>
              </Space>
            </div>
          </div>
        </ProCard>
      </ProCard>
      {
        visable&&
        <Detail
          // id={selectItem}
          visible={visable}
          setVisible={setVisable}
          query={query}
        />
      }
    </PageContainer>
  )
}

export default YeahgoVirtualAccountManagement
