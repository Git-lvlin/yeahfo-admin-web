import React, { useState, useRef, useEffect } from 'react';
import ProTable from '@ant-design/pro-table';
import { PageContainer } from '@/components/PageContainer';
import { Button, Card, Space, Table, Spin, Modal } from 'antd';
import { getWholesaleSku } from '@/services/intensive-activity-management/intensive-activity-list'
import { history } from 'umi';
import { amountTransform } from '@/utils/utils'
import { getWholesaleAuditList } from '@/services/intensive-activity-management/intensive-activity-audit'
import { ExclamationCircleOutlined } from '@ant-design/icons'
import Detail from './detail';
import BulkDetail from './bulk-detail';

const { confirm } = Modal;


const SubTable = (props) => {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false);


  const columns = [
    {
      title: 'spuID',
      dataIndex: 'spuId',
    },
    {
      title: 'skuID',
      dataIndex: 'skuId',
    },
    {
      title: '规格',
      dataIndex: 'skuNameDisplay',
    },
    {
      title: '商品名称',
      dataIndex: 'goodsName',
    },
    {
      title: '上架状态',
      dataIndex: 'goodsStateDesc',
    },
    {
      title: '供应商家ID',
      dataIndex: 'supplierId',
    },
    {
      title: '售价上浮比(%)',
      dataIndex: 'settlePercent',
      render: (_) => `${amountTransform(_)}%`
    },
    {
      title: `批发供货价(元/${data?.[0]?.unit})`,
      dataIndex: 'wholesaleSupplyPrice',
      render: (_) => amountTransform(_, '/')
    },
    {
      title: `市场价(元/${data?.[0]?.unit})`,
      dataIndex: 'marketPrice',
      render: (_) => amountTransform(_, '/')
    },
    {
      title: '集约库存',
      dataIndex: 'totalStockNum',
      render: (_, record) => {
        return (
          <>
            <div>{_}{record.unit}</div>
            {record.batchNumber > 1 && !!record.wsUnit && <div>({parseInt(_ / record.batchNumber, 10)}{record.wsUnit})</div>}
          </>
        )
      }
    },
    {
      title: `集约价(元/${data?.[0]?.unit})`,
      dataIndex: 'price',
      render: (_) => amountTransform(_, '/')
    },
    {
      title: '运营中心配送费补贴',
      dataIndex: 'operationFixedPrice',
      render: (_) => amountTransform(_, '/')
    },
    {
      title: '社区店配送费补贴',
      dataIndex: 'fixedPrice',
      render: (_) => amountTransform(_, '/')
    },
    {
      title: '单次起订量',
      dataIndex: 'minNum',
      render: (_, record) => {
        return (
          <>
            <div>{_}{record.unit}</div>
            {record.batchNumber > 1 && !!record.wsUnit && <div>({parseInt(_ / record.batchNumber, 10)}{record.wsUnit})</div>}
          </>
        )
      }
    },
    {
      title: '单次限订量',
      dataIndex: 'maxNum',
      render: (_, record) => {
        return (
          <>
            <div>{_}{record.unit}</div>
            {record.batchNumber > 1 && !!record.wsUnit && <div>({parseInt(_ / record.batchNumber, 10)}{record.wsUnit})</div>}
          </>
        )
      }
    },
    {
      title: '集约全款金额',
      dataIndex: 'totalMoney',
      render: (_) => amountTransform(_, '/')
    }
  ];

  useEffect(() => {
    setLoading(true);
    getWholesaleSku({
      wholesaleId: props.wholesaleId
    }).then(res => {
      if (res.code === 0) {
        setData(res?.data?.length ? res.data : [])
      }
    }).finally(() => {
      setLoading(false);
    })
  }, [])

  return (
    <Spin spinning={loading}>
      <Table rowKey="id" columns={columns} dataSource={data} pagination={false} />
    </Spin>
  )
};

const TableList = () => {
  const actionRef = useRef();
  const [detailVisible, setDetailVisible] = useState(false);
  const [bulkDetailVisible, setBulkDetailVisible] = useState(false);
  const [selectItem, setSelectItem] = useState({});

  const columns = [
    {
      title: '活动编号',
      dataIndex: 'wholesaleId',
      valueType: 'text',
      hideInSearch: true,
    },
    {
      title: '活动名称',
      dataIndex: 'name',
      valueType: 'text',
      fieldProps: {
        placeholder: '请输入名称'
      }
    },
    {
      title: '配送模式',
      dataIndex: 'wholesaleFlowTypeDesc',
      valueType: 'text',
      hideInSearch: true,
    },
    {
      title: '活动开始时间',
      dataIndex: 'wholesaleStartTime',
      valueType: 'text',
      hideInSearch: true,
      render: (_, records) => {
        return (
          <>
            <div>{records.wholesaleStartTime}</div>
          </>
        )
      }
    },
    {
      title: '采购单下单截止时间',
      dataIndex: 'endTimeAdvancePayment',
      valueType: 'text',
      hideInSearch: true,
    },
    {
      title: '创建人',
      dataIndex: 'createAdminName',
      valueType: 'text',
    },
    {
      title: '创建时间',
      key: 'dateTimeRange',
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
      title: '状态',
      dataIndex: 'wholesaleAuditStatusDesc',
      valueType: 'text',
      hideInSearch: true,
      render: (_, data) => {
        if (data.wholesaleAuditStatus === 2) {
          return <>{_} <Tooltip title={data.rejectionReason}><QuestionCircleOutlined /></Tooltip></>
        }
        return <div dangerouslySetInnerHTML={{ __html: _ }}></div>
      }
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, data) => (
        <Space>
          <a onClick={() => {
            setSelectItem(data);
            if (data.fresh === 2) {
              setBulkDetailVisible(true)
            } else {
              setDetailVisible(true);
            }
          }}>
            审核
          </a>
        </Space>
      ),
    },
  ];

  return (
    <PageContainer>
      <ProTable
        rowKey="wholesaleId"
        options={false}
        params={{
          wholesaleAuditStatus: 0
        }}
        scroll={{ x: 'max-content', scrollToFirstRowOnChange: true, }}
        request={getWholesaleAuditList}
        expandable={{ expandedRowRender: (_) => <SubTable wholesaleId={_.wholesaleId} wholesaleStatus={_.wholesaleStatus} /> }}
        search={{
          defaultCollapsed: true,
          labelWidth: 100,
          optionRender: (searchConfig, formProps, dom) => [
            ...dom.reverse(),
          ],
        }}
        columns={columns}
        actionRef={actionRef}
        pagination={{
          pageSize: 10,
        }}
      />
      {
        detailVisible &&
        <Detail
          id={selectItem?.id}
          detailVisible={detailVisible}
          setDetailVisible={setDetailVisible}
          callback={() => { setSelectItem(null); setDetailVisible(false); actionRef.current.reload() }}
        />
      }
      {
        bulkDetailVisible &&
        <BulkDetail
          id={selectItem?.id}
          detailVisible={bulkDetailVisible}
          setDetailVisible={setBulkDetailVisible}
          callback={() => { setSelectItem(null); setBulkDetailVisible(false); actionRef.current.reload() }}
        />
      }
    </PageContainer>

  );
};

export default TableList;
