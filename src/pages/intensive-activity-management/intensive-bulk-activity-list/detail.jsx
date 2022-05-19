import React from 'react';
import { Drawer, Descriptions, Divider, Table, Row, Typography } from 'antd';
import { amountTransform } from '@/utils/utils'

const { Title } = Typography;


const columns = [
  {
    title: 'spuID',
    dataIndex: 'spuId',
  },
  {
    title: 'skuID',
    dataIndex: 'skuId',
  },
  {
    title: '规格',
    dataIndex: 'skuNameDisplay',
  },
  {
    title: '商品名称',
    dataIndex: 'goodsName',
  },
  {
    title: '供应商家ID',
    dataIndex: 'supplierId',
  },
  // {
  //   title: '结算类型',
  //   dataIndex: 'settleType',
  //   render: (_) => {
  //     return {
  //       0: '全部',
  //       1: '佣金模式',
  //       2: '底价模式'
  //     }[_]
  //   }
  // },
  {
    title: '集约分成比例',
    dataIndex: 'settlePercent',
    render: (_) => `${amountTransform(_)}%`
  },
  {
    title: '供货价',
    dataIndex: 'wholesaleSupplyPrice',
    render: (_) => amountTransform(_, '/')
  },
  {
    title: '市场价',
    dataIndex: 'marketPrice',
    render: (_) => amountTransform(_, '/')
  },
  {
    title: '集约库存',
    dataIndex: 'totalStockNum',
  },
  {
    title: '集约价',
    dataIndex: 'price',
    render: (_) => amountTransform(_, '/')
  },
  {
    title: '配送费补贴',
    dataIndex: 'fixedPrice',
    render: (_) => amountTransform(_, '/')
  },
  {
    title: '单店起订量',
    dataIndex: 'minNum',
  },
  {
    title: '单店限订量',
    dataIndex: 'maxNum',
  },
  {
    title: '集约全款金额',
    dataIndex: 'totalMoney',
    render: (_) => amountTransform(_, '/')
  },
];

const Detail = ({ onClose, visible, detailData }) => {
  const { wholesale } = detailData;
  return (
    <Drawer
      title="活动详情"
      width={1400}
      placement="right"
      onClose={onClose}
      visible={visible}
    >
      <Row>
        <Title style={{ marginBottom: -10 }} level={5}>活动商品</Title>
        <Divider />
        <Table style={{ width: '100%' }} rowKey="skuId" pagination={false} dataSource={detailData.sku} columns={columns} />
      </Row>

      <Row style={{ marginTop: 50 }}>
        <Title style={{ marginBottom: -10 }} level={5}>活动参数</Title>
        <Divider />
        <Descriptions labelStyle={{ textAlign: 'right', width: 150, display: 'inline-block' }}>
          <Descriptions.Item label="活动名称">{wholesale.name}</Descriptions.Item>
          <Descriptions.Item label="活动时间"><span style={{ position: 'absolute', marginTop: -10 }}>{wholesale.wholesaleStartTime}<br />{wholesale.wholesaleEndTime}</span></Descriptions.Item>
          <Descriptions.Item label="采购单下单截止时间">
            {wholesale.endTimeAdvancePayment}
          </Descriptions.Item>
          <Descriptions.Item label="可购买的社区店等级">{wholesale.storeLevel}</Descriptions.Item>
          <Descriptions.Item label="可购买的会员用户">
            {wholesale.memberLevel}
          </Descriptions.Item>
          {/* <Descriptions.Item label="可恢复支付次数">
            {wholesale.canRecoverPayTimes}
          </Descriptions.Item>
          <Descriptions.Item label="每次恢复支付时长">
            {wholesale.recoverPayTimeout / 3600}小时
          </Descriptions.Item> */}
        </Descriptions>
      </Row>

    </Drawer>
  )
}

export default Detail;
