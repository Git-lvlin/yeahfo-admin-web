import React, { useState, useEffect } from 'react';
import { Form, Image, Table } from 'antd';
import { amountTransform } from '@/utils/utils'
import EditTable from './table';
import styles from './edit.less'
import { EyeOutlined } from '@ant-design/icons'

export default (props) => {
  const { detailData, review } = props;
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
            sampleSupplyPrice: item[1].sampleSupplyPrice / 100,
            sampleSalePrice: item[1].sampleSalePrice / 100,
            salePriceFloat: amountTransform(item[1].salePriceFloat),
            salePriceProfitLoss: amountTransform(item[1].salePriceProfitLoss, '/'),
            // suggestedRetailPrice: amountTransform(item[1].suggestedRetailPrice, '/'),
            // wholesalePrice: amountTransform(item[1].wholesalePrice, '/'),
            salePrice: amountTransform((detailData.settleType === 1 || detailData.settleType === 0) ? item[1].retailSupplyPrice : item[1].salePrice, '/'),
            marketPrice: amountTransform(item[1].marketPrice, '/'),
            wholesaleFreight: amountTransform(item[1].wholesaleFreight, '/'),
            tOperateGain: amountTransform(item[1].tOperateGain, '/'),
            tPlatformGain: amountTransform(item[1].tPlatformGain, '/'),
            tStoreGain: amountTransform(item[1].tStoreGain, '/'),
            operateGain: amountTransform(item[1].operateGain, '/'),
            tStoreScale: amountTransform(item[1].tStoreScale),
            tPlatformScale: amountTransform(item[1].tPlatformScale),
            tOperateScale: amountTransform(item[1].tOperateScale),
            tSupplierScale: amountTransform(item[1].tSupplierScale),
            batchNumber: item[1].batchNumber,
            isFreeFreight: item[1].isFreeFreight,
            freightTemplateId: item[1]?.freightTemplateName ? { label: item[1]?.freightTemplateName, value: item[1]?.freightTemplateId } : undefined,
            key: item[1].skuId,
            imageUrl: item[1].imageUrl,
            spec1: specValuesMap[specDataKeys[0]],
            spec2: specValuesMap[specDataKeys[1]],
            specValue,
            ...obj,
          }
        }))
      }
    }

  }, [detailData]);

  return (
    <Form
      {...formItemLayout}
      style={{ backgroundColor: '#fff', padding: 20, paddingTop: 50, paddingBottom: 100 }}
    >
      <Form.Item
        label="????????????"
      >
        {goods.goodsName}
      </Form.Item>
      <Form.Item
        label="????????????(%)"
      >
        {amountTransform(goods.wholesaleTaxRate)}
      </Form.Item>
      <Form.Item
        label="???????????????"
      >
        {goods.goodsDesc}
      </Form.Item>
      <Form.Item
        label="???????????????"
      >
        {goods.goodsKeywords}
      </Form.Item>
      <Form.Item
        label="????????????"
      >
        {`${goods.gcId1Display}/${goods.gcId2Display}`}{detailData.fresh !== 0 && <span style={{ color: 'green' }}>({{ 1: '????????????', 2: '????????????' }[detailData.fresh]})</span>}
      </Form.Item>
      <Form.Item
        label="????????????"
      >
        {goods.supplierSpuId}
      </Form.Item>
      <Form.Item
        label="????????????"
      >
        {goods.brandIdDisplay}
      </Form.Item>
      <Form.Item
        label="????????????"
      >
        {{ 0: '??????+??????', 1: '?????????', 2: '?????????' }[goods.goodsSaleType]}
      </Form.Item>
      {goods.goodsSaleType !== 2 && <Form.Item
        label="????????????"
      >
        {{ 0: '?????????????????????', 1: '??????????????????' }[goods.isSample]}
      </Form.Item>}
      <Form.Item
        label="????????????"
      >
        {{ 1: '????????????', 2: '????????????' }[detailData?.settleType]}
      </Form.Item>
      <Form.Item
        label="????????????"
      >
        {{ 1: '??????', 2: '????????????' }[goods?.operateType]}
      </Form.Item>
      <Form.Item
        label="????????????"
      >
        {{ 0: '?????????', 1: '?????????' }[detailData?.isMultiSpec]}
      </Form.Item>
      {
        detailData.isMultiSpec === 0 &&
        <Form.Item
          label="????????????"
        >
          {goods.skuName}
        </Form.Item>
      }
      {
        goods?.goodsSaleType !== 2 && detailData?.isMultiSpec === 0 &&
        <Form.Item
          label="????????????"
        >
          {amountTransform(goods.wholesaleFreight, '/')}???/{goods.unit}
        </Form.Item>
      }
      {
        detailData?.isMultiSpec === 1
          ?
          <>
            {!!tableData.length &&
              <EditTable
                isSample={goods.isSample}
                tableHead={tableHead}
                tableData={tableData}
                goodsSaleType={goods.goodsSaleType}
                settleType={detailData.settleType}
                unit={goods.unit}
                wsUnit={goods.wsUnit}
                ladderSwitch={detailData.ladderSwitch}
                review={review}
                operateType={goods?.operateType}
              />
            }
            <Form.Item
              label="???????????????"
            >
              {goods?.totalStock}{goods.unit}
            </Form.Item>
            <Form.Item
              label="????????????"
            >
              {goods.unit}
            </Form.Item>
            <Form.Item
              label="??????????????????"
            >
              {goods.wsUnit}
            </Form.Item>
            <Form.Item
              label="?????????"
            >
              {detailData?.shipAddrs?.map?.(item => item.shipName)?.join?.('???')}
            </Form.Item>
            <Form.Item
              label="???SKU????????????"
            >
              {goods?.buyMinNum}{goods.unit}
            </Form.Item>
          </>
          :
          <>
            <Form.Item
              label="??????"
            >
              {goods?.supplierSkuId}
            </Form.Item>

            {
              goods?.goodsSaleType !== 2 &&
              <>
                <Form.Item
                  label="???????????????(???)"
                >
                  {amountTransform(goods.wholesaleSupplyPrice, '/')}???/{goods.unit}
                </Form.Item>
                <Form.Item
                  label="??????????????????"
                >
                  {goods.ladderData && <>
                    <div>??????{goods.ladderData['1'].wsStart}-{goods.ladderData['1'].wsEnd}{goods.unit}??????{goods.ladderData['1'].wsSupplyPrice / 100}???/{goods.unit}</div>
                    {goods.batchNumber > 1 && <div>{parseInt(goods.ladderData['1'].wsStart / goods.batchNumber, 10)}-{parseInt(goods.ladderData['1'].wsEnd / goods.batchNumber, 10)}{goods.wsUnit || '???'}??????{goods.ladderData['1'].wsSupplyPrice * goods.batchNumber / 100}???/{goods.wsUnit || '???'}</div>}
                    <div>{+goods.ladderData['1'].wsEnd + 1}{goods.unit}???????????????{goods.ladderData['2'].wsSupplyPrice / 100}???/{goods.unit}</div>
                    {goods.batchNumber > 1 && <div>{parseInt((+goods.ladderData['1'].wsEnd + 1) / goods.batchNumber, 10)}{goods.wsUnit || '???'}???????????????{goods.ladderData['2'].wsSupplyPrice * goods.batchNumber / 100}???/{goods.wsUnit || '???'}</div>}
                  </>}
                </Form.Item>
                <Form.Item
                  label="?????????????????????"
                >
                  {goods.batchNumber}{goods.unit}/{goods.wsUnit}
                </Form.Item>
                <Form.Item
                  label="???????????????"
                >
                  {goods?.wholesaleMinNum}{goods.unit}
                </Form.Item>
                {
                  goods?.isSample === 1
                  &&
                  <>
                    <Form.Item
                      label="???????????????"
                    >
                      {goods?.sampleSupplyPrice / 100}???/{goods.unit}
                    </Form.Item>
                    <Form.Item
                      label="?????????"
                    >
                      {goods?.sampleSalePrice / 100}???/{goods.unit}
                    </Form.Item>
                    <Form.Item
                      label="???????????????"
                    >
                      {goods?.sampleMinNum}{goods.unit}
                    </Form.Item>
                    <Form.Item
                      label="???????????????"
                    >
                      {goods?.sampleMaxNum}{goods.unit}
                    </Form.Item>
                    <Form.Item
                      label="??????????????????"
                    >
                      {{ 0: '?????????', 1: '??????', }[goods?.sampleFreight]}
                    </Form.Item>
                    {goods?.sampleFreight === 0 && <Form.Item
                      label="??????????????????"
                    >
                      {goods?.sampleFreightName}
                    </Form.Item>}
                  </>
                }
              </>
            }
            {
              goods?.goodsSaleType !== 1 &&
              <>
                <Form.Item
                  label="?????????????????????"
                >
                  {amountTransform(goods?.retailSupplyPrice, '/')}???/{goods.unit}
                </Form.Item>
              </>
            }
            <Form.Item
              label={`${goods?.operateType === 2 ? '???????????????' : '?????????'}`}
            >
              {amountTransform(goods?.salePrice, '/')}???/{goods.unit}
            </Form.Item>
            {
              goods?.operateType === 2
              &&
              <>
                <Form.Item
                  label="???????????????????????????"
                >
                  {amountTransform(goods?.tPlatformGain, '/')}???/{goods.unit}
                </Form.Item>
                <Form.Item
                  label="??????????????????"
                >
                  {amountTransform(goods?.tStoreGain, '/')}???/{goods.unit}
                </Form.Item>
                <Form.Item
                  label="????????????????????????"
                >
                  {amountTransform(goods?.tOperateGain, '/')}???/{goods.unit}
                </Form.Item>
                <Form.Item
                  label="????????????"
                >
                  <Table
                    pagination={false}
                    dataSource={[
                      {
                        tStoreScale: amountTransform(goods.tStoreScale),
                        tPlatformScale: amountTransform(goods.tPlatformScale),
                        tOperateScale: amountTransform(goods.tOperateScale),
                        tSupplierScale: amountTransform(goods.tSupplierScale),
                      }
                    ]}
                    columns={[
                      {
                        title: '??????????????????',
                        dataIndex: 'tStoreScale',
                        render: (_) => `${_}%`,
                      },
                      {
                        title: '??????????????????',
                        dataIndex: 'tPlatformScale',
                        render: (_) => `${_}%`,
                      },
                      {
                        title: '??????????????????',
                        dataIndex: 'tOperateScale',
                        render: (_) => `${_}%`,
                      },
                      {
                        title: '?????????????????????',
                        dataIndex: 'tSupplierScale',
                        render: (_) => `${_}%`,
                      },
                      {
                        title: '??????',
                        dataIndex: 'e',
                        render: () => '100%'
                      }]}
                  />
                </Form.Item>
              </>
            }
            {!review &&
              <Form.Item
                label="?????????"
              >
                {amountTransform(goods?.marketPrice, '/')}???/{goods.unit}
              </Form.Item>}
            <Form.Item
              label="????????????"
            >
              {goods?.totalStock}{goods.unit}
            </Form.Item>
            <Form.Item
              label="????????????"
            >
              {goods.unit}
            </Form.Item>
            <Form.Item
              label="??????????????????"
            >
              {goods.wsUnit}
            </Form.Item>
            <Form.Item
              label="?????????"
            >
              {detailData?.shipAddrs?.map?.(item => item.shipName)?.join?.('???')}
            </Form.Item>
            <Form.Item
              label="???????????????"
            >
              {goods?.stockAlarmNum}{goods.unit}
            </Form.Item>
            <Form.Item
              label="???SKU????????????"
            >
              {goods?.buyMinNum}{goods.unit}
            </Form.Item>
            <Form.Item
              label="???SKU??????????????????????????????"
            >
              {goods?.buyMaxNum}{goods.unit}
            </Form.Item>
          </>
      }
      {goods?.goodsSaleType !== 1 && detailData?.isMultiSpec === 0 && <Form.Item
        label="????????????"
      >
        {{ 0: '?????????', 1: '??????', }[goods?.isFreeFreight]}
      </Form.Item>}
      {goods?.goodsSaleType !== 1 && !goods?.isFreeFreight && detailData?.isMultiSpec === 0 &&
        <Form.Item
          label="????????????"
        >
          {detailData?.freightTemplateName}
        </Form.Item>}
      {/* <Form.Item
        label="?????????????????????"
      >
        {{ 0: '?????????', 1: '??????', }[goods?.supportNoReasonReturn]}
      </Form.Item> */}
      <Form.Item
        label="????????????"
      >
        {goods.goodsRemark}
      </Form.Item>
      <Form.Item
        label="????????????????????????"
      >
        {{ 1: '???????????????????????????', 2: '???????????????????????????', 3: '??????????????????????????????', 4: '??????????????????????????????' }[goods.showOn]}
      </Form.Item>
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
        {goods?.createTimeDisplay}
      </Form.Item>

      <Form.Item
        label="????????????"
      >
        {goods?.goodsVerifyStateDisplay}{detailData?.auditStr}
      </Form.Item>

      <Form.Item
        label="????????????"
      >
        {goods?.goodsStateDisplay}{detailData?.putOnStr}
      </Form.Item>

      {goods?.goodsState === 0 && <Form.Item
        label="????????????"
      >
        <span style={{ color: 'red' }}>{goods?.goodsVerifyRemark}</span>
      </Form.Item>}

      {/* 
          <ProFormSelect
            name="supplierHelperId"
            label="??????????????????"
            options={detailData?.supplierHelpList?.map(item => ({ label: item.companyName, value: item.id }))}
          />
           */}

    </Form>
  );
};