import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Button, Form, Input, message, Modal, Table } from 'antd';
import {
  DrawerForm,
  ProFormText,
  ProFormRadio,
  ProFormTextArea,
  ProFormDependency,
  ProFormSelect,
} from '@ant-design/pro-form';
import Upload from '@/components/upload'
import { uploadImageFormatConversion, amountTransform } from '@/utils/utils'
import { EyeOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import * as api1 from '@/services/product-management/product-list';
import * as api2 from '@/services/product-management/product-list-purchase';
import styles from './edit.less'
import FormModal from './form';
import EditTable from './edit-table';
import GcCascader from '@/components/gc-cascader'
import BrandSelect from '@/components/brand-select'
import debounce from 'lodash/debounce';
import ImageSort from './image-sort';
import Look from '@/components/look';
import FreightTemplateSelect from '@/components/freight-template-select'
import { useLocation } from 'umi';
import { preAccountCheck, preAccountShow } from '@/services/product-management/product-list';
import ProfitTable from './profit-table';
import Big from 'big.js';

Big.RM = 2;


const { confirm } = Modal

const FromWrap = ({ value, onChange, content, right }) => (
  <div style={{ display: 'flex' }}>
    <div>{content(value, onChange)}</div>
    <div style={{ flex: 1, marginLeft: 10, minWidth: 180 }}>{right(value)}</div>
  </div>
)

const PlatformScale = 0.005

export default (props) => {
  const { visible, setVisible, detailData, callback, onClose } = props;
  const [formModalVisible, setFormModalVisible] = useState(false);
  const [tableHead, setTableHead] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [salePriceProfitLoss, setSalePriceProfitLoss] = useState(null);
  const [salePriceFloat, setSalePriceFloat] = useState(0);
  const [platformGain, setPlatformGain] = useState(0);
  const [operateGain, setOperateGain] = useState(0);
  const [storeGain, setStoreGain] = useState(0);
  const [preferential, setPreferential] = useState(0);
  const [lookVisible, setLookVisible] = useState(false);
  const [lookData, setLookData] = useState(false);
  const [form] = Form.useForm()
  const isPurchase = useLocation().pathname.includes('purchase')
  const api = isPurchase ? api2 : api1
  const isLossMoney = useRef(false);
  let goods = {};
  if (detailData) {
    goods = detailData.goods;
  }
  const formItemLayout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 18 },
    layout: {
      labelCol: {
        span: 4,
      },
      wrapperCol: {
        span: 14,
      },
    }
  };

  const urlsTransform = (urls) => {
    return urls.map((item, index) => {
      return {
        imageUrl: item,
        imageSort: index,
      }
    })
  }

  const submit = (values) => {
    const {
      videoUrl,
      gcId,
      primaryImages,
      detailImages,
      // advImages,
      isMultiSpec,
      // wholesalePrice,
      retailSupplyPrice,
      // suggestedRetailPrice,
      salePrice,
      marketPrice,
      freightTemplateId,
      sampleFreightId,
      wholesaleFreight,
      wholesaleTaxRate,
      wholesaleSupplyPrice,
      salePriceFloat,
      supplierHelperId,
      isFreeFreight,
      sampleSalePrice,
      sampleSupplyPrice,
      operateType,
      profit,
      ...rest } = values;
    const { specValues1, specValues2 } = form.getFieldsValue(['specValues1', 'specValues2']);
    const specName = {};
    const specValues = {};
    const specData = {};
    tableHead.forEach((item, index) => {
      if (item) {
        specName[index + 1] = item;
        if (!specValues[index + 1]) {
          specValues[index + 1] = {};
        }
        [specValues1, specValues2][index].forEach((item2, index2) => {
          specValues[index + 1][`${index + 1}0${index2 + 1}`] = item2.name
        })
      }
    })

    // let errorMsg = '';

    tableData.forEach(item => {
      const {
        code,
        key,
        spec1,
        spec2,
        specValue,
        retailSupplyPrice: retailSupplyPrices,
        salePriceProfitLoss: salePriceProfitLosss,
        salePriceFloat: salePriceFloats,
        salePrice: salePrices,
        wholesaleSupplyPrice: wholesaleSupplyPrices,
        sampleSupplyPrice: sampleSupplyPrices,
        sampleSalePrice: sampleSalePrices,
        wholesaleFreight: wholesaleFreights,
        isFreeFreight: isFreeFreights,
        freightTemplateId: freightTemplateIds,
        sampleFreightId: sampleFreightIds,
        ...rests
      } = item;
      const obj = {};

      if (goods.goodsSaleType !== 1) {
        obj.retailSupplyPrice = amountTransform(retailSupplyPrices)
        obj.salePriceProfitLoss = amountTransform(salePriceProfitLosss)
        obj.salePrice = amountTransform(salePrices)
        obj.salePriceFloat = amountTransform(salePriceFloats, '/')
      }

      if (goods.goodsSaleType !== 2) {
        obj.wholesaleSupplyPrice = amountTransform(wholesaleSupplyPrices)
      }

      if (operateType === 2) {
        obj.tStoreScale = amountTransform(item.tStoreScale, '/')
        obj.tOperateScale = amountTransform(item.tOperateScale, '/')
        obj.tPlatformScale = amountTransform(item.tPlatformScale, '/')
        obj.tSupplierScale = amountTransform(item.tSupplierScale, '/')
      }

      // if (wholesaleFreights) {
      // }
      obj.wholesaleFreight = amountTransform(wholesaleFreights)

      if (isFreeFreights || isFreeFreights === 0) {
        obj.isFreeFreight = isFreeFreights
      }
      if (freightTemplateIds) {
        obj.freightTemplateId = freightTemplateIds.value;
        obj.freightTemplateName = freightTemplateIds.label;
      }

      if (sampleFreightIds) {
        obj.sampleFreightId = sampleFreightIds.value;
        obj.sampleFreightName = sampleFreightIds.label;
      }

      if (sampleSupplyPrices) {
        obj.sampleSupplyPrice = amountTransform(sampleSupplyPrices)
      }

      if (sampleSalePrices) {
        obj.sampleSalePrice = amountTransform(sampleSalePrices)
      }

      specData[code] = {
        ...rests,
        specValue,
        imageUrl: item?.imageUrl,
        marketPrice: amountTransform(item.marketPrice),
        ...obj,
      }

      // if (item.retailSupplyPrice > item.salePrice || item.retailSupplyPrice > item.marketPrice) {
      //   errorMsg = '秒约价和市场价不能小于供货价';
      // }
    })

    // if (errorMsg) {
    //   message.error(errorMsg);
    //   reject();
    // }

    const obj = {
      isMultiSpec,
      supplierHelperId,
      goods: {
        ...rest,
        gcId1: gcId[0],
        gcId2: gcId[1],
        wholesaleFreight: amountTransform(wholesaleFreight),
        wholesaleTaxRate: amountTransform(wholesaleTaxRate, '/'),
        goodsSaleType: goods.goodsSaleType,
        skuName: goods.skuName,
        operateType,
      },
      isLossMoney: isLossMoney.current ? 1 : 0,
      primaryImages: urlsTransform(primaryImages),
      detailImages: urlsTransform(detailImages),
      // advImages: advImages?.length ? urlsTransform(advImages) : null,
      videoUrl: detailData?.videoUrl,
      shipAddrs: detailData?.shipAddrs?.map?.(item => ({ shipId: item.shipId }))
    };

    if (isMultiSpec) {
      obj.specName = specName;
      obj.specValues = specValues;
      obj.specData = specData;
    } else {
      if (goods.goodsSaleType !== 1) {
        obj.goods.retailSupplyPrice = amountTransform(retailSupplyPrice);
        obj.goods.salePriceProfitLoss = amountTransform(salePriceProfitLoss);
        obj.goods.salePrice = amountTransform(salePrice);
        obj.goods.salePriceFloat = amountTransform(salePriceFloat, '/');
        obj.goods.isFreeFreight = isFreeFreight;

        if (freightTemplateId) {
          obj.goods.freightTemplateId = freightTemplateId.value;
          obj.goods.freightTemplateName = freightTemplateId.label;
        }
      }

      if (goods.goodsSaleType !== 2) {
        obj.goods.wholesaleSupplyPrice = amountTransform(wholesaleSupplyPrice);
        obj.goods.wholesaleFreight = amountTransform(wholesaleFreight)
      }

      if (sampleFreightId) {
        obj.goods.sampleFreightId = sampleFreightId.value;
        obj.goods.sampleFreightName = sampleFreightId.label;
      }

      if (sampleSupplyPrice) {
        obj.goods.sampleSupplyPrice = amountTransform(sampleSupplyPrice);
      }
      if (sampleSalePrice) {
        obj.goods.sampleSalePrice = amountTransform(sampleSalePrice);
      }

      obj.goods.marketPrice = amountTransform(marketPrice);
      obj.goods.ladderData = goods.ladderData;

      if (operateType === 2) {
        obj.goods.tStoreScale = amountTransform(profit[0].tStoreScale, '/')
        obj.goods.tOperateScale = amountTransform(profit[0].tOperateScale, '/')
        obj.goods.tPlatformScale = amountTransform(profit[0].tPlatformScale, '/')
        obj.goods.tSupplierScale = amountTransform(profit[0].tSupplierScale, '/')
      }

      // if (retailSupplyPrice > salePrice || retailSupplyPrice > marketPrice) {
      //   message.error('秒约价和市场价不能小于供货价');
      //   reject();
      // }
    }

    if (detailData) {
      obj.supplierId = detailData.supplierId
      obj.storeNo = detailData.storeNo
      obj.goodsFromType = detailData.goodsFromType
      obj.spuId = detailData.spuId
      obj.goods.skuId = goods.skuId
    }

    return new Promise((resolve, reject) => {
      const apiMethod = detailData ? api.editGoods : api.addGoods
      apiMethod(obj, { showSuccess: true, showError: true, paramsUndefinedToEmpty: true }).then(res => {
        if (res.code === 0) {
          resolve();
          callback();
        } else {
          reject();
        }
      })
    });
  }

  const createEditTableData = (data) => {
    const { specName1, specName2, specValues1, specValues2 } = form.getFieldsValue(['specName1', 'specName2', 'specValues1', 'specValues2']);
    const specArr = [];
    specValues1.forEach((item, index) => {
      if (specValues2[0].name) {
        specValues2.forEach((item2, index2) => {
          specArr.push({
            ...data,
            skuId: 0,
            spec1: item.name,
            spec2: item2.name,
            key: `${index}-${index2}`,
            specValue: {
              1: `10${index + 1}`,
              2: `20${index2 + 1}`,
            },
            code: `i10${index + 1}|20${index2 + 1}`
          })
        })
      } else {
        specArr.push({
          ...data,
          skuId: 0,
          spec1: item.name,
          key: index,
          specValue: {
            1: `10${index + 1}`,
          },
          code: `i10${index + 1}`
        })
      }

    })
    setTableHead([specName1, specName2])
    setTableData([])
    setTimeout(() => {
      setTableData(specArr)
    })
  }

  const settleTypeChange = (e) => {
    if (e.target.value === 1) {
      form.setFieldsValue({
        salePrice: amountTransform(goods.retailSupplyPrice, '/'),
      })
    } else {
      form.setFieldsValue({
        salePrice: amountTransform(goods.salePrice || goods.retailSupplyPrice, '/'),
      })
    }
  }

  const subAccountCheck = (params, cb) => {
    api.subAccountCheck({
      skuId: goods.skuId,
      retailSupplyPrice: goods.retailSupplyPrice,
      wholesaleTaxRate: goods.wholesaleTaxRate,
      // wholesaleTaxRate: 0.01,
      ...params,
    }).then(res => {
      if (res.code === 0) {
        cb(res.data[0])
      }
    })
  }

  const preAccountCheckRequest = ({ operateType, skuId, salePrice, salePriceFloat, retailSupplyPrice, wholesaleTaxRate, cb, options = {} }) => {
    if (goods.goodsSaleType === 1) {
      return;
    }
    preAccountCheck({
      spuId: detailData.spuId,
      skuId,
      retailSupplyPrice,
      wholesaleTaxRate,
      salePrice,
      salePriceFloat,
      operateType
    }, { ...options }).then(res => {
      if (res.code === 0) {
        cb && cb(res.data[0])
      } else {
        cb && cb({ salePriceFloat: -1, preferential })
      }
    })
  }

  const salePriceChange = useMemo(() => {
    const loadData = (e, operateType, profit) => {
      let obj = {};
      if (operateType === 2 && profit) {
        obj = {
          tStoreScale: amountTransform(profit.tStoreScale, '/'),
          tOperateScale: amountTransform(profit.tOperateScale, '/'),
          tPlatformScale: amountTransform(profit.tPlatformScale, '/'),
        }
      }

      if (operateType === 2 && !profit) {
        form.setFieldsValue({
          profit: [{
            tStoreScale: '',
            tPlatformScale: '',
            tOperateScale: amountTransform(PlatformScale),
            tSupplierScale: +new Big(amountTransform(goods.retailSupplyPrice, '/')).div(+e.target.value).times(100).toFixed(2),
            e: 100,
            key: 1,
          }]
        })
      }

      subAccountCheck({
        salePrice: amountTransform(e.target.value),
        operateType,
        ...obj,
      }, (data) => {
        preAccountCheckRequest({
          skuId: data.skuId,
          salePrice: data.salePrice,
          salePriceFloat: data.salePriceFloat,
          retailSupplyPrice: goods.retailSupplyPrice,
          wholesaleTaxRate: goods.wholesaleTaxRate,
          operateType,
          cb: (d) => {
            setSalePriceFloat(d.salePriceFloat)
            setPreferential(d.preferential)
          }
        })
        form.setFieldsValue({
          salePriceFloat: amountTransform(data.salePriceFloat),
        })
        setSalePriceProfitLoss(amountTransform(data.salePriceProfitLoss, '/'))
        setPlatformGain(amountTransform(data.tPlatformGain, '/'))
        setStoreGain(amountTransform(data.tStoreGain, '/'))
        setOperateGain(amountTransform(data.tOperateGain, '/'))
        if (data.id) {
          form.setFieldsValue({
            profit: [{
              tStoreScale: amountTransform(data.tStoreScale),
              tOperateScale: amountTransform(data.tOperateScale),
              tPlatformScale: amountTransform(data.tPlatformScale),
              tSupplierScale: amountTransform(data.tSupplierScale),
              e: 100,
              key: 1,
            }]
          })
        }
      })
    }
    return debounce(loadData, 500);
  }, [])

  const salePriceFloatChange = useMemo(() => {
    const loadData = (e, operateType, profit) => {
      subAccountCheck({
        salePriceFloat: amountTransform(e.target.value, '/'),
        operateType,
      }, (data) => {
        preAccountCheckRequest({
          operateType,
          skuId: data.skuId,
          salePrice: data.salePrice,
          salePriceFloat: data.salePriceFloat,
          retailSupplyPrice: goods.retailSupplyPrice,
          wholesaleTaxRate: goods.wholesaleTaxRate,
          cb: (d) => {
            setSalePriceFloat(d.salePriceFloat)
            setPreferential(d.preferential)
          }
        })
        form.setFieldsValue({
          salePrice: amountTransform(data.salePrice, '/'),
        })
        setSalePriceProfitLoss(amountTransform(data.salePriceProfitLoss, '/'))
        setPlatformGain(amountTransform(data.tPlatformGain, '/'))
        setStoreGain(amountTransform(data.tStoreGain, '/'))
        setOperateGain(amountTransform(data.tOperateGain, '/'))
        if (operateType === 2 && !profit) {
          form.setFieldsValue({
            profit: [{
              tStoreScale: '',
              tPlatformScale: '',
              tOperateScale: amountTransform(PlatformScale),
              tSupplierScale: +new Big(amountTransform(goods.retailSupplyPrice, '/')).div(amountTransform(data.salePrice, '/')).times(100).toFixed(2),
              e: 100,
              key: 1,
            }]
          })
        }
      })
    }
    return debounce(loadData, 1000);
  }, [])

  const submitConfirm = ({ operateType }) => {
    isLossMoney.current = false;
    return new Promise((resolve, reject) => {
      if (goods.goodsSaleType === 1) {
        resolve()
        return;
      }

      if (detailData.isMultiSpec === 0) {
        if (salePriceFloat >= 0) {
          resolve()
          return;
        }

        if (preferential === 0) {
          resolve()
          return;
        }

        isLossMoney.current = true

        confirm({
          icon: <ExclamationCircleOutlined />,
          content: <span style={{ color: 'red' }}>秒约价导致平台亏损,确认要修改吗</span>,
          onOk() {
            resolve()
          },
          onCancel() {
            reject()
          },
        });
      } else {
        if (tableData.length) {
          const arr = [];
          tableData.forEach(item => {
            preAccountCheckRequest({
              operateType,
              skuId: item.skuId,
              salePrice: amountTransform(item.salePrice),
              salePriceFloat: amountTransform(item.salePriceFloat, '/'),
              retailSupplyPrice: amountTransform(item.retailSupplyPrice),
              wholesaleTaxRate: amountTransform(item.wholesaleTaxRate, '/'),
              cb: (data) => {
                arr.push(data.salePriceFloat);
                const flag = arr.some(v => v < 0)

                if (arr.length === tableData.length) {
                  if (flag) {
                    isLossMoney.current = true
                    confirm({
                      icon: <ExclamationCircleOutlined />,
                      content: <span style={{ color: 'red' }}>秒约价导致平台亏损,确认要修改吗</span>,
                      onOk() {
                        resolve()
                      },
                      onCancel() {
                        reject()
                      },
                    });
                  } else {
                    resolve()
                  }
                }
              }
            })
          })
        } else {
          resolve()
        }
      }

    });
  }

  const shareProfitCheck = ({ operateType, profit, salePrice }) => {
    return new Promise((resolve, reject) => {
      if (goods.goodsSaleType === 1) {
        resolve()
        return;
      }

      if (operateType === 2) {
        if (detailData.isMultiSpec === 0) {
          const { tStoreScale, tPlatformScale } = profit[0]
          const retailSupplyPrice = +new Big(amountTransform(goods.retailSupplyPrice, '/')).div(0.94).toFixed(2)

          if (+salePrice < retailSupplyPrice) {
            message.error(`分享补贴价必须大于${retailSupplyPrice}`)
          }

          if (+tStoreScale < 0.01) {
            message.error('店主补贴占比必须大于等于0.01%')
            reject()
            return
          }
          if (+tPlatformScale < 5) {
            message.error('平台毛利占比必须大于等于5%')
            reject()
            return
          }
        } else {
          if (tableData.length) {
            for (let index = 0; index < tableData.length; index++) {
              const retailSupplyPrice = +new Big(tableData[index].retailSupplyPrice).div(0.94).toFixed(2)

              if (+tableData[index].salePrice < retailSupplyPrice) {
                message.error(`分享补贴价必须大于${retailSupplyPrice}`)
                reject()
                return
              }
              if (+tableData[index].tStoreScale < 0.01) {
                message.error('店主补贴占比必须大于等于0.01%')
                reject()
                return
              }
              if (+tableData[index].tPlatformScale < 5) {
                message.error('平台毛利占比必须大于等于5%')
                reject()
                return
              }
            }
          }
        }
      }

      resolve()
    });
  }

  useEffect(() => {
    if (detailData) {
      const { specName, specValues, specData, freightTemplateId, freightTemplateName, settleType } = detailData;
      form.setFieldsValue({
        goodsName: goods.goodsName,
        goodsDesc: goods.goodsDesc,
        supplierSpuId: goods.supplierSpuId,
        supplierSkuId: goods.supplierSkuId,
        goodsKeywords: goods.goodsKeywords,
        goodsSaleType: goods.goodsSaleType,
        isFreeFreight: goods.isFreeFreight,
        isMultiSpec: detailData.isMultiSpec,
        stockNum: goods.stockNum,
        stockAlarmNum: goods.stockAlarmNum,
        freightTemplateId: +goods.freightTemplateId,
        // wholesaleMinNum: goods.wholesaleMinNum,
        // supportNoReasonReturn: goods.supportNoReasonReturn,
        buyMinNum: goods.buyMinNum,
        buyMaxNum: goods.buyMaxNum,
        goodsRemark: goods.goodsRemark,
        primaryImages: uploadImageFormatConversion(detailData.primaryImages, 'imageUrl'),
        detailImages: uploadImageFormatConversion(detailData.detailImages, 'imageUrl'),
        // advImages: uploadImageFormatConversion(detailData.advImages, 'imageUrl'),
        videoUrl: goods.videoUrl,
        brandId: goods.brandId === 0 ? null : goods.brandId,
        settleType: settleType || 1,
        gcId: [goods.gcId1, goods.gcId2],
        wholesaleFreight: amountTransform(goods.wholesaleFreight, '/'),
        wholesaleTaxRate: amountTransform(goods.wholesaleTaxRate),
        supplierHelperId: !detailData.supplierHelperId ? null : detailData.supplierHelperId,
        batchNumber: goods.batchNumber,
        unit: goods.unit,
        wsUnit: goods.wsUnit || '箱',
        totalStock: goods.totalStock,
        isDrainage: goods.isDrainage,
        isSample: goods.isSample,
        sampleFreight: goods.sampleFreight,
        goodsVirtualSaleNum: goods.goodsVirtualSaleNum,
        showOn: goods.showOn,
        operateType: goods.operateType,
      })

      if (freightTemplateId && freightTemplateName) {
        form.setFieldsValue({
          freightTemplateId: { label: freightTemplateName, value: freightTemplateId }
        })
      }

      if (goods.sampleFreightId && goods.sampleFreightName) {
        form.setFieldsValue({
          sampleFreightId: { label: goods.sampleFreightName, value: goods.sampleFreightId }
        })
      }

      if (detailData.isMultiSpec) {
        form.setFieldsValue({
          specName1: specName['1'],
          specValues1: Object.values(specValues['1']).map(item => ({ name: item })),
        })

        if (specName['2']) {
          form.setFieldsValue({
            specName2: specName['2'],
            specValues2: Object.values(specValues['2']).map(item => ({ name: item })),
          })
        }

        const specValuesMap = {};
        Object.values(specValues).forEach(element => {
          const obj = Object.entries(element);
          obj.forEach(item => {
            // eslint-disable-next-line prefer-destructuring
            specValuesMap[item[0]] = item[1];
          })

        });
        setTableHead(Object.values(specName))
        setTableData(Object.entries(specData).map(item => {
          const specDataKeys = item[0].substring(1).split('|');
          const specValue = {};
          specDataKeys.forEach(it => {
            const index = it.slice(0, 1)
            specValue[index] = it
          })

          const obj = {
            stage1: null,
            stage2: null,
          };
          const ladderData = item[1]?.ladderData;
          if (ladderData?.['1']) {
            obj.stage1 = {
              wsStart: ladderData['1'].wsStart,
              wsEnd: ladderData['1'].wsEnd,
              wsSupplyPrice: ladderData['1'].wsSupplyPrice / 100,
            }

            obj.stage2 = {
              wsStart: ladderData['2'].wsStart,
              wsEnd: ladderData['2'].wsEnd,
              wsSupplyPrice: ladderData['2'].wsSupplyPrice / 100,
            }
          }
          return {
            ...item[1],
            code: item[0],
            retailSupplyPrice: amountTransform(item[1].retailSupplyPrice, '/'),
            wholesaleSupplyPrice: amountTransform(item[1].wholesaleSupplyPrice, '/'),
            wholesaleMinNum: item[1].wholesaleMinNum,
            salePriceFloat: amountTransform(item[1].salePriceFloat),
            salePriceProfitLoss: amountTransform(item[1].salePriceProfitLoss, '/'),
            sampleSupplyPrice: amountTransform(item[1].sampleSupplyPrice, '/'),
            sampleSalePrice: amountTransform(item[1].sampleSalePrice, '/'),
            // suggestedRetailPrice: amountTransform(item[1].suggestedRetailPrice, '/'),
            // wholesalePrice: amountTransform(item[1].wholesalePrice, '/'),
            salePrice: amountTransform((settleType === 1 || settleType === 0) ? item[1].retailSupplyPrice : item[1].salePrice, '/'),
            marketPrice: amountTransform(item[1].marketPrice, '/'),
            wholesaleFreight: amountTransform(item[1].wholesaleFreight, '/'),
            operateGain: amountTransform(item[1].operateGain, '/'),
            tPlatformGain: amountTransform(item[1].tPlatformGain, '/'),
            // batchNumber: item[1].batchNumber,
            // isFreeFreight: item[1].isFreeFreight,
            freightTemplateId: item[1]?.freightTemplateId !== 0 ? { label: item[1]?.freightTemplateName, value: item[1]?.freightTemplateId } : undefined,
            sampleFreightId: item[1]?.sampleFreightId !== 0 ? { label: item[1]?.sampleFreightName, value: item[1]?.sampleFreightId } : undefined,
            key: item[1].skuId,
            imageUrl: item[1].imageUrl,
            spec1: specValuesMap[specDataKeys[0]],
            spec2: specValuesMap[specDataKeys[1]],
            specValue,
            tStoreScale: amountTransform(item[1].tStoreScale) || '',
            tPlatformScale: amountTransform(item[1].tPlatformScale) || '',
            tOperateScale: amountTransform(PlatformScale),
            tSupplierScale: item[1].salePrice ? +new Big(amountTransform(item[1].retailSupplyPrice, '/')).div(amountTransform(item[1].salePrice, '/')).times(100).toFixed(2) : '',
            ...obj,
          }
        }))
        preAccountShow({
          spuId: detailData.spuId,
        }, {
          showError: false,
        }).then(res => {
          if (res.code === 0) {
            setPreferential(res.data.saveMoney)
          }
        })
      } else {
        form.setFieldsValue({
          // wholesalePrice: amountTransform(goods.wholesalePrice, '/'),
          retailSupplyPrice: amountTransform(goods.retailSupplyPrice, '/'),
          sampleSupplyPrice: amountTransform(goods.sampleSupplyPrice, '/'),
          sampleSalePrice: amountTransform(goods.sampleSalePrice, '/'),
          // suggestedRetailPrice: amountTransform(goods.suggestedRetailPrice, '/'),
          salePrice: amountTransform((settleType === 1 || settleType === 0) ? goods.retailSupplyPrice : goods.salePrice, '/'),
          marketPrice: amountTransform(goods.marketPrice, '/'),
          wholesaleSupplyPrice: amountTransform(goods.wholesaleSupplyPrice, '/'),
          wholesaleMinNum: goods.wholesaleMinNum,
          salePriceFloat: amountTransform(goods.salePriceFloat),
          sampleMinNum: goods.sampleMinNum,
          sampleMaxNum: goods.sampleMaxNum,
        })

        if (goods.salePrice) {
          form.setFieldsValue({
            profit: [{
              tStoreScale: amountTransform(goods.tStoreScale) || '',
              tPlatformScale: amountTransform(goods.tPlatformScale) || '',
              tOperateScale: amountTransform(PlatformScale),
              tSupplierScale: +new Big(amountTransform(goods.retailSupplyPrice, '/')).div(amountTransform(goods.salePrice, '/')).times(100).toFixed(2),
              e: 100,
              key: 1,
            }]
          })
        }

        setPlatformGain(amountTransform(goods.tPlatformGain, '/'))
        setStoreGain(amountTransform(goods.tStoreGain, '/'))
        setOperateGain(amountTransform(goods.tOperateGain, '/'))
        setSalePriceProfitLoss(amountTransform(goods.salePriceProfitLoss, '/'))

        preAccountCheckRequest({
          skuId: goods.skuId,
          salePrice: goods.salePrice,
          salePriceFloat: goods.salePriceFloat,
          retailSupplyPrice: goods.retailSupplyPrice,
          wholesaleTaxRate: goods.wholesaleTaxRate,
          cb: (d) => {
            setSalePriceFloat(d.salePriceFloat)
            setPreferential(d.preferential)
          },
          options: {
            showError: false,
          }
        })
      }
    }

  }, [form, detailData]);

  return (
    <DrawerForm
      title={<>{`${detailData ? '编辑' : '新建'}商品`}<span style={{ color: 'red', fontSize: 12, marginLeft: 10 }}>{detailData?.alarmMsg}</span></>}
      onVisibleChange={setVisible}
      drawerProps={{
        forceRender: true,
        destroyOnClose: true,
        width: Math.max(1200, window.innerWidth - 300),
        className: styles.drawer_form,
        onClose: () => {
          onClose();
        },
        maskClosable: true,
      }}
      submitter={{
        render: (props, defaultDoms) => {
          return [
            ...defaultDoms,
            <Button
              key="look"
              onClick={(_) => {
                const d = form.getFieldsValue();
                if (d.primaryImages && d.detailImages) {
                  setLookData(d)
                  setLookVisible(true)
                } else if (detailData) {
                  setLookVisible(true)
                } else {
                  message.error('请上传图片后预览')
                }
              }}
            >
              预览
            </Button>,
          ];
        },
      }}
      form={form}
      onFinish={async (values) => {
        try {
          await submitConfirm(values);
          await shareProfitCheck(values);
          await submit(values);
          return true;
        } catch (error) {
          console.log('error', error);
        }
      }}
      visible={visible}
      initialValues={{
        isMultiSpec: 0,
        // goodsSaleType: 0,
        isFreeFreight: 1,
        buyMinNum: 1,
        buyMaxNum: 200,
        // supportNoReasonReturn: 1,
        specValues1: [{}],
        specValues2: [{}],
        wsUnit: '箱',
        unit: '件',
        showOn: 4,
      }}
      {...formItemLayout}
    >
      <div>
        {formModalVisible &&
          <FormModal
            visible={formModalVisible}
            setVisible={setFormModalVisible}
            getData={createEditTableData}
          />
        }
      </div>
      <ProFormDependency name={['goodsName']}>
        {({ goodsName }) => {
          return (
            <ProFormText
              name="goodsName"
              label="商品名称"
              placeholder="请输入商品名称"
              validateFirst
              extra={
                <>
                  <div><span>标题规范：【标签】/品牌+品名+规格+卖点</span><span style={{ marginLeft: 10 }}>举例：立白 全自动浓缩洗衣粉 900g*1桶 去渍亮白持久留香</span></div>
                  {goodsName?.length < 20 && <div style={{ color: 'orange' }}>商品标题过于简单，不利于搜索露出/不利于用户购买决策，请在标题中补充更多商品信息，包括但不限于商品规格、品牌、卖点等</div>}
                </>
              }
              rules={[
                { required: true, message: '请输入商品名称' },
                () => ({
                  validator(_, value) {
                    if (!value.replace(/\s/g, '')) {
                      return Promise.reject(new Error('请输入商品名称'));
                    }
                    return Promise.resolve();
                  },
                })
              ]}
              fieldProps={{
                maxLength: 50,
              }}
            />
          )
        }}
      </ProFormDependency>
      {goods.goodsSaleType !== 2 && detailData?.isMultiSpec === 0 && <ProFormText
        name="wholesaleFreight"
        label="平均运费"
        disabled
        fieldProps={{
          addonAfter: `元/${goods.unit}`
        }}
      />}
      <ProFormText
        name="wholesaleTaxRate"
        label="商品开票税率(%)"
        disabled
      />
      <ProFormText
        name="goodsDesc"
        label="商品副标题"
        placeholder="请输入商品副标题"
        fieldProps={{
          maxLength: 20,
        }}
        rules={[
          () => ({
            validator(_, value) {
              if (!value.replace(/\s/g, '') && value !== '') {
                return Promise.reject(new Error('请输入商品副标题'));
              }
              return Promise.resolve();
            },
          })
        ]}
      />
      <ProFormText
        name="supplierSpuId"
        label="商品编号"
        placeholder="请输入商品编号"
        fieldProps={{
          maxLength: 32,
        }}
        disabled
      />
      <ProFormText
        name="goodsKeywords"
        label="搜索关键字"
        placeholder="请输入搜索关键字"
        fieldProps={{
          maxLength: 30,
        }}
        rules={[
          () => ({
            validator(_, value) {
              if (!value.replace(/\s/g, '') && value !== '') {
                return Promise.reject(new Error('请输入搜索关键字'));
              }
              return Promise.resolve();
            },
          })
        ]}
      />
      <Form.Item
        label="商品品类"
        name="gcId"
        rules={[{ required: true, message: '请选择商品品类' }]}
      >
        <GcCascader disabled />
      </Form.Item>
      <Form.Item
        name="brandId"
        label="商品品牌"
      >
        <BrandSelect disabled />
      </Form.Item>

      <ProFormRadio.Group
        name="goodsSaleType"
        label="供货类型"
        rules={[{ required: true }]}
        options={[
          {
            label: '批发+零售',
            value: 0,
          },
          {
            label: '仅批发',
            value: 1,
          },
          {
            label: '仅零售',
            value: 2,
          },
        ]}
        disabled
      />
      {
        goods.goodsSaleType !== 2 && <ProFormRadio.Group
          name="isSample"
          label="批发样品"
          rules={[{ required: true }]}
          options={[
            {
              label: '不支持样品售卖',
              value: 0,
            },
            {
              label: '支持样品售卖',
              value: 1,
            },
          ]}
          disabled
        />
      }
      <ProFormRadio.Group
        name="settleType"
        label="结算模式"
        rules={[{ required: true }]}
        options={[
          // {
          //   label: '佣金模式',
          //   value: 1,
          // },
          {
            label: '底价模式',
            value: 2,
          },
        ]}
        fieldProps={{
          onChange: settleTypeChange
        }}
      />
      <ProFormDependency name={['goodsSaleType']}>
        {
          ({ goodsSaleType }) => {
            return goodsSaleType !== 1 && <ProFormRadio.Group
              name="isDrainage"
              label="社区店主引流品"
              rules={[{ required: true }]}
              options={[
                {
                  label: '不设为引流品',
                  value: 0,
                },
                {
                  label: '设为仅对社区店主售卖的引流品',
                  value: 1,
                },
              ]}
              fieldProps={{
                onChange: (e) => {
                  if (e.target.value === 1) {
                    form.setFieldsValue({
                      operateType: 1,
                    })
                  }
                },
              }}
            />
          }
        }
      </ProFormDependency>
      <ProFormDependency name={['isDrainage', 'goodsSaleType', 'salePrice', 'isMultiSpec']}>
        {
          ({ isDrainage, goodsSaleType, salePrice, isMultiSpec }) => {
            return (isDrainage !== 1 && goodsSaleType !== 1) && <ProFormRadio.Group
              name="operateType"
              label="运营类型"
              rules={[{ required: true }]}
              options={[
                {
                  label: '秒约',
                  value: 1,
                },
                {
                  label: '分享补贴',
                  value: 2,
                },
              ]}
              fieldProps={{
                onChange: (e) => {
                  if (e.target.value === 2) {
                    if (isMultiSpec === 0 && salePrice !== 0) {
                      form.setFieldsValue({
                        profit: [{
                          tStoreScale: '',
                          tPlatformScale: '',
                          tOperateScale: amountTransform(PlatformScale),
                          tSupplierScale: +new Big(amountTransform(goods.retailSupplyPrice, '/')).div(salePrice || 0).times(100).toFixed(2),
                          e: 100,
                          key: 1,
                        }]
                      })
                    }

                    if (isMultiSpec === 1) {
                      setTableData(tableData.map(item => {
                        if (item.salePrice) {
                          return {
                            ...item,
                            tStoreScale: '',
                            tPlatformScale: '',
                            tOperateScale: amountTransform(PlatformScale),
                            tSupplierScale: +new Big(item.retailSupplyPrice).div(item.salePrice).times(100).toFixed(2),
                          }
                        }
                        return item
                      }))
                    }
                  }
                },
              }}
            />
          }
        }
      </ProFormDependency>

      <ProFormSelect
        name="supplierHelperId"
        label="供应商家顾问"
        options={detailData?.supplierHelpList?.map(item => ({ label: item.companyName, value: item.id }))}
      />
      <ProFormRadio.Group
        name="isMultiSpec"
        label="规格属性"
        rules={[{ required: true }]}
        options={[
          {
            label: '单规格',
            value: 0,
          },
          {
            label: '多规格',
            value: 1,
          },
        ]}
        disabled
      />
      <ProFormDependency name={['isMultiSpec']}>
        {({ isMultiSpec }) => {
          return isMultiSpec === 1 ?
            <>
              <ProFormSelect
                name="unit"
                label="商品单位"
                fieldProps={{
                  showSearch: true,
                }}
                disabled
              />
              <ProFormSelect
                name="wsUnit"
                label="集采商品单位"
                fieldProps={{
                  showSearch: true,
                }}
                disabled
              />
              <ProFormText
                name="specName1"
                label="规格一"
                placeholder="请输入规格名称"
                rules={[{ required: true, message: '请输入规格名称' }]}
                fieldProps={{
                  maxLength: 18,
                }}
                disabled
                extra='示例：包装、重量、尺寸等'
              />
              <Form.List name="specValues1">
                {(fields, { add, remove }) => (
                  <>
                    {fields.map(({ key, name }) => {
                      return (
                        <Form.Item
                          key={key}
                          label=" "
                          name={[name, 'name']}
                          colon={false}
                          extra='示例：盒装/袋装、200g/300g、22码/24码等'
                        >
                          <Input disabled placeholder="请输入规格属性" maxLength={18} addonAfter={
                            key === 0 ?
                              <Button disabled type="primary" onClick={() => { add() }}>添加</Button>
                              :
                              <Button disabled type="primary" danger onClick={() => { remove(name) }}>删除</Button>
                          } />
                        </Form.Item>
                      )
                    })}
                  </>
                )}
              </Form.List>
              <ProFormText
                name="specName2"
                label="规格二"
                placeholder="请输入规格名称"
                disabled
                extra='示例：包装、重量、尺寸等'
              />
              <Form.List name="specValues2">
                {(fields, { add, remove }) => (
                  <>
                    {fields.map(({ key, name }) => {
                      return (
                        <Form.Item
                          key={key}
                          label=" "
                          name={[name, 'name']}
                          colon={false}
                          extra='示例：盒装/袋装、200g/300g、22码/24码等'
                        >
                          <Input disabled maxLength={18} placeholder="请输入规格属性" addonAfter={
                            key === 0 ?
                              <Button disabled type="primary" onClick={() => { add() }}>添加</Button>
                              :
                              <Button disabled type="primary" danger onClick={() => { remove(name) }}>删除</Button>
                          } />
                        </Form.Item>
                      )
                    })}
                  </>
                )}
              </Form.List>
              <Form.Item
                label=" "
                colon={false}
              >
                <Button disabled type="primary" onClick={() => { setFormModalVisible(true) }}>填写批量规格参数 生成规格配置表</Button>
              </Form.Item>
              {preferential !== 0 && <Form.Item
                label="已适用优惠券最大面额(元)"
              >
                {preferential / 100}
              </Form.Item>}
              {!!tableData.length && <ProFormDependency name={['settleType', 'operateType']}>
                {
                  ({ settleType, operateType }) => (
                    <>
                      {!!tableData.length &&
                        <EditTable
                          operateType={operateType}
                          settleType={settleType}
                          tableHead={tableHead}
                          tableData={tableData}
                          setTableData={setTableData}
                          wholesaleTaxRate={goods.wholesaleTaxRate}
                          goodsSaleType={goods.goodsSaleType}
                          isSample={goods.isSample}
                          unit={goods.unit}
                          wsUnit={goods.wsUnit}
                          ladderSwitch={detailData?.ladderSwitch}
                        />}
                    </>
                  )
                }
              </ProFormDependency>}
              <ProFormText
                name="totalStock"
                label="总可用库存"
                disabled
                fieldProps={{
                  addonAfter: `${goods.unit}`
                }}
              />
              <Form.Item
                label="发货地"
              >
                {detailData?.shipAddrs?.map?.(item => item.shipName)?.join?.('、')}
              </Form.Item>
            </>
            :
            <>
              <Form.Item
                label="规格名称"
              >
                {goods.skuName}
              </Form.Item>
              <ProFormText
                name="supplierSkuId"
                label="货号"
                placeholder="请输入货号"
              />
              {
                goods.goodsSaleType !== 2 &&
                <>
                  <ProFormText
                    name="wholesaleSupplyPrice"
                    label="批发供货价"
                    placeholder="请输入批发供货价"
                    rules={[{ required: true, message: '请输入批发供货价' }]}
                    disabled
                    fieldProps={{
                      addonAfter: `元/${goods.unit}`
                    }}
                  />
                  <Form.Item
                    label="集采阶梯优惠"
                  >
                    {goods.ladderData && <>
                      <div>采购{goods.ladderData['1'].wsStart}-{goods.ladderData['1'].wsEnd}{goods.unit}时，{goods.ladderData['1'].wsSupplyPrice / 100}元/{goods.unit}</div>
                      {goods.batchNumber > 1 && <div>{parseInt(goods.ladderData['1'].wsStart / goods.batchNumber, 10)}-{parseInt(goods.ladderData['1'].wsEnd / goods.batchNumber, 10)}{goods.wsUnit || '箱'}时，{goods.ladderData['1'].wsSupplyPrice * goods.batchNumber / 100}元/{goods.wsUnit || '箱'}</div>}
                      <div>{+goods.ladderData['1'].wsEnd + 1}{goods.unit}及以上时，{goods.ladderData['2'].wsSupplyPrice / 100}元/{goods.unit}</div>
                      {goods.batchNumber > 1 && <div>{parseInt((+goods.ladderData['1'].wsEnd + 1) / goods.batchNumber, 10)}{goods.wsUnit || '箱'}及以上时，{goods.ladderData['2'].wsSupplyPrice * goods.batchNumber / 100}元/{goods.wsUnit || '箱'}</div>}
                    </>}
                  </Form.Item>
                  <ProFormText
                    name="batchNumber"
                    label="集采箱规单位量"
                    placeholder="请输入店主集约采购下单的加购倍数单位量，范围1-9999"
                    disabled
                    fieldProps={{
                      addonAfter: `${goods.unit}/${goods.wsUnit}`
                    }}
                  />
                  <ProFormSelect
                    name="wsUnit"
                    label="集采商品单位"
                    fieldProps={{
                      showSearch: true,
                    }}
                    disabled
                  />
                  <ProFormText
                    name="wholesaleMinNum"
                    label="最低批发量"
                    placeholder="请输入最低批发量"
                    disabled
                    fieldProps={{
                      addonAfter: `${goods.unit}`
                    }}
                  />
                  {
                    goods.isSample === 1
                    &&
                    <>
                      <ProFormText
                        name="sampleSupplyPrice"
                        label="样品供货价"
                        placeholder="请输入集采样品供货价,0.01-99999.99"
                        disabled
                        fieldProps={{
                          addonAfter: `元/${goods.unit}`
                        }}
                      />
                      <ProFormText
                        name="sampleSalePrice"
                        label="样品价"
                        placeholder="大于等于(样品供货价*1.1),小于等于100倍样品供货价,保留2位小数"
                        validateFirst
                        fieldProps={{
                          addonAfter: `元/${goods.unit}`
                        }}
                        rules={[
                          { required: true, message: '请输入大于零的数字' },
                          () => ({
                            validator(_, value) {
                              if (!/^\d+\.?\d*$/g.test(value) || value <= 0) {
                                return Promise.reject(new Error('请输入大于零的数字'));
                              }
                              return Promise.resolve();
                            },
                          })
                        ]}
                      />
                      <ProFormText
                        name="sampleMinNum"
                        label="样品起售量"
                        placeholder="请输入集采样品起售量,1-999,默认为1"
                        disabled
                        fieldProps={{
                          addonAfter: `${goods.unit}`
                        }}
                      />
                      <ProFormText
                        name="sampleMaxNum"
                        label="样品限售量"
                        placeholder="请输入集采样品限售量,1-999,大于等于起售量,默认为1"
                        disabled
                        extra="每次最多可购买数量"
                        fieldProps={{
                          addonAfter: `${goods.unit}`
                        }}
                      />
                      <ProFormRadio.Group
                        name="sampleFreight"
                        label="样品是否包邮"
                        options={[
                          {
                            label: '包邮',
                            value: 1,
                          },
                          {
                            label: '不包邮',
                            value: 0,
                          },
                        ]}
                        disabled
                      />
                      {goods.sampleFreight === 0 && <Form.Item
                        name="sampleFreightId"
                        label="样品运费模板"
                        disabled
                      >
                        <FreightTemplateSelect labelInValue disabled />
                      </Form.Item>}
                    </>
                  }
                </>
              }
              {
                goods.goodsSaleType !== 1 &&
                <>
                  <ProFormText
                    name="retailSupplyPrice"
                    label="零售供货价"
                    placeholder="请输入零售供货价"
                    rules={[{ required: true, message: '请输入零售供货价' }]}
                    disabled
                    fieldProps={{
                      addonAfter: `元/${goods.unit}`
                    }}
                  />
                  <ProFormDependency name={['operateType', 'profit', 'salePrice']}>
                    {
                      ({ operateType, profit, salePrice }) => {
                        return (
                          <>
                            <ProFormText
                              name="salePrice"
                              label={`${operateType === 2 ? '分享补贴价' : '秒约价'}`}
                              placeholder={`请输入${operateType === 2 ? '分享补贴价' : '秒约价'}`}
                              validateFirst
                              rules={[
                                { required: true, message: `请输入${operateType === 2 ? '分享补贴价' : '秒约价'}` },
                                () => ({
                                  validator(_, value) {
                                    if (!/^\d+\.?\d*$/g.test(value) || value <= 0) {
                                      return Promise.reject(new Error('请输入大于零的数字'));
                                    }
                                    return Promise.resolve();
                                  },
                                })
                              ]}
                              extra={<>
                                {operateType === 2 && <span style={{ color: 'orange' }}>分享补贴价不得低于{+new Big(amountTransform(goods.retailSupplyPrice, '/')).div(0.94).toFixed(2)}元(零售供货价 / 94%)</span>}
                                {salePriceFloat < 0 && preferential !== 0 && <div style={{ color: 'red' }}>{`此${operateType === 2 ? '分享补贴价' : '秒约价'}导致平台亏损，请调高${operateType === 2 ? '分享补贴价' : '秒约价'}`}</div>}
                              </>}
                              disabled={detailData?.settleType === 1}
                              fieldProps={{
                                onChange: (e) => { salePriceChange(e, operateType, null) },
                                addonAfter: `元/${goods.unit}`
                              }}
                            />
                            <ProFormText
                              name="salePriceFloat"
                              label={`${operateType === 2 ? '分享补贴上浮比例' : '秒约价上浮比例'}`}
                              placeholder={`${operateType === 2 ? '分享补贴上浮比例' : '秒约价上浮比例'}`}
                              validateFirst
                              rules={[
                                { required: true, message: `请输入${operateType === 2 ? '分享补贴上浮比例' : '秒约价上浮比例'}` },
                                () => ({
                                  validator(_, value) {
                                    if (!/^\d+\.?\d*$/g.test(value) || value <= 0) {
                                      return Promise.reject(new Error('请输入大于零的数字'));
                                    }
                                    return Promise.resolve();
                                  },
                                })
                              ]}
                              fieldProps={{
                                onChange: (e) => { salePriceFloatChange(e, operateType, null) },
                                addonAfter: `%`
                              }}
                            />

                            {operateType === 2
                              ?
                              <>
                                <Form.Item
                                  label="分润比例"
                                  required
                                  name="profit"
                                >
                                  <ProfitTable
                                    form={form}
                                    callback={(v) => {
                                      salePriceChange({ target: { value: salePrice } }, operateType, v[0])
                                    }}
                                  />
                                </Form.Item>
                                <Form.Item
                                  label="分享补贴价平台毛利"
                                >
                                  {platformGain}元/{goods.unit}
                                </Form.Item>
                                <Form.Item
                                  label="分享补贴价平台盈亏"
                                >
                                  {salePriceProfitLoss}元/{goods.unit}
                                </Form.Item>
                                <Form.Item
                                  label="店主补贴金额"
                                >
                                  {storeGain}元/{goods.unit}
                                </Form.Item>
                                <Form.Item
                                  label="运营中心分成金额"
                                >
                                  {operateGain}元/{goods.unit}
                                </Form.Item>
                              </>
                              :
                              <Form.Item
                                label={`秒约价实际盈亏`}
                              >
                                {salePriceProfitLoss}元/{goods.unit}
                              </Form.Item>
                            }
                          </>
                        )
                      }
                    }
                  </ProFormDependency>
                  {preferential !== 0 && <Form.Item
                    label="已适用优惠券最大面额(元)"
                  >
                    {preferential / 100}
                  </Form.Item>}
                </>
              }

              {/* <ProFormText
                name="suggestedRetailPrice"
                label="建议零售价"
                placeholder="请输入建议零售价"
                rules={[{ required: true, message: '请输入建议零售价' }]}
              /> */}
              <ProFormText
                name="marketPrice"
                label="市场价"
                placeholder="请输入市场价"
                validateFirst
                rules={[
                  { required: true, message: '请输入市场价' },
                  () => ({
                    validator(_, value) {
                      if (!/^\d+\.?\d*$/g.test(value) || value <= 0) {
                        return Promise.reject(new Error('请输入大于零的数字'));
                      }
                      return Promise.resolve();
                    },
                  })
                ]}
                fieldProps={{
                  addonAfter: `元/${goods.unit}`
                }}
              />
              <ProFormText
                name="stockNum"
                label="可用库存"
                placeholder="请输入可用库存"
                rules={[{ required: true, message: '请输入可用库存数量' }]}
                disabled
                fieldProps={{
                  addonAfter: `${goods.unit}`
                }}
              />
              <ProFormText
                name="unit"
                label="商品单位"
                placeholder="请输入基本库存单位,字母或汉字,不超过4个字符,默认为件"
                validateFirst
                fieldProps={{
                  maxLength: 4,
                }}
                rules={[
                  { required: true, message: '请输入库存单位' },
                ]}
                disabled
              />
              <Form.Item
                label="发货地"
              >
                {detailData?.shipAddrs?.map?.(item => item.shipName)?.join?.('、')}
              </Form.Item>
              <ProFormText
                name="stockAlarmNum"
                label="库存预警值"
                placeholder="请输入数字 可用库存小于等于此值时提醒"
                disabled
                fieldProps={{
                  addonAfter: `${goods.unit}`
                }}
              />
              {/* <ProFormText
                name="wholesalePrice"
                label="批发价"
                placeholder="请输入批发价"
                rules={[{ required: true, message: '请输入供货价' }]}
              /> */}
              {/* <ProFormText
                name="wholesaleMinNum"
                label="批发起购量"
                placeholder="请输入批发起购量"
                rules={[{ required: true, message: '请输入数字 需大于可用库存' }]}
              /> */}


            </>
        }}
      </ProFormDependency>
      <ProFormText
        name="buyMinNum"
        label="单SKU起售数量"
        placeholder="请输入单SKU起售数量"
        rules={[{ required: true, message: '请输入单SKU起售数量' }]}
        fieldProps={{
          addonAfter: `${goods.unit}`
        }}
      />
      <ProFormText
        name="buyMaxNum"
        label="单SKU单次最多零售购买数量"
        placeholder="请输入单SKU单次最多零售购买数量"
        fieldProps={{
          addonAfter: `${goods.unit}`
        }}
      />
      <ProFormText
        name="goodsVirtualSaleNum"
        label="基础销量"
        placeholder="请输入基础销量"
        fieldProps={{
          addonAfter: `${goods.unit}`
        }}
      />

      {
        goods.goodsSaleType !== 1 && detailData?.isMultiSpec === 0 &&
        <ProFormRadio.Group
          name="isFreeFreight"
          label="是否包邮"
          rules={[{ required: true }]}
          options={[
            {
              label: '包邮',
              value: 1,
            },
            {
              label: '不包邮',
              value: 0,
            },
          ]}
          disabled
        />
      }

      {goods.goodsSaleType !== 1 && !goods.isFreeFreight && detailData?.isMultiSpec === 0 && <Form.Item
        name="freightTemplateId"
        label="选择运费模板"
        rules={[{ required: true, message: '请选择运费模板' }]}
      >
        <FreightTemplateSelect labelInValue disabled />
      </Form.Item>}

      {/* <ProFormRadio.Group
        name="supportNoReasonReturn"
        label="七天无理由退货"
        rules={[{ required: true }]}
        options={[
          {
            label: '支持',
            value: 1,
          },
          {
            label: '不支持',
            value: 0,
          },
        ]}
        disabled
      /> */}
      <ProFormTextArea
        name="goodsRemark"
        label="特殊说明"
        disabled
        fieldProps={{
          placeholder: ''
        }}
      />
      <ProFormDependency name={['goodsSaleType']}>
        {({ goodsSaleType }) => {
          const showOnA = [{
            label: '仅秒约商品详情显示',
            value: 1,
          }]
          const showOnB = [{
            label: '仅集约商品详情显示',
            value: 2,
          }]
          const showOn = [
            {
              label: '所有商品详情页都展示',
              value: 3,
            },
            {
              label: '所有商品详情页不展示',
              value: 4,
            },
          ]
          let showOnOptions = []

          if (goodsSaleType === 0) {
            showOnOptions = [...showOnA, ...showOnB, ...showOn]
          }

          if (goodsSaleType === 1) {
            showOnOptions = [...showOnB, ...showOn]
          }

          if (goodsSaleType === 2) {
            showOnOptions = [...showOnA, ...showOn]
          }

          return (
            <ProFormRadio.Group
              name="showOn"
              label="特殊说明展示状态"
              rules={[{ required: true }]}
              options={showOnOptions}
            />
          )
        }}
      </ProFormDependency>

      <Form.Item
        label="商品主图"
        name="primaryImages"
        required
        rules={[() => ({
          validator(_, value) {
            if (value && value.length >= 3) {
              return Promise.resolve();
            }
            return Promise.reject(new Error('至少上传3张商品主图'));
          },
        })]}
      >
        <FromWrap
          content={(value, onChange) => <Upload code={218} value={value} onChange={onChange} multiple maxCount={50} accept="image/*" dimension="1:1" size={1024} />}
          right={(value) => {
            return (
              <dl>
                <dt>图片要求</dt>
                <dd>1.图片大小1MB以内</dd>
                <dd>2.图片比例1:1</dd>
                <dd>3.图片格式png/jpg/gif</dd>
                <dd>4.至少上传3张</dd>
                {value?.length > 1 && <dd><ImageSort data={value} callback={(v) => { form.setFieldsValue({ primaryImages: v }) }} /></dd>}
              </dl>
            )
          }}
        />
      </Form.Item>
      <Form.Item
        label="商品详情"
        name="detailImages"
        rules={[{ required: true, message: '请上传商品详情图片' }]}
      >
        <FromWrap
          content={(value, onChange) => <Upload code={218} value={value} onChange={onChange} disabled multiple maxCount={50} accept="image/*" size={1024 * 10} />}
          right={(value) => (
            <dl>
              {value?.length > 1 && <dd><ImageSort data={value} callback={(v) => { form.setFieldsValue({ detailImages: v }) }} /></dd>}
            </dl>
          )}
        />

      </Form.Item>
      {/* {detailData.advImages && <Form.Item
        label="商品横幅"
        name="advImages"
      >
        <Upload disabled multiple maxCount={10} accept="image/*" dimension={{ width: 702, height: 320 }} size={500} />
      </Form.Item>} */}
      {detailData?.videoUrl &&
        <Form.Item
          label="商品视频"
          name="videoUrl"
        >
          <div className={styles.video_preview}>
            <video width="100%" height="100%" src={detailData.videoUrl} />
            <div>
              <EyeOutlined onClick={() => { window.open(detailData.videoUrl, '_blank') }} style={{ color: '#fff', cursor: 'pointer' }} />
            </div>
          </div>
        </Form.Item>}
      {detailData && <>
        <Form.Item
          label="创建时间"
        >
          {goods.createTimeDisplay}
        </Form.Item>

        <Form.Item
          label="审核状态"
        >
          {goods.goodsVerifyStateDisplay} {detailData.auditStr}
        </Form.Item>

        <Form.Item
          label="上架状态"
        >
          {goods.goodsStateDisplay} {detailData.putOnStr}
        </Form.Item>

        {goods.goodsState === 0 && <Form.Item
          label="下架原因"
        >
          <span style={{ color: 'red' }}>{goods.goodsVerifyRemark}</span>
        </Form.Item>}
      </>}
      {lookVisible && <Look
        visible={lookVisible}
        setVisible={setLookVisible}
        dataList={lookData || detailData}
        callback={(text) => { console.log('callback', text) }}
      />}
    </DrawerForm>
  );
};
