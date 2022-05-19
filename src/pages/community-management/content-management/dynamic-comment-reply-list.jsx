import React, {useRef} from 'react';
import ProTable from '@ant-design/pro-table';
import { CommentReplyList } from '@/services/community-management/dynamic-comment-reply-list';
import { deleteCommentOrReply } from '@/services/community-management/delete-comment-reply';
import DeleteModal from '@/components/DeleteModal'
import { CaretRightFilled } from '@ant-design/icons';
import { history } from 'umi';
import { Button } from 'antd';

export default props => {
    const ref=useRef()
    const id=props.location.query.id
    const columns = [
        {
            title: '评论ID',
            dataIndex: 'id',
            hideInSearch: true,
        },
        {
            title: '会员ID',
            dataIndex: 'userId',
            hideInSearch: true,
        },
        {
            title: '会员昵称',
            dataIndex: 'memberName',
            valueType: 'text',
            hideInTable:true
        },
        {
            title: '会员昵称',
            dataIndex: 'userName',
            valueType: 'text',
            hideInSearch:true
        },
        {
            title: '评论内容',
            dataIndex: 'content',
            valueType: 'text',
        },
        {
            title: '评论时间',
            dataIndex: 'createTime',
            valueType: 'text',
            hideInSearch:true
        },
        {
            title: '评论时间',
            key: 'dateRange',
            dataIndex: 'createTime',
            valueType: 'dateRange',
            hideInTable: true
        },
        {
            title: '操作',
            render: (text, record, _, action) => [
                <DeleteModal 
                    record={record} 
                    boxref={ref} 
                    text={'确认要删除所选评论吗？'} 
                    InterFace={deleteCommentOrReply} 
                    title={'操作确认'}
                    key='delete'
                />
            ],
            hideInSearch: true,
        },
    ];
  return (
      <>
      <h1><CaretRightFilled /> 评论列表</h1>
        <ProTable
        rowKey="id"
        options={false}
        params={{
            id
        }}
        request={CommentReplyList}
        search={{
            defaultCollapsed: true,
            labelWidth: 100,
            optionRender: (searchConfig, formProps, dom) => [
                ...dom.reverse(),
            ],
        }}
        columns={columns}
        />
          <Button style={{ margin: "20px 0 20px 0" }} type="default" onClick={() => { window.history.back(); setTimeout(() => { window.location.reload(); }, 200) }}>
            返回
        </Button>
    </>
  );
};
