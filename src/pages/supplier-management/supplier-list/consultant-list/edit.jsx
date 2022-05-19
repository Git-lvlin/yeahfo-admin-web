import React, { useState, useEffect } from 'react';
import { Form, Button } from 'antd';
import {
  DrawerForm,
  ProFormText,
  ProFormRadio,
} from '@ant-design/pro-form';
import md5 from 'blueimp-md5';
import FormModal from './form';
import { helperAdds, helperEdits } from '@/services/supplier-management/supplier-list'

export default (props) => {
  const { visible, setVisible, detailData, callback, onClose = () => { } } = props;
  const [formVisible, setFormVisible] = useState(false)
  const [selectData, setSelectData] = useState([]);

  const [form] = Form.useForm()
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
    const { password, ...rest } = values;
    return new Promise((resolve, reject) => {
      const apiMethod = detailData ? helperEdits : helperAdds
      apiMethod({
        password: md5(password),
        supplierId: detailData?.supplierId,
        bindSupplierIds: selectData.map(item => item.id).join(','),
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
        ...detailData
      })
      setSelectData(detailData.supplierIds)
    }
  }, [form, detailData]);

  return (
    <DrawerForm
      title={`${detailData ? '编辑' : '新建'}顾问`}
      onVisibleChange={setVisible}
      drawerProps={{
        forceRender: true,
        destroyOnClose: true,
        width: 800,
        onCancel: () => {
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
        status: 1,
      }}
      {...formItemLayout}
    >
      <ProFormText
        name="companyName"
        label="顾问名称"
        placeholder="请输入顾问名称"
        rules={[{ required: true, message: '请输入顾问名称' }]}
        fieldProps={{
          maxLength: 30,
        }}
      />
      <ProFormText
        name="accountName"
        label="登录账号"
        placeholder="请输入登录账号"
        rules={[{ required: true, message: '请输入登录账号' }]}
        fieldProps={{
          maxLength: 18,
        }}
      />
      <ProFormText.Password
        name="password"
        label="登录密码"
        placeholder="请输入登录密码"
        validateFirst
        rules={[
          { required: true, message: '请输入供应商家登录密码' },
          { required: true, message: '密码应不少于6个字符，不超过18个字符', min: 6, max: 18 }
        ]}
        fieldProps={{
          visibilityToggle: false,
          maxLength: 18,
        }}
      />

      <Form.Item
        label="可关联供应商家"
      >
        <Button type="primary" onClick={() => { setFormVisible(true) }}>选择供应商家</Button>
        <div>
          {!!selectData.length && <div>已选择供应商家</div>}
          {
            selectData.map(item => (<div key={item.id}>{item.companyName}</div>))
          }
        </div>
      </Form.Item>

      <ProFormText
        name="companyUserPhone"
        label="手机号"
        placeholder="请输入手机号"
        rules={[{ required: true, message: '请输入手机号' }]}
        fieldProps={{
          maxLength: 11,
        }}
      />

      <ProFormText
        name="remark"
        label="备注"
        placeholder="请输入备注"
        fieldProps={{
          maxLength: 30,
        }}
      />

      <ProFormRadio.Group
        name="status"
        label="状态"
        rules={[{ required: true }]}
        options={[
          {
            label: '启用',
            value: 1,
          },
          {
            label: '禁用',
            value: 2,
          },
        ]}
      />
      {formVisible && <FormModal
        visible={formVisible}
        setVisible={setFormVisible}
        callback={(v) => { setSelectData(v) }}
        selectData={selectData}
      />}
    </DrawerForm>
  );
};