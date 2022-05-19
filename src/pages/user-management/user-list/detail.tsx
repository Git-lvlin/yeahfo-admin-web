import React, { useEffect, useState } from 'react';
import { Drawer, Descriptions, Divider, Table, Row, Avatar, Typography, Spin } from 'antd';
import { getMemberDetail } from '@/services/user-management/user-list';


const { Title } = Typography;

const columns = [
  {
    title: '序号',
    dataIndex: 'index',
    render: ($, _, index: number) => index + 1
  },
  {
    title: '收货人',
    dataIndex: 'consignee',
  },
  {
    title: '收货人手机号码',
    dataIndex: 'phone',
  },
  {
    title: '收货地址',
    dataIndex: 'fullAddress',
  },
  {
    title: '默认地址',
    dataIndex: 'isDefault',
    render: (_) => _ ? '是' : '否'
  },
];

const sourceType = {
  1: 'vivo',
  2: '小米',
  3: '应用宝',
  4: '小程序',
  5: '移动端浏览器',
  6: '官方渠道',
  7: '魅族',
  8: 'oppo',
  9: '华为',
  10: 'appStore',
  11: 'WEB',
}

type DetailProps = {
  visible: boolean,
  setVisible: (v: boolean) => void,
  id: string,
}

type DataType = {
  memberInfoToAdminResponse?: {
    icon: string,
    nickName: string,
    phoneNumber: string,
    sourceType: string,
    inviteCode: string,
    gender: number,
    userType: number,
    createTime: string,
    uId: string,
    loginTime: string,
    [x: string]: any
  },
  [x: string]: any
}

const Detail: React.FC<DetailProps> = (props) => {
  const { visible, setVisible, id } = props;
  const [detailData, setDetailData] = useState<DataType>({});
  const { memberInfoToAdminResponse: info } = detailData;
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (getMemberDetail({
      id
    }) as Promise<{ data: DataType, code: number }>).then(res => {
      if (res.code === 0) {
        setDetailData(res.data)
      }
    }).finally(() => {
      setLoading(false);
    })
  }, [id])

  return (
    <Drawer
      title="用户详情"
      width={1200}
      placement="right"
      onClose={() => { setVisible(false) }}
      visible={visible}
    >
      <Spin spinning={loading}>
        <div style={{ background: '#fff', padding: 25 }}>
          <Row >
            <Title style={{ marginBottom: -10 }} level={5}>基本信息</Title>
            <Divider />
            <div style={{ textAlign: 'center' }}>
              <Avatar size={100} src={info?.icon} />
              <div>{info?.nickName}</div>
            </div>
            <Descriptions style={{ flex: 1 }} labelStyle={{ textAlign: 'right', width: 100, display: 'inline-block' }}>
              <Descriptions.Item label="下单手机号">{info?.phoneNumber}</Descriptions.Item>
              <Descriptions.Item label="注册来源">{sourceType[info?.sourceType as string]}</Descriptions.Item>
              <Descriptions.Item label="邀请码">
                {info?.inviteCode}
              </Descriptions.Item>
              <Descriptions.Item label="性别">{info?.gender === 1 ? '男' : '女'}</Descriptions.Item>
              <Descriptions.Item label="社区店主">
                {info?.userType === 1 ? '是' : '否'}
              </Descriptions.Item>
              <Descriptions.Item label="注册时间">
                {info?.createTime}
              </Descriptions.Item>
              <Descriptions.Item label="微信账号">
                {info?.uId}
              </Descriptions.Item>
              {/* <Descriptions.Item label="所属小区">
              满京华-艺峦大厦
            </Descriptions.Item> */}
              <Descriptions.Item label="最近登录时间">
                {info?.loginTime}
              </Descriptions.Item>
              <Descriptions.Item label="出生日期">
                {info?.birthday}
              </Descriptions.Item>
              <Descriptions.Item label="职业">
                {info?.job}
              </Descriptions.Item>
              <Descriptions.Item label="学历">
                {info?.education}
              </Descriptions.Item>
              <Descriptions.Item label="地区">
                {info?.provinceName} {info?.cityName} {info?.districtName}
              </Descriptions.Item>
              <Descriptions.Item label="收入水平">
                {info?.incomes}
              </Descriptions.Item>
              <Descriptions.Item label="关注的品类">
                {info?.categoryIds}
              </Descriptions.Item>
            </Descriptions>
          </Row>

          <Row style={{ marginTop: 50 }}>
            <Title style={{ marginBottom: -10 }} level={5}>收货地址</Title>
            <Divider />
            <Table style={{ width: '100%' }} pagination={false} dataSource={detailData?.memberAddressResp} columns={columns} />
          </Row>
        </div>
      </Spin>
    </Drawer>
  )
}

export default Detail;
