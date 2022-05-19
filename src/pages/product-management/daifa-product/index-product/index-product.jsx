import React, { useState, useEffect, useRef } from 'react';
import { EditableProTable } from '@ant-design/pro-table';
import { Form, Select, message, Table, Input, Button } from 'antd';
import { indexProductList, goodsLoading } from '@/services/product-management/daifa-product';
import GcCascader from '@/components/gc-cascader'
import { amountTransform } from '@/utils/utils'
import Big from 'big.js';
import ProCard from '@ant-design/pro-card';
const { Search } = Input;

const SubTable = (props) => {
  const [data, setData] = useState([])
  const [initData, setInitData] = useState([])
  const [size, setSize] = useState(5)
  const columns = [
    {
      title: '图片',
      dataIndex: 'imageUrl',
      render: (text) => <img src={text} width={50} height={50} />,
    },
    { title: 'skuId', dataIndex: 'skuId' },
    { 
      title: '规格',
      dataIndex: 'skuNameDisplay',
    },
    {
      title: '供货价(元)',
      dataIndex: 'retailSupplyPrice',
      render: (_) => amountTransform(_, '/')
    },
    {
      title: '市场价(元)',
      dataIndex: 'marketPrice',
      render: (_) => amountTransform(_, '/')
    },
    { title: '可用库存', dataIndex: 'stockNum' },
  ];

  useEffect(() => {
    if (size) {
      indexProductList({
        page: 1,
        size: size,
        selectType: 2,
        spuId: props.data.spuId
      }).then(({data, total}) => {
        if (data.length) {
          setData(data)
          setInitData(total)
        }
      })
    }
  }, [size])

  return (
    <ProCard>
    <Table rowKey="id" columns={columns} dataSource={data} pagination={false} />
      {initData>5&&<Button style={{
        marginTop: 20
      }} onClick={() => {
        setSize(999)
      }}>查看全部{initData}个sku</Button>}
    </ProCard>
  )
};

export default function EditTable() {
  const [editableKeys, setEditableKeys] = useState([]);
  const [dataSource, setDataSource] = useState([]);
  const [form] = Form.useForm();
  const actionRef = useRef();
  const [params, setParams] = useState({
    selectType: 1,
  });

  const upData = (r) => {
    const { outSpuId:productId, gcId, goodsState, floatPercent } = r
    if (!(/(^[1-9]\d*$)/.test(floatPercent))) {
      return message.error('请输入正整数')
    }
    if (!goodsState && goodsState !== 0) {
      return message.error('请选择售卖状态')
    }
    if (!gcId?.[0]) {
      return message.error('请设置1级分类')
    }
    if (!gcId?.[1]) {
      return message.error('请设置2级分类')
    }
    const params = {
      productId,
      gcId1: gcId?.[0],
      gcId2: gcId?.[1],
      goodsState,
      floatPercent,
    }
    goodsLoading(params).then((res) => {
      if (res.code === 0) {
        message.success('更新成功')
        actionRef.current.reset();
      }
    })
  }

  const columns = [
    {
      title: 'spuID',
      dataIndex: 'spuId',
      valueType: 'text',
      editable: false,
    },
    {
      title: '供应链spuId',
      dataIndex: 'outSpuId',
      valueType: 'text',
      editable: false,
    },
    {
      title: '图片',
      dataIndex: 'goodsImageUrl',
      valueType: 'text',
      editable: false,
      render: (text) => <img src={text} width={50} height={50} />
    },
    {
      title: '商品名称',
      dataIndex: 'goodsName',
      valueType: 'text',
      editable: false,
      search: true,
    },
    {
      title: '最低供货价',
      dataIndex: 'minRetailSupplyPrice',
      valueType: 'text',
      editable: false,
    },
    {
      title: '最高供货价',
      dataIndex: 'maxRetailSupplyPrice',
      valueType: 'text',
      editable: false,
    },
    {
      title: '库存',
      dataIndex: 'stockNum',
      valueType: 'text',
      editable: false,
    },
    {
      title: '供应链状态',
      dataIndex: 'invalid',
      valueType: 'text',
      editable: false,
      render: (_,r) => {
        return _ === 0 ? '有效' : `已失效(${r.invalidInfo})`
      }
    },
    {
      title: '售价最低上浮百分比',
      dataIndex: 'floatPercentMin',
      valueType: 'text',
      editable: false,
      render: (_) => _ + '%' 
    },
    {
      title: '售价最多上浮百分比',
      dataIndex: 'floatPercent',
      align: 'center',
      renderFormItem: () => <Input placeholder='输入正整数' suffix='%'/>,
    },
    {
      title: '商品分类',
      dataIndex: 'gcId',
      renderFormItem: () => (<GcCascader />),
    },
    {
      title: '售卖状态',
      dataIndex: 'goodsState',
      renderFormItem: () => <Select options={[{ label: '暂不售卖', value: 0 }, { label: '售卖', value: 1 }]} />
    },
    {
      title: '操作',
      valueType: 'options',
      editable: false,
      align: 'center',
      render: (_, r) => <a onClick={() => {
        upData(r)
      }}>更新</a>
    },
  ]

  const postData = (data) => {
    setEditableKeys(data.map(item => item.id));
    const arr = data.map(item => ({
      ...item,
      // totalStockNum: item.stockNum,
      // minNum: 1,
      gcId: item.gcId1&&item.gcId2&&[item.gcId1, item.gcId2],
      maxRetailSupplyPrice: amountTransform(+item.maxRetailSupplyPrice, '/'),
      minRetailSupplyPrice: amountTransform(+item.minRetailSupplyPrice, '/'),
      // price: amountTransform(+item.price, '/'),
      // perStoreMinNum: 10,
      // totalPrice: item.salePrice > 0 ? +new Big(+item.salePrice).div(100).times(10) : 0,
    }))
    setDataSource(arr)
  }

  const onSearch = (value) => {
    setParams({
      ...params,
      goodsName: value,
    })
  };
  return (
    <ProCard>
      <Search
      style={
        {
          width: 300,
          marginBottom: 20,
          marginLeft: 24,
        }
      }
      placeholder="请输入商品名"
      onSearch={onSearch}
      enterButton={'商品名称搜索'} />
    <Button onClick={() => {
      onSearch(null)
      // setValue(null)
    }}>重置</Button>
    <EditableProTable
      actionRef={actionRef}
      postData={postData}
      columns={columns}
      expandable={{ expandedRowRender: (_) => <SubTable data={_} /> }}
      rowKey="id"
      value={dataSource}
      params={params}
      request={indexProductList}
      editable={{
        form,
        editableKeys,
        onValuesChange: (record, recordList) => {
          const arr = recordList.map(item => {
            if (item.id === record.id) {
              const data = {
                ...item,
                totalPrice: (item.price > 0 && item.perStoreMinNum > 0) ? +new Big(item.price).times(item.perStoreMinNum) : 0
              }
              // onSelect(data)
              return data
            }
            return item
          })
          setDataSource(arr)
        }
      }}
      pagination={{
        pageSize: 10
      }}
      // rowSelection={{
      //   onChange: (_, val) => {
      //     // onSelect(val[0])
      //   }
      // }}
      bordered
      recordCreatorProps={false}
      tableAlertRender={false}
      style={{ marginBottom: 20, width: '100%' }}
    />
    </ProCard>
  )
}
