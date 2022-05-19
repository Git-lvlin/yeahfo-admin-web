import React, { useState, useMemo } from 'react';
import { Select, Spin } from 'antd';
import debounce from 'lodash/debounce';
import { supplierList } from '@/services/common';

const DebounceSelect = (props) => {
  const [fetching, setFetching] = useState(false);
  const [options, setOptions] = useState([]);
  const debounceFetcher = useMemo(() => {
    const loadOptions = (value) => {
      setOptions([]);
      setFetching(true);
      supplierList({
        supplierId: value
      }).then((res) => {
        if (res.code === 0) {
          setOptions(res.data.records.map(item => ({ label: item.id, value: item.id })));
        }

        setFetching(false);
      });
    };

    return debounce(loadOptions, 800);
  }, []);
  return (
    <Select
      filterOption={false}
      onSearch={debounceFetcher}
      notFoundContent={fetching ? <Spin size="small" /> : null}
      {...props}
      options={options}
      placeholder="请输入供应商家ID"
      showSearch
    />
  );
}

export default DebounceSelect;
