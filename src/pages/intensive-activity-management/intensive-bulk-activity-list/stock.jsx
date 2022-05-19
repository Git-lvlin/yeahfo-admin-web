import React, { useState } from 'react';
import { Form } from 'antd';
import {
  ModalForm,
  ProFormText,
  ProFormDependency,
} from '@ant-design/pro-form';
import { addWholesaleStock } from '@/services/intensive-activity-management/intensive-activity-list'


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
      addWholesaleStock({
        addNum: +values.num,
        wsId: data.wsId,
        skuId: data.baseSku.skuId
      }, { showSuccess: true })
        .then(res => {
          if (res.code === 0) {
            callback();
            resolve()
          } else {
            reject()
          }
        })
    });
  }

  return (
    <ModalForm
      title={<>追加商品集约可用库存<span style={{ marginLeft: 10, fontSize: 12, color: '#0000006d' }}>{data.baseSku.goodsName}（spuId:{data.baseSku.spuId}/skuId:{data.baseSku.skuId}）</span></>}
      onVisibleChange={setVisible}
      visible={visible}
      width={700}
      form={form}
      onFinish={async (values) => {
        await submit(values);
        return true;
      }}
      {...formItemLayout}
    >
      <Form.Item
        label="当前可用库存"
      >
        {data.baseSku.stockNum}
      </Form.Item>
      <Form.Item
        label="当前集约可用库存"
      >
        {data.wholesaleSku.totalStockNum}
      </Form.Item>
      <ProFormText
        label="增加库存数量"
        placeholder={`请输入增加的库存数量，1-${data.baseSku.stockNum}之间的整数`}
        name="num"
        validateFirst
        rules={[
          { required: true, message: '请输入增加库存数量' },
          () => ({
            validator(_, value) {
              if (!/^\d+$/g.test(value) || `${value}`.indexOf('.') !== -1 || value <= 0 || value > data.baseSku.stockNum) {
                return Promise.reject(new Error(`请输入1-${data.baseSku.stockNum}之间的整数`));
              }
              return Promise.resolve();
            },
          })
        ]}
      />
      <ProFormDependency name={['num']}>
        {
          ({ num }) => <Form.Item
            label="增加后可用库存"
          >
            {parseInt(data.wholesaleSku.totalStockNum + (num > 0 ? +num : 0), 10)}
          </Form.Item>
        }
      </ProFormDependency>
    </ModalForm >
  );
};
