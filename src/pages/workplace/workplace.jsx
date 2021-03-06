import React from 'react';
import ProCard from '@ant-design/pro-card';
import { PageContainer } from '@/components/PageContainer';
import { history } from 'umi';
import style from './style.less'


const WorkPlace = () => {
  return (
    <PageContainer>
      <ProCard.Group title="常用功能" headerBordered>
        <ProCard colSpan="148px">
          <div className={style.card} onClick={() => { history.push('/order-management/normal-order')}}>
            <div>
              <img />
            </div>
            <span>订单管理</span>
          </div>
        </ProCard>
        <ProCard colSpan="148px">
          <div className={style.card} onClick={() => { history.push('/product-management/supplier/product-list') }}>
            <div>
              <img />
            </div>
            <span>商品管理</span>
          </div>
        </ProCard>
      </ProCard.Group>
    </PageContainer>
  );
};

export default WorkPlace
