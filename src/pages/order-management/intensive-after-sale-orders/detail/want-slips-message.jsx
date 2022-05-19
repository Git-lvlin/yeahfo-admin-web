import React from 'react'
import ProDescriptions from '@ant-design/pro-descriptions'
import styles from './styles.less'
import './styles.less'

const WantSlipsMessage = ({data}) => {
  const columns = [
    {
      title: '缺货退款单号',
      dataIndex: 'trSn'
    },
    {
      title: '关联集约采购单号',
      dataIndex: 'poNo'
    },
    {
      title: '集约活动ID',
      dataIndex: 'supplierId'
    },
    {
      title: '申请时间',
      dataIndex: 'createTime'
    }
  ]
  return (
    <ProDescriptions
      rowKey='poNo'
      className={styles.description}
      layout='horizontal'
      bordered
      title='缺货单信息'
      column={1}
      dataSource={data}
      columns={columns}
    />
  )
}

export default WantSlipsMessage
