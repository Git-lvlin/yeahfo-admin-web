import React, { useState, useEffect } from 'react';
import { PageContainer } from '@/components/PageContainer';
import { Form, Table } from 'antd';
import { useParams } from 'umi';
import { amountTransform } from '@/utils/utils'
import { ruleDetail } from '@/services/single-contract-activity-management/activity-detail';
import moment from 'moment';

const ActivityDetail = () => {
  const [detailData, setDetailData] = useState({})
  const params = useParams();

  const formItemLayout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
    layout: {
      labelCol: {
        span: 10,
      },
      wrapperCol: {
        span: 14,
      },
    }
  };

  const columns = [
    // {
    //   title: 'spuID',
    //   dataIndex: 'spuId',
    //   valueType: 'text',
    //   width: 60,
    // },
    {
      title: 'skuID',
      dataIndex: 'skuId',
      valueType: 'text',
    },
    {
      title: '基本信息',
      dataIndex: 'goodsName',
      valueType: 'text',
      width: 300,
      render: (_, data) => (
        <div style={{ display: 'flex' }}>
          <img width="50" height="50" src={data.goodsImageUrl} />
          <div style={{ marginLeft: 10, wordBreak: 'break-all' }}>{_}</div>
        </div>
      )
    },
    {
      title: '结算模式',
      dataIndex: 'settleType',
      valueType: 'text',
      render: (_) => {
        return {
          1: '佣金模式',
          2: '底价模式'
        }[_]
      }
    },
    {
      title: '供货价',
      dataIndex: 'retailSupplyPrice',
      valueType: 'text',
      render: (_) => _ > 0 ? amountTransform(_, '/') : 0,
    },
    {
      title: '秒约价',
      dataIndex: 'salePrice',
      valueType: 'text',
      render: (_) => _ > 0 ? amountTransform(_, '/') : 0,
    },
    {
      title: '可用库存',
      dataIndex: 'stockNum',
      valueType: 'text',
    },
    {
      title: '单约价',
      dataIndex: 'activityPrice',
      valueType: 'text',
      render: (_) => _ > 0 ? amountTransform(_, '/') : 0,
    },
    {
      title: '单约库存',
      dataIndex: 'activityStockNum',
      valueType: 'text',
    },
  ];

  useEffect(() => {
    ruleDetail({
      id: params.id
    }).then(res => {
      if (res.code === 0) {
        setDetailData(res.data)
      }
    })
  }, [])

  return (
    <PageContainer>
      <Form
        {...formItemLayout}
        style={{ backgroundColor: '#fff', paddingTop: 10, paddingBottom: 100 }}
      >
        <Form.Item
          label="活动名称"
        >
          {detailData.activityName}
        </Form.Item>
        <Form.Item
          label="活动时间"
        >
          {moment(detailData.activityStartTime * 1000).format('YYYY-MM-DD HH:mm:ss')} ~
          {moment(detailData.activityEndTime * 1000).format('YYYY-MM-DD HH:mm:ss')}
        </Form.Item>
        <Form.Item
          label="参团(单约)人数"
        >
          {detailData.groupNum}人
        </Form.Item>
        <Form.Item
          label="单约拼约时长"
        >
          {detailData.groupTime}小时
        </Form.Item>
        <Form.Item
          label="单约虚拟成团"
        >
          {detailData.virtualType === 2 ? '开启' : '不开启'}
        </Form.Item>
        <Form.Item
          label="可参与活动的会员等级"
        >
          全部
        </Form.Item>
        <Form.Item
          label="活动商品"
        >
          <div style={{ marginBottom: 10 }}>{`共${detailData?.goodsList?.length}条`}</div>
          <Table
            dataSource={detailData.goodsList}
            columns={columns}
            pagination={false}
            style={{
              width: 900
            }}
          />
        </Form.Item>
        <Form.Item
          label="活动规则"
        >
          {detailData.activeRule}
        </Form.Item>
        <Form.Item
          label="创建人"
        >
          {detailData.adminName}
        </Form.Item>
        <Form.Item
          label="创建时间"
        >
          {detailData.createTime}
        </Form.Item>
      </Form>
    </PageContainer>
  )
};

export default ActivityDetail;
