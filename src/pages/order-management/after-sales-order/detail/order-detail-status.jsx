import React from 'react'
import styles from './styles.less'

const AfterState = ({ stage, isIntervention }) => {
  const status = () => {
    switch(stage){
      case 1:
        return '待审核'
      case 2:
        return '处理中'
      case 3:
        return '已拒绝申请'
      case 4:
        return '已拒绝退款'
      case 5:
        return '已完成'
      case 6:
        return '已关闭'
    }
  }
  return (
    <div className={styles.detailTitle}>
      { status() }
      {
        isIntervention == 1 
        && <span className={styles.isIntervention}>平台已介入</span>
      }
    </div>
  )
}

const InterventionDetailStatus = props => {
  const { orderSn, status, platformInvolved } = props
  return (
    <div className={styles.orderDetail}>
      <div>
        <div className={styles.detailTag}>
          售后单号
          <span>{orderSn}</span>
        </div>
        <AfterState stage={status} isIntervention={platformInvolved}/>
      </div>
    </div>
  )
}

export default InterventionDetailStatus