import React, { useState, useRef,useEffect } from 'react';
import { PageContainer } from '@/components/PageContainer';
import ProTable from '@ant-design/pro-table';
import { Button } from 'antd';

export default props => {
//导出
const exportExcel = (form) => {
    couponList({
      ...form.getFieldsValue(),
    }).then(res => {
        const data = res.data.map(item => {
          const { ...rest } = item;
          return {
            ...rest,
  
          }
        });
        const wb = XLSX.utils.book_new();
        const ws = XLSX.utils.json_to_sheet([
          {
            couponName: '会员ID',
            couponType: '用户名',
            useType: '发言时间',
            issueQuantity: '发言记录',
          },
          ...data
        ], {
          header: [
            'couponName',
            'couponType',
            'useType',
            'issueQuantity',
            'issueQuantity',
            'lqCouponQuantity',
            'useCouponQuantity',
            'activityTimeDisplay',
            'createTime',
            'adminName',
            'couponStatus',
          ],
          skipHeader: true
        });
        XLSX.utils.book_append_sheet(wb, ws, "file");
        XLSX.writeFile(wb, `${+new Date()}.xlsx`)
    })
  }
    const columns = [
        {
            title: '会员ID：',
            dataIndex: 'spuId',
        },
        {
            title: '会员类型',
            dataIndex: 'goodsImageUrl',
            valueType: 'select',
            valueEnum: {
                1: '消费者',
                2: '社区店',
            }
        },
        {
            title: '时间',
            key: 'dateRange',
            dataIndex: 'createdAtRange',
            valueType: 'dateRange',
        },
        {
            title: '用户名',
            dataIndex: 'goodsName',
            valueType: 'text',
        },
        {
            title: '会话',
            dataIndex: 'supplierName',
            valueType: 'text',
            hideInSearch: true,
        },
        {
            title: '发言',
            dataIndex: 'supplierName',
            valueType: 'text',
            hideInSearch: true,
        },
        {
            title: '开始时间',
            dataIndex: 'supplierName',
            valueType: 'text',
            hideInSearch: true,
        },
        {
            title: '截止时间',
            dataIndex: 'supplierName',
            valueType: 'text',
            hideInSearch: true, 
        },

        {
            title: '操作',
            render: (text, record, _, action) => [
                <Button>导出</Button>
            ],
            hideInSearch: true,
        },
    ];
  return (
    <PageContainer>
        <ProTable
        rowKey="ID"
        options={false}
        search={{
            defaultCollapsed: true,
            labelWidth: 100,
            optionRender: ({ searchText, resetText },{ form }) => [
                <Button
                    key="search"
                    type="primary"
                    onClick={() => {
                        form?.submit();
                    }}
                    >
                    {searchText}
                </Button>,
                <Button
                    key="rest"
                    onClick={() => {
                        form?.resetFields();
                    }}
                    >
                    {resetText}
                </Button>,
                <Button onClick={()=>{exportExcel(form)}} key="out">
                    导出数据
                </Button>
            ],
        }}
        columns={columns}
        rowSelection={{}}
        />
  </PageContainer>
  );
};
