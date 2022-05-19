import React, { useState, useEffect } from 'react';
import { Table } from 'antd';

export default function EditTable(props) {
  const { tableHead, tableData, goodsSaleType, settleType } = props;
  const [columns, setColumns] = useState([])

  useEffect(() => {
    const arr = [];
    tableHead.forEach((item, index) => {
      if (item) {
        arr.push({
          title: item,
          dataIndex: `spec${index + 1}`,
        })
      }
    });

    setColumns([
      {
        title: '规格图片',
        dataIndex: 'imageUrl',
        width: 100,
        render: (text) => {
          return <img src={text} width="50" height="50" />
        }
      },
      ...arr,
      {
        title: '零售供货价(元)',
        dataIndex: 'retailSupplyPrice',
        editable: false,
        hideInTable: goodsSaleType !== 0,
        width: 130,
      },
      {
        title: '批发供货价(元)',
        dataIndex: 'wholesaleSupplyPrice',
        editable: false,
        width: 130,
      },
      {
        title: '最低批发量',
        dataIndex: 'wholesaleMinNum',
        editable: false,
        width: 130,
      },
      {
        title: '秒约价',
        dataIndex: 'salePrice',
        editable: settleType === 2,
        width: 130,
        hideInTable: goodsSaleType !== 0,
      },
      {
        title: '秒约价上浮比例',
        dataIndex: 'salePriceFloat',
        hideInTable: goodsSaleType !== 0,
        width: 130,
      },
      {
        title: '秒约价实际盈亏',
        dataIndex: 'salePriceProfitLoss',
        editable: false,
        hideInTable: goodsSaleType !== 0,
        width: 130,
      },
      {
        title: '市场价',
        dataIndex: 'marketPrice',
        width: 130,
      },
      {
        title: '库存预警值',
        dataIndex: 'stockAlarmNum',
        editable: false,
        width: 130,
      },
      {
        title: '可用库存',
        dataIndex: 'stockNum',
        editable: false,
        width: 130,
        // formItemProps: {
        //   rules: [{
        //     required: true,
        //     whitespace: true,
        //     message: '请输入可用库存',
        //   }],
        // }
      },
      // {
      //   title: '操作',
      //   valueType: 'option',
      //   render: () => {
      //     return null;
      //   },
      //   width: 50
      // },
    ])

  }, [tableHead])

  return (
    <Table
      columns={columns}
      rowKey="key"
      dataSource={tableData}
      bordered
      style={{ marginBottom: 20 }}
      pagination={false}
    />
  )
}
