import React, { useState, useRef } from 'react';
import ProTable from '@ant-design/pro-table';
import { Button, Tooltip } from 'antd';
import { PageContainer } from '@/components/PageContainer';
import { bindOperationPage } from '@/services/operation-management/bind-list'
import Export from '@/pages/export-excel/export'
import ExportHistory from '@/pages/export-excel/export-history'
import Bind from './bind';
import Unbind from './unbind';

const TableList = () => {
  const actionRef = useRef();
  const formRef = useRef();
  const [visit, setVisit] = useState(false)
  const [bindVisible, setBindVisible] = useState(false)
  const [unbindVisible, setUnbindVisible] = useState(false)
  const [selectItem, setSelectItem] = useState({})

  const columns = [
    {
      title: '社区店名称',
      dataIndex: 'storeName',
      valueType: 'text',
    },
    {
      title: '社区店地址',
      dataIndex: 'address',
      valueType: 'text',
      hideInSearch: true,
      render: (_, records) => {
        return (
          <pre style={{ margin: 0, fontFamily: 'none' }}>
            {records?.areaInfo?.[records?.provinceId]} {records?.areaInfo?.[records?.cityId]} {records?.areaInfo?.[records?.regionId]} {_} {records?.communityName} {records?.houseNumber}
          </pre>
        )
      }
    },
    {
      title: '运营商名称',
      dataIndex: 'operationName',
      valueType: 'text',
      hideInTable: true,
    },
    {
      title: '绑定的运营商',
      dataIndex: 'operationCompanyName',
      valueType: 'text',
      hideInSearch: true,
    },
    {
      title: '绑定状态',
      dataIndex: 'status',
      valueType: 'text',
      hideInSearch: true,
    },
    {
      title: '绑定状态',
      dataIndex: 'operationIsBinded',
      valueType: 'select',
      hideInTable: true,
      valueEnum: {
        1: '已绑',
        0: '未绑',
      }
    },
    {
      title: '审核状态',
      dataIndex: 'lastApply',
      valueType: 'text',
      hideInSearch: true,
      render: (_) => {
        return <>
          {_?.auditStatus?.desc || '待提交'}
          {_?.auditStatus?.code === 2 && <div>
            <Tooltip title={_?.auditRemark}><a>原因</a></Tooltip>
          </div>}
        </>
      }
    },
    // {
    //   title: '审核状态',
    //   dataIndex: 'auditStatus',
    //   valueType: 'select',
    //   hideInTable: true,
    //   valueEnum: {
    //     0: '待提交',
    //     1: '审核通过',
    //     2: '审核驳回',
    //     3: '审核中'
    //   }
    // },
    {
      title: '操作',
      valueType: 'option',
      render: (_, data) => {
        return data.lastApply?.auditStatus?.code !== 3 ? <>
          {data.status === '已绑' && <a onClick={() => { setSelectItem(data); setUnbindVisible(true) }}>申请解绑</a>}
          {data.status === '未绑' && <a onClick={() => { setSelectItem(data); setBindVisible(true) }}>申请绑定</a>}
        </> : '-'
      }
    },
  ];

  const getFieldValue = () => {
    if (formRef?.current?.getFieldsValue) {
      const { current, pageSize, ...rest } = formRef?.current?.getFieldsValue?.();
      return rest
    }
    return {}
  }

  return (
    <PageContainer>
      {bindVisible
        &&
        <Bind
          data={selectItem}
          visible={bindVisible}
          setVisible={setBindVisible}
          callback={() => { actionRef.current.reload() }}
        />
      }
      {unbindVisible
        &&
        <Unbind
          data={selectItem}
          visible={bindVisible}
          setVisible={setUnbindVisible}
          callback={() => { actionRef.current.reload() }}
        />
      }
      <ProTable
        rowKey="id"
        options={false}
        request={bindOperationPage}
        scroll={{ x: 'max-content', scrollToFirstRowOnChange: true, }}
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
            <Export
              key="3"
              change={(e) => { setVisit(e) }}
              type="community-store-bind-export"
              conditions={getFieldValue}
            />,
            <ExportHistory key="4" show={visit} setShow={setVisit} type="community-store-bind-export" />,
          ],
        }}
        columns={columns}
        actionRef={actionRef}
        formRef={formRef}
        pagination={{
          pageSize: 10,
          showQuickJumper: true,
        }}
      />
    </PageContainer>

  );
};

export default TableList;
