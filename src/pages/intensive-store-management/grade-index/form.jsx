import React, { useEffect } from 'react';
import { Form } from 'antd';
import {
  ModalForm,
  ProFormText,
  ProFormDigit
} from '@ant-design/pro-form';
import { memberShopGradeEdit } from '@/services/intensive-store-management/grade-index'
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
      memberShopGradeEdit({
        gradeLevel: data.gradeLevel,
        id: data.id,
        gradeName: values.gradeName,
        icon: values.icon,
        equity: values.equity,
        levelScore: values.levelScore,
        assessment: amountTransform(values.assessment),
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
        levelScore: data.upgrade.score.max,
        assessment: amountTransform(data.scoreGradeMonthlyIndicator, '/'),
        equity: data.equity,
      })
    }
  }, [form, data])

  return (
    <ModalForm
      title={<div>等级设置<span style={{ fontSize: 12, marginLeft: 10, }}>填写店铺等级配置</span></div>}
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
        {data?.gradeLevel}级
      </Form.Item>
      <ProFormText
        label="等级名称"
        width="md"
        placeholder="请输入2-6个字符"
        rules={[
          { type: 'string', required: true, message: '请输入2-6个字符', min: 2, max: 6 },
          () => ({
            validator(_, value) {
              if (/^[^\s]{2,6}$/.test(value)) {
                return Promise.resolve();
              }
              return Promise.reject(new Error('请输入2-6个字符'));
            },
          })
        ]}
        validateFirst={true}
        name="gradeName"
        fieldProps={{
          maxLength: 6,
        }}
      />
      <Form.Item
        label="等级徽章"
        name="icon"
        rules={[{ required: true, message: '请上传等级徽章' }]}
      >
        <Upload accept="image/*" code={221} />
      </Form.Item>
      <ProFormDigit
        placeholder="输入范围1-10000000"
        label="成长值"
        name="levelScore"
        min={1}
        max={10000000}
        step
        rules={[{ required: true, message: '请输入成长值' }]}
      />
      <ProFormDigit
        placeholder="输入范围1-10000000"
        label="月度指标"
        name="assessment"
        min={1}
        max={10000000}
        step
        rules={[{ required: true, message: '请输入月度指标' }]}
      />
      <ProFormText
        label="可开分店数量"
        width="md"
        placeholder="请输入3-18个字符"
        rules={[
          { type: 'string', required: true, message: '请输入3-18个字符', min: 3, max: 18 },
          () => ({
            validator(_, value) {
              if (/^[^\s]{3,18}$/.test(value)) {
                return Promise.resolve();
              }
              return Promise.reject(new Error('请输入3-18个字符'));
            },
          })
        ]}
        validateFirst={true}
        name="equity"
        fieldProps={{
          maxLength: 18,
        }}
      />
    </ModalForm >
  );
};