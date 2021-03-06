import React, { useEffect, useState } from 'react'
import { PageContainer } from '@/components/PageContainer';
import { Steps, Space, Button, Modal, Spin } from 'antd';
import { useParams, history, useLocation } from 'umi';
import { findAdminOrderDetail, deliverGoods, expressInfo, expressInfoYlbb, findAdminOrderDetail2 } from '@/services/order-management/normal-order-detail';
import { amountTransform, dateFormat } from '@/utils/utils'
import LogisticsTrackingModel from '@/components/Logistics-tracking-model'
import ProDescriptions from '@ant-design/pro-descriptions';
import moment from 'moment';

import styles from './style.less';

const { Step } = Steps;

const OrderDetail = () => {

  const params = useParams();
  const [detailData, setDetailData] = useState({});
  const [expressInfoState, setExpressInfoState] = useState([])
  const [loading, setLoading] = useState(false);
  const isPurchase = useLocation().pathname.includes('purchase')

  const expressInfoRequest = () => {

    if (detailData.orderType === 11) {
      expressInfoYlbb({
        orderType: 11,
        webSite: 1688,
        orderId: detailData.outOrderSn,
        shippingCode: detailData.shippingCode,
        deliveryTime: moment(detailData.deliveryTime).unix(),
      }).then(res => {
        if (res.code === 0) {
          setExpressInfoState(res.data?.deliveryList?.reverse())
        }
      })
    } else {
      expressInfo({
        shippingCode: detailData.shippingCode,
        expressType: detailData.expressType,
        mobile: detailData.buyerPhone,
        deliveryTime: detailData.deliveryTime
      }).then(res => {
        if (res.code === 0) {
          setExpressInfoState(res.data?.deliveryList?.reverse())
        }
      })
    }

  }

  const getDetailData = () => {
    setLoading(true);
    const apiMethod = isPurchase ? findAdminOrderDetail2 : findAdminOrderDetail;
    apiMethod({
      id: params.id
    }).then(res => {
      if (res.code === 0) {
        setDetailData(res.data)
      }
    }).finally(() => {
      setLoading(false);
    })
  }

  const orderShipRequest = (values) => {
    deliverGoods({
      subOrderId: params.id,
      shippingCode: values.expressNo,
      expressType: values.expressType,
      expressName: values.expressName,
      expressId: values.expressId
    }, { showSuccess: true })
      .then(res => {
        if (res.code === 0) {
          getDetailData()
        }
      })
  }

  const modifyShipRequest = (values) => {
    updateOrderLogistics({
      id: orderId,
      shippingCode: values.expressNo,
      expressType: values.expressType,
      expressId: values.expressId,
      expressName: values.expressName
    }, { showSuccess: true })
      .then(res => {
        if (res.code === 0) {
          getDetailData()
        }
      })
  }


  useEffect(() => {
    getDetailData()
  }, [])

  return (
    <PageContainer style={{ backgroundColor: '#fff', minHeight: '100%', paddingBottom: 40 }}>
      <Spin spinning={loading}>
        <div className={styles.order_detail}>
          <Steps progressDot current={detailData.status - 1}>
            <Step title="????????????" description={<><div>{detailData.createTime}</div></>} />
            <Step title="????????????" description={<><div>{detailData.payTime}</div></>} />
            <Step title="????????????" description={<><div>{detailData.deliveryTime}</div></>} />
            <Step title="????????????" description={<><div>{detailData.receiveTime}</div></>} />
            <Step title="????????????" description={<><div>{detailData.receiveTime}</div></>} />
          </Steps>
          <div style={{ display: 'flex', marginTop: 30 }}>
            <div style={{ flex: 1, marginRight: 30 }}>
              <div className={styles.box_wrap}>
                <div className={`${styles.box} ${styles.box_header}`}>
                  ????????????
                </div>
                <div className={styles.box}>
                  <div>????????????</div>
                  <div>{detailData.orderTypeStr}</div>
                </div>
                <div className={styles.box}>
                  <div>????????????</div>
                  <div>{detailData.statusStr}</div>
                </div>
                <div className={styles.box}>
                  <div>?????????</div>
                  <div>{detailData.orderSn}</div>
                </div>
                <div className={styles.box}>
                  <div>????????????</div>
                  <div>{detailData?.createTime}</div>
                </div>
                <div className={styles.box}>
                  <div>????????????</div>
                  <div>{detailData?.buyerNickname}</div>
                </div>
                <div className={styles.box}>
                  <div>???????????????</div>
                  <div>{detailData?.buyerPhone}</div>
                </div>
                <div className={styles.box}>
                  <div>????????????</div>
                  <div>{detailData?.payTime}</div>
                </div>
                <div className={styles.box}>
                  <div>????????????</div>
                  <div>{detailData?.payTypeStr}</div>
                </div>
                <div className={styles.box}>
                  <div>???????????????</div>
                  <div>{detailData?.paySn}</div>
                </div>
                <div className={styles.box}>
                  <div>????????????</div>
                  <div className={styles.block}>
                    <p>????????????{detailData?.consignee}</p>
                    <p>?????????????????????{detailData?.phone}</p>
                    <p>???????????????{detailData?.fullAddress}</p>
                  </div>
                </div>
              </div>
              <div className={styles.box_wrap} style={{ marginTop: '-1px' }}>
                <div className={`${styles.box} ${styles.box_header}`}>
                  ????????????
                </div>
                <div className={styles.box}>
                  <div>???????????????</div>
                  <div>{amountTransform(detailData?.goodsTotalAmount, '/')}???</div>
                </div>
                <div className={styles.box}>
                  <div>??????</div>
                  <div>+{amountTransform(detailData?.shippingFeeAmount, '/')}???</div>
                </div>
                <div className={styles.box}>
                  <div>??????</div>
                  <div>
                    {
                      detailData?.orderType === 17
                        ? '??????????????????'
                        : `-${amountTransform(detailData?.couponAmount, '/')}???${detailData?.orderType === 18 ? '??????????????????' : ''}`
                    }
                  </div>
                </div>
                <div className={styles.box}>
                  <div>????????????</div>
                  <div>{amountTransform(detailData?.payAmount, '/')}???</div>
                </div>
                {/* <div className={styles.box}>
                  <div>??????</div>
                  <div>{amountTransform(detailData?.incomeAmount, '/')}???</div>
                </div> */}
                {
                  detailData.status != 1 && detailData.status != 5 && <div className={styles.box}>
                    <div>??????</div>
                    <div>?????????????????????????????? {detailData?.warrantyRatio * 100 + '%'}  ??????,?????????????????????????????????????????????</div>
                  </div>
                }
                <div className={`${styles.box} ${styles.box_header}`}>
                  ????????????
                </div>
                {
                  detailData.logisticsList && detailData.logisticsList.map((ele, idx) => (
                    <ProDescriptions style={{ padding: '20px' }} column={2} title={"??????" + parseInt(idx + 1)}>
                      <ProDescriptions.Item
                        label="????????????"
                      >
                        {ele.expressName}
                      </ProDescriptions.Item>
                      <ProDescriptions.Item
                        label="????????????"
                      >
                        {ele.shippingCode}
                      </ProDescriptions.Item>
                      <ProDescriptions.Item
                        label="????????????"
                      >
                        <p className={styles.schedule}>{ele.lastStatus}</p>
                      </ProDescriptions.Item>

                      <ProDescriptions.Item
                        fieldProps={{}}
                      >
                        <LogisticsTrackingModel
                          record={ele.deliveryList}
                          title={'????????????'}
                          byid={ele.id}
                        />
                      </ProDescriptions.Item>
                    </ProDescriptions>
                  ))
                }
              </div>
            </div>
            <div style={{ flex: 1 }}>
              <div className={styles.box_wrap}>
                <div className={`${styles.box} ${styles.box_header}`}>
                  ????????????
                </div>
                {
                  detailData?.goodsInfo?.map((item, index) => (
                    <div key={item.id} className={styles.box}>
                      <div>??????{index + 1}</div>
                      <div className={styles.box_wrap}>
                        <div className={styles.box}>
                          <div>????????????</div>
                          <div>{item.goodsName}</div>
                        </div>
                        <div className={styles.box}>
                          <div>??????</div>
                          <div>{item.skuName}</div>
                        </div>
                        <div className={styles.box}>
                          <div>?????????</div>
                          <div>{amountTransform(item.skuSalePrice, '/')}???</div>
                        </div>
                        <div className={styles.box}>
                          <div>????????????</div>
                          <div>{item.skuNum}{item.unit}</div>
                        </div>
                        <div className={styles.box}>
                          <div>??????</div>
                          <div>{amountTransform(item.totalAmount, '/')}???</div>
                        </div>
                      </div>
                    </div>
                  ))
                }
                <div className={styles.box}>
                  <div>????????????</div>
                  <div>{detailData?.note}</div>
                </div>
              </div>
              <Space style={{ marginTop: 30 }}>
                <Button type="primary" onClick={() => { window.history.back(); setTimeout(() => { window.location.reload(); }, 200) }}>??????</Button>
              </Space>
            </div>
          </div>
        </div>
        <Modal
          title="????????????"
          visible={expressInfoState.length}
          footer={[
            <Button type="primary" onClick={() => { setExpressInfoState([]) }}>
              ??????
            </Button>,
          ]}
          onCancel={() => { setExpressInfoState([]) }}
        >
          <Steps progressDot current={999} direction="vertical">
            {
              expressInfoState.map(item => (
                <Step title={item.content} description={item.time} />
              ))
            }
          </Steps>
        </Modal>
      </Spin>
    </PageContainer>
  )
}


export default OrderDetail
