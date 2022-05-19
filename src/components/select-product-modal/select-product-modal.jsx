import React, { useState } from 'react';
import { ModalForm } from '@ant-design/pro-form';
import ProTable from '@ant-design/pro-table';
import GcCascader from '@/components/gc-cascader'
import BrandSelect from '@/components/brand-select'
import { productList } from '@/services/intensive-activity-management/intensive-activity-create'
import SupplierSelect from '@/components/supplier-select'

export default (props) => {
  const { visible, setVisible, callback,hideAll, title = '选择活动商品',goodsSaleType, apolloConfig} = props;
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [selectItems, setSelectItems] = useState([]);

  const formItemLayout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 14 },
    layout: {
      labelCol: {
        span: 4,
      },
      wrapperCol: {
        span: 14,
      },
    }
  };


  const columns = [
    {
      title: 'spuID',
      dataIndex: 'spuId',
      valueType: 'text',
      fieldProps: {
        placeholder: '请输入spuID'
      }
    },
    {
      title: 'skuID',
      dataIndex: 'skuId',
      valueType: 'text',
      fieldProps: {
        placeholder: '请输入skuID'
      }
    },
    {
      title: '商品名称',
      dataIndex: 'goodsName',
      valueType: 'text',
      fieldProps: {
        placeholder: '请输入商品名称'
      },
      render: (_, records) => (
        <div style={{ display: 'flex' }}>
          <img width="50" height="50" src={records.imageUrl} />
          <div style={{ marginLeft: 10, wordBreak: 'break-all' }}>{_}</div>
        </div>
      )
    },
    {
      title: '供应商家ID',
      dataIndex: 'supplierId',
      valueType: 'text',
      hideInTable: true,
      // renderFormItem: () => <SupplierSelect />
    },
    {
      title: '结算模式',
      dataIndex: 'settleType',
      valueType: 'select',
      hideInTable: true,
      valueEnum: {
        1: '佣金模式',
        2: '底价模式',
      },
    },
    {
      title: '商品分类',
      dataIndex: 'gcId',
      renderFormItem: () => (<GcCascader />),
      hideInTable: true,
    },
    {
      title: '商品品牌',
      dataIndex: 'brandId',
      renderFormItem: () => (<BrandSelect />),
      hideInTable: true,
    },
    {
      title: '供货价(元)',
      dataIndex: 'retailSupplyPriceDisplay',
      valueType: 'text',
      hideInSearch: true,
    },
    {
      title: '秒约价(元)',
      dataIndex: 'salePriceDisplay',
      valueType: 'text',
      hideInSearch: true,

    },
    {
      title: '可用库存',
      dataIndex: 'stockNum',
      valueType: 'text',
      hideInSearch: true,
    },
  ];

  return (
    <ModalForm
      title={title}
      modalProps={{
      }}
      onVisibleChange={setVisible}
      visible={visible}
      width={1200}
      onFinish={() => {
        callback(selectItems);
        return true;
      }}
      labelAlign="right"
      {...formItemLayout}
    >
      <ProTable
        columns={columns}
        rowKey="skuId"
        options={false}
        request={productList}
        params={{
          goodsState: 1,
          goodsVerifyState: 1,
          hasStock: 1,
          goodsSaleType:goodsSaleType?2:'',
          apolloConfig:apolloConfig?apolloConfig:''
        }}
        search={{
          defaultCollapsed: true,
          labelWidth: 100,
          optionRender: (searchConfig, formProps, dom) => [
            ...dom.reverse(),
          ],
        }}
        pagination={{
          pageSize: 10,
        }}
        rowSelection={{
          hideSelectAll:hideAll||false,
          selectedRowKeys,
          preserveSelectedRowKeys: true,
          onChange: (_, val) => {
            setSelectItems(val);
            setSelectedRowKeys(_);
          }
        }}
      />
    </ModalForm>
  );
};