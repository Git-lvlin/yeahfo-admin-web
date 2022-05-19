import React, { useState, useEffect, useMemo } from 'react';
import { EditableProTable } from '@ant-design/pro-table';
import { Form } from 'antd';
import Upload from '@/components/upload';
import styles from './edit-table.less';
import debounce from 'lodash/debounce';
import * as api from '@/services/product-management/product-list';
import { amountTransform } from '@/utils/utils'
import Big from 'big.js';

Big.RM = 2;

export default function EditTable(props) {
  const { tableHead, tableData, setTableData, settleType, goodsSaleType, isSample, unit, wsUnit, ladderSwitch, operateType } = props;
  const [columns, setColumns] = useState([])
  const [editableKeys, setEditableKeys] = useState([])
  const [dataSource, setDataSource] = useState([]);
  const [form] = Form.useForm();

  useEffect(() => {
    const arr = [];
    tableHead.forEach((item, index) => {
      if (item) {
        arr.push({
          title: item,
          dataIndex: `spec${index + 1}`,
          editable: false,
        })
      }
    });

    setColumns([
      {
        title: '规格图片',
        dataIndex: 'imageUrl',
        editable: false,
        render: (_) => <img src={_} width="50" height="50" />,
        width: 100,
        // renderFormItem: () => <Upload disable maxCount={1} className={styles.upload} accept="image/*" />,
        // formItemProps: {
        //   rules: [{
        //     required: true,
        //     whitespace: true,
        //     message: '请上传规格图片',
        //   }],
        // }
      },
      ...arr,
      {
        title: `零售供货价`,
        dataIndex: 'retailSupplyPrice',
        editable: false,
        hideInTable: goodsSaleType === 1,
        render: _ => `${_}元/${unit}`
      },
      {
        title: `批发供货价`,
        dataIndex: 'wholesaleSupplyPrice',
        editable: false,
        hideInTable: goodsSaleType === 2,
        render: _ => `${_}元/${unit}`
      },
      {
        title: '集采箱规单位量',
        dataIndex: 'batchNumber',
        editable: false,
        hideInTable: goodsSaleType === 2,
        render: _ => `${_}${unit}/${wsUnit}`
      },
      {
        title: '最低批发量',
        dataIndex: 'wholesaleMinNum',
        editable: false,
        hideInTable: goodsSaleType === 2,
        render: _ => `${_}${unit}`
      },
      {
        title: `样品供货价`,
        dataIndex: 'sampleSupplyPrice',
        hideInTable: isSample !== 1,
        fieldProps: {
          addonAfter: `元/${unit}`
        }
      },
      {
        title: `样品价`,
        dataIndex: 'sampleSalePrice',
        hideInTable: isSample !== 1,
        fieldProps: {
          addonAfter: `元/${unit}`
        }
      },
      {
        title: '样品起售量',
        dataIndex: 'sampleMinNum',
        hideInTable: isSample !== 1,
        render: _ => `${_}${unit}`
      },
      {
        title: '样品限售量',
        dataIndex: 'sampleMaxNum',
        hideInTable: isSample !== 1,
        render: _ => `${_}${unit}`
      },
      {
        title: '样品是否包邮',
        dataIndex: 'sampleFreight',
        hideInTable: isSample !== 1,
        render: (_) => _ === 1 ? '包邮' : '不包邮',
        editable: false,
      },
      {
        title: '样品运费模板',
        dataIndex: 'sampleFreightId',
        render: (_) => _.label ? _.label : '_',
        hideInTable: isSample !== 1,
        editable: false,
      },
      {
        title: `${operateType === 2 ? '分享补贴价' : '秒约价'}`,
        dataIndex: 'salePrice',
        editable: settleType === 2,
        hideInTable: goodsSaleType === 1,
        fieldProps: {
          addonAfter: `元/${unit}`
        }
      },
      {
        title: `${operateType === 2 ? '分享补贴价上浮比例' : '秒约价上浮比例'}`,
        dataIndex: 'salePriceFloat',
        hideInTable: goodsSaleType === 1,
      },
      {
        title: `${operateType === 2 ? '分享补贴价平台盈亏' : '秒约价实际盈亏'}`,
        dataIndex: 'salePriceProfitLoss',
        editable: false,
        hideInTable: goodsSaleType === 1,
        render: _ => `${_}元/${unit}`
      },
      {
        title: `分享补贴价平台毛利`,
        dataIndex: 'tPlatformGain',
        editable: false,
        hideInTable: operateType !== 2,
        render: _ => `${_}元/${unit}`
      },
      {
        title: '店主补贴金额',
        dataIndex: 'operateGain',
        editable: false,
        hideInTable: operateType !== 2,
        render: _ => `${_}元/${unit}`
      },
      {
        title: '分享补贴店主占比',
        dataIndex: 'tStoreScale',
        hideInTable: operateType !== 2,
        fieldProps: {
          addonAfter: '%',
        }
      },
      {
        title: '分享补贴平台毛利占比',
        dataIndex: 'tPlatformScale',
        hideInTable: operateType !== 2,
        fieldProps: {
          addonAfter: '%',
          placeholder: '不低于5%'
        },
      },
      {
        title: '分享补贴运营中心占比',
        dataIndex: 'tOperateScale',
        editable: false,
        hideInTable: operateType !== 2,
        render: _ => `${_}%`,
      },
      {
        title: '分享补贴供应商占比',
        dataIndex: 'tSupplierScale',
        editable: false,
        hideInTable: operateType !== 2,
        render: _ => `${_}%`,
      },
      {
        title: '市场价',
        dataIndex: 'marketPrice',
        fieldProps: {
          addonAfter: `元/${unit}`
        }
      },
      {
        title: '库存预警值',
        dataIndex: 'stockAlarmNum',
        editable: false,
        render: _ => `${_}${unit}`
      },
      {
        title: '可用库存',
        dataIndex: 'stockNum',
        editable: false,
        render: _ => `${_}${unit}`
        // formItemProps: {
        //   rules: [{
        //     required: true,
        //     whitespace: true,
        //     message: '请输入可用库存',
        //   }],
        // }
      },
      {
        title: '平均运费',
        dataIndex: 'wholesaleFreight',
        hideInTable: goodsSaleType === 2,
        editable: false,
        render: _ => `${_}元/${unit}`
      },
      {
        title: '是否包邮',
        dataIndex: 'isFreeFreight',
        render: (_) => _ === 1 ? '包邮' : '不包邮',
        hideInTable: goodsSaleType === 1,
        editable: false,
      },
      {
        title: '运费模板',
        dataIndex: 'freightTemplateId',
        render: (_) => _.label ? _.label : '_',
        hideInTable: goodsSaleType === 1,
        editable: false,
      },
      {
        title: '阶梯优惠',
        dataIndex: 'stage1',
        render: (_, record) => {
          return _ !== '-' ? <>
            <div style={{ display: 'flex', marginBottom: 10, alignItems: 'center' }
            }>
              {_.wsStart}
              —
              {_.wsEnd}
              {unit}时，
              {_.wsSupplyPrice}元 / {unit}
            </div >
            {record.batchNumber > 1 && <div>{parseInt(_.wsStart / record.batchNumber, 10)}—{parseInt(_.wsEnd / record.batchNumber, 10)}{wsUnit}时，{+new Big(_.wsSupplyPrice).times(record.batchNumber).toFixed(2)}元/{wsUnit}</div>}
          </> : '-'
        },
        editable: false,
        hideInTable: goodsSaleType === 2,
      },
      {
        title: '最高阶梯优惠',
        dataIndex: 'stage2',
        render: (_, record) => {
          return _ !== '-' ? <>
            <div style={{ display: 'flex', marginBottom: 10, alignItems: 'center' }}>
              {record.stage1.wsEnd + 1}
              {unit}及以上时，
              {_.wsSupplyPrice}元/{unit}
            </div>
            {record.batchNumber > 1 && <div>{parseInt((record.stage1.wsEnd + 1) / record.batchNumber, 10)}{wsUnit}及以上时，{+new Big(_.wsSupplyPrice).times(record.batchNumber).toFixed(2)}元/{wsUnit}</div>}
          </> : '-'
        },
        editable: false,
        hideInTable: goodsSaleType === 2,
      },
      // {
      //   title: '操作',
      //   valueType: 'option',
      //   render: () => {
      //     return null;
      //   },
      //   width: 50
      // },
    ])

  }, [tableHead, settleType, operateType])

  const debounceFetcher = useMemo(() => {
    const loadData = (value) => {
      const { record } = value;

      let { recordList } = value

      const findItem = dataSource.find(item => item.skuId === record.skuId);
      const obj = {
        skuId: findItem.skuId,
        retailSupplyPrice: amountTransform(findItem.retailSupplyPrice),
        wholesaleTaxRate: props.wholesaleTaxRate,
        operateType,
      }
      if (findItem.salePrice !== record.salePrice || findItem.tPlatformScale !== record.tPlatformScale || findItem.tStoreScale !== record.tStoreScale) {
        obj.salePrice = amountTransform(record.salePrice);

        if (findItem.salePrice !== record.salePrice) {
          recordList = recordList.map(item => {
            if (item.skuId === findItem.skuId) {
              return {
                ...item,
                tStoreScale: '',
                tPlatformScale: '',
                tSupplierScale: +new Big(item.retailSupplyPrice).div(item.salePrice).times(100).toFixed(2)
              }
            }
            return item;
          })
        }

      }

      if (findItem.salePriceFloat !== record.salePriceFloat) {
        obj.salePriceFloat = amountTransform(record.salePriceFloat, '/');
      }

      if (operateType === 2) {
        obj.tStoreScale = amountTransform(record.tStoreScale, '/')
        obj.tOperateScale = amountTransform(record.tOperateScale, '/')
        obj.tPlatformScale = amountTransform(record.tPlatformScale, '/')
        if (record.tStoreScale !== findItem.tStoreScale) {
          recordList = recordList.map(item => {
            if (item.skuId === findItem.skuId) {
              const s = +new Big(100).minus(item.tSupplierScale).minus(item.tOperateScale).minus(item.tStoreScale || 0).toFixed(2)
              obj.tPlatformScale = amountTransform(s, '/')
              return {
                ...item,
                tPlatformScale: s
              }
            }

            return item;

          })
        }

        if (record.tPlatformScale !== findItem.tPlatformScale) {
          recordList = recordList.map(item => {
            if (item.skuId === findItem.skuId) {
              const s = +new Big(100).minus(item.tSupplierScale).minus(item.tPlatformScale).minus(item.tOperateScale || 0).toFixed(2);
              obj.tStoreScale = amountTransform(s, '/')
              return {
                ...item,
                tStoreScale: s
              }
            }
            return item;
          })
        }
      }

      setDataSource(recordList)
      setTableData(recordList)

      if (
        (findItem.salePrice !== record.salePrice || findItem.salePriceFloat !== record.salePriceFloat || findItem.tStoreScale !== record.tStoreScale || findItem.tPlatformScale !== record.tPlatformScale)
        && goodsSaleType !== 1
        && (record.salePrice !== '' && record.salePriceFloat !== '')
      ) {
        api.subAccountCheck(obj).then(res => {
          if (res.code === 0) {
            const skuData = res.data[0];
            const arr = recordList.map(item => {
              if (item.skuId === record.skuId) {
                let data = {
                  ...item,
                  salePrice: amountTransform(skuData.salePrice, '/'),
                  salePriceProfitLoss: amountTransform(skuData.salePriceProfitLoss, '/'),
                  salePriceFloat: amountTransform(skuData.salePriceFloat),
                }

                if (findItem.salePriceFloat !== record.salePriceFloat) {
                  data = {
                    ...data,
                    tStoreScale: '',
                    tPlatformScale: '',
                    tSupplierScale: +new Big(amountTransform(data.retailSupplyPrice, '/')).div(data.salePrice).times(100).toFixed(2)
                  }
                }
                return data
              }
              return item
            })
            setDataSource(arr)
            setTableData(arr)
          }
        })
      }
    };
    return debounce(loadData, 1000);
  }, [dataSource, props, operateType]);


  useEffect(() => {
    setEditableKeys(tableData.map(item => item.key));
    setDataSource(tableData);
  }, [tableData])

  return (
    <EditableProTable
      columns={columns}
      rowKey="key"
      value={dataSource}
      editable={{
        editableKeys,
        actionRender: (row, config, defaultDoms) => {
          return [defaultDoms.delete];
        },
        onValuesChange: (record, recordList) => {
          debounceFetcher({ record, recordList })
        }
      }}
      controlled
      scroll={{ x: 'max-content' }}
      bordered
      recordCreatorProps={false}
      style={{ marginBottom: 20 }}
    />
  )
}
