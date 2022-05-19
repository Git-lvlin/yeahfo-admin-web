import React, { useState, useRef } from 'react';
import ProTable from '@ant-design/pro-table';
import { PageContainer } from '@/components/PageContainer';
import { Button, Card } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import * as api from '@/services/product-management/product-unit';
import Form from './form';


const TableList = () => {
  const [formVisible, setFormVisible] = useState(false);
  const [selectItem, setSelectItem] = useState(null);
  const actionRef = useRef();

  const columns = [
    {
      title: '序号',
      valueType: 'index',
    },
    {
      title: '单位类型',
      dataIndex: 'type',
      valueType: 'select',
      valueEnum: {
        1: '基本单位',
        2: '集采单位'
      }
    },
    {
      title: '单位名称',
      dataIndex: 'name',
      order: 1,
    },
    {
      title: '创建人名称',
      dataIndex: 'createUser',
      hideInSearch: true,
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      hideInSearch: true,
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, data) => (
        <>
          <a onClick={() => { setSelectItem(data); setFormVisible(true) }}>编辑</a>
        </>
      ),
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
        request={api.searchUnit}
        search={{
          defaultCollapsed: true,
          labelWidth: 100,
          optionRender: (searchConfig, formProps, dom) => [
            ...dom.reverse(),
          ],
        }}
        columns={columns}
        actionRef={actionRef}
        pagination={{
          pageSize: 10,
        }}
        scroll={{ x: 'max-content', scrollToFirstRowOnChange: true, }}
      />
      <Form
        visible={formVisible}
        setVisible={setFormVisible}
        data={selectItem}
        callback={() => {
          setSelectItem(null)
          actionRef.current.reload();
        }}
        onCancel={() => { setSelectItem(null) }}
      />
    </PageContainer>

  );
};

export default TableList;
