import React, { useState, useRef } from 'react';
import ProTable from '@ant-design/pro-table';
import { PageContainer } from '@/components/PageContainer';
import { amountTransform } from '@/utils/utils'
import { remindStatisticsList } from '@/services/intensive-activity-management/intensive-remind-statistics';


export default (props) => {
  const ref=useRef()
  const columns= [
    {
      title: '活动商品名称',
      dataIndex: 'goodsName',
      valueType: 'text'
    },
    {
      title: '活动名称',
      dataIndex: 'wsName',
      hideInSearch: true,
    },
    {
      title: '提醒次数',
      dataIndex: 'count',
      hideInSearch: true,
      width: 100,
    },
    {
      title: '集约价(元)',
      dataIndex: 'price',
      hideInSearch: true,
      render: (_)=> amountTransform(_, '/').toFixed(2)
    },
    {
      title: '提醒产生采购单数',
      dataIndex: 'orderNum',
      valueType: 'text',
      hideInSearch: true,
      width: 130,
    },
    {
      title: '提醒产生采购单金额(元)',
      dataIndex: 'orderPay',
      valueType: 'text',
      hideInSearch: true,
      width: 200,
      render: (_)=> amountTransform(_, '/').toFixed(2)
    }
    
  ];


return(
  <PageContainer>
    <ProTable
      actionRef={ref}
      rowKey="id"
      options={false}
      request={remindStatisticsList}
      scroll={{ x: 'max-content', scrollToFirstRowOnChange: true, }}
      search={{
        defaultCollapsed: true,
        labelWidth: 100,
        optionRender: (searchConfig, formProps, dom) => [
          ...dom.reverse()
        ],
      }}
      columns={columns}
    />
  </PageContainer>
  );
};
