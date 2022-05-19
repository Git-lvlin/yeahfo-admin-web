import React, { useState, useRef } from 'react';
import ProTable from '@ant-design/pro-table';
import { PageContainer } from '@/components/PageContainer';
import { Button, Card, Space } from 'antd';
import { history } from 'umi';
import { PlusOutlined } from '@ant-design/icons';
import { ruleList, ruleDetail, ruleEnd } from '@/services/single-contract-activity-management/activity-list';
import moment from 'moment';
import ActivityCrate from './activity-crate';
// import Form from './form';

const TableList = () => {
  const [visible, setVisible] = useState(false);
  const [detailData, setDetailData] = useState(null);
  const actionRef = useRef();

  const getDetail = (id) => {
    ruleDetail({
      id
    }).then(res => {
      if (res.code === 0) {
        setDetailData(res.data);
        setVisible(true);
      }
    })
  }

  const activityStop = (id) => {
    ruleEnd({
      id
    }).then(res => {
      if (res.code === 0) {
        actionRef.current.reload();
      }
    })
  }

  const columns = [
    {
      title: '活动ID',
      dataIndex: 'id',
      valueType: 'text',
      fieldProps: {
        placeholder: '请输入活动ID'
      }
    },
    {
      title: '活动名称',
      dataIndex: 'activityName',
      valueType: 'text',
      fieldProps: {
        placeholder: '请输入活动名称'
      }
    },
    {
      title: '活动时间',
      dataIndex: 'activityStartTime',
      valueType: 'text',
      hideInSearch: true,
      render: (_, data) => (
        <>
          {moment(data.activityStartTime * 1000).format('YYYY-MM-DD HH:mm:ss')}
          <br />
          {moment(data.activityEndTime * 1000).format('YYYY-MM-DD HH:mm:ss')}
        </>
      )
    },
    {
      title: '单约人数',
      dataIndex: 'groupNum',
      valueType: 'text',
      fieldProps: {
        placeholder: '请输入单约人数'
      }
    },
    {
      title: '单约拼约时长(h)',
      dataIndex: 'groupTime',
      valueType: 'text',
      hideInSearch: true,
    },
    {
      title: '单约虚拟成团',
      dataIndex: 'virtualType',
      valueType: 'text',
      valueEnum: {
        1: '关闭',
        2: '开启',
      }
    },
    {
      title: '状态',
      dataIndex: 'activityStatus',
      valueType: 'text',
      valueEnum: {
        1: '待开始',
        2: '进行中',
        3: '已结束',
        4: '已中止'
      }
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'text',
      render: (_, data) => (
        <Space>
          <a
            onClick={() => {
              history.push(`/single-contract-activity-management/activity-product/${data.id}`)
            }}>
            活动商品</a>
          <a onClick={() => { history.push(`/single-contract-activity-management/activity-detail/${data.id} `) }}>详情</a>
          {data.activityStatus === 1
            &&
            <a onClick={() => { getDetail(data.id) }}>编辑</a>
          }
          {(data.activityStatus === 2 || data.activityStatus === 1)
            &&
            <a onClick={() => { activityStop(data.id) }}>中止</a>
          }
        </Space>
      ),
      hideInSearch: true,
    },
  ];

  return (
    <PageContainer>
      <Card>
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button key="out" type="primary" icon={<PlusOutlined />} onClick={() => { setVisible(true) }}>新建</Button>
        </div>
      </Card>
      <ProTable
        rowKey="id"
        options={false}
        params={{
          activityType: 3,
        }}
        request={ruleList}
        search={{
          defaultCollapsed: true,
          labelWidth: 100,
          optionRender: (searchConfig, formProps, dom) => [
            ...dom.reverse(),
          ],
        }}
        scroll={{ y: window.innerHeight - 650, scrollToFirstRowOnChange: true, }}
        columns={columns}
        actionRef={actionRef}
        pagination={{
          pageSize: 10,
        }}
      />
      {visible &&
        <ActivityCrate
          visible={visible}
          setVisible={setVisible}
          callback={() => { actionRef.current.reload() }}
          detailData={detailData}
          onClose={() => { setDetailData(null) }}
        />
      }
    </PageContainer>

  );
};

export default TableList;
