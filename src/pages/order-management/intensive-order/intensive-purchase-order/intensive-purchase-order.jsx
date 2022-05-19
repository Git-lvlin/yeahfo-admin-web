import React, { useState, useRef } from 'react';
import { Button, Radio, Space } from 'antd';
import ProTable from '@ant-design/pro-table';
import { PageContainer } from '@/components/PageContainer';
import { operationList } from '@/services/order-management/intensive-purchase-order';
import moment from 'moment';
import Export from '@/pages/export-excel/export'
import ExportHistory from '@/pages/export-excel/export-history'
import Detail from './detail';

const TableList = () => {
  const [detailVisible, setDetailVisible] = useState(false);
  const [selectItem, setSelectItem] = useState({});
  const [params, setParams] = useState({ status: '' });
  const actionRef = useRef();
  const formRef = useRef();
  const [visit, setVisit] = useState(false)
  const [shipVisible, setShipVisible] = useState(false);

  const columns = [
    {
      title: '集约活动ID',
      dataIndex: 'wsId',
      width: 100,
    },
    {
      title: '采购单号',
      dataIndex: 'poNo',
    },
    {
      title: '收货方',
      dataIndex: 'operationName',
    },
    {
      title: '发货方',
      dataIndex: 'supplierName',
    },
    {
      title: '采购商品',
      dataIndex: 'goodsName',
    },
    {
      title: '采购数量',
      dataIndex: 'totalNum',
      valueType: 'text',
      hideInSearch: true,
      width: 100,
    },
    {
      title: '库存单位',
      dataIndex: 'unit',
      valueType: 'text',
      hideInSearch: true,
      width: 100,
    },
    {
      title: '状态',
      dataIndex: 'statusDesc',
      valueType: 'text',
      hideInSearch: true,
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      valueType: 'dateTimeRange',
      hideInTable: true,
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      valueType: 'text',
      hideInSearch: true,
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => {
        return (
          <Space>
            <a onClick={() => { setSelectItem(record); setDetailVisible(true); }}>详情</a>
          </Space>
        )
      },
    },
  ];

  const getFieldValue = () => {
    if (formRef?.current?.getFieldsValue) {
      const user = JSON.parse(localStorage.getItem('user'))
      const { current, pageSize, createTime, ...rest } = formRef?.current?.getFieldsValue?.();
      const obj = {};

      if (createTime) {
        obj.beginTime = moment(createTime[0]).format('YYYY-MM-DD HH:mm:ss');
        obj.endTime = moment(createTime[1]).format('YYYY-MM-DD HH:mm:ss');
      }

      return {
        operatorSource: 2, operatorId: user.id, operatorName: user.username,
        ...rest, ...obj, ...params
      }
    }
    return {}
  }

  return (
    <PageContainer>
      <ProTable
        rowKey="poNo"
        options={{
          density: false,
          reload: true,
          fullScreen: false,
          setting: false,
        }}
        scroll={{ x: 'max-content', scrollToFirstRowOnChange: true, }}
        actionRef={actionRef}
        formRef={formRef}
        params={params}
        request={operationList}
        search={{
          defaultCollapsed: true,
          optionRender: ({ searchText, resetText }, { form }) => [
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
            // <Button
            //   key="rest"
            //   onClick={() => {
            //     form?.resetFields();
            //   }}
            // >
            //   {resetText}
            // </Button>,
            <Export
              key="3"
              change={(e) => { setVisit(e) }}
              type="admin-intensive-delivery-order-export"
              conditions={getFieldValue}
            />,
            <ExportHistory key="4" show={visit} setShow={setVisit} type="admin-intensive-delivery-order-export" />,
          ],
        }}
        toolbar={{
          multipleLine: true,
          filter: (
            <Radio.Group
              optionType="button"
              buttonStyle="solid"
              defaultValue={''}
              options={[
                {
                  label: '全部',
                  value: '',
                },
                {
                  label: '待发货',
                  value: 1,
                },
                {
                  label: '待收货',
                  value: 2,
                },
                {
                  label: '已收货',
                  value: 3,
                },
                {
                  label: '已完成',
                  value: 5,
                },
              ]}
              onChange={(e) => {
                setParams({
                  status: e.target.value
                })
                actionRef.current.reload();
              }}
            />
          )
        }}
        columns={columns}
        pagination={{
          pageSize: 10,
          showQuickJumper: true,
        }}
      />
      {
        detailVisible &&
        <Detail
          id={selectItem?.poNo}
          visible={detailVisible}
          setVisible={setDetailVisible}
          callback={() => {
            setDetailVisible(false);
            setSelectItem(null);
            actionRef.current.reload();
          }}
        />
      }
    </PageContainer>
  );
};

export default TableList;
