import React, { useState, useRef } from 'react';
import ProTable from '@ant-design/pro-table';
import { PageContainer } from '@/components/PageContainer';
import { Button, Card, Modal } from 'antd';
import { PlusOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import * as api from '@/services/product-management/brand-list';
import Form from './form';

const { confirm, warning } = Modal;

const TableList = () => {
  const [formVisible, setFormVisible] = useState(false);
  const [selectItem, setSelectItem] = useState(null);
  const actionRef = useRef();

  const brandDel = (brandId) => {
    api.getExistsByBrandId({
      brandId
    }).then(res => {
      if (res.code === 0) {
        if (res.data === 0) {
          confirm({
            title: '确认要删除么？',
            icon: <ExclamationCircleOutlined />,
            centered: true,
            onOk() {
              api.brandDel({
                brandId
              }, { showSuccess: true }).then(res => {
                if (res.code === 0) {
                  actionRef.current.reload();
                }
              })
            },
          });
        }

        if (res.data === 1) {
          warning({
            title: '此品牌下已关联商品，请先移除关联的商品，再进行删除操作！',
            icon: <ExclamationCircleOutlined />,
            centered: true,
          });
        }
      }
    })
    
  }

  const columns = [
    {
      title: '品牌名称',
      dataIndex: 'brandName',
      valueType: 'text',
      fieldProps: {
        placeholder: '请输入品牌名称'
      }
    },
    {
      title: '品牌logo',
      dataIndex: 'brandLogo',
      valueType: 'text',
      hideInSearch: true,
      render: (text) => <img width={50} height={50} src={text} />
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, data) => (
        <>
          <a onClick={() => { setSelectItem(data); setFormVisible(true) }}>编辑</a>
          &nbsp;
          <a style={{ color: 'red' }} onClick={() => { brandDel(data.brandId) }}>删除</a>
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
        rowKey="brandId"
        options={false}
        request={api.brand}
        scroll={{ x: 'max-content', scrollToFirstRowOnChange: true, }}
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
