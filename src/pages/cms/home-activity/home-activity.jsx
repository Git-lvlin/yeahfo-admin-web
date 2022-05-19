
import React, { useRef, useState, useEffect } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import { Button, message } from 'antd';
import ProTable from '@ant-design/pro-table';
import ProForm from '@ant-design/pro-form';
import { PageContainer } from '@/components/PageContainer';
import Edit from './form';
import { homeActivityList, homeActivitySortTop } from '@/services/cms/member/member';
import ProCard from '@ant-design/pro-card';

const HomeActivity = () => {
  const actionRef = useRef();
  const [formVisible, setFormVisible] = useState(false);
  const [detailData, setDetailData] = useState(null);
  const [useType, setUseType] = useState(1);
  const getDetail = (data) => {
    if (data) {
      setDetailData(data);
      setFormVisible(true);
      return
    }
    setDetailData(null);
    setFormVisible(true);
  }

  const top = (data) => {
    homeActivitySortTop({id: data}).then((res) => {
      if (res.code === 0) {
        message.success(`置顶成功`);
        actionRef.current.reset();
      }
    })
  }

  useEffect(() => {
    if (!formVisible) {
      actionRef.current.reset();
    }
  }, [formVisible])

  const columns = [
    {
      title: '排序',
      dataIndex: 'sort',
      valueType: 'text',
      search: false,
    },
    {
      title: '活动标题',
      dataIndex: 'title',
    },
    {
      title: '活动图片',
      dataIndex: 'image',
      render: (text) => <img src={text} width={50} height={50} />,
      search: false,
    },
    {
      title: '跳转链接',
      dataIndex: 'actionUrl',
      valueType: 'text',
      search: false,
    },
    {
      title: '编辑时间',
      dataIndex: 'updateTime',
      valueType: 'text',
      search: false,
    },
    {
      title: '操作人',
      dataIndex: 'updateName',
      valueType: 'text',
      search: false,
    },
    {
      title: '操作人',
      dataIndex: 'operator',
      valueType: 'text',
      hideInTable: true,
    },
    {
      title: '状态',
      dataIndex: 'state',
      filters: true,
      onFilter: true,
      hideInTable: true,
      valueType: 'select',
      valueEnum: {
        0: {
          text: '关闭',
          status: '1',
        },
        1: {
          text: '启用',
          status: '2',
        },
      }
    },
    {
      title: '展示对象',
      dataIndex: 'customerType',
      valueType: 'text',
      search: false,
      valueEnum: {
        1: '所有用户',
        2: '全部店主',
        3: '生鲜店主',
        4: '普通店主',
      }
    },
    {
      title: '状态',
      dataIndex: 'state',
      valueType: 'text',
      search: false,
      valueEnum: {
        0: '关闭',
        1: '启用',
      }
    },
    {
      title: '操作',
      valueType: 'option',
      dataIndex: 'option',
      render: (text, record, _) => {
        return (
          <>
            {record.state===1&&<a key="top" onClick={() => {top(record.id)}}>置顶</a>}
            &nbsp;&nbsp;{<a key="editable" onClick={() => {getDetail(record)}}>编辑</a>}
          </>
        )
      }
    },
  ];

  return (
    <PageContainer>
      <ProForm.Group>
        <ProCard style={{display: 'flex',}}>
          <Button type={useType==1?'primary':''} onClick={() => {setUseType(1)}}>APP</Button>
          <Button type={useType==1?'':'primary'} onClick={() => {setUseType(2)}}>小程序</Button>
        </ProCard>
      </ProForm.Group>
    <ProTable
      rowKey="id"
      columns={columns}
      actionRef={actionRef}
      params={{useType: useType}}
      request={homeActivityList}
      search={{
        labelWidth: 'auto',
      }}
      pagination={{
        pageSize: 5,
      }}
      scroll={{ x: 'max-content', scrollToFirstRowOnChange: true, }}
      dateFormatter="string"
      headerTitle="首页活动入口配置"
      toolBarRender={(_,record) => [
        <Button key="button" icon={<PlusOutlined />} type="primary" onClick={() => { getDetail() }}>
          新增
        </Button>,
      ]}
    />
    {formVisible && <Edit
      visible={formVisible}
      setVisible={setFormVisible}
      detailData={detailData}
      useType={useType}
      callback={() => { actionRef.current.reload(); setDetailData(null) }}
      onClose={() => { actionRef.current.reload(); setDetailData(null) }}
    />}
    </PageContainer>
  );
};


export default HomeActivity;