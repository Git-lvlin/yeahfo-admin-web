import React, { useRef, useState } from 'react';
import ProTable from '@ant-design/pro-table';
import ProField from '@ant-design/pro-field';
import ProCard from '@ant-design/pro-card';
import { Button, Input, Space, Tag, Form } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { ModalForm,ProFormSwitch} from '@ant-design/pro-form';
const defaultData = [
  {
    id: 1,
    type: 1,
  },
  {
    id: 2,
    type: 0,
  }
]

const columns = [
  {
    title: 'sw',
    dataIndex: 'type',
    render: (_,r) => {
      return <ProFormSwitch name="switch" label="Switch"
        fieldProps={{
          defaultChecked: r.type
        }}
       />
    }
  },
];

export default () => {
  const actionRef = useRef();
  const [dataSource, setDataSource] = useState([]);
  const [editableKeys, setEditableRowKeys] = useState(() =>
    defaultData.map((item) => item.id),
  );
  const [form] = Form.useForm();

  return (
    <>
      <ProTable
        rowKey="id"
        actionRef={actionRef}
        // 关闭默认的新建按钮
        recordCreatorProps={false}
        columns={columns}
        request={async () => ({
          data: defaultData,
          total: 3,
          success: true,
        })}
        value={dataSource}
      />
    </>
  );
};