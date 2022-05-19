import React, { useState } from 'react';
import { Form } from 'antd';
import {
  ModalForm,
  ProFormDateTimePicker,
} from '@ant-design/pro-form';
import { wholesaleEdit } from '@/services/intensive-activity-management/intensive-activity-list'
import moment from 'moment';


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
      wholesaleEdit({
        endTimeAdvancePaymentDatetime: values.endTimeAdvancePaymentDatetime,
        wholesaleId: data.wholesaleId,
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
      title={<>重置店主采购下单截止时间<span style={{ marginLeft: 10, fontSize: 12, color: '#0000006d' }}>请设置设置店主下单截止时间</span></>}
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
      <ProFormDateTimePicker
        label="店主下单截止时间"
        name="endTimeAdvancePaymentDatetime"
        fieldProps={{
          disabledDate: (currentDate) => {
            const curDate = +moment(+currentDate).set({ hour: 0, minute: 0, second: 0, millisecond: 0 })
            const nowDate = +moment(new Date()).set({ hour: 0, minute: 0, second: 0, millisecond: 0 })
            if (curDate === nowDate) {
              return false;
            }
            return curDate < nowDate
          },
          // disabledTime: disabledRangeTime,
          showTime: {
            defaultValue: moment('00:59:59', 'HH:mm:ss')
          }
        }}
      />
    </ModalForm >
  );
};
