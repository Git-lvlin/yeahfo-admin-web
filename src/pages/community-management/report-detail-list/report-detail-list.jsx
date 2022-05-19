import React, { useRef } from 'react';
import ProTable from '@ant-design/pro-table';
import { Button,Image } from 'antd';
import { history } from 'umi';
import { adminReportDetailList } from '@/services/community-management/report-admin-report-detail-list';

export default props => {
let id = props.location.query.id
const actionRef = useRef();
const columns= [
  {
      title: '举报人ID',
      dataIndex: 'userId',
  },
  {
      title: '举报人昵称',
      dataIndex: 'userName',
      valueType: 'text',
  },
  {
      title: '举报类型',
      dataIndex: 'type',
      valueType: 'text',
  },
  {
      title: '举报时间',
      dataIndex: 'createTime',
      valueType: 'text',
  },
  {
      title: '举报原因',
      dataIndex: 'reason',
      valueType: 'text',
  },
  {
      title: '证明截图',
      dataIndex: 'images',
      render: (text) =>{
        return <Image src={text?.[0]} width={50} height={50} />
      } 
  }
];
  return (
    <>
      <Button style={{ margin: "20px 0 20px 0" }} type="default" onClick={() => { window.history.back(); setTimeout(() => { window.location.reload(); }, 200) }}>
            返回
          </Button>
          <ProTable
            rowKey="userId"
            options={false}
            params={{
              sourceId:id,
            }}
            request={adminReportDetailList}
            actionRef={actionRef}
            search={false}
            toolBarRender={false}
            columns={columns}
          />
    </>
  );
};
