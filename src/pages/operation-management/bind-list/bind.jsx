import React, { useState, useEffect } from 'react';
import ProTable from '@ant-design/pro-table';
import { Form, Button, message } from 'antd';
import {
  DrawerForm,
} from '@ant-design/pro-form';
import { getCommonList } from '@/services/operation-management/operation-list'
import { bindingForAdmin } from '@/services/operation-management/bind-list'
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
  const [selectItem, setSelectItem] = useState(null);

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
    if (!selectItem) {
      message.error('请选择要绑定的运营商');
      reject();
    }
    return new Promise((resolve, reject) => {
      const userInfo = JSON.parse(window.localStorage.getItem('user'));
      bindingForAdmin({
        applyFromId: userInfo.id,
        applyFromName: userInfo.username,
        storeNo: data.storeNo,
        operationId: selectItem.id,
        operationName: selectItem.companyName,
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
      title: '运营商名称',
      dataIndex: 'companyName',
      valueType: 'text',
      fieldProps: {
        placeholder: '请输入运营商名称'
      },
    },
    {
      title: '联系人',
      dataIndex: 'companyUserName',
      valueType: 'text',
      fieldProps: {
        placeholder: '请输入联系人'
      },
    },
    {
      title: '联系人手机号',
      dataIndex: 'companyUserPhone',
      valueType: 'text',
      fieldProps: {
        placeholder: '请输入联系人手机号'
      },
    },
  ];

  return (
    <DrawerForm
      title={`绑定运营商`}
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
        await submit(values);
        return true;
      }}
      visible
      {...formItemLayout}
    >
      <ProTable
        rowKey="id"
        options={false}
        request={getCommonList}
        search={{
          defaultCollapsed: true,
          labelWidth: 130,
          optionRender: ({ searchText, resetText }, { form }) => [
            <Button
              key="search"
              type="primary"
              onClick={() => {
                form?.submit();
              }}
            >
              {searchText}
            </Button>,
            <Button
              key="rest"
              onClick={() => {
                form?.resetFields();
              }}
            >
              {resetText}
            </Button>,
          ],
        }}
        columns={columns}
        pagination={{
          pageSize: 10,
          showQuickJumper: true,
        }}
        tableAlertRender={false}
        rowSelection={{
          type: 'radio',
          onSelect: (record) => {
            setSelectItem(record)
          },
        }}
      />
      <Form.Item
        label="绑定审批文件上传"
        name="applyAttach"
        rules={[() => ({
          required: true,
          validator(_, value) {
            if (value && value.length > 0) {
              return Promise.resolve();
            }
            return Promise.reject(new Error('请上传绑定审批文件上传'));
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
