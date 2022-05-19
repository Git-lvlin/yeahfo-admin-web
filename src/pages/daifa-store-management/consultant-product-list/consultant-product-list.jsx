import React, { useState, useRef, useEffect } from 'react';
import ProTable from '@ant-design/pro-table';
import { Space, Table } from 'antd';
import { page_spuList,page_skuList } from '@/services/daifa-store-management/consultant-product-list'
import { amountTransform } from '@/utils/utils'
import GcCascader from '@/components/gc-cascader'

const SubTable = (props) => {
  const [data, setData] = useState([])
  const columns = [
    {
      title: 'skuId',
      dataIndex: 'skuId',
    },
    {
      title: '供应链skuID',
      dataIndex: 'outSkuId',
    },
    {
      title: '规格',
      dataIndex: 'skuNameDisplay',
    },
    {
      title: '店主售价',
      dataIndex: 'salePrice',
      valueType:'money',
      render: (_)=> amountTransform(_, '/').toFixed(2),
    },
    {
      title: '供应链供货价',
      dataIndex: 'retailSupplyPrice',
      valueType:'money',
      render: (_)=> amountTransform(_, '/').toFixed(2),
    },
    {
      title: '店铺市场价',
      dataIndex: 'marketPrice',
      valueType:'money',
      render: (text, record) => (
        <Space size="middle">
          <p>{record.marketPrice?'￥'+amountTransform(record.marketPrice, '/').toFixed(2):null}</p>
        </Space>
      ),
    },
    {
      title: '可用库存',
      dataIndex: 'stockNum',
    },
    {
      title: '销量',
      dataIndex: 'saleNum',
    }
  ];
  useEffect(() => {
    page_skuList({
      spuId: props.spuId,
      storeNo:props.storeNo
    }).then(res => {
      if (res.code === 0) {
        setData(res?.data)
      }
    })
  }, [])
  return (
    <Table key="id" columns={columns} dataSource={data} pagination={false} />
  )
};

const consultantProductList = props => {
  let spuId = props.location.query.spuId
  let storeNo = props.location.query.storeNo
  let storeName = props.location.query.storeName
  let wechatNo = props.location.query.wechatNo
  const [visible, setVisible] = useState(false);
  const [detailData, setDetailData] = useState(null)
  const actionRef = useRef();
  const columns = [
    {
      title: 'spuID',
      dataIndex: 'spuIds',
      valueType: 'text',
      hideInTable:true
    },
    {
      title: 'spuID',
      dataIndex: 'spuId',
      valueType: 'text',
      hideInSearch:true
    },
    {
      title: '供应链ID',
      dataIndex: 'outSpuId',
      valueType: 'text',
      hideInSearch: true,
    },
    {
      title: '图片',
      dataIndex: 'goodsImageUrl',
      valueType: 'image',
      hideInSearch:true
    },
    {
      title: '商品名称',
      dataIndex: 'goodsName',
      valueType: 'text',
    },
    {
      title: '店铺销售价（元）',
      dataIndex: 'saleMaxPrice',
      valueType:'money',
      hideInSearch: true,
      render: (text, record) => (
        <Space size="middle">
          <p>{amountTransform(record.saleMinPrice, '/').toFixed(2)+'~'+amountTransform(record.saleMaxPrice, '/').toFixed(2)+'元'}</p>
        </Space>
      ),
    },
    {
      title: '供应链供货价（元）',
      dataIndex: 'minRetailSupplyPrice',
      valueType:'money',
      hideInSearch: true,
      render: (text, record) => (
        <Space size="middle">
           <p>{amountTransform(record.minRetailSupplyPrice, '/').toFixed(2)+'~'+amountTransform(record.maxRetailSupplyPrice, '/').toFixed(2)+'元'}</p>
        </Space>
      ),
    },
    {
      title: '商品分类',
      dataIndex: 'gcId1Display',
      renderFormItem: () => (<GcCascader />),
      hideInTable:true
    },
    {
      title: '所属分类',
      dataIndex: 'gcId1Display',
      valueType:'text',
      hideInSearch:true
    },
    {
      title: '销量',
      dataIndex: 'saleNum',
      valueType: 'text',
      hideInSearch: true,
    },
    {
      title: '售卖状态',
      dataIndex: 'goodsState',
      valueType: 'text',
      valueEnum: {
        0: '不限',
        1: '批发',
        2: '零售',
      },
      hideInSearch: true,
    },
    {
      title: '上架状态',
      dataIndex: 'status',
      valueType: 'select',
      valueEnum: {
        "1": '上架',
        "2": '下架',
        "3": '草稿',
      },
      hideInTable:true
    },
    {
      title: '上架状态',
      dataIndex: 'status',
      valueType: 'text',
      valueEnum: {
        "1": '上架',
        "2": '下架',
        "3": '草稿',
      },
      hideInSearch:true
    }
  ];

  return (
    <>
      <Space>
          <h1>{storeName}</h1>
          <h3>{'(登录账号： '+wechatNo+')'}</h3>
      </Space>
      <ProTable
        rowKey="id"
        options={false}
        request={page_spuList}
        params={{
          storeNo
        }}
        expandable={{ expandedRowRender: (_) => <SubTable spuId={_.spuId} storeNo={_.storeNo} /> }}
        search={{
          defaultCollapsed: true,
          labelWidth: 100,
          optionRender: (searchConfig, formProps, dom) => [
            ...dom.reverse(),
          ],
        }}
        columns={columns}
        actionRef={actionRef}
      />
      {detailData && <Detail detailData={detailData} visible={visible} onClose={() => { setVisible(false) }} />}
  </>
  );
};

export default consultantProductList;
