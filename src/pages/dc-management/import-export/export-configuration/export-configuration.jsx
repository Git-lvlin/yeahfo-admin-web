import React from 'react'
import { PageContainer } from '@/components/PageContainer';
import ProTable from '@ant-design/pro-table'
import { PlusOutlined } from '@ant-design/icons'
import { history } from 'umi'
import { Button } from 'antd'

import { findByWays } from '@/services/import-export-configuration/export-config'

const ExportConfiguration = () => {

  const columns = [
    {
      title: 'code',
      dataindex: 'code',
      align: 'center',
      valueType: 'text',
    },
    // {
    //   title: '',
    //   dataindex: '',
    //   align: 'center'
    // },
    {
      title: '操作',
      valueType: 'option',
      align: 'center',
      render: (_, record) => (
        <a onClick={()=> history.push(`dc-management/export-configuration/${record.id}`)}>编辑</a>
      )
    }
  ]
  return (
    <PageContainer title={false}>
      <ProTable
        rowKey='code'
        columns={columns}
        request={findByWays}
        pagination={{
          showQuickJumper: true,
          pageSize: 10
        }}
        params={{}}
        headerTitle='导出配置报表'
        toolBarRender={()=>[
          <Button icon={<PlusOutlined />} type="primary">
            添加数据
          </Button>
        ]}
      />
    </PageContainer>
  )
}

export default ExportConfiguration
