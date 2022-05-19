
import React, { useRef, useState, useEffect } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import { Button, message } from 'antd';
import ProTable from '@ant-design/pro-table';
import { PageContainer } from '@/components/PageContainer';
import Edit from './form';
import { posterList, posterDel } from '@/services/cms/member/member';

const Poster = () => {
  const actionRef = useRef();
  const [formVisible, setFormVisible] = useState(false);
  const [detailData, setDetailData] = useState(null);

  const getDetail = (data) => {
    data && setDetailData(data);
    setFormVisible(true);
  }

  const formControl = (id) => {
    posterDel({id: id}).then((res) => {
      if (res.code === 0) {
        message.success(`删除成功`);
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
      title: '图片',
      dataIndex: 'image',
      render: (text) => <img src={text} width={50} height={50} />,
      search: false,
    },
    {
      title: '海报名称',
      dataIndex: 'title',
    },
    {
      title: '添加时间',
      dataIndex: 'createTime',
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
      title: '操作',
      valueType: 'option',
      dataIndex: 'option',
      render: (text, record, _) => {
        return (
          <>
            {<a key="editable" onClick={() => {getDetail(record)}}>编辑</a>}
            &nbsp;&nbsp;{<a key="d" onClick={() => {formControl(record.id)}}>删除</a>}
          </>
        )
      }
    },
  ];

  return (
    <PageContainer>
    <ProTable
      rowKey="id"
      columns={columns}
      actionRef={actionRef}
      request={posterList}
      search={{
        labelWidth: 'auto',
      }}
      scroll={{ x: 'max-content', scrollToFirstRowOnChange: true, }}
      pagination={{
        pageSize: 9,
      }}
      dateFormatter="string"
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
      callback={() => { actionRef.current.reload(); setDetailData(null) }}
      onClose={() => { actionRef.current.reload(); setDetailData(null) }}
    />}
    </PageContainer>
  );
};

export default Poster