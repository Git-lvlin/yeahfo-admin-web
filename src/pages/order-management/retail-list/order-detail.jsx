import {
  Drawer,
  Descriptions,
  Divider,
  Table,
  Row,
  Steps,
  Typography
} from 'antd';

const { Step } = Steps;
const { Title } = Typography;

const dataSource = [];

const columns = [
  {
    title: '序号',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: '收货人',
    dataIndex: 'age',
    key: 'age',
  },
  {
    title: '收货人手机号码',
    dataIndex: 'address',
    key: 'address',
  },
  {
    title: '收货地址',
    dataIndex: 'address',
    key: 'address',
  },
  {
    title: '默认地址',
    dataIndex: 'address',
    key: 'address',
  },
];

const OrderDetail = (onClose) => {
  return (
    <Drawer
      title="订单详情"
      width={1000}
      placement="right"
      onClose={onClose}
      visible
    >
      <Row>
        <Title style={{ marginBottom: -10 }} level={5}>订单日志</Title>
        <Divider />
        <Steps progressDot current={2}>
          <Step
            title="订单提交"
            description={(
              <>
                <div>会员（15876671229）</div>
                <div>2021-03-26 12:23:55</div>
              </>
            )} />
          <Step title="订单支付" />
          <Step title="订单发货" />
          <Step title="订单收货" />
          <Step title="订单完成" />
        </Steps>
      </Row>

      <Row style={{ marginTop: 50 }}>
        <Title style={{ marginBottom: -10 }} level={5}>基本信息</Title>
        <Divider />

        <Descriptions labelStyle={{ textAlign: 'right', width: 100, display: 'inline-block' }}>
          <Descriptions.Item label="订单编号">1032612238755</Descriptions.Item>
          <Descriptions.Item label="订单金额">3900.00 元</Descriptions.Item>
          <Descriptions.Item label="支付方式">微信支付</Descriptions.Item>
          <Descriptions.Item label="下单时间">2021-03-26 12:23:55</Descriptions.Item>
          <Descriptions.Item label="下单手机号">15822330965</Descriptions.Item>
          <Descriptions.Item label="支付时间">2021-03-26 12:26:21</Descriptions.Item>
          <Descriptions.Item label="商品共计">3920.00 元</Descriptions.Item>
          <Descriptions.Item label="优惠合计">50.00 元</Descriptions.Item>
          <Descriptions.Item label="运费合计">50.00 元</Descriptions.Item>
          <Descriptions.Item label="交易流水号">420000 093098 278998 882312 093321</Descriptions.Item>
        </Descriptions>
      </Row>

      <Row style={{ marginTop: 50 }}>
        <Title style={{ marginBottom: -10 }} level={5}>收货信息</Title>
        <Divider />

        <Descriptions>
          <Descriptions.Item label="收货人">周芷萱</Descriptions.Item>
          <Descriptions.Item label="收货手机号">15822330965</Descriptions.Item>
          <Descriptions.Item label="收货地址">
            广东省深圳市宝安区新安街道上川村文汇楼5栋宜家店
          </Descriptions.Item>
        </Descriptions>
      </Row>

      <Row style={{ marginTop: 50 }}>
        <Title style={{ marginBottom: -10 }} level={5}>物流信息</Title>
        <Divider />

        <Descriptions>
          <Descriptions.Item label="快递公司">速递</Descriptions.Item>
          <Descriptions.Item label="运单编号">SF21083048508</Descriptions.Item>
          <Descriptions.Item label="发货时间">
            2021-03-26 18:05:48
          </Descriptions.Item>
        </Descriptions>
      </Row>

      <Row style={{ marginTop: 50 }}>
        <Title style={{ marginBottom: -10 }} level={5}>收货地址</Title>
        <Divider />
        <Table style={{ width: '100%' }} pagination={false} dataSource={dataSource} columns={columns} />
      </Row>
    </Drawer>
  )
}

export default OrderDetail;
