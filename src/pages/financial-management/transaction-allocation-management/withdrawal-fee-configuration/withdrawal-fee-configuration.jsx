import React, { useEffect, useState } from 'react'
import ProForm, { ProFormSelect, ProFormDigit } from '@ant-design/pro-form'
import { Input, message, Form, Spin } from 'antd'
import { PageContainer } from '@/components/PageContainer';

import { withdrawConfigDetail, withdrawConfigUpdate } from '@/services/financial-management/withdrawal-fee-configuration'
import { amountTransform } from '@/utils/utils'
import './styles.less'
import styles from './styles.less'

const WithdrawalFeeConfiguration = () => {
  const [contrary, setContrary] = useState('')
  const [person, setPerson] = useState('')
  const [loading, setLoading] = useState(false)
  const [form] = Form.useForm()
  useEffect(()=> {
    setLoading(true)
    withdrawConfigDetail({}).then(res=> {
      form.setFieldsValue({
        ...res?.data,
        withdrawBusinessFaxScale: amountTransform(res?.data.withdrawBusinessFaxScale, '*'),
        withdrawBusinessFeeFixed: amountTransform(res?.data.withdrawBusinessFeeFixed, '/'),
        withdrawBusinessFeeScale: amountTransform(res?.data.withdrawBusinessFeeScale, '*'),
        withdrawBusinessMax: amountTransform(res?.data.withdrawBusinessMax, '/'),
        withdrawBusinessMin: amountTransform(res?.data.withdrawBusinessMin, '/'),
        withdrawPersonFaxScale: amountTransform(res?.data.withdrawPersonFaxScale, '*'),
        withdrawPersonFeeFixed: amountTransform(res?.data.withdrawPersonFeeFixed, '/'),
        withdrawPersonFeeScale: amountTransform(res?.data.withdrawPersonFeeScale, '*'),
        withdrawPersonMax: amountTransform(res?.data.withdrawPersonMax, '/'),
        withdrawPersonMin: amountTransform(res?.data.withdrawPersonMin, '/')
      })
      setContrary(res?.data?.withdrawBusinessFeeType)
      setPerson(res?.data?.withdrawPersonFeeType)
    }).finally(()=> {
      setLoading(false)
    })
    return undefined
  },[])
  const toggleContrary = (val) => {
    setContrary(val)
  }
  const togglePerson = (val) => {
    setPerson(val)
  }
  const commit = (val) => {
    const flag = val?.withdrawBusinessMin >= val?.withdrawBusinessMax
                ||val?.withdrawPersonMin >= val?.withdrawPersonMax
    if(flag) {
      message.error('????????????????????????????????????')
    } else {
      withdrawConfigUpdate({...val}).then(res=> {
        if(res.success){
          message.success('????????????')
        }
      })
    }
   
  }
  return (
    <PageContainer title={false}>
      <Spin spinning={loading}>
        <div className={styles.formLayout}>
          <ProForm
            form={form}
            layout='horizontal'
            onFinish={async (values) => {
              await commit(values)
            }}
          >
            <span className={styles.label}>??????????????????</span>
            <ProForm.Group>
              <ProFormDigit
                width="xs"
                name="withdrawBusinessMin"
                label="??????(???)"
                rules={[{ required: true, message: '???????????????????????????' }]}
              />
              <ProFormDigit
                width="xs"
                name="withdrawBusinessMax"
                label="??????(???)"
                rules={[{ required: true, message: '???????????????????????????' }]}
              />
            </ProForm.Group>
            <ProForm.Group>
              <ProFormDigit
                label="??????????????????"
                min={0}
                max={100}
                name="withdrawBusinessFaxScale"
                width="xs"
                rules={[{ required: true, message: '???????????????????????????' }]}
              />
              <span className={styles.percentFee}>%</span>
              <ProForm.Item
                label="?????????????????????(???)"
              >
                <Input.Group compact>
                  <ProFormSelect
                    name="withdrawBusinessFeeType"
                    initialValue={'scale'}
                    width={85}
                    allowClear={false}
                    rules={[{ required: true, message: '???????????????' }]}
                    fieldProps={{
                      onChange: (val) => { toggleContrary(val) }
                    }}
                    options={[
                      {
                        value: 'scale',
                        label: '?????????'
                      },
                      {
                        value: 'fixed',
                        label: '?????????'
                      },
                    ]}
                  />
                  <ProFormDigit
                    width="xs"
                    min="0"
                    max={ contrary === 'scale' ? 100 : 99999999 }
                    fieldProps={{
                      precision: 2
                    }}
                    name={contrary === 'scale' ? 'withdrawBusinessFeeScale' : 'withdrawBusinessFeeFixed'}
                  />
                  { contrary === 'scale' ? <span className={styles.percent}>%</span> : '' }
                </Input.Group>
              </ProForm.Item>
            </ProForm.Group>
            <span className={styles.label}>??????????????????</span>
            <ProForm.Group>
              <ProFormDigit
                width="xs"
                name="withdrawPersonMin"
                label="??????(???)"
                rules={[{ required: true, message: '???????????????????????????' }]}
              />
              <ProFormDigit
                width="xs"
                name="withdrawPersonMax"
                label="??????(???)"
                rules={[{ required: true, message: '???????????????????????????' }]}
              />
            </ProForm.Group>
            <ProForm.Group>
              <ProFormDigit
                label="??????????????????"
                min={0}
                max={100}
                name="withdrawPersonFaxScale"
                width='xs'
                rules={[{ required: true, message: '???????????????????????????' }]}
              />
              <span className={styles.percentFee}>%</span>
              <ProForm.Item
                label="?????????????????????(???)"
              >
                <Input.Group compact>
                  <ProFormSelect
                    name="withdrawPersonFeeType"
                    width={85}
                    initialValue={'scale'}
                    allowClear={false}
                    rules={[{ required: true, message: '???????????????' }]}
                    fieldProps={{
                      onChange: (val) => { togglePerson(val) }
                    }}
                    options={[
                      {
                        value: 'scale',
                        label: '?????????',
                      },
                      {
                        value: 'fixed',
                        label: '?????????',
                      },
                    ]}
                  />
                  <ProFormDigit
                    width="xs"
                    min="0"
                    max={ person === 'scale' ? 100 : 99999999 }
                    fieldProps={{ precision: 2 }}
                    name={person === 'scale' ? 'withdrawPersonFeeScale' : 'withdrawPersonFeeFixed'}
                  />
                  { person === 'scale' ? <span className={styles.percent}>%</span> : '' }
                </Input.Group>
              </ProForm.Item>
            </ProForm.Group>
          </ProForm>
        </div>
      </Spin>
    </PageContainer>
  )
}

export default WithdrawalFeeConfiguration
