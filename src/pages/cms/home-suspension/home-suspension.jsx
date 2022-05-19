
import React, { useEffect, useRef, useState } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import { Button, message } from 'antd';
import ProTable from '@ant-design/pro-table';
import ProForm from '@ant-design/pro-form';
import { PageContainer } from '@/components/PageContainer';
import Edit from './form';
import ContentVersionTab from '@/components/content-version-tab';
import { homeSuspensionList, homeSuspensionDel } from '@/services/cms/member/member';

const HomeSuspension = () => {
  const actionRef = useRef();
  const [formVisible, setFormVisible] = useState(false);
  const [detailData, setDetailData] = useState(null);
  const [flag, setFlag] = useState(false);
  const [verifyVersionId, setVerifyVersionId] = useState(1);

  const getDetail = (data) => {
    data && setDetailData(data);
    setFormVisible(true);
  }

  const formControl = (data) => {
    homeSuspensionDel({id: data}).then((res) => {
      if (res.code === 0) {
        message.success(`删除成功`);
        actionRef.current.reset();
      }
    })
  }

  useEffect(() => {
    if (flag) {
      actionRef.current.reset();
      setFlag(false)
    }
  }, [flag])

  const columns = [
    {
      title: '序号',
      dataIndex: 'index',
      valueType: 'indexBorder',
    },
    {
      title: '图片',
      dataIndex: 'image',
      render: (text) => <img src={text} width={50} height={50} />,
      search: false,
    },
    {
      title: '悬窗名称',
      dataIndex: 'title',
    },
    {
      title: '跳转链接',
      dataIndex: 'actionUrl',
      valueType: 'text',
      search: false,
    },
    {
      title: '添加时间',
      dataIndex: 'createTime',
      valueType: 'text',
      search: false,
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
          text: '已下线',
          status: '1',
        },
        1: {
          text: '已上线',
          status: '2',
        },
      }
    },
    {
      title: '状态',
      dataIndex: 'state',
      valueType: 'text',
      search: false,
      valueEnum: {
        0: '下架',
        1: '上架',
      }
    },
    {
      title: '操作',
      valueType: 'option',
      dataIndex: 'option',
      render: (text, record, _) => {
        return (
          <>
            &nbsp;&nbsp;{<a key="editable" onClick={() => {getDetail(record)}}>编辑</a>}
            &nbsp;&nbsp;{record.state===0&&<a key="d" onClick={() => {formControl(record.id)}}>删除</a>}
          </>
        )
      }
    },
  ];

  return (
    <PageContainer>
      <ProForm.Group>
        <ContentVersionTab setVerifyVersionId={setVerifyVersionId} />
      </ProForm.Group>
    <ProTable
      rowKey="id"
      columns={columns}
      actionRef={actionRef}
      params={{
        verifyVersionId: verifyVersionId
      }}
      scroll={{ x: 'max-content', scrollToFirstRowOnChange: true, }}
      request={homeSuspensionList}
      search={{
        labelWidth: 'auto',
      }}
      pagination={{
        pageSize: 10,
      }}
      dateFormatter="string"
      headerTitle="首页悬浮窗"
      toolBarRender={(_,record) => [
        <Button key="button" icon={<PlusOutlined />} type="primary" onClick={() => { getDetail() }}>
          新增
        </Button>,
      ]}
    />
    {formVisible && <Edit
      visible={formVisible}
      setVisible={setFormVisible}
      verifyVersionId={verifyVersionId}
      detailData={detailData}
      setFlag={setFlag}
    />}
    </PageContainer>
  );
};


export default HomeSuspension