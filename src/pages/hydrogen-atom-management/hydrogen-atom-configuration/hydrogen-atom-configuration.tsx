import { useState } from 'react';
import ProCard from '@ant-design/pro-card';
import { PageContainer } from '@/components/PageContainer';
import Configuration from './config-uration'
import MessageNotification from './message-notification'

export default ()=>{
  const [activeKey, setActiveKey] = useState<string>('1')
  return (
    <PageContainer title=" ">
    <ProCard
      tabs={{
        type: 'card',
        activeKey,
        onChange: setActiveKey
      }}
    >
      <ProCard.TabPane key="1" tab="基础配置">
        {
          activeKey == '1' && <Configuration/>
        }
      </ProCard.TabPane>
      <ProCard.TabPane key="2" tab="消息通知">
        {
          activeKey == '2' && <MessageNotification/>
        }
      </ProCard.TabPane>
    </ProCard>
  </PageContainer>
  )
}