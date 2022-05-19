import React, { useState, useEffect, useRef } from 'react'
import { Form, Button, Space, message } from 'antd'
import { EditableProTable } from '@ant-design/pro-table'
import moment from 'moment'
import {
  DrawerForm,
  ProFormText,
  ProFormRadio,
  ProFormDigit,
  ProFormCheckbox,
  ProFormTextArea,
  ProFormDateTimeRangePicker,
  ProFormSelect,
} from '@ant-design/pro-form'

import { amountTransform } from '@/utils/utils'
import { ruleSub, ruleEdit } from '@/services/single-contract-activity-management/activity-list'
import SelectProductModal from './select-product-modal'
import Upload from '@/components/upload'

export default (props) => {
  const { visible, setVisible, detailData, callback, onClose = () => { } } = props
  const [formVisible, setFormVisible] = useState(false)
  const [excelVisible, setExcelVisible] = useState(false)
  const [tableData, setTableData] = useState([])
  const [selectedRowKeys, setSelectedRowKeys] = useState([])
  const [defaultGroupNum, setDefaultGroupNum] = useState()

  const [formRef] = Form.useForm()

  const GroupNumEnum = {
    2: 2,
    3: 3,
    4: 4,
    5: 5,
    6: 6,
    7: 7,
    8: 8,
    9: 9
  }

  const cancel = (id) => {
    setTableData(tableData.filter(item => item.id !== id))
  }

  const batchCancel = () => {
    setTableData(tableData.filter(item => !selectedRowKeys.includes(item.id)))
    setSelectedRowKeys([])
  }

  const columns = [
    {
      title: 'skuID',
      dataIndex: 'skuId',
      valueType: 'text',
      editable: false,
      fixed: 'left',
      width: 'md'
    },
    {
      title: '基本信息',
      dataIndex: 'goodsName',
      valueType: 'text',
      editable: false,
      width: 200,
      render: (_, data) => (
        <div style={{ display: 'flex' }}>
          <img width="50" height="50" src={data.imageUrl || data.goodsImageUrl} />
          <div style={{ marginLeft: 10, wordBreak: 'break-all' }}>{_}</div>
        </div>
      )
    },
    {
      title: '零售供货价（元）',
      dataIndex: 'retailSupplyPrice',
      valueType: 'text',
      editable: false,
      render: (_) => _ > 0 ? amountTransform(_, '/') : 0
    },
    {
      title: '秒约价（元）',
      dataIndex: 'salePrice',
      valueType: 'text',
      editable: false,
      render: (_) => _ > 0 ? amountTransform(_, '/') : 0
    },
    {
      title: '市场价（元）',
      dataIndex: 'marketPrice',
      valueType: 'text',
      editable: false,
      render: (_) => _ > 0 ? amountTransform(_, '/') : 0
    },
    {
      title: '可用库存',
      dataIndex: 'stockNum',
      valueType: 'text',
      editable: false
    },
    {
      title: '拼团价（元）',
      dataIndex: 'activityPrice',
      valueType: 'digit',
      editable: (_, data) => {
        return data.settleType !== 1
      },
      render: (_) => _ > 0 ? amountTransform(_, '/') : 0
    },
    {
      title: '拼团库存',
      dataIndex: 'activityStockNumEdit',
      valueType: 'digit',
      formItemProps: {
        rules: [
          {
            pattern: /^((0)|([1-9][0-9]*))$/,
            message: '拼团库存只能输入正整数'
          }
        ]
      }
    },
    {
      title: '成团人数',
      dataIndex: 'defaultGroupNum',
      valueType: 'select',
      valueEnum: GroupNumEnum,
      fieldProps: {
        defaultValue: defaultGroupNum
      }
    },
    {
      title: '限新人参团',
      dataIndex: 'memberType',
      valueType: 'switch'
    },
    {
      title: '操作',
      valueType: 'options',
      render: (_, data) => <a onClick={() => { cancel(data.id) }}>取消参加</a>,
      editable: false,
      fixed: 'right',
      width: 'md'
    },
  ];

  const [form] = Form.useForm()
  const formItemLayout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 20 },
    layout: {
      labelCol: {
        span: 4,
      },
      wrapperCol: {
        span: 14,
      },
    }
  };


  const submit = (values) => {
    const { activityTime, checkbox, ...rest } = values
    return new Promise((resolve, reject) => {
      const apiMethod = detailData ? ruleEdit : ruleSub
      for (let i = 0; i < tableData.length; i++) {
        const reg = /^((0)|([1-9][0-9]*))$/
        if (tableData[i].activityStockNumEdit === '') {
          message.error(`请输入（skuId:${tableData[i].skuId}）拼团库存`)
          reject()
          return
        }
        if (!reg.test(tableData[i].activityStockNumEdit)) {
          message.error(`skuId:${tableData[i].skuId}拼团库存只能输入正整数`)
          reject()
          return
        }
        if (!detailData && tableData[i].activityStockNumEdit > (parseFloat(tableData[i].stockNum / 2))) {
          message.error(`skuId:${tableData[i].skuId}拼团库存需要小于商品库存50%`)
          reject()
          return
        }
      }
      apiMethod({
        id: detailData?.id,
        activityStartTime: moment(activityTime[0]).unix(),
        activityEndTime: moment(activityTime[1]).unix(),
        activityType: 3,
        goodsInfo: tableData.map(item => {
          const memberType = item.memberType ? '1' : '0'
          return {
            spuId: item.spuId,
            skuId: item.skuId,
            settleType: item.settleType,
            retailSupplyPrice: item.retailSupplyPrice,
            activityPrice: amountTransform(item.activityPrice, '*'),
            stockNum: item.stockNum,
            activityStockNum: +item.activityStockNumEdit,
            defaultGroupNum: +item.defaultGroupNum || +defaultGroupNum,
            memberType,
            salePrice: item.salePrice,
            marketPrice: item.marketPrice
          }
        }),
        ...rest,
      }, { showSuccess: true }).then(res => {
        if (res.code === 0) {
          resolve();
          callback();
        } else {
          reject();
        }
      })
    })
  }

  useEffect(() => {
    if (detailData) {
      setDefaultGroupNum(detailData.defaultGroupNum)
      form.setFieldsValue({
        activityTime: [detailData.activityStartTime * 1000, detailData.activityEndTime * 1000],
        ...detailData,
      })

      setTableData(detailData.goodsList.map(item => ({
        ...item,
        activityStockNumEdit: +item.activityStockNum,
        activityPrice: amountTransform(item.activityPrice, '/')
      })))
    }
  }, [form, detailData]);

  return (
    <DrawerForm
      title={`${detailData ? '编辑' : '新建'}活动`}
      onVisibleChange={setVisible}
      drawerProps={{
        forceRender: true,
        destroyOnClose: true,
        width: 1200,
        onClose: () => {
          onClose();
        }
      }}
      form={form}
      onFinish={async (values) => {
        try {
          await submit(values);
          return true;
        } catch (error) {
          console.log(error)
        }
      }}
      visible={visible}
      initialValues={{
        checkbox: [1],
        virtualType: 2,
      }}
      {...formItemLayout}
    >
      <ProFormText
        name="activityName"
        label="活动名称"
        placeholder="请输入活动名称"
        rules={[{ required: true, message: '请输入活动名称' }]}
        fieldProps={{
          maxLength: 30,
        }}
        width="md"
      />
      <ProFormDateTimeRangePicker
        name="activityTime"
        label="活动时间"
        rules={[{ required: true, message: '请选择活动时间' }]}
        width="md"
      />

      <ProFormSelect
        placeholder="请选择拼团人数"
        label="成团人数"
        name="defaultGroupNum"
        valueEnum={ GroupNumEnum }
        rules={[
          { required: true, message: '请选择成团人数' },
          () => ({
            validator(_, value) {
              if (`${value}`.indexOf('.') !== -1) {
                return Promise.reject(new Error('请输入整数'));
              }
              return Promise.resolve()
            },
          })
        ]}
        extra={
          <>
            <Button disabled type='default' style={{ position: 'absolute', left: 325, top: 0, cursor: 'default' }}>人</Button>
            <span style={{ color: 'rgb(234, 154, 0)' }}>一键设置所有活动商品的成团人数</span>
          </>
        }
        width="md"
        fieldProps={{
          onChange: e => setDefaultGroupNum(e)
        }}
      />

      <ProFormDigit
        placeholder="请输入1-96之间的整数"
        label="拼团时长"
        name="groupTime"
        min={1}
        max={96}
        step
        rules={[
          { required: true, message: '请输入拼团时长' },
          () => ({
            validator(_, value) {
              if (`${value}`.indexOf('.') !== -1) {
                return Promise.reject(new Error('请输入1-96之间的整数'));
              }
              return Promise.resolve();
            },
          })
        ]}
        extra={<><span style={{ position: 'absolute', left: 270, top: 5 }}>小时</span></>}
        width="md"
      />

      <ProFormRadio.Group
        name="virtualType"
        label="虚拟成团状态"
        rules={[{ required: true }]}
        options={[
          {
            label: '开启',
            value: 2
          },
          {
            label: '不开启',
            value: 1
          },
        ]}
        extra={
          <>
            <div>开启虚拟成团后，当拼团时长到期时，对人数未满的团，系统将会模拟匿名买家凑满人数，使该团成团，开启以提高成团率</div>
            <div style={{ color: 'rgb(234, 154, 0)' }}>限新人参团的商品固定不开启虚拟成团</div>
          </>
        }
      />

      <Form.Item
        label="活动商品"
      >
        <Space style={{ marginBottom: 10 }}>
          <Button type="primary" onClick={() => { setFormVisible(true) }}>选择活动商品</Button>
          <Button type="primary" disabled={selectedRowKeys.length === 0} onClick={() => { batchCancel() }}>批量取消</Button>
        </Space>
        {
          !!tableData.length &&
          <>
            <EditableProTable
              value={tableData}
              columns={columns}
              pagination={{
                pageSize: 5
              }}
              scroll={{ x: 'max-content' }}
              rowKey="id"
              rowSelection={{
                selectedRowKeys,
                onChange: (_) => {
                  setSelectedRowKeys(_);
                }
              }}
              editable={{
                editableKeys: tableData.map(item => item.id),
                onValuesChange: (record, recordList) => {
                  setTableData(recordList);
                },
              }}
              recordCreatorProps={false}
              tableAlertRender={false}
            />
          </>

        }
      </Form.Item>
      <ProFormTextArea
        name="activeRule"
        label="活动规则"
        placeholder="请输入活动规则"
        width={500}
        fieldProps={{
          showCount: true,
          maxLength: 2000
        }}
        rules={[
          () => ({
            validator(_, value) {
              if (value.length < 5) {
                return Promise.reject(new Error('请输入5-2000个字符'))
              }
              return Promise.resolve()
            },
          })
        ]}
      />

      {
        formVisible &&
        <SelectProductModal
          visible={formVisible}
          setVisible={setFormVisible}
          callback={(v) => {
            setTableData(v.map(item => {
              return { ...item }
            }))
          }}
          skuData={tableData}
        />
      }
    </DrawerForm>
  )
}