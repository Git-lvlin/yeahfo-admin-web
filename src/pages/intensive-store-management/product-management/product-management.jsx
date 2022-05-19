import React, { useState, useRef } from 'react';
import ProTable from '@ant-design/pro-table';
import { Space, Button } from 'antd';
import { PageContainer } from '@/components/PageContainer';
import { goodsPage } from '@/services/intensive-store-management/product-management';
import { useParams, useLocation, history } from 'umi';
import { amountTransform, typeTransform } from '@/utils/utils'
import GcCascader from '@/components/gc-cascader'
import ProductDetailDrawer from '@/components/product-detail-drawer'
import ModifyPriceLog from './modify-price-log'


const TableList = () => {
  const params = useParams();
  const location = useLocation();
  const [productDetailDrawerVisible, setProductDetailDrawerVisible] = useState(false);
  const [modifyPriceLogVisible, setModifyPriceLogVisible] = useState(false);
  const [selectItem, setSelectItem] = useState(null);

  const columns = [
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
      render: (_, record) => {
        return <a onClick={() => { setSelectItem(record); setProductDetailDrawerVisible(true); }}>{_}</a>
      },

    },
    {
      title: '图片',
      dataIndex: 'skuImageUrl',
      valueType: 'text',
      render: (_) => <img src={_} width="50" height="50" />,
      hideInSearch: true,
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
      title: '供应商家ID',
      dataIndex: ['supplier', 'id'],
      valueType: 'text',
      hideInSearch: true,
    },
    {
      title: '店内可用库存',
      dataIndex: 'stockNum',
      valueType: 'text',
      hideInSearch: true,
    },
    {
      title: '店内销量',
      dataIndex: 'saleNum',
      valueType: 'text',
      hideInSearch: true,
    },
    {
      title: '集约价',
      dataIndex: 'price',
      valueType: 'text',
      hideInSearch: true,
      render: (_) => amountTransform(_, '/')
    },
    {
      title: '当前售价',
      dataIndex: 'salePrice',
      valueType: 'text',
      hideInSearch: true,
      render: (_) => amountTransform(_, '/')
    },
    {
      title: '进店时间',
      dataIndex: 'createTime',
      valueType: 'text',
      hideInSearch: true,
    },
    {
      title: '展示状态',
      dataIndex: 'onlineStatusText',
      valueType: 'text',
      hideInSearch: true,
    },
    {
      title: '改价次数',
      dataIndex: 'modifyPriceNums',
      valueType: 'text',
      hideInSearch: true,
      render: (_, record) => _ > 0 ? <a onClick={() => { setSelectItem(record); setModifyPriceLogVisible(true); }}>{_}</a> : _
    },
    {
      title: '展示状态',
      dataIndex: 'onlineStatus',
      valueType: 'select',
      hideInTable: true,
      valueEnum: {
        1: '展示中',
        2: '已隐藏'
      }
    },
    {
      title: '商品分类',
      dataIndex: 'gcId',
      renderFormItem: () => (<GcCascader />),
      hideInTable: true,
    },
    {
      title: '改价记录',
      dataIndex: 'isModifyPrice',
      valueEnum: {
        1: '有改价记录',
        2: '没有改价记录'
      },
      hideInTable: true,
    },
    // {
    //   title: '商品品牌',
    //   dataIndex: 'brandId',
    //   renderFormItem: () => (<BrandSelect />),
    //   hideInTable: true,
    // },
  ];

  return (
    <PageContainer>
      <div style={{ marginBottom: 10, background: '#fff', padding: 10 }}>
        <Space size="large">
          <span>{location?.query?.storeName}</span>
          <span>({location?.query?.linkman} {location?.query?.phone})</span>
        </Space>
      </div>
      <ProTable
        rowKey="orderId"
        options={false}
        params={{
          storeNo: params.id
        }}
        request={goodsPage}
        search={{
          defaultCollapsed: true,
          labelWidth: 100,
          optionRender: (searchConfig, formProps, dom) => [
            ...dom.reverse(),
          ],
        }}
        columns={columns}
        pagination={{
          pageSize: 10,
          showQuickJumper: true,
        }}
      />
      <div style={{ textAlign: 'center', marginTop: 30 }}>
        <Button onClick={() => { window.history.back(); setTimeout(() => { window.location.reload(); }, 200) }}>返回</Button>
      </div>
      {
        productDetailDrawerVisible &&
        <ProductDetailDrawer
          visible={productDetailDrawerVisible}
          setVisible={setProductDetailDrawerVisible}
          spuId={selectItem?.spuId}
        />
      }
      {modifyPriceLogVisible && <ModifyPriceLog id={selectItem?.id} visible={modifyPriceLogVisible} setVisible={setModifyPriceLogVisible} />}
    </PageContainer>

  );
};

export default TableList;
