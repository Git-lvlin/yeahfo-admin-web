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
            <Step title="订单提交" description={<><div>{detailData.createTime}</div></>} />
            <Step title="订单支付" description={<><div>{detailData.payTime}</div></>} />
            <Step title="订单发货" description={<><div>{detailData.deliveryTime}</div></>} />
            <Step title="订单收货" description={<><div>{detailData.receiveTime}</div></>} />
            <Step title="订单完成" description={<><div>{detailData.receiveTime}</div></>} />
          </Steps>
          <div style={{ display: 'flex', marginTop: 30 }}>
            <div style={{ flex: 1, marginRight: 30 }}>
              <div className={styles.box_wrap}>
                <div className={`${styles.box} ${styles.box_header}`}>
                  订单信息
                </div>
                <div className={styles.box}>
                  <div>订单类型</div>
                  <div>{detailData.orderTypeStr}</div>
                </div>
                <div className={styles.box}>
                  <div>订单状态</div>
                  <div>{detailData.statusStr}</div>
                </div>
                <div className={styles.box}>
                  <div>订单号</div>
                  <div>{detailData.orderSn}</div>
                </div>
                <div className={styles.box}>
                  <div>下单时间</div>
                  <div>{detailData?.createTime}</div>
                </div>
                <div className={styles.box}>
                  <div>下单用户</div>
                  <div>{detailData?.buyerNickname}</div>
                </div>
                <div className={styles.box}>
                  <div>用户手机号</div>
                  <div>{detailData?.buyerPhone}</div>
                </div>
                <div className={styles.box}>
                  <div>支付时间</div>
                  <div>{detailData?.payTime}</div>
                </div>
                <div className={styles.box}>
                  <div>支付方式</div>
                  <div>{detailData?.payTypeStr}</div>
                </div>
                <div className={styles.box}>
                  <div>支付流水号</div>
                  <div>{detailData?.paySn}</div>
                </div>
                <div className={styles.box}>
                  <div>收货信息</div>
                  <div className={styles.block}>
                    <p>收货人：{detailData?.consignee}</p>
                    <p>收货手机号码：{detailData?.phone}</p>
                    <p>收货地址：{detailData?.fullAddress}</p>
                  </div>
                </div>
              </div>
              <div className={styles.box_wrap} style={{ marginTop: '-1px' }}>
                <div className={`${styles.box} ${styles.box_header}`}>
                  订单金额
                </div>
                <div className={styles.box}>
                  <div>商品总金额</div>
                  <div>{amountTransform(detailData?.goodsTotalAmount, '/')}元</div>
                </div>
                <div className={styles.box}>
                  <div>运费</div>
                  <div>+{amountTransform(detailData?.shippingFeeAmount, '/')}元</div>
                </div>
                <div className={styles.box}>
                  <div>红包</div>
                  <div>
                    {
                      detailData?.orderType === 17
                        ? '盲盒全额抵扣'
                        : `-${amountTransform(detailData?.couponAmount, '/')}元${detailData?.orderType === 18 ? '（签到红包）' : ''}`
                    }
                  </div>
                </div>
                <div className={styles.box}>
                  <div>用户实付</div>
                  <div>{amountTransform(detailData?.payAmount, '/')}元</div>
                </div>
                {/* <div className={styles.box}>
                  <div>实收</div>
                  <div>{amountTransform(detailData?.incomeAmount, '/')}元</div>
                </div> */}
                {
                  detailData.status != 1 && detailData.status != 5 && <div className={styles.box}>
                    <div>备注</div>
                    <div>买家确认收货后可提现 {detailData?.warrantyRatio * 100 + '%'}  金额,订单超过售后期可提现剩余金额。</div>
                  </div>
                }
                <div className={`${styles.box} ${styles.box_header}`}>
                  物流信息
                </div>
                {
                  detailData.logisticsList && detailData.logisticsList.map((ele, idx) => (
                    <ProDescriptions style={{ padding: '20px' }} column={2} title={"包裹" + parseInt(idx + 1)}>
                      <ProDescriptions.Item
                        label="快递公司"
                      >
                        {ele.expressName}
                      </ProDescriptions.Item>
                      <ProDescriptions.Item
                        label="运单编号"
                      >
                        {ele.shippingCode}
                      </ProDescriptions.Item>
                      <ProDescriptions.Item
                        label="物流进度"
                      >
                        <p className={styles.schedule}>{ele.lastStatus}</p>
                      </ProDescriptions.Item>

                      <ProDescriptions.Item
                        fieldProps={{}}
                      >
                        <LogisticsTrackingModel
                          record={ele.deliveryList}
                          title={'物流跟踪'}
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
                  商品信息
                </div>
                {
                  detailData?.goodsInfo?.map((item, index) => (
                    <div key={item.id} className={styles.box}>
                      <div>商品{index + 1}</div>
                      <div className={styles.box_wrap}>
                        <div className={styles.box}>
                          <div>商品名称</div>
                          <div>{item.goodsName}</div>
                        </div>
                        <div className={styles.box}>
                          <div>规格</div>
                          <div>{item.skuName}</div>
                        </div>
                        <div className={styles.box}>
                          <div>{({ 2: '秒约', 3: '拼团', 4: '团约' }[detailData.orderType] || '秒约')}价</div>
                          <div>{amountTransform(item.skuSalePrice, '/')}元</div>
                        </div>
                        <div className={styles.box}>
                          <div>购买数量</div>
                          <div>{item.skuNum}{item.unit}</div>
                        </div>
                        <div className={styles.box}>
                          <div>小计</div>
                          <div>{amountTransform(item.totalAmount, '/')}元</div>
                        </div>
                      </div>
                    </div>
                  ))
                }
                <div className={styles.box}>
                  <div>买家留言</div>
                  <div>{detailData?.note}</div>
                </div>
              </div>
              <Space style={{ marginTop: 30 }}>
                <Button type="primary" onClick={() => { window.history.back(); setTimeout(() => { window.location.reload(); }, 200) }}>返回</Button>
              </Space>
            </div>
          </div>
        </div>
        <Modal
          title="物流跟踪"
          visible={expressInfoState.length}
          footer={[
            <Button type="primary" onClick={() => { setExpressInfoState([]) }}>
              确定
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
