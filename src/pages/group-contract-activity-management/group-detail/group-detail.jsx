import React, { useState, useEffect } from 'react';
import ProTable from '@ant-design/pro-table';
import { Space, Table, Spin } from 'antd';
import { PageContainer } from '@/components/PageContainer';
import { useParams, useLocation } from 'umi';
import { multiGroupList, groupMemberList } from '@/services/single-contract-activity-management/group-detail'

const SubTable = (props) => {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false);

  const columns = [
    { title: '序号', dataIndex: 'index', render: (_, $, index) => data.length - index },
    { title: '参团用户手机号', dataIndex: 'joinMemberPhone' },
    { title: '参团时间', dataIndex: 'createTime' },
    { title: '支付状态', dataIndex: 'payStatus' },
    { title: '拼约商品数量', dataIndex: 'goodsNum' },
  ];

  useEffect(() => {
    setLoading(true);
    groupMemberList({
      groupId: props.data.id
    }).then(res => {
      setData(res?.data?.length ? res.data : [])
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
  const params = useParams();
  const location = useLocation()

  const columns = [
    {
      title: '参团手机号',
      dataIndex: 'joinMemberPhone',
      valueType: 'text',
      fieldProps: {
        placeholder: '请输入请输入会员手机号'
      },
      hideInTable: true,
    },
    {
      title: <div style={{ position: 'relative' }}><span style={{ position: 'absolute', marginLeft: '-50px' }}>详情</span>团ID</div>,
      dataIndex: 'id',
      valueType: 'text',
      hideInSearch: true,
    },
    // {
    //   title: '团长手机号',
    //   dataIndex: 'groupMemberPhone',
    //   valueType: 'text',
    //   fieldProps: {
    //     placeholder: '请输入请输入会员手机号'
    //   }
    // },
    {
      title: '开团时间',
      dataIndex: 'createGroupTime',
      valueType: 'dateRange',
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
      title: '拼约状态',
      dataIndex: 'groupState',
      valueType: 'text',
      hideInSearch: true,
    },
    {
      title: '成团时间',
      dataIndex: 'finishGroupTime',
      valueType: 'text',
      hideInSearch: true,
    },
    {
      title: '参团时间',
      dataIndex: 'joinGroupTime',
      valueType: 'dateRange',
      hideInTable: true,
    },
  ];

  return (
    <PageContainer>
      <div style={{ marginBottom: 10, background: '#fff', padding: 10 }}>
        <Space size="large">
          <span>{location?.query?.goodsName}</span>
          <span>skuID:{location?.query?.skuId}</span>
          <span>({location?.query?.activityName}</span>
          <span>{location?.query?.activityStartTime}~{location?.query?.activityEndTime}</span>
          <span>团约{location?.query?.groupNum}人团</span>
          <span>{{
            1: '待开始',
            2: '进行中',
            3: '已结束',
            4: '已中止'
          }[location?.query?.activityStatus]})</span>
        </Space>
      </div>
      <ProTable
        rowKey="id"
        options={false}
        params={{
          activityId: params.id,
          groupState: 2,
          skuId: location?.query?.skuId,
        }}
        expandable={{ expandedRowRender: (_) => <SubTable data={_} /> }}
        request={multiGroupList}
        search={{
          defaultCollapsed: true,
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
    </PageContainer>

  );
};

export default TableList;
