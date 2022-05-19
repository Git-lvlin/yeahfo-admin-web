import React, { useState, useEffect } from 'react'
import { Table } from 'antd';
import { amountTransform } from '@/utils/utils'
import Big from 'big.js';

Big.RM = 0;

const FreshIncome = ({ data, freshCommission, parse = false }) => {
  const [sourceData, setSourceData] = useState([]);
  const freshData = data.freshData[0];


  useEffect(() => {
    let price = data.price || 0
    if (parse) {
      price = amountTransform(price, '/')
    }

    const arr = [
      {
        shopCommission: `${price}*${amountTransform(freshCommission)}%*${amountTransform(freshData.shopCommission)}%`,
        operateCommission: `${price}*${amountTransform(freshCommission)}%*${amountTransform(freshData.operateCommission)}%`,
        referrerCommission: `${price}*${amountTransform(freshCommission)}%*${amountTransform(freshData.referrerCommission)}%`,
        platForm: `${price}*${amountTransform(freshCommission)}%*${amountTransform(freshData.platForm)}%`,
      },
      {
        shopCommission: `${+new Big(price).times(freshCommission).times(freshData.shopCommission).toFixed(2)}元/${data.unit}`,
        operateCommission: `${+new Big(price).times(freshCommission).times(freshData.operateCommission).toFixed(2)}元/${data.unit}`,
        referrerCommission: `${+new Big(price).times(freshCommission).times(freshData.referrerCommission).toFixed(2)}元/${data.unit}`,
        platForm: `${+new Big(price).times(freshCommission).times(freshData.platForm).toFixed(2)}元/${data.unit}`,
      },
    ]

    setSourceData(arr)
  }, [data, freshCommission])

  return (
    <>
      <Table
        title={() => "以五星社区店为例"}
        columns={[
          { title: '社区店', dataIndex: 'shopCommission' },
          { title: '运营中心', dataIndex: 'operateCommission' },
          { title: '推荐人', dataIndex: 'referrerCommission' },
          { title: '平台额外收益', dataIndex: 'platForm' },
        ]}
        dataSource={sourceData}
        pagination={false}
      />
      <div>各方分佣金额 = 集约价 * 总分佣比例 * 各方分佣比例</div>
    </>
  )
}

export default FreshIncome
