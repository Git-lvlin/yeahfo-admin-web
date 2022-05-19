import React, { useState, useEffect, useRef } from 'react';
import { Table, Tooltip, Spin } from 'antd';
import ProTable from '@ant-design/pro-table';
import { PageContainer } from '@/components/PageContainer';
import * as api from '@/services/product-management/product-review'
import { setGoodsList } from '@/services/product-management/set-goods-list'
import GcCascader from '@/components/gc-cascader'
import BrandSelect from '@/components/brand-select'
import { typeTransform, amountTransform } from '@/utils/utils'
import Edit from '../product-list/edit'
import ProductDetailDrawer from '@/components/product-detail-drawer'
import Export from '@/pages/export-excel/export'
import ExportHistory from '@/pages/export-excel/export-history'
import moment from 'moment';

const SubTable = (props) => {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false);

  const columns = [
    { title: 'skuID', dataIndex: 'skuId' },
    { title: '规格', dataIndex: 'skuNameDisplay' },
    { title: '零售供货价', dataIndex: 'retailSupplyPrice', render: (_) => _ > 0 ? amountTransform(_, '/') : '-' },
    { title: '批发供货价', dataIndex: 'wholesalePrice', render: (_) => _ > 0 ? amountTransform(_, '/') : '-' },
    { title: '批发起购量', dataIndex: 'wholesaleMinNum' },
    // { title: '建议零售价', dataIndex: 'suggestedRetailPriceDisplay' },
    { title: '市场价', dataIndex: 'marketPriceDisplay' },
    { title: '商品价格', dataIndex: 'salePriceDisplay' },
    { title: '可用库存', dataIndex: 'stockNum' },
    // { title: '活动库存', dataIndex: 'activityStockNum' },
  ];

  useEffect(() => {
    setLoading(true);
    setGoodsList({
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
  const [config, setConfig] = useState({});
  const [detailData, setDetailData] = useState(null);
  const [selectItem, setSelectItem] = useState(null);
  const actionRef = useRef();
  const [formVisible, setFormVisible] = useState(false);
  const [productDetailDrawerVisible, setProductDetailDrawerVisible] = useState(false);
  const [visit, setVisit] = useState(false)

  const formRef = useRef();

  const getDetail = (record) => {
    api.getDetail({
      spuId: record.id
    }).then(res => {
      if (res.code === 0) {
        setDetailData({
          ...res.data,
          settleType: 2,
        });
        setFormVisible(true);
      }
    })
  }

  const columns = [
    {
      title: 'spuID',
      dataIndex: 'spuId',
      valueType: 'text',
      fieldProps: {
        placeholder: '请输入商品SPU',
        maxLength: 12,
      }
    },
    {
      title: 'skuID',
      dataIndex: 'skuId',
      valueType: 'text',
      fieldProps: {
        placeholder: '请输入商品SKU',
        maxLength: 12,
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
      hideInTable: true,
    },
    {
      title: '商品名称',
      dataIndex: 'goodsName',
      valueType: 'text',
      hideInSearch: true,
      render: (_, record) => {
        return <a onClick={() => { setSelectItem(record); setProductDetailDrawerVisible(true); }}>{_}</a>
      }
    },
    {
      title: '生鲜类型',
      dataIndex: 'fresh',
      valueType: 'text',
      hideInTable: true,
      valueEnum: {
        0: '非生鲜',
        1: '精装生鲜',
        2: '散装生鲜',
      }
    },
    {
      title: '生鲜类型',
      dataIndex: 'fresh',
      valueType: 'text',
      hideInSearch: true,
      render: (_) => ({
        0: '非生鲜',
        1: '精装生鲜',
        2: '散装生鲜',
      }[_]),
    },
    {
      title: '供应商家ID',
      dataIndex: 'supplierId',
      valueType: 'text',
      hideInSearch: true,
      width: 120,
    },
    {
      title: '供应商家ID',
      dataIndex: 'supplierId',
      valueType: 'text',
      fieldProps: {
        placeholder: '请输入供应商家ID'
      },
      // renderFormItem: () => <SupplierSelect />,
      hideInTable: true,
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
      title: '批发供货价(元)',
      dataIndex: 'wholesaleSupplyPriceRange',
      valueType: 'text',
      hideInSearch: true,
      render: (_, data) => data.goodsSaleType === 2 ? '-' : _,
      width: 120,
    },
    {
      title: '零售供货价(元)',
      dataIndex: 'retailSupplyPriceRange',
      valueType: 'text',
      hideInSearch: true,
      render: (_, data) => data.goodsSaleType === 1 ? '-' : _,
      width: 120,
    },
    {
      title: '秒约价(元)',
      dataIndex: 'name',
      valueType: 'text',
      hideInSearch: true,
      render: (_, data) => {
        const { goodsSaleMinPrice, goodsSaleMaxPrice } = data;
        if (goodsSaleMinPrice === goodsSaleMaxPrice) {
          return amountTransform(goodsSaleMinPrice, '/');
        }

        return `${amountTransform(goodsSaleMinPrice, '/')}~${amountTransform(goodsSaleMaxPrice, '/')}`
      },
      width: 120,
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
    // {
    //   title: '审核状态',
    //   dataIndex: 'goodsVerifyState',
    //   onFilter: true,
    //   valueType: 'select',
    //   valueEnum: typeTransform(config.goodsVerifyState),
    //   hideInTable: true,

    // },
    // {
    //   title: '审核状态',
    //   dataIndex: 'goodsVerifyStateDisplay',
    //   valueType: 'text',
    //   hideInSearch: true,
    //   render: (_, record) => {
    //     const { goodsVerifyRemark, goodsVerifyState } = record;
    //     return (
    //       <>
    //         {_}&nbsp;
    //         {(goodsVerifyRemark && goodsVerifyState === 2) && <Tooltip title={goodsVerifyRemark}><QuestionCircleOutlined /></Tooltip>}
    //       </>
    //     )
    //   },
    // },
    {
      title: '上架状态',
      dataIndex: 'goodsState',
      onFilter: true,
      valueType: 'select',
      valueEnum: typeTransform(config.goodsState),
      hideInTable: true,
    },
    // {
    //   title: '审核类型',
    //   dataIndex: 'firstAuditDisplay',
    //   valueType: 'text',
    //   hideInSearch: true,
    // },
    // {
    //   title: '上架状态',
    //   dataIndex: 'goodsStateDisplay',
    //   valueType: 'text',
    //   hideInSearch: true,
    //   render: (_, record) => {
    //     const { goodsStateRemark, goodsState } = record;
    //     return (
    //       <>
    //         {_}&nbsp;
    //         {(goodsStateRemark && goodsState === 0) && <Tooltip title={goodsStateRemark}><QuestionCircleOutlined /></Tooltip>}
    //       </>
    //     )
    //   },
    // },
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
      title: '上架状态',
      dataIndex: 'goodsStateDisplay',
      valueType: 'text',
      hideInSearch: true,
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      valueType: 'dateTimeRange',
      hideInTable: true,
    },
    {
      title: '审核时间',
      dataIndex: 'auditTime',
      valueType: 'dateTimeRange',
      hideInTable: true,
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => (
        <>
          <a onClick={() => { getDetail(record) }}>设置</a>
        </>
      ),
    },
  ];

  const getFieldValue = () => {
    if (formRef?.current?.getFieldsValue) {
      const { current, pageSize, gcId = [], createTime, auditTime, ...rest } = formRef?.current?.getFieldsValue?.();
      const obj = {};

      if (createTime) {
        obj.createTimeStart = moment(createTime[0]).unix();
        obj.createTimeEnd = moment(createTime[1]).unix();
      }

      if (auditTime) {
        obj.auditTimeStart = moment(auditTime[0]).unix();
        obj.auditTimeEnd = moment(auditTime[1]).unix();
      }

      return {
        ...obj,
        selectType: 1,
        gcId1: gcId[0],
        gcId2: gcId[1],
        ...rest
      }
    }
    return {}
  }

  useEffect(() => {
    api.getConfig()
      .then(res => {
        setConfig(res?.data || [])
      })
  }, [])

  return (
    <PageContainer>
      {/* <Card>
        <div style={{display: 'flex', justifyContent: 'flex-end'}}>
          <Button key="out" type="primary" icon={<PlusOutlined />}>新建</Button>
        </div>
      </Card> */}
      <ProTable
        rowKey="id"
        options={false}
        actionRef={actionRef}
        formRef={formRef}
        params={{
          selectType: 1,
        }}
        scroll={{ x: 'max-content', scrollToFirstRowOnChange: true, }}
        request={setGoodsList}
        expandable={{ expandedRowRender: (_) => <SubTable data={_} /> }}
        search={{
          labelWidth: 120,
          defaultCollapsed: true,
          optionRender: (searchConfig, formProps, dom) => [
            ...dom.reverse(),
            <Export
              key="4"
              change={(e) => { setVisit(e) }}
              type="goods-operate-export"
              conditions={()=>{return getFieldValue(searchConfig)}}
            />,
            <ExportHistory key="5" show={visit} setShow={setVisit} type="goods-operate-export" />,
          ],
        }}
        columns={columns}
        pagination={{
          pageSize: 10,
        }}
      />
      {formVisible && <Edit
        visible={formVisible}
        setVisible={setFormVisible}
        detailData={detailData}
        callback={() => { actionRef.current.reload(); setDetailData(null) }}
        onClose={() => { setDetailData(null) }}
      />}
      {
        productDetailDrawerVisible &&
        <ProductDetailDrawer
          visible={productDetailDrawerVisible}
          setVisible={setProductDetailDrawerVisible}
          spuId={selectItem.spuId}
        />
      }
    </PageContainer>

  );
};

export default TableList;
