import React, { useState, useRef } from 'react';
import { InfoCircleOutlined } from '@ant-design/icons'
import ProTable from '@ant-design/pro-table';
import { PageContainer } from '@/components/PageContainer';
import { gradeList } from '@/services/intensive-store-management/grade-index';
import { amountTransform } from '@/utils/utils'
import Form from './form';

const GradeIndex = () => {
  const [formVisible, setFormVisible] = useState(false);
  const [detailData, setDetailData] = useState({});
  const actionRef = useRef();
  const formRef = useRef();

  const columns = [
    {
      title: '等级',
      dataIndex: 'gradeLevel',
      valueType: 'text',
    },
    {
      title: '等级徽章',
      dataIndex: 'icon',
      valueType: 'text',
      render: (_) => <img src={_} width="50" height="50" />
    },
    {
      title: '等级名称',
      dataIndex: 'gradeName',
      valueType: 'text',
    },
    {
      title: '成长值',
      dataIndex: ['upgrade', 'score', 'max'],
      valueType: 'text',
    },
    {
      title: '月度指标(元)',
      dataIndex: 'scoreGradeMonthlyIndicator',
      valueType: 'text',
      render: (_) => amountTransform(_, '/')
    },
    {
      title: '权益可开分店数量',
      dataIndex: 'equity',
      valueType: 'text',
    },
    {
      title: '操作',
      valueType: 'options',
      render: (_, data) => <a onClick={() => { setDetailData(data); setFormVisible(true) }}>配置</a>
    },
  ];

  return (
    <PageContainer>
      <ProTable
        rowKey="id"
        options={false}
        actionRef={actionRef}
        formRef={formRef}
        request={gradeList}
        search={false}
        columns={columns}
        pagination={false}
      />
      <div style={{ backgroundColor: '#fff', padding: 30, display: 'flex' }}>
        <InfoCircleOutlined style={{ fontSize: 30, color: '#40a9ff' }} />
        <dl style={{ marginLeft: 20 }}>
          <dt style={{ fontSize: 20, marginBottom: 10 }}>店铺等级权益说明</dt>
          <dd>1.店铺的成长值只增不减</dd>
          <dd>2.店铺的成长值按成本金额计算，不考虑售后</dd>
        </dl>
      </div>
      {
        formVisible &&
        <Form
          visible={formVisible}
          setVisible={setFormVisible}
          data={detailData}
          callback={() => { actionRef.current.reload() }}
        />
      }
    </PageContainer>
  );
};

export default GradeIndex;
