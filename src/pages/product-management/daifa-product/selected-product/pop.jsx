import React, { useRef } from 'react';
import ProTable from '@ant-design/pro-table';
import { ModalForm } from '@ant-design/pro-form';
import { productList } from '@/services/product-management/daifa-product';
export default (props) => {
  const { setVisible, visible, params } = props;
  const formRef = useRef();
  const columns = [
    {
      title: '图片',
      dataIndex: 'image',
      render: (text) => <img src={text} width={50} height={50} />,
    },
    { title: '供应链skuID', dataIndex: 'skuId' },
    { 
      title: '规格1',
      dataIndex: 'attributesOne',
    },
    { 
      title: '规格2',
      dataIndex: 'attributesTwo',
    },
    {
      title: '销售价',
      dataIndex: 'consignPrice',
      render: (_) => amountTransform(_, '/')
    },
    {
      title: '市场价',
      dataIndex: 'retailPrice',
      render: (_) => amountTransform(_, '/')
    },
    { title: '可用库存', dataIndex: 'amountOnSale' },
  ];

  return (
    <ModalForm
      width={1300}
      title={`所属sku列表`}
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
      params={{
        page: 1,
        size: 10,
        selectType: 2,
        productId: params
      }}
      request={productList}
      search={false}
      pagination={{
        pageSize: 10
      }}
      dateFormatter="string"
    />
    </ModalForm>
  );
};