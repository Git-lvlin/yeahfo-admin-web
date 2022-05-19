import { useState, useEffect, useRef } from "react"
import ProForm, { 
  ModalForm,
  ProFormRadio,
  ProFormTextArea,
  ProFormDigit
} from '@ant-design/pro-form'
import { ExclamationCircleOutlined } from "@ant-design/icons"
import { Button } from "antd"
import moment from 'moment'

import type{ FC } from "react"
import type { ModalFormProps, OptProps, InfoProps } from "./data"
import type { FormInstance } from "antd"

import styles from './styles.less'
import { findMachinePay, afterPaymentSetting } from '@/services/hydrogen-atom-management/equipment-management'
import { amountTransform } from "@/utils/utils"

const PayFee: FC<ModalFormProps> = (props) => {
  const { visible, setVisible, id, refs, expire, phone } = props
  const [checked, setChecked] = useState<number>()
  const [info, setInfo] = useState<InfoProps>()
  const form = useRef<FormInstance>()

  useEffect(()=> {
    findMachinePay({
      imei: id
    }).then(res => {
      setInfo(res.data)
    })
  }, [])

  useEffect(()=> {
    setChecked(info?.packageType)
    form.current?.setFieldsValue({
      remark: info?.remark,
      type: info?.packageType,
      amount: amountTransform(info?.amount, '/')
    })
  }, [info])
  
  const submit = (v: OptProps) => {
    new Promise((resolve, reject) => {
      afterPaymentSetting({
        imei: id,
        remark: v.remark,
        type: v.type,
        amount: amountTransform(v.amount, '*'),
        phone
      }).then(res => {
        if(res.success) {
          refs.current?.reload()
          resolve('')
        }else {
          reject()
        }
      })
    })
  }

  const formItemLayout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 18 }
  }

  return (
    <ModalForm
      visible={visible}
      onFinish={async (values) => {
        submit(values)
        return true
      }}
      formRef={form}
      layout='horizontal'
      onVisibleChange={setVisible}
      title='确认提示'
      width={550}
      {...formItemLayout}
      submitter={{
        render: (props) => {
          return (
            <div className={styles.footer}>
              <div className={styles.footerText}>店主缴费后启用机器</div>
              <div>
                <Button onClick={()=>{setVisible(false)}}>取消</Button>
                <Button type='primary' onClick={()=>{props.submit()}}>确定</Button>
              </div>
            </div>
          )
        },
      }}
    >
      {
        <>
          <div className={styles.tip}>
            <ExclamationCircleOutlined/>
            是否开启机器缴费入口
          </div>
          <ProFormTextArea
            label='开启说明'
            name="remark"
            width='md'
            validateFirst
            fieldProps={{
              showCount: true,
              maxLength: 50,
              placeholder: '请输入开启机器缴费的信息，5-50个字符'
            }}
            rules={[
              { 
                required: true
              },
              () => ({
                validator(_, value) {
                  if (value.length < 5) {
                    return Promise.reject(new Error('请输入5-50个字符'))
                  }
                  return Promise.resolve()
                }
              })
            ]}
          />
          <ProForm.Item
            label="租期状态"
          >
            已逾期（已逾期{moment(expire).fromNow().replace('前', '')}）
          </ProForm.Item>
          <ProForm.Item
            label="租期截止日"
          >
            {expire}
          </ProForm.Item>
          <ProFormRadio.Group
            label="再展示缴费入口"
            name="type"
            layout="vertical"
            fieldProps={{
              onChange: (e)=> {
                setChecked(e.target.value)
              }
            }}
            options={[
              {
                label: '按配置缴费，已逾期时段的管理费都需交齐',
                value: 1,
              },
              {
                label: '按配置缴费，已逾期时段的管理费都不用交',
                value: 2,
              },
              {
                label: '交纳指定费用，已逾期时段的管理费都不用交',
                value: 3,
              }
            ]}
          />
          {
            checked === 3 &&
            <ProFormDigit
              label='缴费金额'
              name='amount'
              width='md'
              fieldProps={{
                step: 0.01,
                min: 0.01,
                max: 99999.99,
                stringMode: true,
                placeholder: '请输入需要缴费的金额，0.01-99999.99'
              }}
              rules={[{
                required: true
              }]}
              extra={<span>默认配置：{amountTransform(info?.dayAmount, '/')}元/天</span>}
            />
          }
          {
            checked === 3 &&
            <ProForm.Item 
              label='缴费后租期截止日'
              extra={<span>{info?.nowDate}——{info?.deadlineDate}共{info?.sumDay}天</span>}
            >
              {info?.deadlineDate}（即日起至月底 ）
            </ProForm.Item>
          }
        </>
      }
    </ModalForm>
  )
}

export default PayFee