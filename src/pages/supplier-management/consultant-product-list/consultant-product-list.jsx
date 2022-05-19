import React, { useState, useEffect, useRef } from 'react';
import { Button, Table, Spin } from 'antd';
import ProTable from '@ant-design/pro-table';
import XLSX from 'xlsx'
import { PageContainer } from '@/components/PageContainer';
import * as api from '@/services/product-management/product-list';
import GcCascader from '@/components/gc-cascader'
import BrandSelect from '@/components/brand-select'
import { amountTransform, typeTransform } from '@/utils/utils'
import { manageProductSpu } from '@/services/supplier-management/consultant-product-list';
import { useParams, history } from 'umi';
import Detail from './detail';


const SubTable = (props) => {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false);
  const columns = [
    { title: 'skuID', dataIndex: 'skuId' },
    { title: '规格', dataIndex: 'skuNameDisplay' },
    { title: '供货价', dataIndex: 'retailSupplyPrice', render: (_) => amountTransform(_, '/') },
    // { title: '批发价', dataIndex: 'wholesalePriceDisplay' },
    // { title: '批发起购量', dataIndex: 'wholesaleMinNum' },
    // { title: '建议零售价', dataIndex: 'suggestedRetailPriceDisplay' },
    // { title: '市场价', dataIndex: 'marketPriceDisplay' },
    // { title: '商品价格', dataIndex: 'salePriceDisplay' },
    { title: '可用库存', dataIndex: 'stockNum' },
    // { title: '活动库存', dataIndex: 'activityStockNum' },
  ];

  useEffect(() => {
    setLoading(true);
    api.productList({
      selectType: 2,
      spuId: props.data.spuId
    }).then(res => {
      setData(res?.data)
    }).finally(() => {
      setLoading(false);
    })
  }, [])

  return (
    <Spin spinning={loading}>
      <Table rowKey="id" columns={columns} dataSource={data} pagination={false} />
    </Spin>
  )
};

const TableList = () => {
  const [formVisible, setFormVisible] = useState(false);
  const [config, setConfig] = useState({});
  const actionRef = useRef();
  const formRef = useRef();

  const columns = [
    {
      title: 'spuID',
      dataIndex: 'spuId',
      valueType: 'text',
      fieldProps: {
        placeholder: '请输入商品SPU'
      }
    },
    {
      title: 'skuID',
      dataIndex: 'skuId',
      valueType: 'text',
      fieldProps: {
        placeholder: '请输入商品SKU'
      },
      hideInTable: true,
    },
    {
      title: '图片',
      dataIndex: 'goodsImageUrl',
      render: (text) => <img src={text} width={50} height={50} />,
      hideInSearch: true,
    },
    {
      title: '商品名称',
      dataIndex: 'goodsName',
      valueType: 'text',
      fieldProps: {
        placeholder: '请输入商品名称'
      },
      render: (_, data) => {
        return (<a onClick={() => { history.push(`/product-management/product-detail/${data.spuId}`); }}>{_}</a>)
      }
    },
    {
      title: '供应商家ID',
      dataIndex: 'supplierId',
      valueType: 'text',
      fieldProps: {
        placeholder: '请输入供应商家ID'
      }
    },
    {
      title: '供货类型',
      dataIndex: 'goodsSaleType',
      onFilter: true,
      valueType: 'select',
      valueEnum: typeTransform(config.goodsSaleType),
      hideInTable: true,
    },
    {
      title: '供货类型',
      dataIndex: 'goodsSaleTypeDisplay',
      valueType: 'text',
      hideInSearch: true,
    },
    {
      title: '销售价',
      dataIndex: 'goodsSaleMinPrice',
      valueType: 'text',
      hideInSearch: true,
      render: (_, data) => {
        const { goodsSaleMinPrice, goodsSaleMaxPrice } = data;
        if (goodsSaleMinPrice === goodsSaleMaxPrice) {
          return amountTransform(goodsSaleMinPrice, '/');
        }

        return `${amountTransform(goodsSaleMinPrice, '/')}~${amountTransform(goodsSaleMaxPrice, '/')}`
      }
    },
    {
      title: '可用库存',
      dataIndex: 'stockNum',
      valueType: 'text',
      hideInSearch: true,
    },
    // {
    //   title: '活动库存',
    //   dataIndex: 'activityStockNum',
    //   valueType: 'text',
    //   hideInSearch: true,
    // },
    {
      title: '销量',
      dataIndex: 'goodsSaleNum',
      valueType: 'text',
      hideInSearch: true,
    },
    {
      title: '审核状态',
      dataIndex: 'goodsVerifyState',
      onFilter: true,
      valueType: 'select',
      valueEnum: typeTransform(config.goodsVerifyState),
      hideInTable: true,

    },
    {
      title: '审核状态',
      dataIndex: 'goodsVerifyStateDisplay',
      valueType: 'text',
      hideInSearch: true,
    },
    {
      title: '上架状态',
      dataIndex: 'goodsState',
      onFilter: true,
      valueType: 'select',
      valueEnum: typeTransform(config.goodsState),
      hideInTable: true,
    },
    {
      title: '上架状态',
      dataIndex: 'goodsStateDisplay',
      valueType: 'text',
      hideInSearch: true,
    },
    {
      title: '商品关键字',
      dataIndex: 'goodsKeywords',
      valueType: 'text',
      hideInTable: true,
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
  ];

  const exportExcel = (form) => {
    api.listExport({
      ...form.getFieldsValue(),
    }).then(res => {
      if (res.code === 0) {
        const data = res.data.map(item => {
          const { goodsState, goodsFromType, goodsVerifyState, ...rest } = item;
          return {
            ...rest,
            retailSupplyPrice: amountTransform(rest.retailSupplyPrice, '/'),
            suggestedRetailPrice: amountTransform(rest.suggestedRetailPrice, '/'),
            wholesalePrice: amountTransform(rest.wholesalePrice, '/'),
          }
        });
        const wb = XLSX.utils.book_new();
        const ws = XLSX.utils.json_to_sheet([
          {
            spuId: 'spuId',
            goodsName: '商品名称',
            skuId: 'skuId',
            skuSpec: '规格组合',
            goodsFromTypeDisplay: '供货类型',
            retailSupplyPrice: '零售价',
            suggestedRetailPrice: '建议零售价',
            wholesalePrice: '批发价',
            stockNum: '可用库存',
            // activityNum: '活动库存',
            isFreeFreightDisplay: '是否包邮',
            supportNoReasonReturn: '七天无理由退货',
            goodsVerifyStateDisplay: '审核状态',
            goodsStateDisplay: '上架状态',
            createTime: '创建时间',
          },
          ...data
        ], {
          header: [
            'spuId',
            'goodsName',
            'skuId',
            'skuSpec',
            'goodsFromTypeDisplay',
            'retailSupplyPrice',
            'suggestedRetailPrice',
            'wholesalePrice',
            'stockNum',
            // 'activityNum',
            'isFreeFreightDisplay',
            'supportNoReasonReturn',
            'goodsVerifyStateDisplay',
            'goodsStateDisplay',
            'createTime',
          ],
          skipHeader: true
        });
        XLSX.utils.book_append_sheet(wb, ws, "file");
        XLSX.writeFile(wb, `${+new Date()}.xlsx`)

      }
    })
  }

  useEffect(() => {
    api.getConfig()
      .then(res => {
        setConfig(res?.data || [])
      })
  }, [])

  return (
    <PageContainer>
      <ProTable
        rowKey="id"
        options={false}
        params={{
          supplierHelperId: useParams()?.id,
        }}
        actionRef={actionRef}
        formRef={formRef}
        request={manageProductSpu}
        expandable={{ expandedRowRender: (_) => <SubTable data={_} /> }}
        search={{
          defaultCollapsed: true,
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
            <Button key="out" onClick={() => { exportExcel(form) }}>导出</Button>,
          ],
        }}
        columns={columns}
      />
    </PageContainer>
  );
};

export default TableList;
