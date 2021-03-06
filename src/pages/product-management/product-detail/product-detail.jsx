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
            label="????????????"
          >
            {detailData?.goods.goodsName}
          </Form.Item>
          <Form.Item
            label="????????????(???)"
          >
            {amountTransform(detailData?.goods.wholesaleFreight, '/')}
          </Form.Item>
          <Form.Item
            label="????????????(%)"
          >
            {amountTransform(detailData?.goods.wholesaleTaxRate)}
          </Form.Item>
          {detailData?.goods.goodsDesc &&
            <Form.Item
              label="???????????????"
            >
              {detailData?.goods.goodsDesc}
            </Form.Item>
          }
          <Form.Item
            label="????????????"
          >
            {detailData?.goods.supplierSpuId}
          </Form.Item>
          {detailData?.goods.goodsKeywords &&
            <Form.Item
              label="???????????????"
            >
              {detailData?.goods.goodsKeywords}
            </Form.Item>
          }
          <Form.Item
            label="????????????"
          >
            {`${detailData?.goods.gcId1Display}/${detailData?.goods.gcId2Display}`}
          </Form.Item>
          {detailData?.goods.brandIdDisplay &&
            <Form.Item
              label="????????????"
            >
              {detailData?.goods.brandIdDisplay}
            </Form.Item>}
          <Form.Item
            label="????????????"
          >
            {{ 0: '??????+??????', 1: '?????????', 2: '??????' }[detailData?.goods.goodsSaleType]}
          </Form.Item>
          <Form.Item
            label="????????????"
          >
            {{ 0: '?????????', 1: '?????????' }[detailData?.isMultiSpec]}
          </Form.Item>
          <Form.Item
            label="????????????"
          >
            {{ 1: '????????????', 2: '????????????' }[detailData?.settleType]}
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
                  label="??????"
                >
                  {detailData?.goods?.supplierSkuId}
                </Form.Item>
                <Form.Item
                  label="???????????????(???)"
                >
                  {amountTransform(detailData?.goods?.wholesaleSupplyPrice, '/')}
                </Form.Item>
                <Form.Item
                  label="???????????????"
                >
                  {detailData?.goods?.wholesaleMinNum}
                </Form.Item>
                <Form.Item
                  label="?????????"
                >
                  {amountTransform(detailData?.goods?.marketPrice, '/')}
                </Form.Item>
                <Form.Item
                  label="?????????"
                >
                  {amountTransform(detailData?.goods?.salePrice, '/')}
                </Form.Item>
                {
                  detailData?.goods?.goodsSaleType===0
                  &&
                  <>
                    <Form.Item
                      label="?????????????????????"
                    >
                      {amountTransform(detailData?.goods?.salePriceFloat)}
                    </Form.Item>
                    <Form.Item
                      label="?????????????????????"
                    >
                      {amountTransform(detailData?.goods?.salePriceProfitLoss, '/')}
                    </Form.Item>
                  </>
                }
              </>
          }
          {detailData?.goods?.goodsSaleType !== 1 &&<Form.Item
            label="????????????"
          >
            {{ 0: '?????????', 1: '??????', }[detailData?.goods?.isFreeFreight]}
          </Form.Item>}
          {detailData?.freightTemplateName &&
            <Form.Item
              label="????????????"
            >
              {detailData?.freightTemplateName}
            </Form.Item>}
          {/* <Form.Item
            label="?????????????????????"
          >
            {{ 0: '?????????', 1: '??????', }[detailData?.goods?.supportNoReasonReturn]}
          </Form.Item> */}
          {detailData?.goods.goodsRemark
            &&
            <Form.Item
              label="????????????"
            >
              {detailData?.goods.goodsRemark}
            </Form.Item>
          }
          <Form.Item
            label="????????????"
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
            label="????????????"
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
              label="????????????"
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
            label="????????????"
          >
            {detailData?.goods.createTimeDisplay}
          </Form.Item>

          <Form.Item
            label="????????????"
          >
            {detailData?.goods?.goodsVerifyStateDisplay}{detailData?.auditStr}
          </Form.Item>

          <Form.Item
            label="????????????"
          >
            {detailData?.goods?.goodsStateDisplay}{detailData?.putOnStr}
          </Form.Item>

          {detailData?.goods?.goodsState === 0 && <Form.Item
            label="????????????"
          >
            <span style={{ color: 'red' }}>{detailData.goods.goodsVerifyRemark}</span>
          </Form.Item>}
          {/* 
          <ProFormSelect
            name="supplierHelperId"
            label="??????????????????"
            options={detailData?.supplierHelpList?.map(item => ({ label: item.companyName, value: item.id }))}
          />
           */}
          <div style={{ textAlign: 'center', marginTop: 30 }}>
            <Button onClick={() => { window.history.back(); setTimeout(() => { window.location.reload(); }, 200) }}>??????</Button>
          </div>
        </Form>
      </Spin>

    </PageContainer>
  );
};