import React, { useState, useEffect } from 'react';
import { Form, Image, Button } from 'antd';
import {
  DrawerForm,
} from '@ant-design/pro-form';
import { amountTransform } from '@/utils/utils'
import Table from './table';

export default (props) => {
  const { visible, setVisible, detailData } = props;
  const [tableHead, setTableHead] = useState([]);
  const [tableData, setTableData] = useState([]);
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
          // eslint-disable-next-line prefer-destructuring
          specValuesMap[obj[0][0]] = obj[0][1];
        });
        setTableHead(Object.values(specName))
        setTableData(Object.entries(specData).map(item => {
          const specDataKeys = item[0].substring(1).split('|');
          return {
            ...item[1],
            retailSupplyPrice: amountTransform(item[1].retailSupplyPrice, '/'),
            suggestedRetailPrice: amountTransform(item[1].suggestedRetailPrice, '/'),
            wholesalePrice: amountTransform(item[1].wholesalePrice, '/'),
            salePrice: amountTransform(item[1].salePrice, '/'),
            marketPrice: amountTransform(item[1].marketPrice, '/'),
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
        width: 1200,
      }}
      visible={visible}
      {...formItemLayout}
    >
      <Form.Item
        label="商品名称"
      >
        {goods.goodsName}
      </Form.Item>
      {goods.goodsDesc &&
        <Form.Item
          label="商品副标题"
        >
          {goods.goodsDesc}
        </Form.Item>
      }

      <Form.Item
        label="商品编号"
      >
        {goods.supplierSpuId}
      </Form.Item>

      {goods.goodsKeywords &&
        <Form.Item
          label="搜索关键字"
        >
          {goods.goodsKeywords}
        </Form.Item>
      }

      <Form.Item
        label="商品品类"
      >
        {`${goods.gcId1Display}/${goods.gcId2Display}`}
      </Form.Item>
      {goods.brandIdDisplay &&
        <Form.Item
          label="商品品牌"
        >
          {goods.brandIdDisplay}
        </Form.Item>}

      <Form.Item
        label="供货类型"
      >
        {{ 0: '批发+零售', 1: '仅批发', 2: '零售' }[goods.goodsSaleType]}
      </Form.Item>

      <Form.Item
        label="规格属性"
      >
        {{ 0: '单规格', 1: '多规格' }[detailData.isMultiSpec]}
      </Form.Item>

      {
        detailData.isMultiSpec === 1
          ?
          <>
            {!!tableData.length && <Table tableHead={tableHead} tableData={tableData} />}
          </>
          :
          <>
            <Form.Item
              label="可用库存"
            >
              {goods.stockNum}
            </Form.Item>
            {
              goods.stockAlarmNum &&
              <Form.Item
                label="库存预警值"
              >
                {goods.stockAlarmNum}
              </Form.Item>
            }

            <Form.Item
              label="批发价"
            >
              {goods.wholesalePrice}
            </Form.Item>

            <Form.Item
              label="批发起购量"
            >
              {goods.wholesaleMinNum}
            </Form.Item>

            <Form.Item
              label="零售供货价"
            >
              {goods.retailSupplyPrice}
            </Form.Item>

            <Form.Item
              label="建议零售价"
            >
              {goods.suggestedRetailPrice}
            </Form.Item>

          </>
      }
      <Form.Item
        label="起售数量"
      >
        {goods.buyMinNum}
      </Form.Item>

      <Form.Item
        label="单次最多零售购买数量"
      >
        {goods.buyMaxNum}
      </Form.Item>

      <Form.Item
        label="供货类型"
      >
        {{ 0: '不包邮', 1: '包邮', }[goods.isFreeFreight]}
      </Form.Item>

      {/* <Form.Item
        label="七天无理由退货"
      >
        {{ 0: '不支持', 1: '支持', }[goods.supportNoReasonReturn]}
      </Form.Item> */}

      {goods.goodsRemark
        &&
        <Form.Item
          label="特殊说明"
        >
          {goods.goodsRemark}
        </Form.Item>
      }

      <Form.Item
        label="商品主图"
        name="primaryImages"
      >
        {
          detailData.primaryImages.map(item => (
            <div
              style={{ marginRight: 10, display: 'inline-block' }}
              key={item.imageSort}
            >
              <Image width={100} height={100} src={item.imageUrl} />
            </div>
          ))
        }
      </Form.Item>
      <Form.Item
        label="商品详情"
      >
        {
          detailData.detailImages.map(item => (
            <div
              style={{ marginRight: 10, display: 'inline-block' }}
              key={item.imageSort}
            >
              <Image width={100} height={100} src={item.imageUrl} />
            </div>
          ))
        }
      </Form.Item>
      {!!detailData.advImages.length &&
        <Form.Item
          label="商品横幅"
        >
          {
            detailData.advImages.map(item => (
              <div
                style={{ marginRight: 10, display: 'inline-block' }}
                key={item.imageSort}
              >
                <Image width={100} height={100} src={item.imageUrl} />
              </div>
            ))
          }
        </Form.Item>
      }
      {/* <Form.Item
        label="商品视频"
        name="videoUrl"
        tooltip={
          <dl>
            <dt>视频要求</dt>
            <dd>1.视频大小20MB以内</dd>
            <dd>2.视频格式mp4</dd>
          </dl>
        }
      >
        <Upload maxCount={1} accept="video/mp4" />
      </Form.Item> */}

      <Form.Item
        label="创建时间"
      >
        {goods.createTimeDisplay}
      </Form.Item>

      <Form.Item
        label="审核状态"
      >
        {goods.goodsVerifyStateDisplay}
      </Form.Item>

      <Form.Item
        label="上架状态"
      >
        {goods.goodsStateDisplay}
      </Form.Item>

      {goods.goodsVerifyRemark && <Form.Item
        label="原因"
      >
        <span style={{ color: 'red' }}>{goods.goodsVerifyRemark}</span>
      </Form.Item>}
    </DrawerForm>
  );
};