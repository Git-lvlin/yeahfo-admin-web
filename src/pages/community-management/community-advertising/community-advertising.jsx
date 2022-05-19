import React, { useState,useRef } from 'react';
import { PageContainer } from '@/components/PageContainer';
import ProTable from '@ant-design/pro-table';
import { adsenseAdminList } from '@/services/community-management/adsense-admin-list';
import { deleteById } from '@/services/community-management/adsense-delete-byid';
import { history } from 'umi';
import DeleteModal from '@/components/DeleteModal'
import { Button,message } from 'antd';

export default props => {
    const ref=useRef()
    const columns = [
        {
            title: '广告ID：',
            dataIndex: 'id',
        },
        {
            title: '广告标题',
            dataIndex: 'title',
            valueType: 'text',
            hideInSearch: true,
        },
        {
            title: '所处位置',
            dataIndex: 'position',
            valueType: 'text',
            hideInSearch: true,
        },
        {
            title: '排序',
            dataIndex: 'order',
            valueType: 'text',
            hideInSearch: true,
        },
        {
            title: '链接类型',
            dataIndex: 'linkType',
            valueType:'select',
            valueEnum: {
              0: '全部',
              1: 'URL',
              2: '商品',
              3: '销售活动',
            },
            hideInTable:true
        },
        {
            title: '链接类型',
            dataIndex: 'linkType',
            valueType:'text',
            valueEnum: {
                0: '全部',
                1: 'URL',
                2: '商品',
                3: '销售活动',
            },
            hideInSearch:true,
        },
        {
            title: '状态',
            dataIndex: 'state',
            valueType:'select',
            valueEnum: {
                0: '禁用',
                1: '启用',
            },
            hideInTable:true
        },
        {
            title: '状态',
            dataIndex: 'state',
            valueType: 'text',
            valueEnum: {
                0: '禁用',
                1: '启用',
            },
            hideInSearch:true
        },
        {
            title: '创建时间',
            dataIndex: 'createTime',
            valueType: 'text',
            hideInSearch: true,
        },
        {
            title: '操作',
            render: (text, record, _, action) => [
              <Button key='edit' style={{marginRight:'10px'}} onClick={()=>history.push('/community-management/community-advertising/add-advertising?id='+record.id)}>编辑</Button>,
              <DeleteModal 
                record={record} 
                boxref={ref} 
                text={'确认要删除所选广告吗？'} 
                InterFace={deleteById} 
                title={'操作确认'}
                key='detele'
              />
            ],
            hideInSearch: true,
        },
    ];
  return (
    <PageContainer>
        <ProTable
          rowKey="id"
          options={false}
          actionRef={ref}
          request={adsenseAdminList}
          scroll={{ y: window.innerHeight - 550, scrollToFirstRowOnChange: true, }}
          search={{
              defaultCollapsed: true,
              labelWidth: 100,
              optionRender: (searchConfig, formProps, dom) => [
                  ...dom.reverse(),
                  <Button
                      key="primary"
                      type="primary"
                      onClick={() => {
                          history.push('/community-management/community-advertising/add-advertising')
                      }}
                      >
                      添加
                  </Button>,
              ],
          }}
          columns={columns}
        />
  </PageContainer>
  );
};
