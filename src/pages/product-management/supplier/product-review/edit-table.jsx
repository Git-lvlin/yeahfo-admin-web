import React, { useState, useEffect } from 'react';
import { EditableProTable } from '@ant-design/pro-table';
import { Form } from 'antd';

export default function EditTable(props) {
  const { tableHead, tableData, settleType, goodsSaleType, isSample } = props;
  const [columns, setColumns] = useState([])
  const [editableKeys, setEditableKeys] = useState([])
  const [dataSource, setDataSource] = useState([]);
  const [form] = Form.useForm();

  useEffect(() => {
    const arr = [];
    tableHead.forEach((item, index) => {
      if (item) {
        arr.push({
          title: item,
          dataIndex: `spec${index + 1}`,
          editable: false,
        })
      }
    });

    setColumns([
      {
        title: '规格图片',
        dataIndex: 'imageUrl',
        width: 80,
        editable: false,
        render: (_) => _ ? <img src={_} width="50" height="50" /> : '',

      },
      ...arr,
      {
        title: '零售供货价(元)',
        dataIndex: 'retailSupplyPrice',
        editable: false,
        hideInTable: goodsSaleType === 1,
      },
      {
        title: '批发供货价(元)',
        dataIndex: 'wholesaleSupplyPrice',
        editable: false,
        hideInTable: goodsSaleType === 2,
      },
      {
        title: '集采箱规单位量',
        dataIndex: 'batchNumber',
        hideInTable: goodsSaleType === 2,
      },
      {
        title: '最低批发量',
        dataIndex: 'wholesaleMinNum',
        editable: false,
        hideInTable: goodsSaleType === 2,
      },
      {
        title: '样品供货价(元)',
        dataIndex: 'sampleSupplyPrice',
        hideInTable: isSample !== 1,
      },
      {
        title: '样品起售量',
        dataIndex: 'sampleMinNum',
        hideInTable: isSample !== 1,
      },
      {
        title: '样品限售量',
        dataIndex: 'sampleMaxNum',
        hideInTable: isSample !== 1,
      },
      {
        title: '样品是否包邮',
        dataIndex: 'sampleFreight',
        hideInTable: isSample !== 1,
        render: (_) => _ === 1 ? '包邮' : '不包邮',
      },
      {
        title: '样品运费模板',
        dataIndex: 'sampleFreightId',
        render: (_) => _.label ? _.label : '_',
        hideInTable: isSample !== 1,
      },
      {
        title: '库存预警值',
        dataIndex: 'stockAlarmNum',
        editable: false,
      },
      {
        title: '可用库存',
        dataIndex: 'stockNum',
        editable: false,
      },
      {
        title: '平均运费(元)',
        dataIndex: 'wholesaleFreight',
        hideInTable: goodsSaleType === 2,
      },
      {
        title: '是否包邮',
        dataIndex: 'isFreeFreight',
        render: (_) => _ === 1 ? '包邮' : '不包邮',
        hideInTable: goodsSaleType === 1,
      },
      {
        title: '运费模板',
        dataIndex: 'freightTemplateId',
        render: (_) => _.label ? _.label : '_',
        hideInTable: goodsSaleType === 1,
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

  }, [tableHead, settleType])

  useEffect(() => {
    setDataSource(tableData);
  }, [tableData])

  return (
    <EditableProTable
      columns={columns}
      rowKey="key"
      value={dataSource}
      scroll={{ x: 'max-content' }}
      controlled
      editable={{
        editableKeys,
        actionRender: (row, config, defaultDoms) => {
          return [defaultDoms.delete];
        },
        onValuesChange: (record, recordList) => {
          // setDataSource(recordList);
          // setTableData(recordList)
          debounceFetcher({ record, recordList })
        }
      }}
      bordered
      recordCreatorProps={false}
      style={{ marginBottom: 20 }}
    />
  )
}
