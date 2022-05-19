import React, { useState, useEffect } from 'react'
import { PageContainer } from '@ant-design/pro-layout'
import { Drawer, Form, Table } from 'antd'
import ProTable from '@ant-design/pro-table'
import { amountTransform } from '@/utils/utils'
import { ruleDetail } from '@/services/single-contract-activity-management/activity-detail'
import moment from 'moment'
import Upload from '@/components/upload'

const ActivityDetail = ({visible, onClose, id}) => {
  const [detailData, setDetailData] = useState({})

  const formItemLayout = {
    labelCol: { span: 4 },
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
    {
      title: 'skuID',
      dataIndex: 'skuId',
      valueType: 'text',
    },
    {
      title: '基本信息',
      dataIndex: 'goodsName',
      valueType: 'text',
      width: 200,
      render: (_, data) => (
        <div style={{ display: 'flex' }}>
          <img width="50" height="50" src={data.goodsImageUrl} />
          <div style={{ marginLeft: 10, wordBreak: 'break-all' }}>{_}</div>
        </div>
      )
    },
    {
      title: '零售供货价',
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
      title: '库存',
      dataIndex: 'stockNum',
      valueType: 'text'
    },
    {
      title: '拼团价',
      dataIndex: 'activityPrice',
      valueType: 'text',
      render: (_) => _ > 0 ? amountTransform(_, '/') : 0,
    },
    {
      title: '拼团库存',
      dataIndex: 'activityStockNum',
      valueType: 'text'
    },
    {
      title: '成团人数',
      dataIndex: 'defaultGroupNum',
      valueType: 'text'
    },
    {
      title: '限新人参团',
      dataIndex: 'memberType',
      valueType: 'select',
      valueEnum: {
        1: '是',
        0: '否'
      }
    }
  ]

  useEffect(() => {
    ruleDetail({ id }).then(res => {
      if (res.code === 0) {
        setDetailData(res.data)
      }
    })
  }, [])

  return (
    <Drawer
      title={false}
      width={1200}
      visible={visible}
      onClose={onClose}
    >
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
          label="拼团时长"
        >
          {detailData.groupTime}小时
        </Form.Item>
        <Form.Item
          label="虚拟成团状态"
        >
          {detailData.virtualType === 2 ? '开启' : '不开启'}
        </Form.Item>
        <Form.Item
          label="活动商品"
        >
          <div style={{ marginBottom: 10 }}>{`共${detailData?.goodsList?.length}条`}</div>
          <ProTable
            rowKey="skuId"
            search={false}
            toolBarRender={false}
            dataSource={detailData.goodsList}
            columns={columns}
            pagination={false}
            scroll={{x: 'max-content'}}
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
    </Drawer>
  )
};

export default ActivityDetail;
