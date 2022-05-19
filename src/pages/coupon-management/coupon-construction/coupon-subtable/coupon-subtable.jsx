import React, { useState,useEffect } from 'react';
import ProTable from '@ant-design/pro-table';
import { couponCrowdList } from '@/services/crowd-management/coupon-crowd';

export default (props) => {
    const [data, setData] = useState([])
    const {name}=props
    const columns = [
      {
        title: '选项',
        dataIndex: 'type',
        valueType: 'select',
        valueEnum: {
          1: '会员等级',
          2: '消费次数',
          3: '累计消费'
        },
        hideInSearch: true,
    },
      {
          title: '范围',
          dataIndex: 'isContain',
          valueType: 'select',
          valueEnum: {
            1: '包含',
            2: '不包含',
          },
          hideInSearch: true,
      },
      {
          title: '条件',
          dataIndex: 'msgDisplay',
          hideInSearch: true,
      }
    ];
    useEffect(() => {
      couponCrowdList({
        name:name
      }).then(res => {
        if (res.code === 0) {
          setData(res?.data?.[0].crowdInfo)
        }
      })
    }, [])
    return (
      <ProTable toolBarRender={false} search={false} key="type" columns={columns} dataSource={data} pagination={false} />
    )
  };