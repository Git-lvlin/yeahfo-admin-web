import React, { useEffect } from 'react';
import { Form } from 'antd';
import ProForm, {
  DrawerForm,
} from '@ant-design/pro-form';
import { skuPercentLog  } from '@/services/intensive-activity-management/platfor-bonus-percentage-audit'
import ProTable from '@ant-design/pro-table';

export default (props) => {
  const { visible, setVisible, logId,onClose} = props;
  const columns= [
    {
      title: '序号',
      dataIndex: 'id',
      hideInSearch: true,
      valueType: 'indexBorder'
    },
    {
        title: '操作角色',
        dataIndex: 'groupName', 
        valueType: 'text'
    },
    {
        title: '操作人名称',
        dataIndex: 'operatorName',
        valueType: 'text',
        ellipsis:true
    },
    {
        title: '操作动作',
        dataIndex: 'typeName',
        valueType: 'text',
    },
    {
      title: '操作说明',
      dataIndex: 'logMsg',
      valueType: 'text',
    },
    {
        title: '操作时间',
        dataIndex: 'time',
    },
];
  return (
    <DrawerForm
      title='操作日志'
      onVisibleChange={setVisible}
      visible={visible}
      width={1000}
      drawerProps={{
        forceRender: true,
        destroyOnClose: true,
        onClose: () => {
          onClose()
        }
      }}
      submitter={{
        render: (props, defaultDoms) => {
            return [];
        },
        }}
    >
      <ProTable
          toolBarRender={false}
          search={false}
          rowKey="id"
          params={{
            id:logId
          }}
          columns={columns}
          request={skuPercentLog}
          pagination={{
            pageSize: 10,
            showQuickJumper: true,
          }}
      />
    </DrawerForm >
  );
};