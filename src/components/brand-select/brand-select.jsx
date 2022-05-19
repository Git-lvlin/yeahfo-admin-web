import React, { useState, useEffect } from 'react';
import { Select } from 'antd';
import { brand } from '@/services/product-management/brand-list';

const BrandSelect = ({ value, onChange, ...rest }) => {
  const [brandData, setBrandData] = useState([]);

  useEffect(() => {
    brand({ page: 1, size: 9999 })
      .then(res => {
        setBrandData(res.data.map(item => ({ label: item.brandName, value: item.brandId })))
      })
    return () => {
      setBrandData([])
    }
  }, [])

  const changeHandle = (v) => {
    onChange(v)
  }
  return (
    <Select
      placeholder="请选择品牌"
      options={brandData}
      value={value}
      onChange={changeHandle}
      allowClear
      {...rest}
    />
  )
}

export default BrandSelect;

