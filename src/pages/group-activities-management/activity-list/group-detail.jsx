import React, { useState, useEffect } from 'react';
import ProCard from '@ant-design/pro-card';
import { PageContainer } from '@ant-design/pro-layout';
import ProTable from '@ant-design/pro-table';
import { Drawer, Space, Spin, Table } from 'antd';
import { singleGroupList, groupMemberList } from '@/services/single-contract-activity-management/group-detail'

const SubTable = (props) => {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false);
  const columns = [
    { 
      title: '序号', 
      dataIndex: 'index', 
      render: (_, $, index) => data.length - index
    },
    { 
      title: '参团用户手机号',
      dataIndex: 'joinMemberPhone',
      render: (_, r) => <span>{_}{r.type === 1 && `（团长）`}</span>
    },
    { 
      title: '参团时间',
      dataIndex: 'createTime' 
    },
    { 
      title: '支付状态',
      dataIndex: 'payStatus'
    },
    { 
      title: '拼团商品数量', 
      dataIndex: 'goodsNum' 
    },
  ];

  useEffect(() => {
    setLoading(true);
    groupMemberList({
      groupId: props.data.id
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
}

const TableList = ({data, visible, onClose, id, groupState, info}) => {

  const columns = [
    {
      title: "团ID",
      dataIndex: 'id',
      valueType: 'text',
      hideInSearch: true,
    },
    {
      title: '团长手机号',
      dataIndex: 'groupMemberPhone',
      valueType: 'text',
      hideInTable: true
    },
    {
      title: '开团时间',
      dataIndex: 'createGroupTime',
      valueType: 'dateTimeRange',
      hideInTable: true,
    },
    {
      title: '开团时间',
      dataIndex: 'startTime',
      valueType: 'text',
      hideInSearch: true,
    },
    {
      title: '真实参团人数',
      dataIndex: 'joinedNum',
      valueType: 'text',
      hideInSearch: true,
    },
    {
      title: '剩余时间（小时）',
      dataIndex: 'remainTime',
      valueType: 'text',
      hideInSearch: true,
    },
    {
      title: '拼团商品数量',
      dataIndex: 'goodsNum',
      valueType: 'text',
      hideInSearch: true,
    },
    {
      title: '参团手机号',
      dataIndex: 'joinMemberPhone',
      hideInTable: true
    },
    {
      title: '参团时间',
      dataIndex: 'joinGroupTime',
      hideInTable: true,
      valueType: 'dateTimeRange'
    },
    {
      title: '成团时间',
      dataIndex: 'finishGroupTime',
      hideInTable: true,
      valueType: 'dateTimeRange',
      hideInSearch: groupState === 3 || groupState === 2
    },
    {
      title: '失败时间',
      dataIndex: 'finishGroupTime',
      hideInTable: true,
      valueType: 'dateTimeRange',
      hideInSearch: groupState === 1 || groupState === 2
    }
  ]
  
  return (
    <Drawer
      visible={visible}
      onClose={onClose}
      width={1200}
    >
      <div style={{ marginBottom: 10, padding: 10 }}>
        <Space size="middle">
          <span style={{maxWidth: "260px", display: "inline-block"}}>{data.goodsName}</span>
          <span>skuID:{data.skuId}</span>
          <span>({info.activityName}</span>
          <span>{info.activityStartTime}~{info.activityEndTime}</span>
          {info.virtualType === 2 && <span>虚拟成团)</span>}
          {data.memberType === 1 &&<span>限新人参团</span>}
          <span>{info.groupNum}人团</span>
          <span>
            {{
              2: '拼团中',
              1: '已成团',
              3: '已失败'
            }[groupState]}
          </span>
        </Space>
      </div>
      <ProTable
        rowKey="id"
        options={false}
        params={{
          activityId: id,
          groupState,
          skuId: data.skuId
        }}
        dateFormatter="string"
        expandable={{ expandedRowRender: (_) => <SubTable data={_} /> }}
        request={singleGroupList}
        search={{
          defaultCollapsed: false,
          labelWidth: 100,
          optionRender: (searchConfig, formProps, dom) => [
            ...dom.reverse(),
          ],
        }}
        columns={columns}
        pagination={{
          pageSize: 10,
        }}
      />
    </Drawer>
  )
};

export default TableList;
