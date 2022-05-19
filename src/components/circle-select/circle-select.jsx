import React, { useState, useEffect } from 'react';
import { Select } from 'antd';
import { adminCircleList } from '@/services/community-management/circle-admin-circle-list';

const CircleSelect = ({ value, onChange, }) => {
  const [circleData, setCircleData] = useState([]);

  useEffect(()=>{
    adminCircleList({}).then(res=>{
        setCircleData(res.data.map(ele=>(
              {label:ele.name,value:ele.id}
          )))
      })
  },[])

  const changeHandle = (v) => {
    console.log('v',v)
    onChange(v)
  }
  return (
    <Select
      placeholder="发布圈子"
      options={circleData}
      value={value}
      onChange={changeHandle}
      allowClear
    />
  )
}

export default CircleSelect;

