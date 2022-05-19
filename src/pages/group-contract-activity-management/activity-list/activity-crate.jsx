import React, { useState, useEffect } from 'react';
import { Form, Button, Space } from 'antd';
import { EditableProTable } from '@ant-design/pro-table';
import moment from 'moment';
import {
  DrawerForm,
  ProFormText,
  ProFormRadio,
  ProFormDigit,
  ProFormCheckbox,
  ProFormTextArea,
  ProFormDateTimeRangePicker,
} from '@ant-design/pro-form';
import { amountTransform } from '@/utils/utils'
import { ruleSub, ruleEdit } from '@/services/single-contract-activity-management/activity-list'
import SelectProductModal from '@/components/select-product-modal'
import ExcelModal from './excel-modal';


export default (props) => {
  const { visible, setVisible, detailData, callback, onClose = () => { } } = props;
  const [formVisible, setFormVisible] = useState(false)
  const [excelVisible, setExcelVisible] = useState(false)
  const [tableData, setTableData] = useState([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);

  const cancel = (id) => {
    setTableData(tableData.filter(item => item.id !== id))
  }

  const batchCancel = () => {
    setTableData(tableData.filter(item => !selectedRowKeys.includes(item.id)))
    setSelectedRowKeys([])
  }

  const columns = [
    {
      title: 'spuID',
      dataIndex: 'spuId',
      valueType: 'text',
      editable: false,
      width: 60,
    },
    {
      title: 'skuID',
      dataIndex: 'skuId',
      valueType: 'text',
      editable: false,
      width: 60,
    },
    {
      title: '基本信息',
      dataIndex: 'goodsName',
      valueType: 'text',
      editable: false,
      width: 300,
      render: (_, data) => (
        <div style={{ display: 'flex' }}>
          <img width="50" height="50" src={data.imageUrl || data.goodsImageUrl} />
          <div style={{ marginLeft: 10, wordBreak: 'break-all' }}>{_}</div>
        </div>
      )
    },
    {
      title: '结算模式',
      dataIndex: 'settleType',
      valueType: 'text',
      editable: false,
      valueEnum: {
        1: '佣金模式',
        2: '底价模式'
      },
      width: 80,
    },
    {
      title: '供货价',
      dataIndex: 'retailSupplyPrice',
      valueType: 'text',
      editable: false,
      render: (_) => _ > 0 ? amountTransform(_, '/') : 0,
      width: 80,
    },
    {
      title: '秒约价',
      dataIndex: 'salePrice',
      valueType: 'text',
      editable: false,
      render: (_) => _ > 0 ? amountTransform(_, '/') : 0,
      width: 80,
    },
    {
      title: '可用库存',
      dataIndex: 'stockNum',
      valueType: 'text',
      editable: false,
      width: 80,
    },
    {
      title: '团约价',
      dataIndex: 'activityPrice',
      valueType: 'text',
      editable: (_, data) => {
        return data.settleType !== 1
      },
      fieldProps: {
        placeholder: ''
      },
      width: 100,
    },
    {
      title: '团约库存',
      dataIndex: 'activityStockNumEdit',
      valueType: 'text',
      fieldProps: {
        placeholder: ''
      },
      width: 100,
    },
    {
      title: '团约默认开团人数',
      dataIndex: 'defaultGroupNum',
      valueType: 'text',
      width: 100,
      fieldProps: {
        placeholder: ''
      },
    },
    {
      title: '操作',
      valueType: 'options',
      render: (_, data) => <a onClick={() => { cancel(data.id) }}>取消参加</a>,
      editable: false,
      width: 80
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
    const { activityTime, checkbox, ...rest } = values;
    return new Promise((resolve, reject) => {
      const apiMethod = detailData ? ruleEdit : ruleSub
      apiMethod({
        id: detailData?.id,
        activityStartTime: moment(activityTime[0]).unix(),
        activityEndTime: moment(activityTime[1]).unix(),
        activityType: 4,
        goodsInfo: tableData.map(item => ({
          spuId: item.spuId,
          skuId: item.skuId,
          settleType: item.settleType,
          retailSupplyPrice: item.retailSupplyPrice,
          activityPrice: amountTransform(item.activityPrice),
          stockNum: item.stockNum,
          activityStockNum: +item.activityStockNumEdit,
          defaultGroupNum: item.defaultGroupNum,
        })),
        ...rest,
      }, { showSuccess: true }).then(res => {
        if (res.code === 0) {
          resolve();
          callback();
        } else {
          reject();
        }
      })
    });
  }

  useEffect(() => {
    if (detailData) {
      form.setFieldsValue({
        activityTime: [detailData.activityStartTime * 1000, detailData.activityEndTime * 1000],
        ...detailData,
      })

      setTableData(detailData.goodsList.map(item => ({
        ...item,
        activityStockNumEdit: item.activityStockNum,
        activityPrice: amountTransform(item.activityPrice, '/'),
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
        width: 1500,
        onClose: () => {
          onClose();
        }
      }}
      form={form}
      onFinish={async (values) => {
        await submit(values);
        return true;
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

      <ProFormDigit
        placeholder="请输入参团人数"
        label="参团(团约)人数"
        name="groupNum"
        min={1}
        max={99999}
        step
        rules={[
          { required: true, message: '请输入参团人数' },
          () => ({
            validator(_, value) {
              if (`${value}`.indexOf('.') !== -1) {
                return Promise.reject(new Error('请输入整数'));
              }
              return Promise.resolve();
            },
          })
        ]}
        extra={<><span style={{ position: 'absolute', left: 280, top: 5 }}>人</span></>}
        width="md"
      />

      <ProFormDigit
        placeholder="请输入1-720之间的整数"
        label="团约拼约时长"
        name="groupTime"
        min={1}
        max={720}
        step
        rules={[
          { required: true, message: '请输入团约拼约时长' },
          () => ({
            validator(_, value) {
              if (`${value}`.indexOf('.') !== -1) {
                return Promise.reject(new Error('请输入1-720之间的整数'));
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
        label="团约虚拟成团"
        rules={[{ required: true }]}
        options={[
          {
            label: '开启',
            value: 2,
          },
        ]}
        extra="开启虚拟成团后，当拼约时长到期时，对人数未满的团，系统将会模拟匿名买家凑满人数，使该团成团，开启以提高成团率"
      />

      <ProFormCheckbox.Group
        name="checkbox"
        label="可参与活动的会员等级"
        disabled
        options={[
          {
            label: '全部',
            value: 1,
          }
        ]}
      />

      <Form.Item
        label="活动商品"
      >
        <Space style={{ marginBottom: 10 }}>
          <Button type="primary" onClick={() => { setFormVisible(true) }}>选择活动商品</Button>
          <Button type="primary" disabled={selectedRowKeys.length === 0} onClick={() => { batchCancel() }}>批量取消</Button>
          <Button type="primary" onClick={() => { setExcelVisible(true) }}>批量导入</Button>
        </Space>
        {
          !!tableData.length &&
          <>
            <EditableProTable
              value={tableData}
              columns={columns}
              pagination={false}
              scroll={{ y: 300 }}
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
            {`共${tableData.length}条`}
          </>

        }
      </Form.Item>

      <ProFormTextArea
        name="activeRule"
        label="活动规则"
        placeholder="请输入活动规则"
        width="md"
      />

      {formVisible && <SelectProductModal
        visible={formVisible}
        setVisible={setFormVisible}
        callback={(v) => {
          setTableData(v.map(item => {
            return {
              ...item,
              activityPrice: amountTransform(item.retailSupplyPrice, '/')
            }
          }))
        }}
      />}
      {excelVisible &&
        <ExcelModal
          visible={excelVisible}
          setVisible={setExcelVisible}
          callback={(v) => {
            setTableData(v.map(item => {
              return {
                ...item,
                activityPrice: amountTransform(item.retailSupplyPrice, '/')
              }
            }))
          }}
        />
      }
    </DrawerForm>
  );
};