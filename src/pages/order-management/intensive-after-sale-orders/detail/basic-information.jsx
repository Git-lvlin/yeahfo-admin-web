import React from 'react'
import ProDescriptions from '@ant-design/pro-descriptions'
import styles from './styles.less'
import './styles.less'

const BasicInformation = ({data}) => {
  const columns = [
    {
      title: '买家ID',
      dataIndex: 'storeNo'
    },
    {
      title: '买家昵称',
      dataIndex: 'storeName'
    },
    {
      title: '买家手机号',
      dataIndex: 'memberPhone'
    },
    {
      title: '商家ID',
      dataIndex: 'supplierId'
    },
    {
      title: '商家名称',
      dataIndex: 'goodsName'
    },
    {
      title: '商家手机号',
      dataIndex: 'storePhone',
      render:(_,data)=>{
        return <p>-</p>
      },
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
