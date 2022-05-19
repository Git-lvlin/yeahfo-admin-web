import React from 'react'
import ProDescriptions from '@ant-design/pro-descriptions'
import styles from './styles.less'
import './styles.less'

const BasicInformation = ({data}) => {
  const columns = [
    {
      title: '买家ID',
      dataIndex: 'userId'
    },
    {
      title: '买家昵称',
      dataIndex: 'buyerNickname'
    },
    {
      title: '买家手机号',
      dataIndex: 'buyerPhone'
    },
    {
      title: '商家ID',
      dataIndex: 'storeNo'
    },
    {
      title: '商家名称',
      dataIndex: 'storeName'
    },
    {
      title: '商家手机号',
      dataIndex: 'storePhone'
    },
  ]
  return (
    <ProDescriptions
      rowKey='orderNumber'
      className={styles.description}
      layout='horizontal'
      bordered
      title='买卖方基本信息'
      column={1}
      dataSource={data}
      columns={columns}
    />
  )
}

export default BasicInformation
