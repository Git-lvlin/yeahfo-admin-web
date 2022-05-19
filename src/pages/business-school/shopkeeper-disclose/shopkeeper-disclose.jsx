
import React, { useRef, useState } from 'react';
import { Button, Space, message,Image } from 'antd';
import ProTable from '@ant-design/pro-table';
import { PageContainer } from '@/components/PageContainer';
import { history,connect } from 'umi';
import { findAdminDebunkList } from '@/services/business-school/find-admin-debunk-list';


export default (props) => {
  let articleId = props.location.query.articleId
  let articleTitle = props.location.query.articleTitle
  let type = props.location.query.type
  const actionRef = useRef();
  const columns = [
    {
      title: '吐槽时间',
      key: 'dateTimeRange',
      dataIndex: 'createTime',
      valueType: 'dateTimeRange', 
      hideInTable:true  
    },
    {
      title: '手机号',
      dataIndex: 'phoneNum',
      valueType: 'text',
      render:(text, record, _, action)=>[
        <a onClick={()=>history.push(`/user-management/user-detail/${record.memberId}`)}>{record.phoneNum}</a>
      ],
    },
    {
      title: '吐槽图片',
      dataIndex: 'pictures',
      valueType: 'image',
      search: false,
      render:(_,data)=>{
        return <Image width={80} src={data.pictures.split(';')[0]}/>
      }
    },
    {
      title: '吐槽内容',
      dataIndex: 'content',
      valueType: 'number',
      search: false,
    },
    {
      title: '提交时间',
      dataIndex: 'createTime',
      valueType: 'text',
      search: false,
      width:150
    }
  ];

  return (
    <PageContainer title="店主吐槽">
      <div style={{ marginBottom: 10, background: '#fff', padding: '10px 0 5px 10px' }}>
        <p>{type==1?'【图文】':'【视频】'}{articleTitle} （编号：{articleId}）</p>
      </div>
        <ProTable
            rowKey="id"
            options={false}
            columns={columns}
            actionRef={actionRef}
            params={{
              articleId:articleId
            }}
            request={findAdminDebunkList}
            search={{
                labelWidth: 'auto',
            }}
            dateFormatter="string"
            headerTitle=""
            search={{
                defaultCollapsed: true,
                labelWidth: 100,
                optionRender: (searchConfig, formProps, dom) => [
                ...dom.reverse(),
                ],
            }}
        />
      <Button style={{ float: 'right', margin: '20px 20px 0 0' }} type="primary" onClick={() => { window.history.back(); setTimeout(() => { window.location.reload(); }, 200) }}>
           返回
        </Button>
    </PageContainer>
  );
};