
import React, { useRef, useState, useEffect } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import { Button, message } from 'antd';
import ProTable from '@ant-design/pro-table';
import { PageContainer } from '@/components/PageContainer';
import Edit from './form';
import { storyList, posterDel } from '@/services/cms/member/member';

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
      title: '店铺Logo',
      dataIndex: 'logo',
      render: (text) => <img src={text} width={50} height={50} />,
      search: false,
    },
    {
      title: '店铺名称',
      dataIndex: 'storeName',
      valueType: 'text',
      search: false,
    },
    {
      title: '店主姓名',
      dataIndex: 'storeUserName',
      valueType: 'text',
      search: false,
    },
    {
      title: '故事内容',
      dataIndex: 'storeStory',
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
      request={storyList}
      search={false}
      pagination={false}
      dateFormatter="string"
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