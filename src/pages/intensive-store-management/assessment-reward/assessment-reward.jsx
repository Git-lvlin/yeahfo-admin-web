import React, { useState, useRef } from 'react';
// import { Button } from 'antd';
import { InfoCircleOutlined } from '@ant-design/icons'
import ProTable from '@ant-design/pro-table';
import { PageContainer } from '@/components/PageContainer';
import { memberShopResults } from '@/services/intensive-store-management/assessment-reward';
import { amountTransform } from '@/utils/utils'
import Form from './form';

const GradeIndex = () => {
  const [formVisible, setFormVisible] = useState(false);
  const [detailData, setDetailData] = useState({});
  const actionRef = useRef();
  const formRef = useRef();

  const columns = [
    {
      title: '考核等级',
      dataIndex: 'resultsName',
      valueType: 'text',
    },
    // {
    //   title: '等级徽章',
    //   dataIndex: 'resultsLevel',
    //   valueType: 'text',
    //   render: (_) => <img src={_} width="50" height="50" />
    // },
    {
      title: '考核指标',
      dataIndex: ['upresults', 'evaluation'],
      valueType: 'text',
    },
    {
      title: '积分奖励',
      dataIndex: 'bonusPoints',
      valueType: 'text',
    },
    {
      title: '返佣比例',
      dataIndex: 'commissionRatio',
      valueType: 'text',
      render: (_) => `${amountTransform(+_)}%`
    },
    {
      title: '未完成指标降级说明',
      dataIndex: 'demotionInstruction',
      valueType: 'text',
    },
    {
      title: '操作',
      dataIndex: '',
      valueType: 'option',
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
        request={memberShopResults}
        search={false}
        columns={columns}
        pagination={false}
      />
      <div style={{ backgroundColor: '#fff', padding: 30, display: 'flex' }}>
        <InfoCircleOutlined style={{ fontSize: 30, color: '#40a9ff' }} />
        <dl style={{ marginLeft: 20 }}>
          <dt style={{ fontSize: 20, marginBottom: 10 }}>店铺每月任务考核和分佣时间说明</dt>
          <dd>1.每月1日凌晨00:30之前根据过去18个月完成指标情况确认当月的考核等级</dd>
          <dd>2.每月5号前核对确认店铺分佣金额，每月6号-10号财务复核并确认打款</dd>
          <dd>3.月度任务按店铺支付尾款成功所处的月份计算，售后订单暂不影响月度任务考核</dd>
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
