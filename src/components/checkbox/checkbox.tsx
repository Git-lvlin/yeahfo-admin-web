import React, { useState, useEffect } from 'react'
import { Checkbox } from 'antd'
import type { CheckboxChangeEvent } from 'antd/lib/checkbox'

const CheckboxGroup = Checkbox.Group

type CheckboxValueType = string | number | boolean

type CheckboxProps = {
  value?: CheckboxValueType[],
  onChange?: (v: CheckboxValueType[]) => void,
  options: [{ label: string, value: CheckboxValueType, disabled?: boolean }],
  checkAllText?: string,
}

const CheckBox: React.FC<CheckboxProps> = ({
  value = [],
  onChange = () => { },
  options,
  checkAllText = '全部'
}) => {
  const [checkedList, setCheckedList] = useState(value)
  const [checkAll, setCheckAll] = useState(false)

  const onChangeHandle = (list: CheckboxValueType[]) => {
    onChange(list)
    setCheckedList(list)
    setCheckAll(list.length === options.length)
  }

  const onCheckAllChange = (e: CheckboxChangeEvent) => {
    const list = e.target.checked ? options.map(item => item.value) : []
    setCheckedList(list)
    onChange(list)
    setCheckAll(e.target.checked)
  }

  useEffect(() => {
    setCheckAll(value.length === options.length)
  }, [value, options])

  return (
    <>
      <Checkbox onChange={onCheckAllChange} checked={checkAll}>
        {checkAllText}
      </Checkbox>
      <CheckboxGroup options={options} value={checkedList} onChange={onChangeHandle} />
    </>
  )
}

export default CheckBox
