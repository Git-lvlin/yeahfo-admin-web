import React, { useState, useRef,useEffect } from 'react';
import ProTable from '@ant-design/pro-table';
import { withdrawPage } from '@/services/activity-management/spring-festival-build-building-activity';
import { PageContainer } from '@/components/PageContainer';
import { amountTransform } from '@/utils/utils'



export default (props) => {
    const ref=useRef()
    let sn = props.location.query.sn
    const columns= [
      {
        title: '序号',
        dataIndex:'id',
        valueType: 'borderIndex',
        hideInSearch: true,
        valueType: 'indexBorder'
      },
      {
        title: '提现单号',
        dataIndex: 'sn',
        valueType: 'text',
      },
      {
        title: '用户手机号',
        dataIndex: 'withdrawAccount',
        valueType: 'text',
        hideInTable: true,
      },
      {
        title: '提现用户名',
        dataIndex: 'realName',
        valueType: 'text',
      },
      {
        title: '提现银行机构',
        dataIndex: 'paymentMethod',
        valueType: 'select',
        valueEnum: {
          'alipay':'支付宝',
        },
        hideInSearch: true,
      },
      {
        title: '账户号码',
        dataIndex: 'withdrawAccount',
        valueType: 'text',
        hideInSearch: true,
      },
      {
        title: '银行账户',
        dataIndex: 'withdrawAccount',
        valueType: 'text',
        hideInTable: true,
      },
      {
        title: '提现金额',
        dataIndex: 'amount',
        valueType: 'text',
        hideInSearch: true,
        render:(_,data)=>{
          return <p>{amountTransform(_, '/')}元</p>
        }
      },
      {
        title: '提现申请时间',
        key: 'dateTimeRange',
        dataIndex: 'createTime',
        valueType: 'dateTimeRange',
        hideInTable: true,
      },
      {
        title: '提现申请时间',
        dataIndex: 'createTime',
        valueType: 'text',
        hideInSearch:true,
      },
      {
        title: '提现手续费',
        dataIndex: 'fee',
        valueType: 'text',
        hideInSearch: true,
        render:(_,data)=>{
          return <p>{amountTransform(_, '/')}元</p>
        }
      },
      {
        title: '偶然所得税',
        dataIndex: 'tax',
        valueType: 'text',
        hideInSearch: true,
        render:(_,data)=>{
          return <p>{amountTransform(_, '/')}元</p>
        }
      },
      {
        title: '实际到账金额',
        dataIndex: 'realAmount',
        valueType: 'text',
        hideInSearch: true,
        render:(_,data)=>{
          return <p>{amountTransform(_, '/')}元</p>
        }
      },
      {
        title: '提现状态',
        dataIndex: 'status',
        valueType: 'select',
        valueEnum: {
          'auditing':'待审核',
          'waitPay':'待执行',
          'paid':'已执行',
          'arrived':'已到帐',
          'unPass':'审核拒绝', 
          'failure':'提现失败'
        },
      },
      {
        title: '失败原因',
        dataIndex: 'reason',
        valueType: 'text',
        hideInSearch: true,
      },
      {
        title: '提现到账时间',
        key: 'dateTimeRange2',
        dataIndex: 'notifyTime',
        valueType: 'dateTimeRange',
        hideInTable: true,
      },
      {
        title: '提现到账结果时间',
        dataIndex: 'notifyTime',
        valueType: 'text',
        hideInSearch:true   
      }
    ];
    return (
      <PageContainer>
        <ProTable
          actionRef={ref}
          rowKey="sn"
          options={false}
          request={withdrawPage}
          params={{
            activityType:1,
            sn:sn
          }}
          search={{
            defaultCollapsed: true,
            labelWidth: 100,
            optionRender: (searchConfig, formProps, dom) => [
               ...dom.reverse()
            ],
          }}
          scroll={{ x: 'max-content', scrollToFirstRowOnChange: true, }}
          columns={columns}
          pagination={{
            pageSize: 10,
            showQuickJumper: true,
          }}
        />
        </PageContainer>
    );
  };