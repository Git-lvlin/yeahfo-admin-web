import React, { useState, useEffect } from 'react';
import { Drawer, Space, Button, Modal, Steps, Spin } from 'antd';
import { findAdminOrderDetail } from '@/services/order-management/normal-order-detail';
import { amountTransform, dateFormat  } from '@/utils/utils'
import ProDescriptions from '@ant-design/pro-descriptions';
import LogisticsTrackingModel from '@/components/Logistics-tracking-model'
import styles from './detail.less';

const { Step } = Steps;

const Detail = (props) => {
  const { visible, setVisible, id } = props;
  const [detailData, setDetailData] = useState({});
  const [loading, setLoading] = useState(false);
  const [expressInfoState, setExpressInfoState] = useState([])

  const getDetailData = () => {
    setLoading(true);
    findAdminOrderDetail({
      id
    }).then(res => {
      if (res.code === 0) {
        setDetailData(res.data)
      }
    }).finally(() => {
      setLoading(false);
    })
  }

  const getCurrent = () => {
    let current = 0;
    detailData?.nodeList?.forEach(item => {
      if (item.eventTime) {
        current += 1;
      }
    })
    return current - 1;
  }

  useEffect(() => {
    getDetailData();
  }, [])

  return (
    <Drawer
      title="订单详情"
      width={1200}
      placement="right"
      onClose={() => { setVisible(false) }}
      visible={visible}
      footer={
        <div style={{ textAlign: 'right' }}>
          <Space>
            <Button onClick={() => { setVisible(false) }}>返回</Button>
          </Space>
        </div>
      }
    >
      <Spin spinning={loading}>
        <div className={styles.order_detail}>
          <Steps progressDot current={getCurrent()}>
            {
              detailData?.nodeList?.map(item => (
                <Step title={item.event} description={<><div>{item.eventTime?.replace('T', ' ')}</div></>} />
              ))
            }
          </Steps>
          <div style={{ display: 'flex', marginTop: 30 }}>
            <div style={{ flex: 1, marginRight: 30 }}>
              <div className={styles.box_wrap}>
                <div className={`${styles.box} ${styles.box_header}`}>
                  订单信息
                </div>
                <div className={styles.box}>
                  <div>所属商家</div>
                  <div>{detailData.storeName}</div>
                </div>
                <div className={styles.box}>
                  <div>订单状态</div>
                  <div>{{ 1: '待付款', 2: '待发货', 3: '已发货', 4: '已完成', 5: '已关闭', 6: '无效订单', 7: '待分享' }[detailData.status]}</div>
                </div>
                <div className={styles.box}>
                  <div>订单号</div>
                  <div>{detailData.orderSn}</div>
                </div>
                <div className={styles.box}>
                  <div>下单时间</div>
                  <div>{detailData.createTime?.replace('T', ' ')}</div>
                </div>
                <div className={styles.box}>
                  <div>下单用户</div>
                  <div>{detailData.buyerNickname}</div>
                </div>
                <div className={styles.box}>
                  <div>用户手机号</div>
                  <div>{detailData.buyerPhone}</div>
                </div>
                <div className={styles.box}>
                  <div>支付时间</div>
                  <div>{dateFormat(detailData?.payTime)}</div>
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
                {/* <div className={styles.box}>
                  <div>运费</div>
                  <div>+{amountTransform(detailData?.shippingFeeAmount, '/')}元</div>
                </div> */}
                <div className={styles.box}>
                  <div>红包</div>
                  <div>-{amountTransform(detailData?.couponAmount, '/')}元</div>
                </div>
                <div className={styles.box}>
                  <div>用户实付</div>
                  <div>{amountTransform(detailData?.payAmount, '/')}元</div>
                </div>
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
                    <div className={styles.box}>
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
                          <div>集约价</div>
                          <div>{amountTransform(item.skuSalePrice, '/')}元{!!item.wholesaleFreight && `（含平均运费¥${amountTransform(item.wholesaleFreight, '/')}/${item.unit}）`}</div>
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
            </div>
          </div>
        </div>
      </Spin>
    </Drawer>
  )
}

export default Detail;
