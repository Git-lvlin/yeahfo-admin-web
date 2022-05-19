
import React, { useRef, useState, useEffect } from 'react';
import { message } from 'antd';
import ProTable from '@ant-design/pro-table';
import { PageContainer } from '@/components/PageContainer';
import Edit from './form';
import { contentVersionList, cententVersionStatus } from '@/services/cms/member/member';

const ContentVersion = () => {
  const actionRef = useRef();
  const [formVisible, setFormVisible] = useState(false);
  const [detailData, setDetailData] = useState(null);

  const getDetail = (data) => {
    data && setDetailData(data);
    setFormVisible(true);
  }

  const switchBtn = (open, id) => {
    cententVersionStatus({id: id, status: open}).then((res) => {
      if (res.code === 0) {
        message.success(`操作成功`);
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
      title: '编号',
      dataIndex: 'id',
      valueType: 'text',
    },
    {
      title: '名称',
      dataIndex: 'title',
    },
    {
      title: '备注',
      dataIndex: 'remark',
      valueType: 'text',
    },
    {
      title: '状态',
      dataIndex: 'status',
      valueType: 'text',
      search: false,
      valueEnum: {
        1: '关闭',
        2: '启用',
      }
    },
    {
      title: '操作',
      valueType: 'option',
      dataIndex: 'option',
      render: (text, record, _) => {
        return (
          <>
            {<a key="editable" onClick={() => {getDetail(record)}}>编辑</a>}
            &nbsp;&nbsp;{record.status===1&&<a key="open" onClick={() => {switchBtn(2,record.id)}}>开启</a>}
            {record.status===2&&<a key="close" onClick={() => {switchBtn(1,record.id)}}>关闭</a>}
          </>
        )
      }
    },
  ];

  return (
    <PageContainer>
    <ProTable
      rowKey="id"
      options={false}
      columns={columns}
      actionRef={actionRef}
      request={contentVersionList}
      search={false}
      pagination={false}
      dateFormatter="string"
      scroll={{ x: 'max-content', scrollToFirstRowOnChange: true, }}
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

export default ContentVersion