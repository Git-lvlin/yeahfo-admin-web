import React, { useState, useRef } from 'react';
import ProTable from '@ant-design/pro-table';
import { PageContainer } from '@/components/PageContainer';
import { Button, Card } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useParams } from 'umi';
import { getAccountList, details } from '@/services/supplier-management/supplier-sub-account';
import Edit from './edit';

const TableList = () => {
  const [formVisible, setFormVisible] = useState(false);
  const [detailData, setDetailData] = useState(null);
  const params = useParams();
  const actionRef = useRef();

  const getDetail = (id) => {
    details({
      accountId: id
    }).then(res => {
      if (res.code === 0) {
        setDetailData(res.data.records);
        setFormVisible(true)
      }
    })
  }

  const columns = [
    {
      title: '名称',
      dataIndex: 'nickname',
      valueType: 'text',
    },
    {
      title: '登录账号',
      dataIndex: 'accountName',
      valueType: 'text',
    },
    {
      title: '角色',
      dataIndex: 'roleName',
      valueType: 'text',
    },
    {
      title: '创建人',
      dataIndex: 'createName',
      valueType: 'text',
      hideInSearch: true,
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      valueType: 'text',
      hideInSearch: true,
    },
    {
      title: '状态',
      dataIndex: 'status',
      valueType: 'text',
      render: (_) => {
        if (_ === 1) {
          return '启用'
        }
        return '禁用'
      }
    },
    {
      title: '操作',
      valueType: 'options',
      render: (_, data) => (<a onClick={() => { getDetail(data.id) }}>编辑</a>)
    },
  ];

  return (
    <PageContainer>
      <Card>
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button key="out" type="primary" icon={<PlusOutlined />} onClick={() => { setFormVisible(true) }}>新建</Button>
        </div>
      </Card>
      <ProTable
        rowKey="id"
        options={false}
        params={{
          accountId: params?.id,
          type: 2,
        }}
        request={getAccountList}
        search={false}
        columns={columns}
        actionRef={actionRef}
      />
      {formVisible && <Edit
        visible={formVisible}
        setVisible={setFormVisible}
        callback={() => { actionRef.current.reload() }}
        accountId={params?.id}
        detailData={detailData}
        onClose={() => {setDetailData(null) }}
      />}
    </PageContainer>

  );
};

export default TableList;
