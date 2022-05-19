import React, { useRef} from 'react';
import ProTable from '@ant-design/pro-table';
import { Button } from 'antd';
import { history } from 'umi';
import { CaretRightFilled } from '@ant-design/icons';
import { listLikes } from '@/services/community-management/dynamic-list-likes';

export default props => {
let id = props.location.query.id
const actionRef = useRef();
const columns= [
  {
      title: '会员ID',
      dataIndex: 'userId',
      valueType: 'text',
  },
  {
      title: '会员昵称',
      dataIndex: 'userName',
      valueType: 'text',
  }
];
  return (
    <>
      <h1><CaretRightFilled /> 点赞列表</h1>
      <ProTable
        rowKey="userId"
        options={false}
        params={{
            id
        }}
        request={listLikes}
        actionRef={actionRef}
        search={false}
        toolBarRender={false}
        columns={columns}
      />
      <Button style={{ margin: "20px 0 20px 0" }} type="default" onClick={() => { window.history.back(); setTimeout(() => { window.location.reload(); }, 200) }}>
            返回
        </Button>
    </>
  );
};
