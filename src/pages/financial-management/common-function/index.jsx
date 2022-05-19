import { Space } from 'antd'

import { amountTransform } from '@/utils/utils'

export const fashionableType = (data, amount, fee, couponAmount, realAmount) =>{
  return (
    <Space size={10}>
      <span>{data}: ¥{amountTransform(amount, '/')}</span>
      {
        (couponAmount !== '0' && couponAmount)&&
        <span>优惠金额: ¥{amountTransform(couponAmount, '/')}</span>
      }
      <span>交易通道费: ¥{amountTransform(fee, '/')}</span>
      {
        (realAmount !== '0' && realAmount)&&
        <span>到账金额: ¥{amountTransform(realAmount, '/')}</span>
      }
      
    </Space>
  )
}

export const backCalculation= (data, amount, fee)=> {
  return (
    <Space size={10}>
      <span>{data}回退: ¥{amountTransform(amount, '/')}</span>
      <span>交易通道费: ¥{amountTransform(fee, '/')}</span>
    </Space>
  )
}
