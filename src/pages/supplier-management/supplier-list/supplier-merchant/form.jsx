import React, { useEffect, useState } from 'react';
import { Form } from 'antd';
import {
  ModalForm,
} from '@ant-design/pro-form';
import ProTable from '@ant-design/pro-table';
import { addSelectHelperList } from '@/services/supplier-management/supplier-list'

export default (props) => {
  const { visible, setVisible, callback, id, selectData } = props;
  const [form] = Form.useForm();
  const [selectItems, setSelectItems] = useState([]);
  const [selectKeys, setSelectKeys] = useState([]);
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

  const columns = [
    {
      title: '顾问名称',
      dataIndex: 'companyName',
      valueType: 'text',
      fieldProps: {
        placeholder: '请输入顾问名称'
      }
    },
    {
      title: '登录账号',
      dataIndex: 'companyName',
      valueType: 'text',
      fieldProps: {
        placeholder: '请输入登录账号'
      }
    },
    {
      title: '手机号',
      dataIndex: 'companyUserPhone',
      valueType: 'text',
      hideInSearch: true,
    },
  ];

  useEffect(() => {
    setSelectItems(selectData)
    setSelectKeys(selectData.map(item => item.id))
    
  }, [selectData])

  return (
    <ModalForm
      title={'选择关联的顾问'}
      modalProps={{
        onCancel: () => form.resetFields(),
      }}
      onVisibleChange={setVisible}
      visible={visible}
      width={800}
      form={form}
      onFinish={() => {
        callback(selectItems)
        form.resetFields();
        return true;
      }}
      {...formItemLayout}
    >
      <ProTable
        rowKey="id"
        options={false}
        request={addSelectHelperList}
        search={{
          defaultCollapsed: true,
          optionRender: (searchConfig, formProps, dom) => [
            ...dom.reverse(),
          ],
        }}
        columns={columns}
        pagination={{
          pageSize: 10,
        }}
        rowSelection={{
          hideSelectAll: true,
          selectedRowKeys: selectKeys,
          onChange: (_, val) => {
            setSelectItems(val);
            setSelectKeys(_)
          }
        }}
      />
    </ModalForm >
  );
};