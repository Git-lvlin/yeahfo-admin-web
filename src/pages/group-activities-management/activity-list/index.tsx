import { useState, useRef } from 'react'
import ProTable from '@ant-design/pro-table' 
import { PageContainer } from '@ant-design/pro-layout' 
import { 
  Button,
  Card, 
  Space, 
  Popconfirm,
  message 
} from 'antd' 
import { PlusOutlined } from '@ant-design/icons'

import { ruleList, ruleDetail, ruleEnd } from '@/services/single-contract-activity-management/activity-list' 
import moment from 'moment' 
import ActivityCrate from './activity-crate' 
import ActivityDetail from './activity-detail'
import ActivityGoods from './activity-goods'

import type { FC } from 'react'
import type { ProColumns, ActionType } from '@ant-design/pro-table'
import type { TableListItem } from '../data'

const TableList: FC = () => {

  const [visible, setVisible] = useState(false)
  const [detailVisible, setDetailVisible] = useState(false)
  const [goodsVisible, setGoodsVisible] = useState(false)
  const [detailData, setDetailData] = useState(null) 
  const [id, setId] = useState(0)
  const actionRef = useRef<ActionType>() 

  const getDetail = (id: number) => {
    ruleDetail({ id }).then(res => {
      if (res.code === 0) {
        setDetailData(res.data) 
        setVisible(true) 
      }
    })
  }

  const activityStop = (id: number) => {
    ruleEnd({ id }).then(res => {
      if (res.code === 0) {
        actionRef.current?.reload() 
        message.success('操作成功')
      }
    })
  }

  const columns: ProColumns<TableListItem>[] = [
    {
      title: '活动ID',
      dataIndex: 'id',
      valueType: 'text',
      width: '5%',
      fieldProps: {
        placeholder: '请输入活动ID'
      }
    },
    {
      title: '活动名称',
      dataIndex: 'activityName',
      valueType: 'text',
      width: '10%',
      fieldProps: {
        placeholder: '请输入活动名称'
      }
    },
    {
      title: '活动时间',
      dataIndex: 'activityStartTime',
      width: '10%',
      valueType: 'text',
      hideInSearch: true,
      render: (_, data) => (
        <>
          {moment(data.activityStartTime * 1000).format('YYYY-MM-DD HH:mm:ss')}
          <br />
          {moment(data.activityEndTime * 1000).format('YYYY-MM-DD HH:mm:ss')}
        </>
      )
    },
    {
      title: '拼团时长(小时)',
      dataIndex: 'groupTime',
      width: '5%',
      valueType: 'text',
      hideInSearch: true,
    },
    {
      title: '虚拟成团状态',
      width: '10%',
      dataIndex: 'virtualType',
      valueType: 'text',
      valueEnum: {
        2: '开启',
        1: '不开启'
      }
    },
    {
      title: '状态',
      width: '5%',
      dataIndex: 'activityStatus',
      valueType: 'text',
      valueEnum: {
        1: '待开始',
        2: '进行中',
        3: '已结束',
        4: '已终止'
      }
    },
    {
      title: '操作',
      width: '15%',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, data) => (
        <Space>
          <a onClick={() => { setGoodsVisible(true); setId(data.id) }}>活动商品</a>
          <a onClick={() => { setDetailVisible(true); setId(data.id) }}>详情</a>
          {data.activityStatus === 1
            &&
            <a onClick={() => { getDetail(data.id) }}>编辑</a>
          }
          {(data.activityStatus === 2 || data.activityStatus === 1)
            &&
            <Popconfirm
              title="终止后无法开启，你还要继续吗？"
              onConfirm={()=> activityStop(data.id)}
              okText="确认终止"
              cancelText="取消"
            >
              <a>终止</a>
            </Popconfirm>
          }
        </Space>
      ),
    },
  ] 

  return (
    <PageContainer title={false}>
      <Card>
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button key="out" type="primary" icon={<PlusOutlined />} onClick={() => { setVisible(true) }}>新建</Button>
        </div>
      </Card>
      <ProTable<TableListItem>
        rowKey="id"
        options={false}
        actionRef={actionRef}
        params={{
          activityType: 3,
        }}
        request={ruleList}
        search={{
          defaultCollapsed: false,
          labelWidth: 100,
          optionRender: (searchConfig, formProps, dom) => [
            ...dom.reverse(),
          ],
        }}
        columns={columns}
        pagination={{
          pageSize: 10
        }}
      />
      {
        visible &&
        <ActivityCrate
          visible={visible}
          setVisible={setVisible}
          callback={() => { actionRef.current?.reload() }}
          detailData={detailData}
          onClose={() => { setDetailData(null) }}
        />
      }
      {
        detailVisible&&
        <ActivityDetail
          visible={detailVisible}
          onClose={()=>{setDetailVisible(false)}}
          id={id}
        />
      }
      {
        goodsVisible&&
        <ActivityGoods
          visible={goodsVisible}
          onClose={()=>{setGoodsVisible(false)}}
          id={id}
        />
      }
    </PageContainer>

  ) 
} 

export default TableList 
