import React, { useState } from 'react';
import ProCard from '@ant-design/pro-card';
import { PageContainer } from '@/components/PageContainer';
import SelectedProduct from './selected-product';
import IndexProduct from './index-product';

const DaifaProduct = () => {
  const [activeKey, setActiveKey] = useState('1')

  return (
    <PageContainer>
      <ProCard
        tabs={{
          type: 'card',
          activeKey,
          onChange: setActiveKey
        }}
      >
        <ProCard.TabPane key="1" tab="供应链已选商品">
          <SelectedProduct />
        </ProCard.TabPane>
        <ProCard.TabPane key="2" tab="内部基础商品库">
          <IndexProduct />
        </ProCard.TabPane>
      </ProCard>
    </PageContainer>
  )
}

export default DaifaProduct;
