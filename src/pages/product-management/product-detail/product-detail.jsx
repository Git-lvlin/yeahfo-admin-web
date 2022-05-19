import React, { useState, useEffect, useRef } from 'react';
import { Button, Form, Image, Spin } from 'antd';
import { EyeOutlined } from '@ant-design/icons'
import { PageContainer } from '@/components/PageContainer';
import EditTable from './table';
import { amountTransform } from '@/utils/utils'
import { useParams, history } from 'umi';
import styles from './style.less'
import { getDetail } from '@/services/product-management/product-list';


export default () => {
  const [tableData, setTableData] = useState([]);
  const [tableHead, setTableHead] = useState([]);
  const [detailData, setDetailData] = useState(null);
  const [loading, setLoading] = useState(false);

  const params = useParams();

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
    setLoading(true);
    getDetail({
      spuId: params.id
    }).then(res => {
      if (res.code === 0) {
        const resData = {
          ...res.data,
          settleType: 2,
        }
        setDetailData(resData);

        const { specName, specValues, specData } = resData;

        if (resData.isMultiSpec) {
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
            return {
              ...item[1],
              code: item[0],
              retailSupplyPrice: amountTransform(item[1].retailSupplyPrice, '/'),
              wholesaleSupplyPrice: amountTransform(item[1].wholesaleSupplyPrice, '/'),
              wholesaleMinNum: item[1].wholesaleMinNum,
              salePriceFloat: amountTransform(item[1].salePriceFloat),
              salePriceProfitLoss: amountTransform(item[1].salePriceProfitLoss, '/'),
              // suggestedRetailPrice: amountTransform(item[1].suggestedRetailPrice, '/'),
              // wholesalePrice: amountTransform(item[1].wholesalePrice, '/'),
              salePrice: amountTransform((resData.settleType === 1 || resData.settleType === 0) ? item[1].retailSupplyPrice : item[1].salePrice, '/'),
              marketPrice: amountTransform(item[1].marketPrice || item[1].retailSupplyPrice, '/'),
              key: item[1].skuId,
              imageUrl: item[1].imageUrl,
              spec1: specValuesMap[specDataKeys[0]],
              spec2: specValuesMap[specDataKeys[1]],
              specValue,
            }
          }))
        }
      }
    }).finally(() => {
      setLoading(false);
    })

  }, []);

  return (
    <PageContainer>
      <Spin
        spinning={loading}
      >
        <Form
          {...formItemLayout}
          style={{ backgroundColor: '#fff', padding: 20, paddingTop: 50, paddingBottom: 100 }}
        >
          <Form.Item
            label="商品名称"
          >
            {detailData?.goods.goodsName}
          </Form.Item>
          <Form.Item
            label="平均运费(元)"
          >
            {amountTransform(detailData?.goods.wholesaleFreight, '/')}
          </Form.Item>
          <Form.Item
            label="发票税率(%)"
          >
            {amountTransform(detailData?.goods.wholesaleTaxRate)}
          </Form.Item>
          {detailData?.goods.goodsDesc &&
            <Form.Item
              label="商品副标题"
            >
              {detailData?.goods.goodsDesc}
            </Form.Item>
          }
          <Form.Item
            label="商品编号"
          >
            {detailData?.goods.supplierSpuId}
          </Form.Item>
          {detailData?.goods.goodsKeywords &&
            <Form.Item
              label="搜索关键字"
            >
              {detailData?.goods.goodsKeywords}
            </Form.Item>
          }
          <Form.Item
            label="商品品类"
          >
            {`${detailData?.goods.gcId1Display}/${detailData?.goods.gcId2Display}`}
          </Form.Item>
          {detailData?.goods.brandIdDisplay &&
            <Form.Item
              label="商品品牌"
            >
              {detailData?.goods.brandIdDisplay}
            </Form.Item>}
          <Form.Item
            label="供货类型"
          >
            {{ 0: '批发+零售', 1: '仅批发', 2: '零售' }[detailData?.goods.goodsSaleType]}
          </Form.Item>
          <Form.Item
            label="规格属性"
          >
            {{ 0: '单规格', 1: '多规格' }[detailData?.isMultiSpec]}
          </Form.Item>
          <Form.Item
            label="结算模式"
          >
            {{ 1: '佣金模式', 2: '底价模式' }[detailData?.settleType]}
          </Form.Item>
          {
            detailData?.isMultiSpec === 1
              ?
              <>
                {!!tableData.length && <EditTable tableHead={tableHead} tableData={tableData} goodsSaleType={detailData?.goods?.goodsSaleType} settleType={detailData?.settleType} />}
              </>
              :
              <>
                <Form.Item
                  label="货号"
                >
                  {detailData?.goods?.supplierSkuId}
                </Form.Item>
                <Form.Item
                  label="批发供货价(元)"
                >
                  {amountTransform(detailData?.goods?.wholesaleSupplyPrice, '/')}
                </Form.Item>
                <Form.Item
                  label="最低批发量"
                >
                  {detailData?.goods?.wholesaleMinNum}
                </Form.Item>
                <Form.Item
                  label="市场价"
                >
                  {amountTransform(detailData?.goods?.marketPrice, '/')}
                </Form.Item>
                <Form.Item
                  label="秒约价"
                >
                  {amountTransform(detailData?.goods?.salePrice, '/')}
                </Form.Item>
                {
                  detailData?.goods?.goodsSaleType===0
                  &&
                  <>
                    <Form.Item
                      label="秒约价上浮比例"
                    >
                      {amountTransform(detailData?.goods?.salePriceFloat)}
                    </Form.Item>
                    <Form.Item
                      label="秒约价实际盈亏"
                    >
                      {amountTransform(detailData?.goods?.salePriceProfitLoss, '/')}
                    </Form.Item>
                  </>
                }
              </>
          }
          {detailData?.goods?.goodsSaleType !== 1 &&<Form.Item
            label="是否包邮"
          >
            {{ 0: '不包邮', 1: '包邮', }[detailData?.goods?.isFreeFreight]}
          </Form.Item>}
          {detailData?.freightTemplateName &&
            <Form.Item
              label="运费模板"
            >
              {detailData?.freightTemplateName}
            </Form.Item>}
          {/* <Form.Item
            label="七天无理由退货"
          >
            {{ 0: '不支持', 1: '支持', }[detailData?.goods?.supportNoReasonReturn]}
          </Form.Item> */}
          {detailData?.goods.goodsRemark
            &&
            <Form.Item
              label="特殊说明"
            >
              {detailData?.goods.goodsRemark}
            </Form.Item>
          }
          <Form.Item
            label="商品主图"
            name="primaryImages"
          >
            {
              detailData?.primaryImages.map(item => (
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
              detailData?.detailImages.map(item => (
                <div
                  style={{ marginRight: 10, display: 'inline-block' }}
                  key={item.imageSort}
                >
                  <Image width={100} height={100} src={item.imageUrl} />
                </div>
              ))
            }
          </Form.Item>
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

          <Form.Item
            label="创建时间"
          >
            {detailData?.goods.createTimeDisplay}
          </Form.Item>

          <Form.Item
            label="审核状态"
          >
            {detailData?.goods?.goodsVerifyStateDisplay}{detailData?.auditStr}
          </Form.Item>

          <Form.Item
            label="上架状态"
          >
            {detailData?.goods?.goodsStateDisplay}{detailData?.putOnStr}
          </Form.Item>

          {detailData?.goods?.goodsState === 0 && <Form.Item
            label="下架原因"
          >
            <span style={{ color: 'red' }}>{detailData.goods.goodsVerifyRemark}</span>
          </Form.Item>}
          {/* 
          <ProFormSelect
            name="supplierHelperId"
            label="供应商家顾问"
            options={detailData?.supplierHelpList?.map(item => ({ label: item.companyName, value: item.id }))}
          />
           */}
          <div style={{ textAlign: 'center', marginTop: 30 }}>
            <Button onClick={() => { window.history.back(); setTimeout(() => { window.location.reload(); }, 200) }}>返回</Button>
          </div>
        </Form>
      </Spin>

    </PageContainer>
  );
};