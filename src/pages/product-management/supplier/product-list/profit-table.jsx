import React, { useMemo } from 'react';
import { EditableProTable } from '@ant-design/pro-table';
import debounce from 'lodash/debounce';
import Big from 'big.js';

Big.RM = 2;

const ProfitTable = ({ value, form, callback }) => {

  const columns = [
    {
      title: '店主补贴占比',
      dataIndex: 'tStoreScale',
      valueType: 'text',
      fieldProps: {
        addonAfter: '%',
        style: {
          width: 200,
        }
      },
    },
    {
      title: '平台毛利占比',
      dataIndex: 'tPlatformScale',
      valueType: 'text',
      fieldProps: {
        addonAfter: '%',
        style: {
          width: 200,
        },
        placeholder: '不低于5%'
      },
    },
    {
      title: '运营中心占比',
      dataIndex: 'tOperateScale',
      valueType: 'text',
      render: (_) => `${_}%`,
      editable: false,
    },
    {
      title: '供应商货款占比',
      dataIndex: 'tSupplierScale',
      valueType: 'text',
      render: (_) => `${_}%`,
      editable: false,
    },
    {
      title: '合计',
      dataIndex: 'e',
      valueType: 'text',
      render: (_, r) => `${+new Big(r.tStoreScale || 0).plus(r.tPlatformScale || 0).plus(r.tOperateScale || 0).plus(r.tSupplierScale || 0)}%`,
      editable: false,
    },
  ]

  const debounceFetcher = useMemo(() => {
    const loadData = (record, recordList) => {
      let arr = []
      if (record.tStoreScale !== value[0].tStoreScale) {
        arr = recordList.map(item => {
          return {
            ...item,
            tPlatformScale: +new Big(100).minus(item.tSupplierScale).minus(item.tOperateScale).minus(item.tStoreScale || 0).toFixed(2)
          }
        })

      } else {
        arr = recordList.map(item => {
          return {
            ...item,
            tStoreScale: +new Big(100).minus(item.tSupplierScale).minus(item.tPlatformScale || 0).minus(item.tOperateScale).toFixed(2)
          }
        })
      }

      form.setFieldsValue({
        test: arr
      })

      callback(arr)
    }
    return debounce(loadData, 1000);
  }, [value]);

  return (
    <EditableProTable
      columns={columns}
      rowKey="key"
      value={value}
      search={false}
      editable={{
        editableKeys: [1],
        onValuesChange: (record, recordList) => {
          debounceFetcher(record, recordList)

        }
      }}
      controlled
      scroll={{ x: 'max-content' }}
      bordered
      recordCreatorProps={false}
      tableAlertRender={false}
    />
  )
}

export default ProfitTable
