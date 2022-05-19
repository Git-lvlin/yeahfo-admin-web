import React, { useState, useEffect, useRef } from 'react';
import { Button, Card } from 'antd';
import ProTable from '@ant-design/pro-table';
import { PageContainer } from '@/components/PageContainer';
import { PlusOutlined } from '@ant-design/icons';
import * as api from '@/services/setting/account-management';
import Form from './form';
import { adminGroup } from '@/services/setting/account-management'
import moment from 'moment'

const typeTransform = (array) => {
  if (!Array.isArray(array)) {
    return {}
  }
  const obj = {};
  array.forEach(item => {
    obj[item.value] = {
      text: item.label,
    }
  })

  return obj;
}

const TableList = () => {
  const [adminGroupList, setAdminGroupList] = useState([]);
  const [formVisible, setFormVisible] = useState(false);
  const [selectItem, setSelectItem] = useState(null);
  const actionRef = useRef();

  const columns = [
    {
      title: '名称',
      dataIndex: 'nickname',
      valueType: 'text',
      fieldProps: {
        placeholder: '请输入名称'
      }
    },
    {
      title: '登录账号',
      dataIndex: 'username',
      valueType: 'text',
      fieldProps: {
        placeholder: '请输入登录账号'
      }
    },
    {
      title: '角色',
      dataIndex: 'groupId',
      onFilter: true,
      valueType: 'select',
      valueEnum: typeTransform(adminGroupList),
    },
    {
      title: '状态',
      dataIndex: 'status',
      onFilter: true,
      valueType: 'select',
      hideInTable: true,
      valueEnum: {
        1: {
          text: '开启',
        },
        0: {
          text: '禁用',
        },
      },
    },
    {
      title: '状态',
      dataIndex: 'status',
      valueType: 'text',
      hideInSearch: true,
      render: (text) => text === 1 ? '开启' : '禁用',
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      valueType: 'text',
      hideInSearch: true,
    },
    {
      title: '登录次数',
      dataIndex: 'loginnum',
      valueType: 'text',
      hideInSearch: true,
    },
    {
      title: '最近登录时间',
      dataIndex: 'logintime',
      valueType: 'text',
      hideInSearch: true,
      render: _ => moment(_ * 1000).format('YYYY-MM-DD HH:mm:ss')
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => {
        return (
          <a onClick={() => { setSelectItem(record); setFormVisible(true) }}>编辑</a>
        )
      },
    },
  ];

  useEffect(() => {
    adminGroup({
      page_size: 999,
      page: 1,
    }).then(res => {
      if (res.code === 0) {
        setAdminGroupList(res.data.records.map(item => ({ label: item.title, value: item.id })))
      }
    })
  }, [])

  return (
    <PageContainer>
      <Card>
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button onClick={() => { setFormVisible(true) }} type="primary" icon={<PlusOutlined />}>新建</Button>
        </div>
      </Card>
      <ProTable
        rowKey="id"
        options={false}
        request={api.adminList}
        actionRef={actionRef}
        search={{
          defaultCollapsed: true,
        }}
        columns={columns}
        scroll={{ x: 'max-content', scrollToFirstRowOnChange: true, }}
      />
      {formVisible &&
        <Form
          visible={formVisible}
          setVisible={setFormVisible}
          adminGroupList={adminGroupList}
          callback={() => { actionRef.current.reload(); setSelectItem(null) }}
          onClose={() => { setSelectItem(null) }}
          data={selectItem}
        />}
    </PageContainer>
  );
};

export default TableList;
