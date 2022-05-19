import React, { useState } from 'react';
import ProCard from '@ant-design/pro-card';
import { PageContainer } from '@/components/PageContainer';
import { Space } from 'antd';
import { useLocation } from 'umi';
import InProgress from './in-progress';
import Done from './done';

const TableList = () => {
  const [activeKey, setActiveKey] = useState('1')
  const location = useLocation();
  return (
    <PageContainer>
      <div style={{ marginBottom: 10, background: '#fff', padding: 10 }}>
        <Space size="large">
          <span>{location?.query?.goodsName}</span>
          <span>skuID:{location?.query?.skuId}</span>
          <span>({location?.query?.activityName}</span>
          <span>{location?.query?.activityStartTime}~{location?.query?.activityEndTime}</span>
          <span>单约{location?.query?.groupNum}人团</span>
          {location?.query?.virtualType === 2 && <span>虚拟成团</span>}
          <span>{{
            1: '待开始',
            2: '进行中',
            3: '已结束',
            4: '已中止'
          }[location?.query?.activityStatus]})</span>
        </Space>
      </div>
      <ProCard
        tabs={{
          type: 'card',
          activeKey,
          onChange: setActiveKey
        }}
      >
        <ProCard.TabPane key="1" tab="进行中">
          {activeKey === '1' && <InProgress skuId={location?.query?.skuId} />}
        </ProCard.TabPane>
        <ProCard.TabPane key="2" tab="已成团">
          {activeKey === '2' && <Done skuId={location?.query?.skuId} />}
        </ProCard.TabPane>
      </ProCard>
    </PageContainer>
  )
};

export default TableList;
