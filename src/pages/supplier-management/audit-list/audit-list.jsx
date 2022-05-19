import React, { useState, useRef } from 'react';
import ProTable from '@ant-design/pro-table';
import { Button, Space } from 'antd';
import { getAuditedList } from '@/services/supplier-management/audit-list'
import { PageContainer } from '@/components/PageContainer';
import Audit from './audit';
import moment from 'moment';

const TableList = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectItem, setSelectItem] = useState(null);
  const actionRef = useRef();

  const columns = [
    {
      title: 'ID',
      dataIndex: 'supId',
      valueType: 'text',
      hideInSearch: true,
      width: 70,
    },
    {
      title: '供应商家名称',
      dataIndex: 'companyName',
      valueType: 'text',
      fieldProps: {
        placeholder: '请输入供应商家名称'
      }
    },
    {
      title: '供应商家ID',
      dataIndex: 'supplierId',
      valueType: 'text',
      fieldProps: {
        placeholder: '请输入供应商家ID'
      },
      hideInTable: true,
    },
    {
      title: '登录账号',
      dataIndex: 'accountName',
      valueType: 'text',
      fieldProps: {
        placeholder: '请输入登录账号'
      }
    },
    {
      title: '负责人',
      dataIndex: 'companyUserName',
      valueType: 'text',
      hideInSearch: true,
      render: (_, data) => <>
        <div>{data.companyUserName}</div>
        <div>{data.companyUserPhone}</div>
      </>
    },
    {
      title: '状态',
      dataIndex: 'status',
      valueType: 'select',
      valueEnum: {
        0: '禁用',
        1: '启用'
      },
      hideInSearch: true,
      width: 50,
    },
    {
      title: '创建信息',
      dataIndex: 'operateName',
      valueType: 'text',
      hideInSearch: true,
      render: (_, data) => <>
        <div>{data.operateName}</div>
        <div>{data.createTime}</div>
      </>
    },
    {
      title: '审核信息',
      dataIndex: 'auditUser',
      valueType: 'text',
      hideInSearch: true,
      render: (_, data) => {
        if (data.accountType === 2) {
          return '个人开户系统自动审核通过'
        }
        return <>
          <div>{data.auditUser}</div>
          <div>{data.auditTime > 0 && moment(data.auditTime * 1000).format('YYYY-MM-DD HH:mm:ss')}</div>
        </>
      }
    },
    {
      title: '审核开户状态',
      dataIndex: 'auditStatus',
      valueType: 'text',
      hideInSearch: true,
      render: (_, data) => <>
        <div>{{
          0: '待提交',
          1: '开户成功',
          2: '待审核',
          3: '开户失败',
          4: '待开户',
          5: '审核拒绝'
        }[_]}</div>
        {!!data.auditReason && _ !== 2 && <div style={{ color: 'red' }}>{data.auditReason}</div>}
      </>
    },
    {
      title: '审核开户状态',
      dataIndex: 'auditStatus',
      valueType: 'select',
      valueEnum: {
        0: '待提交',
        1: '开户成功',
        2: '待审核',
        3: '开户失败',
        4: '待开户',
        5: '审核拒绝'
      },
      hideInTable: true,
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, data) => (
        <Space>
          {data.auditStatus === 2 && <a onClick={() => { setSelectItem(data); setModalVisible(true); }}>审核</a>}
        </Space>
      ),
    },
  ];

  return (
    <PageContainer>
      <ProTable
        rowKey="supId"
        options={false}
        request={getAuditedList}
        search={{
          defaultCollapsed: true,
          labelWidth: 130,
          optionRender: ({ searchText, resetText }, { form }) => [
            <Button
              key="search"
              type="primary"
              onClick={() => {
                form?.submit();
              }}
            >
              {searchText}
            </Button>,
            <Button
              key="rest"
              onClick={() => {
                form?.resetFields();
              }}
            >
              {resetText}
            </Button>,
          ],
        }}
        columns={columns}
        actionRef={actionRef}
        pagination={{
          pageSize: 10,
        }}
        scroll={{ x: 'max-content', scrollToFirstRowOnChange: true, }}
      />

      {modalVisible &&
        <Audit
          visible={modalVisible}
          supId={selectItem.supId}
          id={selectItem.id}
          setVisible={setModalVisible}
          callback={() => { actionRef.current.reload() }}
        />
      }
    </PageContainer>

  );
};

export default TableList;
