import React from 'react';;
import ProTable from '@ant-design/pro-table';
import { listReportType } from '@/services/community-management/report-list-report-type'


const columns= [
  {
    title: 'ID',
    dataIndex: 'order',
    valueType: 'indexBorder',
    width: 48,
  },
  {
    title: '举报类型',
    dataIndex: 'title',
    valueType:'text',
    hideInSearch:true
  }
];


export default () => {
  return (
    <ProTable
      rowKey="order"
      columns={columns}
      params={{}}
      request={listReportType}
      rowKey="key"
      search={false}
      toolBarRender={false}
    />
  );
};