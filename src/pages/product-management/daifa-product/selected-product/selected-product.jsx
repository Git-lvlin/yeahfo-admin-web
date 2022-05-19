import React, { useState, useEffect, useRef } from 'react';
import { EditableProTable } from '@ant-design/pro-table';
import { Button, Form, Select, Table, message, Input } from 'antd';
import { productList, setIndex } from '@/services/product-management/daifa-product';
import GcCascader from '@/components/gc-cascader';
import { amountTransform } from '@/utils/utils';
import Edit from './form';
// import Pop from './pop';
import Big from 'big.js';
import { PageContainer } from '@/components/PageContainer';
import ProCard from '@ant-design/pro-card';
const { Search } = Input;
const SubTable = (props) => {
  const [data, setData] = useState([])
  const [initData, setInitData] = useState([])
  const [size, setSize] = useState(5)
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
      title: '供货价(元)',
      dataIndex: 'consignPrice',
      render: (_) => amountTransform(_, '/')
    },
    {
      title: '市场价(元)',
      dataIndex: 'retailPrice',
      render: (_) => amountTransform(_, '/')
    },
    { title: '可用库存', dataIndex: 'amountOnSale' },
  ];

  useEffect(() => {
    if (size) {
      productList({
        page: 1,
        size: size,
        selectType: 2,
        productId: props.data.feedId
      }).then(({data}) => {
        if (data.length) {
          data.forEach((item) => {
            item.attributesOne = item.attributes[0].attributeName + ':' + item.attributes[0].attributeValue
            item.attributesTwo = item.attributes[1]?item.attributes[1].attributeName + ':' + item.attributes[1].attributeValue:''
          })
          if (size === 999) {
            setData(data)
            setInitData([])
            return
          }
          setData(data.slice(0, size))
          setInitData(data)
        }
      })
    }

  }, [size])

  return (
    <ProCard>
      <Table rowKey="id" columns={columns} dataSource={data} pagination={false} />
      {initData.length>5&&<Button style={{
        marginTop: 20
      }} onClick={() => {
        setSize(999)
      }}>查看全部{initData.length}个sku</Button>}
    </ProCard>
  )
};

export default function EditTable() {
  const [editableKeys, setEditableKeys] = useState([]);
  const [dataSource, setDataSource] = useState([]);
  const [hasData, setHasData] = useState(false);
  const [formVisible, setFormVisible] = useState(false);
  // const [popShow, setPopShow] = useState(false);
  const [params, setParams] = useState({
    selectType: 1,
  });
  const [form] = Form.useForm();
  const actionRef = useRef();
  const columns = [
    {
      title: 'spu',
      dataIndex: 'feedId',
      valueType: 'text',
      editable: false,
    },
    {
      title: '图片',
      dataIndex: 'imgUrl',
      valueType: 'text',
      editable: false,
      render: (text) => <img src={text} width={50} height={50} />
    },
    {
      title: '商品名称',
      dataIndex: 'title',
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
      title: '售价最多上浮百分比',
      dataIndex: 'floatPercent',
      width: 160,
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
      renderFormItem: () => <Select placeholder='请选择' options={[{ label: '暂不售卖', value: 0 }, { label: '售卖', value: 1 }]} />
    },
    {
      title: '操作',
      valueType: 'options',
      editable: false,
      align: 'center',
      render: (_,r) => {
        return  <>
          <a onClick={() => {
            setGoodsIndex(r)
          }}>设置</a>
          </>
      }
    },
  ]

  const setGoodsIndex = (r) => {
    const { feedId:productId, gcId, goodsState, floatPercent } = r
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
    setIndex(params).then(res=> {
      if (res.code === 0) {
        message.success('设置成功')
      }
    }) 
  }

  const postData = (data) => {
    setEditableKeys(data.map(item => item.id));
    const arr = data.map(item => ({
      ...item,
      gcId: item.gcId1&&item.gcId2&&[Number(item.gcId1), Number(item.gcId2)],
      price: amountTransform(+item.price, '/'),
      floatPercent: 500,
      goodsState: 1,
    }))
    setDataSource(arr)
  }

  useEffect(() => {
    hasData&&actionRef.current.reset();
  }, [hasData])

  const getGoodsList = () => {
    console.log('拉取商品组')
    hasData&&setHasData(false)
    setFormVisible(true)
  }

  const onSearch = (value) => {
    setParams({
      ...params,
      goodsName: value,
    })
  };

  return (
    <PageContainer
      ghost
      header={{
        title: '',
        breadcrumb: {},
      }}
      content={
        <Button onClick={() => {
          getGoodsList()
        }}>获取供应链已选商品组</Button>
      }
    >
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
    }}>重置</Button>
    {<EditableProTable
      actionRef={actionRef}
      postData={postData}
      columns={columns}
      params={params}
      rowKey="id"
      value={dataSource}
      expandable={{ expandedRowRender: (_) => <SubTable data={_} /> }}
      request={productList}
      search={false}
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
              return data
            }
            return item
          })
          setDataSource(arr)
        }
      }}
      pagination={{
        pageSize: 5
      }}
      // rowSelection={{
      //   onChange: (_, val) => {
      //     onSelect(val[0])
      //     console.log('_', _, val)
      //   }
      // }}
      bordered
      recordCreatorProps={false}
      tableAlertRender={false}
      style={{ marginBottom: 20, width: '100%' }}
    />}
      {formVisible && <Edit
      visible={formVisible}
      setVisible={setFormVisible}
      setHasData={setHasData}
    />}
      {/* {popShow && <Pop
      visible={popShow}
      setVisible={setPopShow}
      params={params}
    />} */}
    </PageContainer>
  )
}
