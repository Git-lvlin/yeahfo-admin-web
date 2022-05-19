import React, { useState, useEffect } from 'react';
import { Select } from 'antd';
import { spaceClassList } from '@/services/cms/member/up-reg-select';

const MemberReg = ({ value, onChange }) => {
  const [memberRegData, setMemberRegData] = useState([]);

  useEffect(() => {
    spaceClassList({ page: 1, size: 9999 })
      .then(res => {
        setMemberRegData(res.data.map(item => (item.title&&{ label: item.title, value: item.id })))
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

export default MemberReg;

