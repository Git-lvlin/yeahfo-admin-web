import React, { useState, useRef,useEffect } from 'react';
import ProTable from '@ant-design/pro-table';
import { commissionSum,commissionPage } from '@/services/daifa-store-management/list';
import { Statistic, Row, Col,Space } from 'antd';
import './style.less'

export default props => {
    let storeNo = props.location.query.storeNo
    let storeName = props.location.query.storeName
    let realname = props.location.query.realname
    let mobile = props.location.query.mobile
    let [moneyData,setMoneyData]=useState({})
    const ref=useRef()
    const columns = [
        {
            title: '返佣金额',
            dataIndex: 'commission',
            valueType:'money',
            hideInSearch:true
        },
        {
            title: '利润金额',
            dataIndex: 'profit',
            valueType:'money',
            hideInSearch:true
        },
        {
            title: '订单金额',
            dataIndex: 'orderAmount',
            valueType:'money',
            hideInSearch:true
        },
        {
            title: '订单编号',
            dataIndex: 'orderNo',
            valueType:'text'    
        },
        {
            title: '商品数量',
            dataIndex: 'productCount',
            valueType:'text',
            hideInSearch:true
        },
        {
            title: '买家手机号',
            dataIndex: 'mobile',
            valueType:'text',
        },
        {
            title: '支付时间',
            dataIndex: 'payTime',
            valueType:'text',
            hideInSearch:true
        },
        {
            title: '返佣到账时间',
            dataIndex: 'commissionTime',
            valueType:'text',
            hideInSearch:true
        },
        {
            title: '返佣时间',
            key: 'dateRange',
            dataIndex: 'commissionTime',
            valueType: 'dateRange',
            hideInTable: true,
        }
    ];
    useEffect(()=>{
        commissionSum({storeNo}).then(res=>{
            setMoneyData(res.data)
        })
    },[])
  return (
      <>
        <Space>
            <h1>{storeName}</h1>
            <h3>{'('+realname+' '+mobile +')'}</h3>
        </Space>
        <Row gutter={16} className='commission'>
            <Col span={8}>
               <Statistic title="累计成交金额" className='moneyData' value={moneyData.totalOrderAmount&&moneyData.totalOrderAmount/100} precision={2}/>
               <span className='amount'>元</span>
            </Col>
            <Col span={8}>
              <Statistic title="累计佣金金额" className='moneyData' value={moneyData.totalCommission&&moneyData.totalCommission/100} precision={2}/>
              <span className='amount'>{moneyData.freezeCommission?'元（其中冻结佣金额为'+moneyData.freezeCommission/100+'元)':''}</span>
            </Col>
            <Col span={8}>
               <Statistic title="累计返佣订单笔数" className='moneyData' value={moneyData.totalOrderCount}/>
               <span className='amount'>笔</span>
            </Col>
        </Row>
        <ProTable
            rowKey="id"
            actionRef={ref}
            params={{
                storeNo
            }}
            postData={(data) => {
                data.forEach(item => {
                  item.commission = item.commission/100
                  item.profit = item.profit/100
                  item.orderAmount = item.orderAmount/100

                })
                return data
            }}
            request={commissionPage}
            search={{
                defaultCollapsed: true,
                labelWidth: 100,
                optionRender: (searchConfig, formProps, dom) => [
                    ...dom.reverse()
                ],
            }}
            columns={columns}
        />
    </>
  );
};
