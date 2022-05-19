import React, { useRef } from 'react';
import ProTable from '@ant-design/pro-table';
import { ModalForm } from '@ant-design/pro-form';
import { getGoodsList, selectGoodsList } from '@/services/product-management/daifa-product';

export default (props) => {
  const { setVisible, setHasData, visible } = props;
  const formRef = useRef();
  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      valueType: 'text',
      search: false,
    },
    {
      title: '商品组名称',
      dataIndex: 'title',
      valueType: 'text',
      search: false,
    },
    {
      title: '商品组名称',
      dataIndex: 'title',
      valueType: 'text',
      hideInTable: true,
    },
    {
      title: '商品数量',
      dataIndex: 'feedCount',
      valueType: 'text',
      search: false,
    },
    {
      title: '最近获取时间',
      dataIndex: 'updateTime',
      valueType: 'text',
      search: false,
    },
    {
      title: '商品组状态',
      dataIndex: 'state',
      valueType: 'text',
      search: false,
      valueEnum: {
        0: '失效',
        1: '正常',
      }
    },
    {
      title: 'groupId',
      dataIndex: 'groupId',
      valueType: 'text',
      search: false,
      hideInTable: true,
    },
  ];

  const goToBigList = (record) => {
    const param = {
      groupId: record.groupId
    }
    selectGoodsList(param).then((res) => {
      if (res.code === 0) {
        return true
      }
    })
  }

  return (
    <ModalForm
      width={1300}
      title={`选择要获取的供应链商品组商品`}
      onVisibleChange={setVisible}
      formRef={formRef}
      visible={visible}
      submitter={{
        resetButtonProps: {
          style: {
            display: 'none',
          },
        },
        submitButtonProps: {
          style: {
            display: 'none',
          },
        },
      }}
    >
<ProTable
      rowKey="id"
      options={false}
      columns={columns}
      request={getGoodsList}
      search={{
        labelWidth: 'auto',
      }}
      pagination={{
        pageSize: 10
      }}
      dateFormatter="string"
      headerTitle="请点击要拉取商品所在的商品组"
      onRow={(record) => {
        return {
          onClick: async () => {
            console.log('左侧栏点击item',record)
            await goToBigList(record)
            setHasData(true)
            setVisible(false)
          },
        };
      }}
    />
    </ModalForm>
  );
};