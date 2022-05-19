import React, { useState } from 'react';
import ProTable from '@ant-design/pro-table';
import { PageContainer } from '@/components/PageContainer';
import OrderDetail from './order-detail';
import { orderList } from '@/services/order-management/retail-list';
import { Table } from 'antd';
import { amountTransform } from '@/utils/utils'

const SubTable = (props) => {
  const { data } = props;
  const columns = [
    { title: 'spuID', dataIndex: 'skuId' },
    { title: '图片', dataIndex: 'goodsImageUrl', render: (text) => <img width={50} height={50} src={text} /> },
    { title: '商品名称', dataIndex: 'goodsName' },
    { title: '商品数量', dataIndex: 'skuNum' },
    { title: '商品小计金额（元）', dataIndex: 'goodsTotalPrice', render: (text) => amountTransform(text, '/') },
  ];

  return (
    <Table columns={columns} dataSource={data} pagination={false} />
  )
};

const TableList = () => {
  const columns = [
    {
      title: '订单编号',
      dataIndex: 'orderSn',
      valueType: 'text',
      fieldProps: {
        placeholder: '请输入订单编号'
      }
    },
    {
      title: '下单手机号',
      dataIndex: 'phone',
      valueType: 'text',
      fieldProps: {
        placeholder: '请输入下单手机号'
      }
    },
    {
      title: '商品数量',
      dataIndex: 'totalAmount',
      valueType: 'text',
      hideInSearch: false,
    },
    {
      title: '商品数量',
      dataIndex: 'goodsNum',
      valueType: 'text',
      hideInSearch: false,
    },
    {
      title: '收货人手机号',
      dataIndex: 'goodsNum',
      valueType: 'text',
      hideInSearch: false,
    },
    {
      title: '收货人姓名',
      dataIndex: 'consignee',
      valueType: 'text',
      hideInSearch: false,
    },
    {
      title: '收货人地址',
      dataIndex: 'address',
      valueType: 'text',
      hideInSearch: false,
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      render: () => (
        <>
          <a>编辑</a>
        </>
      ),
    },
  ];

  return (
    <PageContainer>
      <ProTable
        rowKey="id"
        options={false}
        search={{
          defaultCollapsed: true,
          labelWidth: 100
        }}
        columns={columns}
        request={orderList}
        expandable={{ expandedRowRender: (_) => <SubTable data={_.orderItem} /> }}
      />
      {/* <OrderDetail /> */}
    </PageContainer>

  );
};

export default TableList;
