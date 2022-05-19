import { Drawer, Image } from 'antd';
import ProTable from '@ant-design/pro-table';
import { modifyPriceRecord } from '@/services/intensive-store-management/product-management';

const UserDetail = (props) => {
  const { visible, setVisible, id, operateRole, operatorAction } = props;

  const columns = [
    {
      title: '序号',
      dataIndex: 'id',
      valueType: 'text',
    },
    {
      title: '旧值',
      dataIndex: 'oldPrice',
      valueType: 'text',
    },
    {
      title: '新值',
      dataIndex: 'newPrice',
      valueType: 'text',
    },
    {
      title: '改价幅度',
      dataIndex: 'range',
      valueType: 'text',
    },
    {
      title: '操作时间',
      dataIndex: 'createTime',
      valueType: 'text',
    },
  ];

  return (
    <Drawer
      title="改价日志"
      width={800}
      placement="right"
      onClose={() => { setVisible(false) }}
      visible={visible}
    >
      <ProTable
        rowKey="id"
        options={false}
        params={{
          id,
        }}
        request={modifyPriceRecord}
        search={false}
        columns={columns}
        pagination={{
          pageSize: 10,
          showQuickJumper: true,
        }}
      />
    </Drawer>
  )
}

export default UserDetail;
