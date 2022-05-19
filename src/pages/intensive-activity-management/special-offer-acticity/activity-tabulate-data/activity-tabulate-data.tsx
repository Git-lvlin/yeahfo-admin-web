import { useState,useEffect } from 'react';
import { Descriptions} from 'antd';
import { specialActivityDataSum } from '@/services/intensive-activity-management/special-offer-acticity';
import { PageContainer } from '@ant-design/pro-layout';
import { amountTransform } from '@/utils/utils'

interface Person{
  procurementStorekeeperNum:number,
  bProcurementOrderNum:number,
  bProcurementNum:number,
  cSaleNum:number,
  cSaleNewUser:number,
  cTranslateRate:string,
  activityShareUserNum:number,
  activityShareTimes:number,
  inviteRegisterNum:number
}

export default () => {
  const [detailList,setDetailList]=useState<Person>()
  useEffect(()=>{
    specialActivityDataSum({}).then(res=>{
        setDetailList(res.data[0])
      })
  },[])
    return (
      <PageContainer style={{background:'#fff'}} title=" ">
        <Descriptions labelStyle={{fontWeight:'bold'}} column={9} layout="vertical" bordered>
            <Descriptions.Item  label="采购店主数">{detailList?.procurementStorekeeperNum}  </Descriptions.Item>
            <Descriptions.Item  label="B端采购订单数">{detailList?.bProcurementOrderNum}  </Descriptions.Item>
            <Descriptions.Item  label="B端采购份数">{detailList?.bProcurementNum}  </Descriptions.Item>
            <Descriptions.Item  label="C端零售份数">{detailList?.cSaleNum}  </Descriptions.Item>
            <Descriptions.Item  label="C端转化率">{amountTransform(parseFloat(detailList?.cTranslateRate),'*').toFixed(2)}%</Descriptions.Item>
            {/* <Descriptions.Item  label="活动分享人数">{detailList?.activityShareUserNum||'-'}  </Descriptions.Item>
            <Descriptions.Item  label="活动分享次数">{detailList?.activityShareTimes||'-'}  </Descriptions.Item> */}
            <Descriptions.Item  label="受邀注册数（绑定关系）">{detailList?.inviteRegisterNum}  </Descriptions.Item>
        </Descriptions>
      </PageContainer>
    );
  };