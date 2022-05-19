import { useState, useEffect, useRef } from 'react'
import ProForm, {
  ModalForm,
  ProFormText,
  ProFormRadio,
  ProFormDependency,
  ProFormDigit
} from '@ant-design/pro-form'

import styles from './styles.less'
import { ruleSkuStockSub } from '@/services/single-contract-activity-management/activity-product'

const EditTitle = ({goodsName, spuId, skuId}) => {
  return (
    <>
      <span className={styles.title}>编辑活动库存</span>
      <span className={styles.subhead}>{`${goodsName}（spuID：${spuId}/skuID：${skuId}）`}</span>
    </>
  )
}

const EditStock = (props) => {
  const {data, visible, onClose, callback, id} = props

  const [checked, setChecked] = useState(2)
  const [activityStock, setActivityStock] = useState(0)

  const optionActivityStock = (num = 0) => {
    if(isNaN(num)) {
      num = 0
    }
    if(checked === 2) {
      return (parseInt(data.activityStockNum) + (parseInt(num) || 0))
    } else {
      return (data.activityStockNum - num)
    }
  }

  const optionStock = (num = 0) => {
    if(isNaN(num)) {
      num = 0
    }
    if(checked === 1) {
      return (parseInt(data.stockNum) + (parseInt(num) || 0))
    } else {
      return (data.stockNum - num)
    }
  }

  const submit = () => {
    return new Promise((resolve, reject) => {
      ruleSkuStockSub({
        stocks: [
          {
            ruleId: id,
            activityType: data.activityType,
            skuId: data.skuId,
            stockNum: data.stockNum,
            actionType: checked,
            oldActivityStockNum: data.activityStockNum,
            newActivityStockNum: activityStock
          }
        ]
      },{
        showSuccess: true
      }).then(res => {
        if (res.success) {
          resolve()
          callback()
        } else {
          reject()
        }
      })
    })
  }

  const formItemLayout = {
    labelCol: { span: 10 },
    wrapperCol: { span: 26 },
    layout: {
      labelCol: {
        span: 24,
      },
      wrapperCol: {
        span: 16,
      },
    }
  }

  return (
    <ModalForm
      visible={visible}
      title={
        <EditTitle
          goodsName={data.goodsName}
          spuId={data.spuId}
          skuId={data.skuId}
        />
      }
      onVisibleChange={onClose}
      modalProps={{
        destroyOnClose: true,
        zIndex: 1001
      }}
      onFinish={async (values) => {
        await submit(values)
        return true
      }}
      width={700}
      layout='horizontal'
      {...formItemLayout}
    >
      <ProForm.Item label="当前商品可用库存（秒约）">
        {data.stockNum}{data.unit}
      </ProForm.Item>
      <ProForm.Item label="当前拼团活动可用库存">
        {data.activityStockNum}{data.unit}
      </ProForm.Item>
      <ProFormRadio.Group
        name="actionType"
        label="操作类型"
        rules={[{ required: true }]}
        options={[
          {
            label: '增加活动库存',
            value: 2
          },
          {
            label: '减少活动库存',
            value: 1
          }
        ]}
        initialValue={checked}
        fieldProps={{
          onChange: (e) => setChecked(e.target.value)
        }}
      />
      <ProFormText
        label="操作拼团活动库存数量（秒约）"
        name="newActivityStockNum"
        fieldProps={{
          onChange: (e) => setActivityStock(e.target.value),
          addonBefore: checked === 1 ? "-" : "+",
          addonAfter: `${data.unit}`
        }}
        width="md"
        placeholder={checked === 1 ? "请输入<=当前商品拼团可用库存" : "请输入<=当前可用库存"}
        rules={[
          { required: true, message: '请输入拼团人数' },
          () => ({
            validator(_, value) {
              const reg = /^[1-9]\d*$/
              if (!reg.test(value)) {
                return Promise.reject(new Error('请输入整数'));
              }
              if(value > data.stockNum && checked === 2) {
                return Promise.reject(new Error('请输入小于总库存的数'));
              }
              if(value > data.activityStockNum && checked === 1) {
                return Promise.reject(new Error('请输入小于拼团活动可用库存'));
              }
              return Promise.resolve()
            },
          })
        ]}
      />
      <ProFormDependency name={['newActivityStockNum']}>
        {({ newActivityStockNum }) => {
          return (
            <>
              <ProForm.Item label="操作后拼团活动可用库存">
                {optionActivityStock(newActivityStockNum)}{data.unit}
              </ProForm.Item>
              <ProForm.Item label="操作后商品可用库存">
                {optionStock(newActivityStockNum)}{data.unit}
              </ProForm.Item>
            </>
          )
        }}
      </ProFormDependency>
    </ModalForm>
  )
}

export default EditStock
