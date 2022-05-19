import React, { useState, useEffect } from 'react';
import { Cascader } from 'antd';
import { category } from '@/services/product-management/product-category';

const GcCascader = ({ value, onChange, isFresh, ...rest }) => {
  const [gcData, setGcData] = useState([]);
  const gcLoadData = (selectedOptions) => {
    const targetOption = selectedOptions[selectedOptions.length - 1];
    targetOption.loading = true;
    category({ gcParentId: targetOption.value, isFresh })
      .then(res => {
        targetOption.loading = false;
        targetOption.children = res.data.records.map(item => ({
          label: item.fresh !== 0 ? <>{item.gcName}<span type={item.fresh} style={{ color: 'green' }}>({{ 1: '精装生鲜', 2: '散装生鲜' }[item.fresh]})</span></> : item.gcName,
          value: item.id
        }));
        if (res.code === 0) {
          setGcData([...gcData])
        }
      })
  }

  const changeHandle = (v) => {
    onChange(v)
  }

  useEffect(() => {
    if (value) {
      const [gcId1] = value
      category({ gcParentId: 0, isFresh })
        .then(res => {
          if (res.code === 0) {
            const gcId = gcId1
            const index = res.data.records.findIndex(item => item.id === gcId);
            const data = res.data.records.map(item => ({
              label: item.fresh !== 0 ? <>{item.gcName}<span type={item.fresh} style={{ color: 'green' }}>({{ 1: '精装生鲜', 2: '散装生鲜' }[item.fresh]})</span></> : item.gcName,
              value: item.id,
              isLeaf: false
            }));
            setGcData(data)

            category({ gcParentId: gcId, isFresh })
              .then(res2 => {
                if (res2.code === 0 && data[index]) {
                  data[index].children = res2.data.records.map(item => ({
                    label: item.fresh !== 0 ? <>{item.gcName}<span type={item.fresh} style={{ color: 'green' }}>({{ 1: '精装生鲜', 2: '散装生鲜' }[item.fresh]})</span></> : item.gcName,
                    value: item.id
                  }));
                  if (res.code === 0) {
                    setGcData([...data])
                  }
                }
              })
          }
        })
    } else {
      category({ gcParentId: 0, isFresh })
        .then(res => {
          if (res.code === 0) {
            const data = res.data.records.map(item => ({
              label: item.fresh !== 0 ? <>{item.gcName}<span type={item.fresh} style={{ color: 'green' }}>({{ 1: '精装生鲜', 2: '散装生鲜' }[item.fresh]})</span></> : item.gcName,
              value: item.id,
              isLeaf: false
            }));
            setGcData(data)
          }
        })
    }

    return () => {
      setGcData([])
    }
  }, [])

  return (
    <Cascader
      value={value}
      onChange={changeHandle}
      options={gcData}
      placeholder="请选择商品品类"
      loadData={gcLoadData}
      displayRender={label => {
        if (label?.[0]?.props && label?.[1]?.props) {
          return <span>{label[0].props.children[0]}/{label[1].props.children[0]}<span style={{ color: 'green' }}>({label[0].props.children[1].props.type === 1 ? '精装生鲜' : '散装生鲜'})</span></span>
        }
        return label.join('/')
      }}
      {...rest}
    />
  )
}

export default GcCascader;

