import React, { useState, useRef } from 'react';
import ProTable from '@ant-design/pro-table';
import { PageContainer } from '@/components/PageContainer';
import { Button, Card } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { postageList, postageDetail } from '@/services/product-management/freight-template';
import Form from './form';

const TableList = () => {
  const [formVisible, setFormVisible] = useState(false);
  const [detailData, setDetailData] = useState(null);
  const actionRef = useRef();
  const getDetail = (id) => {
    postageDetail({
      id,
    }).then(res => {
      if (res.code === 0) {
        setDetailData(res.data);
        setFormVisible(true);
      }
    })
  }
  const columns = [
    {
      title: '模板名称',
      dataIndex: 'expressName',
      valueType: 'text',
      fieldProps: {
        placeholder: '请输入模板名称'
      }
    },
    {
      title: '是否有指定地区不配送',
      dataIndex: 'name',
      onFilter: true,
      valueType: 'select',
      hideInTable: true,
      valueEnum: {
        1: {
          text: '全部',
        },
      },
    },
    {
      title: '是否有指定条件包邮',
      dataIndex: 'name',
      onFilter: true,
      valueType: 'select',
      hideInTable: true,
      valueEnum: {
        1: {
          text: '全部',
        },
      },
    },
    {
      title: '是否有指定条件包邮',
      dataIndex: 'expressFlagStr',
      valueType: 'text',
      hideInSearch: true,
    },
    {
      title: '应用商品',
      dataIndex: 'goodsNum',
      valueType: 'text',
      hideInSearch: true,
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => (
        <>
          <a onClick={() => { getDetail(record.id) }}>编辑</a>
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
        request={postageList}
        search={{
          defaultCollapsed: true,
          labelWidth: 150,
          optionRender: (searchConfig, formProps, dom) => [
            ...dom.reverse(),
          ],
        }}
        columns={columns}
        actionRef={actionRef}
      />
      {formVisible && <Form
        visible={formVisible}
        setVisible={setFormVisible}
        onClose={() => { setFormVisible(false); setDetailData(null) }}
        detailData={detailData}
        callback={() => { actionRef.current.reload() }}
      />}
    </PageContainer>
  );
};

export default TableList;
