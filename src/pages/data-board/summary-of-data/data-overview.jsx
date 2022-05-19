import React, { useState } from 'react'
import ProTable from '@ant-design/pro-table'
import ProForm from '@ant-design/pro-form'
import { Space, Tooltip } from 'antd'

import styles from './style.less'
import Yuan from '../components/Yuan'
import { operationDailySummaryData } from '@/services/data-board/summary-of-data'
import Export from '@/pages/export-excel/export'
import ExportHistory from '@/pages/export-excel/export-history'

const DataOverview = () => {
  const [visit, setVisit] = useState(false)

  const getValues = () => {
    return {
      type:"export"
    }
  }

  const columns = [
    {
      title: '用户数据',
      align: 'center',
      children: [
        {
          title: ()=> (
            <Tooltip title='已注册的用户总数'>
              注册用户总数
            </Tooltip>
          ),
          dataIndex: 'registeredUsersNum',
          align: 'center',
          render: (_)=><Yuan>{_}</Yuan>
        }
      ]
    },
    {
      title: '店主数据',
      align: 'center',
      children: [
        {
          title: ()=> (
            <Tooltip title='已缴保证金的店主总数'>
              店主申请总数
            </Tooltip>
          ),
          dataIndex: 'applyCommunityStoreNum',
          align: 'center',
          render: (_)=><Yuan>{_}</Yuan>
        },
        {
          title: ()=> (
            <Tooltip title='已缴保证金且人工审核通过的店主总数'>
              审核通过的店主总数
            </Tooltip>
          ),
          dataIndex: 'passApplyNum',
          align: 'center',
          render: (_)=><Yuan>{_}</Yuan>
        },
        {
          title: ()=> (
            <Tooltip title='已缴保证金但人工审核未通过的店主总数'>
              未审核通过的店主总数
            </Tooltip>
          ),
          dataIndex: 'notAuditStoreNum',
          align: 'center',
          render: (_)=><Yuan>{_}</Yuan>
        },
        {
          title: ()=> (
            <Tooltip title='已退保证金且已注销的店主总数'>
              已注销的店主总数
            </Tooltip>
          ),
          dataIndex: 'storeCancelNum',
          align: 'center',
          render: (_)=><Yuan>{_}</Yuan>
        },
        {
          title: ()=>(
            <Tooltip title='已申请注销未退保证金的店主总数'>
              申请注销的店主总数
            </Tooltip>
          ),
          dataIndex: 'storeCancelNumNotAudit',
          align: 'center',
          render: (_)=><Yuan>{_}</Yuan>
        }
      ]
    },
    {
      title: '集约数据',
      align: 'center',
      children: [
        {
          title: ()=> (
            <Tooltip title='店主集采下单且已支付的总金额'>
              店主集约总成交额
            </Tooltip>
          ),
          dataIndex: 'bTotalPay',
          align: 'center',
          render: (_)=><Yuan>{_}</Yuan>
        },
        {
          title: ()=>(
            <Tooltip title='店主集采下单的总订单数量（含未支付订单）'>
              店主集约总订单数
            </Tooltip>
          ),
          dataIndex: 'bOrderNum',
          align: 'center',
          render: (_)=><Yuan>{_}</Yuan>
        },
        {
          title: ()=>(
            <Tooltip title='店主集采下单且已支付的订单总数'>
              店主已支付订单数
            </Tooltip>
          ),
          dataIndex: 'bOrderPayNum',
          align: 'center',
          render: (_)=><Yuan>{_}</Yuan>
        },
        {
          title: ()=>(
            <Tooltip title='店主集采下单的总人数（含未支付订单，去重）'>
              下单店主人数
            </Tooltip>
          ),
          dataIndex: 'bOrderStoreNum',
          align: 'center',
          render: (_)=><Yuan>{_}</Yuan>
        },
        {
          title: ()=>(
            <Tooltip title='店主集采下单且已支付的人数（去重）'>
              下单且已支付的店主人数
            </Tooltip>
          ),
          dataIndex: 'bPayStoreNum',
          align: 'center',
          render: (_)=><Yuan>{_}</Yuan>
        },
        {
          title: ()=>(
            <Tooltip title='下单已支付的店主人数/审核通过的店主总数'>
              集约参与率
            </Tooltip>
          ),
          dataIndex: 'wsRat',
          align: 'center'
        },
        {
          title: ()=>(
            <Tooltip title='店主集约总成交额/下单已支付的店主人数'>
              单个店主集约贡献成交额（元）
            </Tooltip>
          ),
          dataIndex: 'bAveragePay',
          align: 'center',
          render: (_)=><Yuan>{_}</Yuan>
        },
        {
          title: ()=>(
            <Tooltip title='C端消费者下单且支付的总金额'>
              C端集约售卖总成交额
            </Tooltip>
          ),
          dataIndex: 'cTotalPay',
          align: 'center',
          render: (_)=><Yuan>{_}</Yuan>
        },
        {
          title: ()=>(
            <Tooltip title='C端消费者下单且已支付的订单总数量'>
              C端支付总订单数
            </Tooltip>
          ),
          dataIndex: 'cOrderPayNum',
          align: 'center',
        },
        {
          title: ()=>(
            <Tooltip title='C端消费者下单的总数量（含未支付订单）'>
              C端总订单数
            </Tooltip>
          ),
          dataIndex: 'cOrderNum',
          align: 'center',
          render: (_)=><Yuan>{_}</Yuan>
        },
        {
          title: 'C端下单人数',
          dataIndex: 'cWholesaleOrderUserNum',
          align: 'center',
          render: (_)=><Yuan>{_}</Yuan>
        },
        {
          title: ()=>(
            <Tooltip title='C端消费者下单并支付的总人数（去重）'>
              C端下单且已支付人数
            </Tooltip>
          ),
          dataIndex: 'cWholesalePayUserNum',
          align: 'center',
          render: (_)=><Yuan>{_}</Yuan>
        },
        {
          title: ()=>(
            <Tooltip title='C端集约售卖总成交额/有售出的店主人数'>
              单个店主C端贡献成交额（元）
            </Tooltip>
          ),
          dataIndex: 'cAveragePay',
          align: 'center',
          render: (_)=><Yuan>{_}</Yuan>
        }
      ]
    },
    {
      title: '秒约数据',
      align: 'center',
      children: [
        {
          title: ()=>(
            <Tooltip title='（下单并支付的）秒约订单总金额'>
              秒约总成交额
            </Tooltip>
          ),
          dataIndex: 'cMiaoTotalPay',
          align: 'center',
          render: (_)=><Yuan>{_}</Yuan>
        },
        {
          title: ()=>(
            <Tooltip title='（下单并支付的）秒约订单总数量'>
              支付总订单数
            </Tooltip>
          ),
          dataIndex: 'cMiaoOrderNum',
          align: 'center',
          render: (_)=><Yuan>{_}</Yuan>
        },
        {
          title: ()=>(
            <Tooltip title='过了售后期且无退款的订单总金额'>
              已完成且无售后的成交额
            </Tooltip>
          ),
          dataIndex: 'completedNotAfterSaleAmount',
          align: 'center',
          render: (_)=><Yuan>{_}</Yuan>
        },
        {
          title: ()=>(
            <Tooltip title='有发生退款的订单总金额'>
              退货退款合计金额
            </Tooltip>
          ),
          dataIndex: 'refundsAmount',
          align: 'center',
          render: (_)=><Yuan>{_}</Yuan>
        },
        {
          title: ()=>(
            <Tooltip title='有发生退款的订单总数'>
              退款笔数
            </Tooltip>
          ),
          dataIndex: 'refundNum',
          align: 'center',
          render: (_)=><Yuan>{_}</Yuan>
        },
        {
          title: ()=>(
            <Tooltip title='秒约商品下单并支付的总人数（去重）'>
              下单并支付人数
            </Tooltip>
          ),
          dataIndex: 'cMiaoPayNum',
          align: 'center',
          render: (_)=><Yuan>{_}</Yuan>
        },
        {
          title: ()=>(
            <Tooltip title='秒约商品下单并支付的总人数（含未支付订单，去重）'>
              下单人数
            </Tooltip>
          ),
          dataIndex: 'cMiaoUserNum',
          align: 'center',
          render: (_)=><Yuan>{_}</Yuan>
        },
        {
          title: ()=>(
            <Tooltip title='秒约总成交额/下单并支付人数'>
              单个用户贡献成交额
            </Tooltip>
          ),
          dataIndex: 'cMiaoAveragePay',
          align: 'center',
          render: (_)=><Yuan>{_}</Yuan>
        }
      ]
    },
    {
      title: '平台',
      align: 'center',
      fixed: 'right',
      children: [
        {
          title: ()=>(
            <Tooltip title='秒约+集约的总成交额合计'>
              总成交额
            </Tooltip>
          ),
          dataIndex: 'platformPayTotal',
          align: 'center',
          render: (_)=><Yuan>{_}</Yuan>
        }
      ]
    }
  ]

  return (
    <div
      style={{
        backgroundColor: '#fff', 
        padding: 15,
        marginTop: 20
      }}
    >
      <ProForm
        style={{
          marginBottom: 20
        }}
        submitter={{
          render: () => {
            return (
              <Space size="small">
                <Export
                  change={(e)=> {setVisit(e)}}
                  key="export" 
                  type="data-board-operationDaily-SummaryData"
                  conditions={getValues}
                />
                <ExportHistory 
                  key="export-history" 
                  show={visit} setShow={setVisit}
                  type="data-board-operationDaily-SummaryData"
                />
              </Space>
            )
          }
        }}
        layout="inline"
      >
        <h3 className={styles.dataOverview}>数据总览</h3>
      </ProForm>
      <ProTable
        rowKey="registeredUsersNum"
        request={operationDailySummaryData}
        bordered
        columns={columns}
        search={false}
        toolBarRender={false}
        pagination={false}
        scroll={{x: 2500}}
      />
    </div>
  )
}

export default DataOverview
