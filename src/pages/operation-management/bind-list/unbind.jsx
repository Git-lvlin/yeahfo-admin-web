import React, { useState, useEffect } from 'react';
import ProTable from '@ant-design/pro-table';
import { Form, message } from 'antd';
import {
  DrawerForm,
} from '@ant-design/pro-form';
import { unbindingForAdmin } from '@/services/operation-management/bind-list'
import Upload from '@/components/upload';

const FromWrap = ({ value, onChange, content, right }) => (
  <div style={{ display: 'flex' }}>
    <div>{content(value, onChange)}</div>
    <div style={{ flex: 1, marginLeft: 10, minWidth: 180 }}>{right(value)}</div>
  </div>
)

export default (props) => {
  const { setVisible, data, callback = () => { }, onClose = () => { } } = props;
  const [form] = Form.useForm();

  const formItemLayout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 10 },
    layout: {
      labelCol: {
        span: 4,
      },
      wrapperCol: {
        span: 10,
      },
    }
  };

  const submit = (values) => {
    return new Promise((resolve, reject) => {
      const userInfo = JSON.parse(window.localStorage.getItem('user'));
      unbindingForAdmin({
        applyFromId: userInfo.id,
        applyFromName: userInfo.username,
        storeNo: data.storeNo,
        operationId: data.operationId,
        operationName: data.operationCompanyName,
        applyAttach: values.applyAttach,
      }, { showSuccess: true }).then(res => {
        if (res.code === 0) {
          callback();
          resolve();
        } else {
          reject();
        }
      })
    });
  }

  const columns = [
    {
      title: '社区店名称',
      dataIndex: 'storeName',
      valueType: 'text',
    },
    {
      title: '社区店地址',
      dataIndex: 'address',
      valueType: 'text',
      render: (_, records) => {
        return (
          <pre style={{ margin: 0, fontFamily: 'none' }}>
            {records?.areaInfo?.[records?.provinceId]} {records?.areaInfo?.[records?.cityId]} {records?.areaInfo?.[records?.regionId]} {_} {records?.communityName} {records?.houseNumber}
          </pre>
        )
      }
    },
    {
      title: '绑定的运营商',
      dataIndex: 'operationCompanyName',
      valueType: 'text',
    },
  ];

  useEffect(() => {

  }, []);

  return (
    <DrawerForm
      title={`解绑运营商`}
      onVisibleChange={setVisible}
      drawerProps={{
        forceRender: true,
        destroyOnClose: true,
        width: 1300,
        onClose: () => {
          onClose();
        }
      }}
      form={form}
      onFinish={async (values) => {
        try {
          await submit(values);
          return true;
        } catch (error) {
          console.log('error', error);
        }
      }}
      visible
      {...formItemLayout}
    >
      <ProTable
        rowKey="id"
        options={false}
        dataSource={[data]}
        search={false}
        columns={columns}
        pagination={false}
      />
      <Form.Item
        label="解绑审批文件上传"
        name="applyAttach"
        style={{ marginTop: 20 }}
        rules={[() => ({
          required: true,
          validator(_, value) {
            if (value && value.length > 0) {
              return Promise.resolve();
            }
            return Promise.reject(new Error('请上传解绑审批文件上传'));
          },
        })]}
      >
        <FromWrap
          content={(value, onChange) => <Upload value={value} onChange={onChange} maxCount={50} accept=".png, .jpg, .jpeg" size={2048} />}
          right={() => {
            return (
              <dl>
                <dd>大小：不超过2MB</dd>
                <dd>尺寸：不限</dd>
                <dd>格式：png/jpg</dd>
              </dl>
            )
          }}
        />
      </Form.Item>
    </DrawerForm>
  );
};
