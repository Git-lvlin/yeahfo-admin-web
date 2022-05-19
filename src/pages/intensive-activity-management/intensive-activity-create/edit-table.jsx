import React, { useState, useRef, useMemo, forwardRef, useImperativeHandle } from 'react';
import { EditableProTable } from '@ant-design/pro-table';
import { Checkbox, Input, Radio, message } from 'antd';
import GcCascader from '@/components/gc-cascader'
import BrandSelect from '@/components/brand-select'
import { productList } from '@/services/intensive-activity-management/intensive-activity-create'
import Big from 'big.js';
import { amountTransform } from '@/utils/utils'
import debounce from 'lodash/debounce';

const parseNum = (value) => {
  let num = `${value}`;
  if (!/^\d+\.?\d*$/.test(num)) {
    return ''
  }

  if (`${num}`.indexOf('.') !== -1) {
    const arr = num.split('.')
    num = `${arr[0]}.${arr[1].slice(0, 2)}`
  }

  return num;
}

const CusInput = ({ value, onChange, ...rest }) => {
  const keyup = (e) => {
    onChange(parseNum(e.target.value))
  }
  return <Input value={value} onChange={keyup} {...rest} />
}

const FormWrap = ({ value, onChange, children }) => {
  return (
    <>
      {children({ value, onChange })}
    </>
  )
}

// const Subsidy = ({ value = {}, onChange, orderProfit, ...rest }) => {
//   return (
//     <>
//       <div>当订单金额达到 <CusInput onChange={(e) => { const obj = { ...value }; obj.a = e; onChange(obj) }} value={value.a} style={{ width: 150 }} {...rest} /></div>
//       {orderProfit !== 0 && <div>实际盈亏为 {orderProfit}元</div>}
//       <div>补贴 <CusInput onChange={(e) => { const obj = { ...value }; obj.b = e; onChange(obj) }} value={value.b} style={{ width: 150 }} {...rest} /></div>
//     </>
//   )
// }

const EditTable = ({ onSelect, sku, wholesale, radioSelect }, ref) => {
  const [editableKeys, setEditableKeys] = useState([])
  const [dataSource, setDataSource] = useState([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [selectData, setSelectData] = useState([]);
  const isFirst = useRef(true);
  const formRef = useRef();

  const update = (recordList, record) => {
    const findItem = dataSource.find(item => item.id === record.id);
    const obj = {
      skuId: record.skuId,
      isGetWholesale: 1,
      priceScale: amountTransform(record.settlePercent, '/'),
      price: amountTransform(record.price),
      // orderAmount: amountTransform(record.subsidy.a),
      // subsidy: amountTransform(record.subsidy.b)
    }

    if (record.isAppointSubsidy.length) {
      obj.fixedPrice = amountTransform(record.fixedPrice);
      obj.operationFixedPrice = amountTransform(record.operationFixedPrice);
    }

    if (findItem.price !== record.price) {
      obj.price = amountTransform(record.price);
      obj.priceScale = -1;
    }

    if (findItem.settlePercent !== record.settlePercent) {
      obj.priceScale = amountTransform(record.settlePercent, '/');
      delete obj.price;
    }

    if (record.freshCommission2) {
      obj.freshCommission = amountTransform(record.freshCommission2, '/');
      obj.price = amountTransform(record.price);
    }

    if (record.freshCommission3) {
      obj.freshCommission = amountTransform(record.freshCommission3, '/');
      obj.priceScale = amountTransform(record.settlePercent, '/');
    }

    const getList = (list, skuData, cb) => {
      const arr = list.map(item => {
        if (item.id === skuData.id) {
          const data = {
            ...record,
            fixedPrice: amountTransform(skuData.fixedPrice, '/'),
            operationFixedPrice: amountTransform(skuData.operationFixedPrice, '/'),
            settlePercent: amountTransform(skuData.settlePercent),
            price: amountTransform(skuData.price, '/'),
            profit: amountTransform(skuData.profit, '/'),
            orderProfit: amountTransform(skuData.orderProfit, '/'),
            totalPrice: (skuData.price > 0 && record.maxNum > 0) ? +new Big(amountTransform(skuData.price, '/')).times(record.minNum) : 0,
            // subsidy: {
            //   a: skuData.orderAmount ? amountTransform(skuData.orderAmount, '/') : '',
            //   b: skuData.subsidy ? amountTransform(skuData.subsidy, '/') : ''
            // }
          }
          return data
        }
        return item
      })
      if (cb) {
        cb(arr);
      }
      return arr;
    }

    if (record.skuId === selectedRowKeys[0]) {
      onSelect([record])
      setSelectData([record])
    }

    setDataSource(recordList)

    productList(obj).then(res => {
      const skuData = res.data[0];
      if (record.skuId === selectedRowKeys[0]) {
        onSelect(getList([record], skuData, (arr) => { setSelectData(arr) }))
      }
      setDataSource(getList(recordList, skuData))
    })
  };

  useImperativeHandle(ref, () => ({
    update: (record) => { update(dataSource, record) }
  }))

  const debounceFetcher = useMemo(() => {
    const loadData = (value) => {
      const { recordList, record } = value;
      update(recordList, record);
    }
    return debounce(loadData, 10);
  }, [dataSource, selectData, onSelect, selectedRowKeys]);

  const columns = [
    {
      dataIndex: 'goodsName',
      valueType: 'text',
      fieldProps: {
        placeholder: '请输入商品名称',
        maxLength: 50,
      },
      hideInTable: true
    },
    {
      dataIndex: 'retailSupplyPrice',
      valueType: 'text',
      fieldProps: {
        placeholder: '请输入商品关键字',
        maxLength: 30,
      },
      hideInTable: true
    },
    // {
    //   dataIndex: 'retailSupplyPrice',
    //   valueType: 'select',
    //   fieldProps: {
    //     placeholder: '请选择商品所属供应商家类型'
    //   },
    //   valueEnum: {
    //     0: '全部',
    //     1: '佣金模式',
    //     2: '底价模式'
    //   },
    //   hideInTable: true
    // },
    {
      dataIndex: 'supplierId',
      valueType: 'text',
      fieldProps: {
        placeholder: '请输入供应商家ID',
        maxLength: 30,
      },
      hideInTable: true
    },
    {
      dataIndex: 'spuId',
      valueType: 'text',
      fieldProps: {
        placeholder: '请输入商品spuID',
        maxLength: 30,
      },
      hideInTable: true,
    },
    {
      dataIndex: 'skuId',
      valueType: 'text',
      fieldProps: {
        placeholder: '请输入商品skuID',
        maxLength: 30,
      },
      hideInTable: true,
      initialValue: sku?.skuId,
    },
    {
      dataIndex: 'gcId',
      renderFormItem: () => (<GcCascader placeholder="请选择商品分类" />),
      hideInTable: true,
    },
    {
      dataIndex: 'brandId',
      renderFormItem: () => (<BrandSelect placeholder="请选择商品品牌" />),
      hideInTable: true,
    },
    {
      title: 'spuID',
      dataIndex: 'spuId',
      valueType: 'text',
      hideInSearch: true,
      editable: false,
    },
    {
      title: 'skuID',
      dataIndex: 'skuId',
      valueType: 'text',
      hideInSearch: true,
      editable: false,
    },
    {
      title: '商品分类',
      dataIndex: 'retailSupplyPrice',
      valueType: 'text',
      hideInSearch: true,
      editable: false,
      render: (_, data) => <>{data.gcId1Display}-{data.gcId2Display}{data.fresh !== 0 && <span style={{ color: 'green' }}>({{ 1: '精装生鲜', 2: '散装生鲜' }[data.fresh]})</span>}</>,
    },
    {
      title: '主图',
      dataIndex: 'imageUrl',
      valueType: 'text',
      hideInSearch: true,
      editable: false,
      render: (text) => <img src={text} width={50} height={50} />
    },
    {
      title: '供应商家ID',
      dataIndex: 'supplierId',
      valueType: 'text',
      hideInSearch: true,
      editable: false,
    },
    {
      title: '配送模式',
      dataIndex: 'wholesaleFlowType',
      hideInSearch: true,
      renderFormItem: (_, { record }) => {
        return (<Radio.Group>
          <Radio value={1} disabled={record?.fresh === 1}>直发到店</Radio>
          <Radio value={2}>运营中心配送</Radio>
        </Radio.Group>)
      }
    },
    // {
    //   title: '批发供货价(元)',
    //   dataIndex: 'wholesaleSupplyPrice',
    //   valueType: 'text',
    //   hideInSearch: true,
    //   editable: false,
    // },
    // {
    //   title: '市场价(元)',
    //   dataIndex: 'marketPriceDisplay',
    //   valueType: 'text',
    //   hideInSearch: true,
    //   editable: false,
    // },
    // {
    //   title: '平均运费(元)',
    //   dataIndex: 'wholesaleFreight',
    //   valueType: 'text',
    //   hideInSearch: true,
    //   editable: false,
    // },
    {
      title: '总库存',
      dataIndex: 'stockNum',
      valueType: 'text',
      hideInSearch: true,
      editable: false,
      render: (_, record) => {
        return (
          <>
            <div>{_}{record.unit}</div>
            {record.batchNumber > 1 && !!record.wsUnit && <div>({parseInt(_ / record.batchNumber, 10)}{record.wsUnit})</div>}
          </>
        )
      }
    },
    {
      title: '商品名称',
      dataIndex: 'goodsName',
      valueType: 'text',
      hideInSearch: true,
      editable: false,
      width: 200,
    },
    {
      title: '规格信息',
      dataIndex: 'skuNameDisplay',
      valueType: 'text',
      hideInSearch: true,
      editable: false,
      width: 200,
    },
    // {
    //   title: '结算类型',
    //   dataIndex: 'settleType',
    //   valueType: 'text',
    //   hideInSearch: true,
    //   editable: false,
    //   valueEnum: {
    //     1: '佣金模式',
    //     2: '底价模式'
    //   },
    // },
    {
      title: '集约总库存',
      dataIndex: 'totalStockNum',
      valueType: 'text',
      hideInSearch: true,
      renderFormItem: (_, { record }) => {
        return (
          <FormWrap>
            {({ value, onChange }) => (
              <>
                <Input style={{ width: 130 }} addonAfter={record.unit} value={value} onChange={onChange} onBlur={() => {
                  debounceFetcher({ record, recordList: dataSource })
                }} />
                {record.batchNumber > 1 && !!record.wsUnit && value / record.batchNumber >= 1 && <div>({parseInt(value / record.batchNumber, 10)}{record.wsUnit})</div>}
              </>
            )}
          </FormWrap>
        )
      }
    },
    // {
    //   title: '售价上浮比(%)',
    //   dataIndex: 'settlePercent',
    //   valueType: 'text',
    //   hideInSearch: true,
    //   renderFormItem: (_, { record }) => <Input addonAfter="%" onBlur={() => {
    //     debounceFetcher({ record, recordList: dataSource })
    //   }} />,
    // },
    // {
    //   title: (
    //     <>
    //       集约价
    //       {/* <Tooltip placement="top" title="集约价最低=(批发供货价+配送费补贴) ÷（100%-集约分成比例-0.68%）">
    //         <QuestionCircleOutlined style={{ marginLeft: 4 }} />
    //       </Tooltip> */}
    //     </>
    //   ),
    //   dataIndex: 'price',
    //   valueType: 'text',
    //   hideInSearch: true,
    //   renderFormItem: (_, { record }) => <CusInput addonAfter={`元/${record.unit}`} onBlur={() => {
    //     debounceFetcher({ record, recordList: dataSource })
    //   }} />,
    // },
    // {
    //   title: '实际盈亏(元)',
    //   dataIndex: 'profit',
    //   valueType: 'text',
    //   hideInSearch: true,
    //   editable: false,
    // },
    {
      title: '是否指定配送补贴',
      dataIndex: 'isAppointSubsidy',
      valueType: 'text',
      hideInSearch: true,
      renderFormItem: (_, { record }) => <Checkbox.Group disabled={record?.fresh !== 0}><Checkbox value={1}>指定配送补贴</Checkbox></Checkbox.Group>,
    },
    {
      title: '运营中心配送费补贴',
      dataIndex: 'operationFixedPrice',
      valueType: 'text',
      hideInSearch: true,
      renderFormItem: (_, { record }) => {
        if (record.isAppointSubsidy.length) {
          return <CusInput onBlur={() => {
            debounceFetcher({ record, recordList: dataSource })
          }} />
        }
        return record.operationFixedPrice
      },
    },
    {
      title: '社区店配送费补贴',
      dataIndex: 'fixedPrice',
      valueType: 'text',
      hideInSearch: true,
      renderFormItem: (_, { record }) => {
        if (record.isAppointSubsidy.length) {
          return <CusInput onBlur={() => {
            debounceFetcher({ record, recordList: dataSource })
          }} />
        }
        return record.fixedPrice
      },
    },
    // {
    //   title: '社区店特殊补贴',
    //   dataIndex: 'subsidy',
    //   valueType: 'text',
    //   hideInSearch: true,
    //   width: 250,
    //   renderFormItem: (_, { record }) => {
    //     return <Subsidy onBlur={() => {
    //       debounceFetcher({ record, recordList: dataSource })
    //     }} orderProfit={record.orderProfit} />
    //   }
    // },
    {
      title: '集采箱规单位量',
      dataIndex: 'batchNumber',
      valueType: 'text',
      hideInSearch: true,
      editable: false,
      render: (_, record) => {
        return <span>{_}{record.unit}{!!record.wsUnit && `/${record.wsUnit}`}</span>
      }
    },
    {
      title: '单次起订量',
      dataIndex: 'minNum',
      valueType: 'text',
      hideInSearch: true,
      renderFormItem: (_, { record }) => {
        return (
          <FormWrap>
            {({ value, onChange }) => (
              <>
                <Input style={{ width: 130 }} addonAfter={record.unit} value={value} onChange={onChange} onBlur={() => {
                  debounceFetcher({ record, recordList: dataSource })
                }} />
                {record.batchNumber > 1 && !!record.wsUnit && value / record.batchNumber >= 1 && <div>({parseInt(value / record.batchNumber, 10)}{record.wsUnit})</div>}
              </>
            )}
          </FormWrap>
        )
      }
    },
    {
      title: '单次限订量',
      dataIndex: 'maxNum',
      valueType: 'text',
      hideInSearch: true,
      renderFormItem: (_, { record }) => {
        return (
          <FormWrap>
            {({ value, onChange }) => (
              <>
                <Input style={{ width: 130 }} addonAfter={record.unit} value={value} onChange={onChange} onBlur={() => {
                  debounceFetcher({ record, recordList: dataSource })
                }} />
                {record.batchNumber > 1 && !!record.wsUnit && value / record.batchNumber >= 1 && <div>({parseInt(value / record.batchNumber, 10)}{record.wsUnit})</div>}
              </>
            )}
          </FormWrap>
        )
      }
    },
    {
      title: '全款金额',
      dataIndex: 'totalPrice',
      valueType: 'text',
      hideInSearch: true,
      editable: false,
      render: (_) => <span style={{ color: 'red' }}>{_}元</span>,
    },
  ]

  const postData = (data) => {
    setEditableKeys(data.map(item => item.id));
    const arr = data.map(item => ({
      ...item,
      totalStockNum: parseInt(item.stockNum * 0.8, 10),
      minNum: item.batchNumber,
      maxNum: 100,
      price: amountTransform(item.price, '/'),
      fixedPrice: amountTransform(item.fixedPrice, '/'),
      operationFixedPrice: amountTransform(item.operationFixedPrice, '/'),
      settlePercent: amountTransform(item.settlePercent),
      wholesaleFreight: amountTransform(item.wholesaleFreight, '/'),
      wholesaleSupplyPrice: amountTransform(item.wholesaleSupplyPrice, '/'),
      profit: amountTransform(item.profit, '/'),
      orderProfit: 0,
      totalPrice: +new Big(item.price).div(100).times(item.wholesaleMinNum || 10),
      wholesaleFlowType: item.fresh === 1 ? 2 : 1,
      isAppointSubsidy: [],
      // subsidy: {
      //   a: item.orderAmount > 0 ? amountTransform(item.orderAmount, '/') : '',
      //   b: item.subsidy > 0 ? amountTransform(item.subsidy, '/') : '',
      // }
    }))

    if (data.length === 0) {
      message.error('该商品不存在或已下架')
    }

    if (isFirst.current && sku && data.length) {
      arr[0] = {
        ...arr[0],
        ladderData: sku.ladderSubsidy.length === 0 ? arr[0].ladderData : sku.ladderSubsidy,
        minNum: sku.minNum,
        maxNum: sku.maxNum,
        totalStockNum: sku.totalStockNum,
        price: amountTransform(sku.price, '/'),
        fixedPrice: amountTransform(sku.fixedPrice, '/'),
        operationFixedPrice: amountTransform(sku.operationFixedPrice, '/'),
        settlePercent: amountTransform(sku.settlePercent),
        wholesaleSupplyPrice: amountTransform(sku.wholesaleSupplyPrice, '/'),
        profit: amountTransform(sku.profit, '/'),
        orderProfit: amountTransform(wholesale?.orderProfit, '/'),
        totalPrice: +new Big(sku.price).div(100).times(sku.minNum || 10),
        wholesaleFlowType: wholesale?.wholesaleFlowType,
        isAppointSubsidy: sku?.isAppointSubsidy === 0 ? [] : [1],
        // subsidy: {
        //   a: wholesale?.orderAmount > 0 ? amountTransform(wholesale?.orderAmount, '/') : '',
        //   b: wholesale?.subsidy > 0 ? amountTransform(wholesale.subsidy, '/') : '',
        // }
      }
      setSelectedRowKeys([sku.skuId])
      setSelectData(arr);
      onSelect(arr);
      formRef.current.setFieldsValue({
        skuId: '',
      })
    } else {
      setSelectedRowKeys([])
      setSelectData([]);
      onSelect([]);
    }
    isFirst.current = false;
    setDataSource(arr)
    // return arr;
  }



  return (
    <EditableProTable
      postData={postData}
      columns={columns}
      rowKey="skuId"
      value={dataSource}
      params={{
        goodsState: 1,
        goodsVerifyState: 1,
        hasStock: 1,
        isGetWholesale: 1,
      }}
      scroll={{ x: 'max-content' }}
      controlled
      request={productList}
      formRef={formRef}
      search={{
        defaultCollapsed: true,
        optionRender: (searchConfig, formProps, dom) => [
          ...dom.reverse(),
        ],
      }}
      editable={{
        editableKeys,
        onValuesChange: (record, recordList) => {
          const findItem = dataSource.find(item => item.id === record.id);
          if (findItem.isAppointSubsidy.length !== record.isAppointSubsidy.length) {
            debounceFetcher({ record, recordList })
          }

          if (findItem.wholesaleFlowType !== record.wholesaleFlowType) {
            onSelect([record])
            setSelectData([record])
            setDataSource(recordList)
          }

        }
      }}
      pagination={{
        pageSize: 5,
        pageSizeOptions: [5, 10, 20, 50, 100]
      }}

      rowSelection={{
        hideSelectAll: true,
        type: 'radio',
        selectedRowKeys,
        getCheckboxProps:(record)=>{
          return {
            disabled: record.fresh === 2,
          }
        },
        // onChange: (_, val) => {
        //   console.log('_', _);
        //   onSelect(val)
        //   setSelectedRowKeys(val.map(item => item.skuId))
        // },
        onSelect: (record, selected) => {
          // if (selected) {
          //   if (selectedRowKeys.length === 10) {
          //     message.error('最多只能选择10个商品');
          //     return;
          //   }
          //   const arr = [...selectedRowKeys];
          //   arr.push(record.skuId);
          //   setSelectedRowKeys(arr);
          //   const datas = [...selectData];
          //   datas.push(record);
          //   setSelectData(datas);
          //   onSelect(datas);
          // } else {
          //   const arr = selectedRowKeys.filter(item => item !== record.skuId)
          //   setSelectedRowKeys(arr);
          //   const datas = selectData.filter(item => item.skuId !== record.skuId);
          //   setSelectData(datas);
          //   onSelect(datas);
          // }
          setSelectedRowKeys([record.skuId])
          setSelectData([record]);
          onSelect([record]);
          radioSelect([record])
        },
        fixed: true
      }}
      bordered
      recordCreatorProps={false}
      tableAlertRender={false}
      style={{ marginBottom: 20, width: '100%' }}
    />
  )
}

export default forwardRef(EditTable);