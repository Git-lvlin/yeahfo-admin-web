import React, { useState, useEffect } from 'react';
import { Button, Form, Image } from 'antd';
import { EyeOutlined } from '@ant-design/icons'
import {
  DrawerForm,
  ProFormDependency,
} from '@ant-design/pro-form';
import Overrule from './overrule';
import EditTable from './edit-table';
import { amountTransform } from '@/utils/utils'
import styles from './first-review.less'
import Look from './look';
import ProductDetail from '@/components/product-detail'

export default (props) => {
  const { visible, setVisible, detailData, check, overrule } = props;
  const [overruleVisible, setOverruleVisible] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [tableHead, setTableHead] = useState([]);
  const [form] = Form.useForm()
  const [lookVisible, setLookVisible] = useState(false);

  const { goods } = detailData;

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

  useEffect(() => {
    if (detailData) {
      const { specName, specValues, specData } = detailData;

      if (detailData.isMultiSpec) {
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
          return {
            ...item[1],
            retailSupplyPrice: amountTransform(item[1].retailSupplyPrice, '/'),
            wholesaleSupplyPrice: amountTransform(item[1].wholesaleSupplyPrice, '/'),
            // suggestedRetailPrice: amountTransform(item[1].retailSupplyPrice, '/'),
            // wholesalePrice: amountTransform(item[1].retailSupplyPrice, '/'),
            salePrice: amountTransform(item[1].salePrice, '/'),
            marketPrice: amountTransform(item[1].marketPrice, '/'),
            salePriceFloat: amountTransform(item[1].salePriceFloat),
            salePriceProfitLoss: amountTransform(item[1].salePriceProfitLoss, '/'),
            wholesaleFreight: amountTransform(item[1].wholesaleFreight, '/'),
            sampleSupplyPrice: amountTransform(item[1].sampleSupplyPrice, '/'),
            batchNumber: item[1].batchNumber,
            isFreeFreight: item[1].isFreeFreight,
            freightTemplateId: item[1]?.freightTemplateId !== 0 ? { label: item[1]?.freightTemplateName, value: item[1]?.freightTemplateId } : undefined,
            sampleFreightId: item[1]?.sampleFreightId !== 0 ? { label: item[1]?.sampleFreightName, value: item[1]?.sampleFreightId } : undefined,
            key: item[1].skuId,
            imageUrl: item[1].imageUrl,
            spec1: specValuesMap[specDataKeys[0]],
            spec2: specValuesMap[specDataKeys[1]],
          }
        }))
      }
    }

  }, [detailData]);

  return (
    <DrawerForm
      title="商品审核"
      onVisibleChange={setVisible}
      drawerProps={{
        forceRender: true,
        destroyOnClose: true,
        width: 1300,
      }}
      form={form}
      onFinish={() => {
        check(detailData.spuId);
      }}
      submitter={{
        render: (props) => {
          return [
            <Button key="1" type="primary" onClick={() => { props.submit(); }}>
              审核通过
            </Button>,
            <Button type="danger" key="3" danger onClick={() => { setOverruleVisible(true) }}>
              审核驳回
            </Button>,
            <Button key="4" onClick={() => { setVisible(false) }}>
              返回
            </Button>,
            <Button
              key="look"
              onClick={(_) => {
                if (detailData) {
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
      visible={visible}
      initialValues={{
        settleType: 2,
      }}
      {...formItemLayout}
    >
      <ProductDetail detailData={detailData} review />
      {overruleVisible && <Overrule
        visible={overruleVisible}
        setVisible={setOverruleVisible}
        callback={(text) => { overrule([detailData.spuId].join(','), text) }}
      />}
      {lookVisible && <Look
        visible={lookVisible}
        setVisible={setLookVisible}
        dataList={detailData}
      />}
    </DrawerForm>
  );
};