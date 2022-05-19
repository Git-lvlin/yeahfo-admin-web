import React, { useState, useEffect } from 'react'
import { PageContainer } from '@/components/PageContainer';
import { Spin, Empty, Button } from 'antd'
import { useParams, history } from 'umi'

import {interventionListDetail, findReturnRecord} from '@/services/order-management/intensive-intervention-list'
import InterventionDetailStatus from './intervention-detail-status'
import PlatformDecision from './platform-decision'
import BuyerProof from './buyer-proof'
import SellerProof from './seller-proof'
import ReturnGoods from './return-goods'
import ReturnSingle from './return-single'
import NegotiationHistory from './negotiation-history'
import styles from './styles.less'

const Detail = () => {
  const { id } = useParams()
  const [detail, setDetail] = useState([])
  const [consultationRecord, setConsultationRecord] = useState([])
  const [loading, setLoading] = useState(false)
  const [flag, setFlag] = useState(false)
  useEffect(()=>{
    setLoading(true)
    interventionListDetail({id}).then(res=> {
      setDetail(res?.data)
    }).finally(()=> {
      setLoading(false)
    })
    return ()=>{
      setDetail([])
    }
  }, [flag])
  useEffect(()=>{
    if(detail != ![]) {
      findReturnRecord({refundId: detail?.refundId}).then(res=> {
        if(res?.success) {
          setConsultationRecord(res?.data)
        }
      })
    }
    return ()=>{
      setConsultationRecord([])
    }
  }, [detail])
  const handleBack = () => { window.history.back(); setTimeout(() => { window.location.reload(); }, 200) }
  return(
    <PageContainer title={false}>
      <Spin spinning={loading}>
        <InterventionDetailStatus
          orderId={detail?.refundId}
          type={detail?.refundType}
          supplierId={detail?.supplierId}
          id={id}
          change={setFlag}
          status={detail?.status}
          isArbitration={detail?.isArbitration}
        />
        {
          detail?.isPlatIntervention !== 1 &&
          <PlatformDecision
            platformOpinion={detail?.arbitrationResult?.description}
            data={detail?.arbitrationResult}
            platformEvidenceImg={detail?.arbitrationResult?.voucherPics}
          />
        }
        <BuyerProof 
          platformOpinion={detail?.buyer?.description}
          userEvidenceImg={detail?.buyer?.voucherPics}
          data={detail?.buyer}
        />
        <SellerProof 
           platformOpinion={detail?.business?.description}
           storeEvidenceImg={detail?.business?.voucherPics}
           data={detail}
        />
        <ReturnGoods data={detail}/>
        <ReturnSingle data={detail}/>
        { <div className={styles.negotiation}>协商历史</div> }
        {
          consultationRecord?.length === 0 ? 
          <Empty className={styles.empty}/>:
          <NegotiationHistory data={consultationRecord}/>
        }
        <div className={styles.btn}>
          <Button
            type='primary'
            size='large'
            onClick={handleBack}
          >
            返回
          </Button>
        </div>
      </Spin>
    </PageContainer>
  )
}

export default Detail
