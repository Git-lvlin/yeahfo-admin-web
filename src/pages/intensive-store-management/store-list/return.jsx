import React, { useEffect, useState } from 'react';
import { Form, Input } from 'antd';
import {
  ModalForm,
  ProFormTextArea,
} from '@ant-design/pro-form';
import { refunded, backTrack } from '@/services/intensive-store-management/store-list';
import { getDetail } from '@/services/intensive-store-management/store-detail';
import { amountTransform } from '@/utils/utils'
import Upload from '@/components/upload'

const FromWrap = ({ value, onChange, content, right }) => (
  <div style={{ display: 'flex' }}>
    <div>{content(value, onChange)}</div>
    <div style={{ flex: 1, marginLeft: 10, minWidth: 180 }}>{right(value)}</div>
  </div>
)

export default (props) => {
  const { visible, setVisible, callback, data } = props;
  const [deposit, setDeposit] = useState({})
  const [form] = Form.useForm();
  const formItemLayout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 16 },
    layout: {
      labelCol: {
        span: 6,
      },
      wrapperCol: {
        span: 16,
      },
    }
  };

  const submit = (values) => {
    return new Promise((resolve, reject) => {
      let userInfo = window.localStorage.getItem('user');
      userInfo = userInfo && JSON.parse(userInfo);
      const apiMethod = data.type === 1 ? refunded : backTrack
      const obj = {};

      if (values.moneyCertificates) {
        obj.moneyCertificates = [values.moneyCertificates]
      }

      apiMethod({
        ...obj,
        applyId: data.applyId,
        refendAmount: amountTransform(values.refendAmount),
        remark: values.remark,
        optAdminId: userInfo.id,
        optAdminName: userInfo.username,
      }, { showSuccess: true }).then(res => {
        if (res.code === 0) {
          resolve()
        } else {
          reject()
        }
      })
    });
  }

  useEffect(() => {
    getDetail({
      storeNo: data.storeNo
    }).then(res => {
      if (res.code === 0) {
        setDeposit(res.data.deposit)
      }
    })
  }, [])

  return (
    <ModalForm
      title={`请${data?.type === 1 ? '登记店铺保证金退回信息' : '确认将保证金原路退回信息'}  ${data.storeName} （店铺ID：${data.id}）`}
      modalProps={{
      }}
      onVisibleChange={setVisible}
      visible={visible}
      width={800}
      form={form}
      onFinish={async (values) => {
        await submit(values);
        callback();
        return true;
      }}
      submitter={{
        searchConfig: {
          submitText: data?.type === 1 ? '确定' : '立即原来退回保证金',
          resetText: '取消'
        }
      }}
      {...formItemLayout}
    >
      <Form.Item
        label="保证金缴纳状态"
      >
        已交（￥{amountTransform(deposit?.payAmount, '/')}）  于 {deposit?.payTime} 缴纳 （缴纳支付方式：{deposit?.payType?.desc}）
        <div style={{ color: 'red' }}>{`${data?.type === 1 ? '已实际完成店铺保证金退款操作，确认无误后登记如下：' : '确认无误后线上原路退回如下：'}`}</div>
      </Form.Item>

      {data?.type === 1 && <Form.Item
        label="退款凭证"
        name="moneyCertificates"
      >
        <FromWrap
          content={(value, onChange) => <Upload value={value} onChange={onChange} accept="image/*" size={5 * 1024} />}
          right={() => {
            return (
              <dl>
                <dt>图片要求</dt>
                <dd>1.图片大小5MB以内</dd>
                <dd>2.图片格式jpg/gif/png</dd>
              </dl>
            )
          }}
        />
      </Form.Item>}

      <Form.Item
        name="refendAmount"
        label={`请输入${data?.type === 1 ? '已' : '要'}退回金额`}
        rules={[{ required: true, message: `请输入${data?.type === 1 ? '已' : '要'}退回金额` }]}
      >
        <Input placeholder={`请输入${data?.type === 1 ? '已' : '要'}退回金额`} suffix="元" />
      </Form.Item>

      <ProFormTextArea
        name="remark"
        label="备注"
        placeholder={`请输入备注信息 6-50个字 ${data?.type === 1 ? '例如：退款时间，退款操作人，退款打款银行卡号码等等' : ''}`}
        rules={[{ required: true, message: '请输入备注' }]}
      />

    </ModalForm >
  );
};