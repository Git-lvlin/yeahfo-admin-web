import React from 'react'
import ProDescriptions from '@ant-design/pro-descriptions'
import styles from './styles.less'

const InterventionDetailStatus = props => {
  const { data } = props
  const columns = [
    {
      title: '售后编号',
      dataIndex: 'trSn'
    },
    {
      title: '退款状态',
      dataIndex: 'status',
      valueEnum: {
        1: '待退款',
        2: '退款中',
        3: '退款完成',
        4: '退款失败',
        6: '已取消',
      },
    },
    {
      title: '备注',
      dataIndex: 'refundMessage'
    },
  ]
  return (
      <ProDescriptions
        rowKey='poNo'
        className={styles.description}
        layout='horizontal'
        bordered
        title='售后单信息'
        column={1}
        dataSource={data}
        columns={columns}
      />
  )
}

export default InterventionDetailStatus