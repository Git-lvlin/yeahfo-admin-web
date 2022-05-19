import React, { useState, useRef } from 'react';
import { Button, Space } from 'antd';
import ProTable from '@ant-design/pro-table';
import { PageContainer } from '@/components/PageContainer';
import { ManOutlined, WomanOutlined } from '@ant-design/icons';
import moment from 'moment';
// import UserDetail from './user-detail';
import DisableModal from './disable-modal';
import { userList } from '@/services/user-management/user-list';
import AddressCascader from '@/components/address-cascader';
import Detail from './detail';

const sourceType = {
  1: 'vivo',
  2: '小米',
  3: '应用宝',
  4: '小程序',
  5: '移动端浏览器',
  6: '官方渠道',
  7: '魅族',
  8: 'oppo',
  9: '华为',
  10: 'appStore',
  11: 'WEB',
}



const TableList = () => {
  const [visible, setVisible] = useState(false);
  const [detailVisible, setDetailVisible] = useState(false);
  const [selectItem, setSelectItem] = useState({});
  const actionRef = useRef();
  const columns = [
    {
      title: '昵称',
      dataIndex: 'nickName',
      valueType: 'text',
      fieldProps: {
        placeholder: '请输入昵称'
      },
      render: (_, data) => (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div style={{ borderRadius: '50%', width: 50, height: 50, overflow: 'hidden', marginRight: 5 }}>
            <img src={data.icon} width="50" height="50" />
          </div>
          <span>{_}</span>
          <div style={{ marginLeft: 5 }}>{data.gender === 1 ? <ManOutlined /> : <WomanOutlined />}</div>
        </div>
      )
    },
    // {
    //   title: '头像',
    //   dataIndex: 'icon',
    //   valueType: 'text',
    //   hideInSearch: true,
    // },
    {
      title: '地区',
      dataIndex: 'provinceName',
      hideInSearch: true,
      render: (_, record) => <>{record.provinceName}&nbsp;{record.cityName}&nbsp;{record.districtName}</>
    },
    {
      title: '年龄',
      dataIndex: 'age',
      hideInSearch: true,
      width: 100,
    },
    {
      title: '是否开店',
      dataIndex: 'userType',
      valueType: 'text',
      hideInSearch: true,
      render: (text) => text === 1 ? '是' : '否',
      width: 100,
    },
    {
      title: '手机号',
      dataIndex: 'phoneNumber',
      valueType: 'text',
      fieldProps: {
        placeholder: '请输入手机号'
      }
    },
    // {
    //   title: '等级',
    //   dataIndex: 'name',
    //   onFilter: true,
    //   valueType: 'select',
    //   valueEnum: {
    //     1: {
    //       text: '全部',
    //     },
    //     2: {
    //       text: '注册会员',
    //     },
    //     3: {
    //       text: '金卡',
    //     },
    //     4: {
    //       text: '银卡',
    //     },
    //     5: {
    //       text: '铜卡',
    //     },
    //   },
    // },
    // {
    //   title: '积分',
    //   dataIndex: 'name',
    //   valueType: 'text',
    //   hideInSearch: true,
    // },
    // {
    //   title: '约卡余额',
    //   dataIndex: 'name',
    //   valueType: 'text',
    //   hideInSearch: true,
    // },
    // {
    //   title: '所属社区店',
    //   dataIndex: 'name',
    //   onFilter: true,
    //   valueType: 'select',
    //   hideInTable: true,
    //   valueEnum: {
    //     1: {
    //       text: '全部',
    //     },
    //   },
    // },
    // {
    //   title: '社区店主',
    //   dataIndex: 'name',
    //   onFilter: true,
    //   valueType: 'select',
    //   hideInTable: true,
    //   valueEnum: {
    //     1: {
    //       text: '全部',
    //     },
    //   },
    // },
    {
      title: '注册来源',
      dataIndex: 'sourceType',
      onFilter: true,
      valueType: 'select',
      valueEnum: sourceType,
    },
    {
      title: '注册时间',
      dataIndex: 'createTime',
      valueType: 'dateRange',
      hideInTable: true,
    },
    {
      title: '注册时间',
      dataIndex: 'createTime',
      valueType: 'text',
      hideInSearch: true,
      render: (text) => moment(text).format('YYYY-MM-DD HH:mm:ss')
    },
    {
      title: '上次访问时间',
      dataIndex: 'loginTime',
      valueType: 'dateRange',
      hideInTable: true,
    },
    {
      title: '上次访问时间',
      dataIndex: 'loginTime',
      valueType: 'text',
      hideInSearch: true,
      render: (text) => moment(text).format('YYYY-MM-DD HH:mm:ss')

    },
    {
      title: '用户性别',
      dataIndex: 'gender',
      onFilter: true,
      valueType: 'select',
      hideInTable: true,
      valueEnum: {
        1: '男',
        0: '女'
      },
    },
    {
      title: '会员店主',
      dataIndex: 'userType',
      onFilter: true,
      valueType: 'select',
      hideInTable: true,
      valueEnum: {
        1: '是',
        0: '否'
      },
    },
    {
      title: '地区',
      dataIndex: 'area',
      hideInTable: true,
      renderFormItem: () => (<AddressCascader placeholder="请选择" changeOnSelect />)
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, data) => (
        <Space>
          <a onClick={() => { setSelectItem(data); setVisible(true) }}>禁用</a>
          <a onClick={() => { setSelectItem(data); setDetailVisible(true) }}>详情</a>
        </Space>
      ),
    },
  ];

  return (
    <PageContainer>
      <ProTable
        rowKey="id"
        options={false}
        params={{
          status: 1,
        }}
        scroll={{ scrollToFirstRowOnChange: true, }}
        request={userList}
        actionRef={actionRef}
        search={{
          defaultCollapsed: true,
          labelWidth: 100,
          optionRender: (searchConfig, formProps, dom) => [
            ...dom.reverse(),
          ],
        }}
        columns={columns}
        pagination={{
          pageSize: 10,
        }}
      />
      <DisableModal
        visible={visible}
        setVisible={setVisible}
        data={selectItem}
        callback={() => { actionRef.current.reload() }}
      />
      {
        detailVisible &&
        <Detail
          id={selectItem?.id}
          visible={detailVisible}
          setVisible={setDetailVisible}
        />
      }
    </PageContainer>

  );
};

export default TableList;
