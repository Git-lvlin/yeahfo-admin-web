import React, { useState, useRef } from 'react';
import ProTable from '@ant-design/pro-table';
import { PageContainer } from '@/components/PageContainer';
import { Button, Card, Space, Modal } from 'antd';
import { PlusOutlined } from '@ant-design/icons'
import { addressList, addressDetail, addressSwitch, addressSetDefault } from '@/services/operation-management/after-sale-address'
import { useParams } from 'umi';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import Edit from './edit';

const { confirm } = Modal;

const TableList = () => {
  const [formVisible, setFormVisible] = useState(false);
  const [detailData, setDetailData] = useState(null);
  const actionRef = useRef();
  const params = useParams();

  const getDetail = (id) => {
    addressDetail({
      id
    }).then(res => {
      if (res.code === 0) {
        setDetailData(res?.data);
        setFormVisible(true);
      }
    })
  }

  const switchStatus = (data) => {
    confirm({
      title: `${data.status===1?'禁用':'开启'}售后地址信息`,
      icon: <ExclamationCircleOutlined />,
      content: `${data.contactName}(${data.address})`,
      onOk() {
        addressSwitch({
          operationId: params?.id,
          id: data.id
        })
          .then(res => {
            if (res.code === 0) {
              actionRef.current.reload()
            }
          })
      },
    });
  }

  const addressSetDefaultHandle = (data) => {
    confirm({
      title: `设置默认售后地址信息`,
      icon: <ExclamationCircleOutlined />,
      content: `确定要将 ${data.contactName}（${data.address}）设置为默认地址么？`,
      onOk() {
        addressSetDefault({
          operationId: params?.id,
          id: data.id
        })
          .then(res => {
            if (res.code === 0) {
              actionRef.current.reload()
            }
          })
      },
    });
  }

  const columns = [
    {
      title: '序号',
      dataIndex: 'id',
      valueType: 'text',
    },
    {
      title: '售后联系人',
      dataIndex: 'contactName',
      valueType: 'text',
    },
    {
      title: '售后联系方式',
      dataIndex: 'contactPhone',
      valueType: 'text',
    },
    {
      title: '售后地址',
      dataIndex: 'address',
      valueType: 'text',
    },
    {
      title: '默认售后地址',
      dataIndex: 'isDefault',
      valueType: 'text',
      valueEnum: {
        1: '是',
        0: '否'
      }
    },
    {
      title: '启用状态',
      dataIndex: 'status',
      valueType: 'text',
      valueEnum: {
        1: '启用',
        0: '禁用'
      }
    },
    {
      title: '操作',
      dataIndex: 'brandName',
      valueType: 'options',
      render: (_, data) => {
        return (
          <Space>
            {/* {data.status === 1 && <a onClick={() => { switchStatus(data) }}>禁用</a>} */}
            {data.status === 0 && <a onClick={() => { switchStatus(data) }}>开启</a>}
            {data.isDefault === 0 && <a onClick={() => { addressSetDefaultHandle(data) }}>设为默认</a>}
            <a onClick={() => { getDetail(data.id) }}>编辑</a>
          </Space>
        )
      }
    },
  ];

  return (
    <PageContainer>
      {/* <Card>
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button key="out" type="primary" icon={<PlusOutlined />} onClick={() => { setFormVisible(true) }}>新建</Button>
        </div>
      </Card> */}
      <ProTable
        options={false}
        params={{
          operationId: params?.id
        }}
        request={addressList}
        search={false}
        columns={columns}
        actionRef={actionRef}
        rowKey="id"
      />
      <Edit
        visible={formVisible}
        setVisible={setFormVisible}
        operationId={params?.id}
        detailData={detailData}
        callback={() => { actionRef.current.reload() }}
      />
    </PageContainer>
  );
};

export default TableList;
