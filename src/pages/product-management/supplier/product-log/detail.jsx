import { Drawer, Image } from 'antd';
import ProTable from '@ant-design/pro-table';
import { logDetail } from '@/services/product-management/product-log';

const UserDetail = (props) => {
  const { visible, setVisible, spuId, operateRole, operatorAction } = props;

  const columns = [
    {
      title: '序号',
      dataIndex: 'id',
      valueType: 'text',
      hideInSearch: true,
    },
    {
      title: '操作角色',
      dataIndex: 'operatorType',
      onFilter: true,
      valueType: 'select',
      valueEnum: operateRole,
      hideInTable: true,
    },
    {
      title: '操作角色',
      dataIndex: 'operatorTypeDisplay',
      valueType: 'text',
      hideInSearch: true,
    },
    {
      title: '操作对象',
      dataIndex: 'operatorName',
      valueType: 'text',
      fieldProps: {
        placeholder: '请输入操作对象'
      },
      hideInTable: true,
    },
    {
      title: '操作项',
      dataIndex: 'actionItem',
      onFilter: true,
      valueType: 'select',
      valueEnum: operatorAction,
      hideInTable: true,
    },
    {
      title: '操作对象',
      dataIndex: 'operatorName',
      valueType: 'text',
      hideInSearch: true,
    },
    {
      title: '操作项',
      dataIndex: 'actionTypeDisplay',
      valueType: 'text',
      hideInSearch: true,
    },
    {
      title: '原值',
      dataIndex: 'actionBefore',
      valueType: 'text',
      hideInSearch: true,
      render: (text) => {
        if (/https?/.test(text)) {
          const imgArr = text.split(';');
          imgArr.length -= 1;
          return imgArr.map(item => (<div key={item} style={{ marginRight: 10, display: 'inline-block' }}><Image style={{ width: 50, height: 50 }} src={item} /></div>))
        }
        return text;
      },
      width: 200,
    },
    {
      title: '操作后新值',
      dataIndex: 'actionAfter',
      valueType: 'text',
      hideInSearch: true,
      render: (text) => {
        if (/https?/.test(text)) {
          const imgArr = text.split(';');
          imgArr.length -= 1;
          return imgArr.map(item => (<div key={item} style={{ marginRight: 10, display: 'inline-block' }}><Image style={{ width: 50, height: 50 }} src={item} /></div>))
        }
        return text;
      },
      width: 200,
    },
    {
      title: '说明',
      dataIndex: 'actionRemark',
      valueType: 'text',
      hideInSearch: true,
      width: 200,
    },
    {
      title: '操作时间',
      dataIndex: 'updateTime',
      valueType: 'text',
      hideInSearch: true,
    },
  ];

  return (
    <Drawer
      title="日志详情"
      width={1200}
      placement="right"
      onClose={() => { setVisible(false) }}
      visible={visible}
    >
      <ProTable
        rowKey="id"
        options={false}
        params={{
          spuId,
        }}
        request={logDetail}
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
      />
    </Drawer>
  )
}

export default UserDetail;
