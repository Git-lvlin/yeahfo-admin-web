
import React, { useRef, useState } from 'react';
import { Button, Space, message,Tabs,Image } from 'antd';
import { PageContainer } from '@/components/PageContainer';
import ClassifyAudit from './classify-audit/classify-audit.jsx'
import SingleCommodityAudit from './single-commodity-audit/single-commodity-audit.jsx'
import styles from './style.less'

const { TabPane } = Tabs
export default (props) =>{
  const [seleType,setSeleType]=useState(1)
  return (
      <PageContainer>
        <div className={styles.header}>
          <p>* 平台总额外奖励占商品盈利比例：90%</p>
        </div>
        <Tabs
          centered
          defaultActiveKey="1"
          style={{backgroundColor:"#fff",padding:'25px'}}
          onChange={(val)=>{
            setSeleType(val)
          }}
        >
          <TabPane tab="分类审核" key="1">
            {
              seleType==1&&<ClassifyAudit/>
            }
          </TabPane>
          <TabPane tab="单商品审核" key="2">
            {
              seleType==2&&<SingleCommodityAudit/>
            }
          </TabPane>
        </Tabs>
      </PageContainer>
  )
}