import React, { useState, useEffect } from 'react';
import { Select } from 'antd';
import { craztActivityRegList } from '@/services/cms/member/up-reg-select';

const CrazyAddActivityReg = ({ value, onChange }) => {
  const [memberRegData, setMemberRegData] = useState([]);

  useEffect(() => {
    craztActivityRegList()
      .then(res => {
        setMemberRegData(res.data.map(item => (item.name&&{ label: item.name, value: item.id })))
      })
    return () => {
      setMemberRegData([])
    }
  }, [])

  const changeHandle = (v) => {
    onChange(v)
  }
  return (
    <Select
      placeholder="请选择上传区域"
      options={memberRegData}
      value={value}
      onChange={changeHandle}
      allowClear
    />
  )
}

export default CrazyAddActivityReg;

