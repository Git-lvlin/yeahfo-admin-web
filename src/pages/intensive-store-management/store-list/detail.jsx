import React, { useState, useEffect } from 'react';
import { Typography, Button, Drawer, Space, Spin, Row, Divider, Avatar, Descriptions, Image } from 'antd';
import { getDetail } from '@/services/intensive-store-management/store-detail';
import { amountTransform } from '@/utils/utils'
import Auth from '@/components/auth'
import AddressEdit from './address-edit';
import OrderDetail from '@/pages/order-management/normal-order/detail';


const { Title } = Typography;

const orderStatus = { 1: '待付款', 2: '待发货', 3: '已发货', 4: '已完成', 5: '已关闭' };

const Detail = ({ storeNo, visible, setVisible }) => {
  const [detailData, setDetailData] = useState({});
  const [loading, setLoading] = useState(false);
  const [edit, setEdit] = useState(false);
  const [orderDetailVisible, setOrderDetailVisible] = useState(false);
  const [selectItem, setSelectItem] = useState({});

  const getDetailRequest = () => {
    setLoading(true);
    getDetail({
      storeNo
    }).then(res => {
      if (res.code === 0) {
        setDetailData({
          ...res.data,
          storeNo,
        })
      }
    }).finally(() => {
      setLoading(false);
    })
  }

  useEffect(() => {
    if (detailData.storeName) {
      var marker = new AMap.Marker({
        position: new AMap.LngLat(detailData.longitude, detailData.latitude),
      });

      const map = new AMap.Map('container', {
        zoom: 20,
        center: [detailData.longitude, detailData.latitude],
      });
      map.add(marker)
    }
  }, [detailData])

  useEffect(() => {
    getDetailRequest();
  }, [])

  return (
    <Drawer
      title="店铺详情"
      width={1300}
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
        <div style={{ background: '#fff', padding: 25 }}>
          <Row >
            <Title style={{ marginBottom: -10 }} level={5}>基本信息</Title>
            <Divider />
            <div style={{ textAlign: 'center', marginRight: 40 }}>
              <Avatar size={100} src={detailData?.storeLogo} />
              <div style={{ marginTop: 10 }}>{detailData?.storeName}</div>
            </div>
            <div style={{ flex: 1 }}>
              <Descriptions labelStyle={{ textAlign: 'right', width: 140, display: 'inline-block' }}>
                <Descriptions.Item label="店主昵称手机号">{`${detailData?.member?.nickname === detailData.memberPhone ? '未设置昵称' : detailData?.member?.nickname}（${detailData.memberPhone}）`}</Descriptions.Item>
                <Descriptions.Item label="剩余保证金金额">{`¥${amountTransform(detailData?.memberShop?.deposit, '/')}`}</Descriptions.Item>
                {/* <Descriptions.Item label="店主性别">{detailData?.member?.gender?.desc}</Descriptions.Item> */}
                <Descriptions.Item label="缴纳保证金">¥{amountTransform(detailData?.deposit?.payAmount, '/')}（{detailData?.deposit?.payTime}）</Descriptions.Item>
                <Descriptions.Item label="缴纳保证金支付方式">{detailData?.deposit?.payType?.desc}</Descriptions.Item>
                <Descriptions.Item label="服务费金额">{`¥${amountTransform(detailData?.lastServiceFee?.payAmount, '/')}`}</Descriptions.Item>
                <Descriptions.Item label="缴纳服务费时间">{detailData?.lastServiceFee?.payTime}</Descriptions.Item>
                <Descriptions.Item label="缴纳服务费支付方式">{detailData?.lastServiceFee?.payType?.desc}</Descriptions.Item>
                <Descriptions.Item label="入驻时间">{detailData?.createTime}</Descriptions.Item>
                <Descriptions.Item label="注册时间">{detailData?.memberShop?.applyRow?.createTime}</Descriptions.Item>
                <Descriptions.Item label="申请类型">{{ 10: '正常申请', 20: '绿色通道申请' }[detailData?.memberShop?.applyType?.code]}</Descriptions.Item>
                {/* <Descriptions.Item label="微信账号">{detailData?.member?.wechatBindState?.desc}</Descriptions.Item> */}
                {/* <Descriptions.Item label="最近登录时间">{}</Descriptions.Item> */}
              </Descriptions>
              {detailData?.memberShop?.applyType?.code === 20 &&
                <div style={{ display: 'flex', marginBottom: 10 }}>
                  <div>绿色通道证明文件</div>
                  {
                    detailData?.memberShop?.applyRow?.credentialList.map(item => (<Image style={{marginRight: 10}} width={50} height={50} src={item} key={item} />))
                  }
                </div>
              }
              <div style={{ display: 'flex', marginBottom: 10 }}>
                <div>在平台购买生鲜柜的情况：</div>
                {
                  (detailData?.freshApplyRow?.id === 0 || detailData?.freshApplyRow?.details?.isOrdered === 0) && '未购买'
                }
                {
                  detailData?.freshApplyRow?.details?.isOrdered === 1 &&
                  <>购买生鲜柜订单号<a onClick={() => { setSelectItem({ id: detailData?.freshApplyRow?.details?.order?.id }); setOrderDetailVisible(true) }} >{detailData?.freshApplyRow?.details?.order?.orderSn}【{orderStatus[detailData?.freshApplyRow?.details?.order?.status]}】</a></>
                }
              </div>
              <div style={{ display: 'flex', marginBottom: 10 }}>
                <div>已有生鲜柜的情况：</div>
                {
                  !detailData?.freshApplyRow?.details?.attachList && '没有生鲜柜'
                }
                {
                  detailData?.freshApplyRow?.details?.attachList?.length > 0 && <>已有生鲜柜图片{detailData?.freshApplyRow?.details?.attachList.map(item => (<Image width={50} height={50} src={item} key={item} />))}</>
                }
              </div>
              <div style={{ display: 'flex', marginBottom: 10 }}>
                <div>必备礼包订单号：</div>
                {
                  detailData?.memberShop?.giftOrder?.isGiftOrdered === 0
                  && <span style={{ color: 'red' }}>没有购买记录 </span>
                }
                {
                  detailData?.memberShop?.giftOrder?.isGiftOrdered === 1
                  && <a onClick={() => { setSelectItem({ id: detailData?.memberShop?.giftOrder?.id }); setOrderDetailVisible(true) }}>{detailData?.memberShop?.giftOrder?.orderSn}【{orderStatus[detailData?.memberShop?.giftOrder?.status]}】 </a>
                }
              </div>
            </div>
          </Row>
          <Row>
            <Title style={{ marginBottom: -10, marginTop: 100 }} level={5}>地址信息</Title>
            <Divider />
            <Descriptions labelStyle={{ textAlign: 'right', width: 120, display: 'inline-block' }}>
              <Descriptions.Item label="所属地区">{detailData?.areaInfo?.[detailData?.provinceId]}{detailData?.areaInfo?.[detailData?.cityId]}{detailData?.areaInfo?.[detailData?.regionId]}</Descriptions.Item>
              <Descriptions.Item label="详细地址">{detailData?.address}</Descriptions.Item>
              <Descriptions.Item label="门牌号">{detailData?.houseNumber}</Descriptions.Item>
              <Descriptions.Item label="经纬度">{detailData?.longitude}，{detailData?.latitude}</Descriptions.Item>
              <Descriptions.Item label="小区名称">{detailData?.memberShop?.communityName}</Descriptions.Item>
              <Descriptions.Item label="收件手机号">{detailData?.phone}</Descriptions.Item>
              <Descriptions.Item label="配送范围">{detailData?.deliveryCoverage ? detailData?.deliveryCoverage / 1000 + 'km' : '店主未配置'}</Descriptions.Item>
            </Descriptions>
          </Row>
          {/* <Row>
            <Title style={{ marginBottom: -10, marginTop: 100 }} level={5}>审核认证资料</Title>
            <Divider />
            <Descriptions labelStyle={{ textAlign: 'right', width: 120, display: 'inline-block' }}>
              <Descriptions.Item label="姓名">{detailData?.memberShop?.applyRow?.realname}</Descriptions.Item>
              <Descriptions.Item label="身份证号码">{detailData?.memberShop?.applyRow?.idNumber}</Descriptions.Item>
            </Descriptions>
            <Descriptions labelStyle={{ textAlign: 'right', width: 120, display: 'inline-block' }}>
              <Descriptions.Item label="审核资料文件">
                <Space>
                  <Image width={100} src={detailData?.memberShop?.applyRow?.idFront} />
                  <Image width={100} src={detailData?.memberShop?.applyRow?.idBack} />
                  <Image width={100} src={detailData?.memberShop?.applyRow?.idHandheld} />
                </Space>
              </Descriptions.Item>
            </Descriptions>
          </Row> */}
          <Auth name="store/memberShop/changeAreaInfo">
            <Button type='primary' style={{ marginBottom: 20 }} onClick={() => { setEdit(true) }}>编辑</Button>
          </Auth>
          {
            edit && <AddressEdit visible={edit} setVisible={setEdit} data={detailData} callback={getDetailRequest} />
          }
          <div id="container" style={{ width: '100%', height: 500 }}></div>
        </div>
      </Spin>
      {
        orderDetailVisible &&
        <OrderDetail
          id={selectItem?.id}
          visible={orderDetailVisible}
          setVisible={setOrderDetailVisible}
        />
      }
    </Drawer>
  )
}

export default Detail;
