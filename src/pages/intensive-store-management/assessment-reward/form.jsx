import React, { useEffect } from 'react';
import { Form } from 'antd';
import {
  ModalForm,
  ProFormText,
  ProFormDigit
} from '@ant-design/pro-form';
import { memberShopResultsEdit } from '@/services/intensive-store-management/assessment-reward'
import { amountTransform } from '@/utils/utils'
import Upload from '@/components/upload'

export default (props) => {
  const { visible, setVisible, callback, data } = props;
  const [form] = Form.useForm();
  const formItemLayout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 14 },
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
    return new Promise((resolve, reject) => {
      memberShopResultsEdit({
        icon: values.icon,
        id: data.id,
        bonusPoints: values.bonusPoints,
        commissionRatio: amountTransform(values.commissionRatio, '/'),
      }, { showSuccess: true }).then(res => {
        if (res.code === 0) {
          resolve();
        } else {
          reject();
        }
      })
    });
  }

  useEffect(() => {
    if (data) {
      form?.setFieldsValue({
        gradeName: data.gradeName,
        icon: data.icon,
        bonusPoints: data.bonusPoints,
        commissionRatio: amountTransform(data.commissionRatio),
      })
    }
  }, [form, data])

  return (
    <ModalForm
      title={<div>考核等级设置<span style={{ fontSize: 12, marginLeft: 10, }}>填写店铺考核等级配置</span></div>}
      modalProps={{
      }}
      onVisibleChange={setVisible}
      visible={visible}
      width={550}
      form={form}
      onFinish={async (values) => {
        await submit(values);
        callback();
        return true;
      }}
      initialValues={{
        gcShow: true,
      }}
      {...formItemLayout}
    >
      <Form.Item
        label="等级"
      >
        {data?.resultsName}
      </Form.Item>
      <Form.Item
        label="等级徽章"
        name="icon"
      >
        <Upload accept="image/*" code={221} />
      </Form.Item>
      <ProFormDigit
        placeholder="请输入1-99999之间的整数"
        label="积分奖励"
        name="bonusPoints"
        min={1}
        max={99999}
        step
        rules={[{ required: true, message: '请输入积分奖励' }]}
      />
      <ProFormDigit
        placeholder="输入范围1-99，如55.25"
        label="返佣比例"
        name="commissionRatio"
        min={1}
        max={99}
        step
        rules={[{ required: true, message: '请输入返佣比例' }]}
      />
    </ModalForm >
  );
};