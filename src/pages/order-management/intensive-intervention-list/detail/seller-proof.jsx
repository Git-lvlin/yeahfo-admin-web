import React from 'react'
import ProDescriptions from '@ant-design/pro-descriptions'
import ProCard from '@ant-design/pro-card'
import { Image } from 'antd'

import styles from './styles.less'
import './styles.less'

const BuyerProof = props => {
  const { platformOpinion, data, storeEvidenceImg } = props
  const columns = [
    {
      title: '供应商家ID',
      dataIndex: 'supplierId'
    }
  ]

  const imageArr = () => {
    const imgUrl = storeEvidenceImg?.split(',')
    return imgUrl?.map((url) => {
      if(url) {
        return (
          <Image
            key={url}
            width={80}
            height={80}
            src={url}
          />
        )
      }
    })
  }

  return (
    <>
      <ProCard.Group>
        <ProDescriptions
          rowKey='orderNumber'
          className={styles.description}
          layout='horizontal'
          bordered
          title='卖方举证信息'
          column={1}
          dataSource={data}
          columns={columns}
        />
      </ProCard.Group>
      <ProCard.Group className={styles.tabelRow}>
        <ProCard bordered className={styles.item}>
          <div className={styles.itemOpinion}>
            原因描述：
            <span>{ platformOpinion }</span>
          </div>
          <div className={styles.itemImg}>
            <div className={styles.itemTxt}>申述凭证：</div>
            <Image.PreviewGroup>
              { imageArr() }
            </Image.PreviewGroup>
          </div>
        </ProCard>
      </ProCard.Group>
    </>
  )
}

export default BuyerProof
