import React, { useState, useRef, useEffect } from 'react';
import ProTable from '@ant-design/pro-table';
import { PageContainer } from '@/components/PageContainer';
import { Button, Card, Space, Table, Spin, Modal, Tooltip, Menu, Dropdown } from 'antd';
import { PlusOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import {
  getWholesaleList,
  getWholesaleDetail,
  getWholesaleSku,
  updateWholesaleState,
  getWholesaleOneSku,
  wholesaleStop,
  cancelWholesale,
} from '@/services/intensive-activity-management/intensive-bulk-activity-list'
import { history } from 'umi';
import { amountTransform } from '@/utils/utils'
import { ExclamationCircleOutlined } from '@ant-design/icons'
import Stock from './stock';
import Area from './area';
import TimeSet from './time-set';
import style from './area.less';

const { confirm } = Modal;


const SubTable = (props) => {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false);
  const [stockVisible, setStockVisible] = useState(false);
  const [stockData, setStockData] = useState(null);
  const [reload, setReload] = useState(null);

  const setStock = (record) => {
    getWholesaleOneSku({
      wholesaleId: props.wholesaleId,
      skuId: record.skuId
    }).then(res => {
      if (res.code === 0) {
        setStockData({
          ...res.data,
          wsId: props.wholesaleId,
        })
        setStockVisible(true);
      }
    })
  }

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
    // {
    //   title: '结算类型',
    //   dataIndex: 'settleType',
    //   render: (_) => {
    //     return {
    //       0: '全部',
    //       1: '佣金模式',
    //       2: '底价模式'
    //     }[_]
    //   }
    // },
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
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => {
        return (
          <Space>
            {(props.wholesaleStatus === 1 || props.wholesaleStatus === 2) && <a onClick={() => { setStock(record) }}>追加库存</a>}
          </Space>
        )
      },
    },
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
  }, [reload])

  return (
    <Spin spinning={loading}>
      <Table rowKey="id" columns={columns} dataSource={data} pagination={false} />
      {stockVisible && <Stock
        data={stockData}
        visible={stockVisible}
        setVisible={setStockVisible}
        callback={() => { setReload(!reload) }}
      />}
    </Spin>
  )
};

const TableList = () => {
  const [visible, setVisible] = useState(false);
  const [timeVisible, setTimeVisible] = useState(false);
  const [detailData, setDetailData] = useState(null)
  const [selectItem, setSelectItem] = useState(null);
  const actionRef = useRef();

  const getDetail = (wholesaleId) => {
    getWholesaleDetail({
      wholesaleId
    }).then(res => {
      if (res.code === 0) {
        setVisible(true);
        setDetailData(res.data);
      }
    })
  }

  const wholesaleStopRequest = (wholesaleId, stopType) => {
    wholesaleStop({
      wholesaleId,
      stopType,
    }).then(res => {
      if (res.code === 0) {
        actionRef.current.reload();
      }
    })
  }

  const update = (wholesaleId) => {
    updateWholesaleState({
      wholesaleId
    }).then(res => {
      if (res.code === 0) {
        actionRef.current.reload();
      }
    })
  }

  const cancel = (wholesaleId) => {
    confirm({
      title: '请确认要取消活动',
      icon: <ExclamationCircleOutlined />,
      content: <div><span style={{ color: 'red' }}>取消后无法开启</span>，你还要继续吗？</div>,
      okText: '取消活动',
      cancelText: '不取消',
      onOk() {
        cancelWholesale({
          wsId: wholesaleId
        }).then(res => {
          if (res.code === 0) {
            actionRef.current.reload();
          }
        })
      },
    });

  }

  const handleMenuClick = ({ key }, data) => {
    if (key === '1') {
      history.push(`/intensive-activity-management/intensive-bulk-activity-create/${data.wholesaleId}`)
    }
    if (key === '2') {
      confirm({
        title: '确定要终止集约活动店主下单么？',
        icon: <ExclamationCircleOutlined />,
        content: <div><span style={{ color: 'red' }}>终止后店主将无法采购</span>，你还要继续吗？</div>,
        onOk() {
          wholesaleStopRequest(data.wholesaleId, 1)
        },
      });
    }

    if (key === '3') {
      confirm({
        title: '确定要终止集约店主和消费者下单么？',
        icon: <ExclamationCircleOutlined />,
        content: <div><span style={{ color: 'red' }}>终止后店主和消费者将无法集约</span>，你还要继续吗？</div>,
        onOk() {
          wholesaleStopRequest(data.wholesaleId, 2)
        },
      });
    }

    if (key === '4') {
      setVisible(true);
      setSelectItem(data);
    }

    if (key === '5') {
      update(data.wholesaleId)
    }

    if (key === '6') {
      cancel(data.wholesaleId)
    }

    if (key === '7') {
      history.push(`/intensive-activity-management/intensive-bulk-activity-create/${data.wholesaleId}?type=1`)
    }

    if (key === '8') {
      setTimeVisible(true);
      setSelectItem(data);
    }
  }

  const handleButtonClick = (_, data) => {
    history.push(`/intensive-activity-management/intensive-bulk-activity-detail/${data.wholesaleId}`)
  }

  const menu = (data) => (
    <Menu onClick={(e) => { handleMenuClick(e, data) }}>
      {data.wholesaleAuditStatus !== 1 && data.wholesaleAuditStatus !== 3 && <Menu.Item key="1">编辑</Menu.Item>}
      {
        (data.wholesaleStatus === 1 || data.wholesaleStatus === 2 || data.wholesaleStatus === 4 || data.wholesaleStatus === 5)
        &&
        <>
          {
            data.wholesaleStatus !== 4 && data.wholesaleStatus !== 5 && <Menu.Item key="2">终止店主集约</Menu.Item>
          }
          {
            data.wholesaleStatus !== 5
            &&
            <>
              {/* <Menu.Item key="3">终止店主和消费者集约</Menu.Item> */}
              <Menu.Item key="4">区域</Menu.Item>
            </>
          }
          {
            data.wholesaleStatus === 2
            &&
            <Menu.Item key="5"><span style={{ color: 'red' }}>终止</span></Menu.Item>
          }
        </>
      }
      {
        data.wholesaleAuditStatus === 0
        &&
        <Menu.Item key="6">取消活动</Menu.Item>
      }
      <Menu.Item key="7">复制活动</Menu.Item>
      {
        data.wholesaleStatus === 1 && +new Date() < +new Date(data.endTimeAdvancePayment)
        && <Menu.Item key="8">重置店主采购下单截止时间</Menu.Item>
      }
    </Menu>
  )

  const columns = [
    {
      title: '活动编号',
      dataIndex: 'wholesaleId',
      valueType: 'text',
      hideInSearch: true,
      width: 80,
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
      title: '活动状态',
      dataIndex: 'wholesaleIsOnline',
      valueType: 'select',
      valueEnum: {
        0: '已下架',
        1: '待开始',
        2: '进行中',
        3: '已结束',
      },
      hideInTable: true,
    },
    {
      title: '审核状态',
      dataIndex: 'wholesaleAuditStatus',
      valueType: 'select',
      valueEnum: {
        0: '待审核',
        1: '审核通过',
        2: '已拒绝',
        3: '已取消',
      },
      hideInTable: true,
    },
    // {
    //   title: '活动时间',
    //   dataIndex: 'wholesaleTime',
    //   valueType: 'dateRange',
    //   hideInTable: true,
    // },
    // {
    //   title: '可购买后销售的社区店等级',
    //   dataIndex: 'storeLevel',
    //   valueType: 'text',
    //   hideInSearch: true,
    // },
    {
      title: '配送模式',
      dataIndex: 'wholesaleFlowTypeDesc',
      valueType: 'text',
      hideInSearch: true,
    },
    // {
    //   title: '可购买的会员等级',
    //   dataIndex: 'memberLevel',
    //   valueType: 'text',
    //   hideInSearch: true,
    // },
    // {
    //   title: '可恢复支付次数',
    //   dataIndex: 'canRecoverPayTimes',
    //   valueType: 'text',
    //   hideInSearch: true,
    // },
    // {
    //   title: '每次恢复的支付时限(小时)',
    //   dataIndex: 'recoverPayTimeout',
    //   valueType: 'text',
    //   hideInSearch: true,
    //   render: (text) => +new Big(text).div(3600).toFixed(1)
    // },
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
      render: (_, data) => {
        return (
          <>
            <div dangerouslySetInnerHTML={{ __html: _ }}></div>
            <div>{data.endTimeAdvancePaymentLogMsg}</div>
          </>
        )
      }
    },
    {
      title: '创建人',
      dataIndex: 'createAdminName',
      valueType: 'text',
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
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
      title: '活动状态',
      dataIndex: 'wholesaleStatusDesc',
      valueType: 'text',
      hideInSearch: true,
      render: (_) => {
        return <div dangerouslySetInnerHTML={{ __html: _ }}></div>
      }
    },
    {
      title: '审核状态',
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
      width: 110,
      fixed: 'right',
      render: (_, data) => (
        <Space>
          <Dropdown.Button onClick={(e) => { handleButtonClick(e, data) }} overlay={() => { return menu(data) }}>详情</Dropdown.Button>
        </Space >
      ),
    },
  ];

  return (
    <PageContainer>
      <div className={style.test}>
        <Card>
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button type="primary" icon={<PlusOutlined />} onClick={() => { history.push('/intensive-activity-management/intensive-bulk-activity-create/0') }}>新建</Button>
          </div>
        </Card>
        {visible && <Area visible={visible} wsId={selectItem?.wholesaleId} setVisible={setVisible} />}
        {timeVisible && <TimeSet visible={timeVisible} data={selectItem} setVisible={setTimeVisible} callback={() => { actionRef.current.reload() }} />}
        <ProTable
          rowKey="wholesaleId"
          options={false}
          request={getWholesaleList}
          scroll={{ x: 'max-content', scrollToFirstRowOnChange: true, }}
          expandable={{ expandedRowRender: (_) => <SubTable wholesaleId={_.wholesaleId} wholesaleStatus={_.wholesaleStatus} wholesaleAuditStatus={_.wholesaleAuditStatus} /> }}
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
      </div>
    </PageContainer>

  );
};

export default TableList;
