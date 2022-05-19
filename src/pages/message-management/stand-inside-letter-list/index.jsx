import React from 'react'
import { PageContainer } from '@/components/PageContainer';
import ProTable from '@ant-design/pro-table'
import { standLetterList } from '@/services/message-management/message-template-config'

import '../styles.less'
import moment from 'moment'

const index = () => {
  const columns = [
    {
      title: '编号',
      dataIndex: 'msgId',
      align: 'center'
    },
    {
      title: '消息名称',
      dataIndex: 'name',
      align: 'center'
    },
    {
      title: '消息标题',
      dataIndex: 'title',
      align: 'center'
    },
    {
      title: '消息内容',
      dataIndex: 'copywritingContent',
      hideInSearch: true,
      width: 300,
      align: 'center',
      render: (_) => (
        <div style={{textAlign: 'left'}}>{_}</div>
      )
    },
    {
      title: '接收时间',
      dataIndex: 'sendTime',
      hideInSearch: true,
      align: 'center',
      render: (_)=> moment(_).format('YYYY-MM-DD HH:mm:ss')
    }
  ]
  return (
    <PageContainer title={false}>
      <ProTable
        rowKey='msgId'
        columns={columns}
        toolBarRender={false}
        params={{toType: 4}}
        request={standLetterList}
        scroll={{ y: window.innerHeight - 400, scrollToFirstRowOnChange: true, }}
        pagination={{
          showQuickJumper: true,
        }}
      />
    </PageContainer>
  )
}

export default index
