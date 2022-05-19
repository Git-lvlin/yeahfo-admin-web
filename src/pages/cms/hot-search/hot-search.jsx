
import React, { useRef, useState, useEffect } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import { Button, message } from 'antd';
import ProTable from '@ant-design/pro-table';
import { PageContainer } from '@/components/PageContainer';
import { hotSearchList, hotSearchDel } from '@/services/cms/member/member';
import Edit from './form';
import { dateFormat } from '@/utils/utils';

const HotSearch = () => {
  const actionRef = useRef();
  const [formVisible, setFormVisible] = useState(false);
  const [detailData, setDetailData] = useState(null);

  const getDetail = (data) => {
    data?setDetailData(data):setDetailData(null);
    setFormVisible(true);
  }

  const formControl = ({id}) => {
    hotSearchDel({id}).then((res) => {
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
      title: 'id',
      dataIndex: 'id',
      search: false,
      hideInTable: true,
    },
    {
      title: '位置',
      dataIndex: 'num',
      valueType: 'text',
      search: false,
    },
    {
      title: '关键词名称',
      dataIndex: 'keyword',
    },
    {
      title: '添加时间',
      key: 'showTime',
      dataIndex: 'addTime',
      sorter: true,
      hideInSearch: true,
    },
    {
      title: '添加时间',
      dataIndex: 'addTime',
      valueType: 'date',
      hideInTable: true,
      search: {
        transform: (value) => {
          return {
            date: Date.parse(new Date(value))/1000,
          };
        },
      },
    },
    {
      title: '操作人',
      dataIndex: 'userName',
      valueType: 'text',
      search: false,
    },
    {
      title: '操作',
      valueType: 'option',
      dataIndex: 'option',
      render: (text, record) => {
        return (
          <>
           {<a key="editable" onClick={() => {getDetail(record)}}>编辑</a>}
            &nbsp;&nbsp;{<a key="d" onClick={() => {formControl(record)}}>删除</a>}
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
      postData={(data) => {
        data.forEach(item => {
          item.addTime = dateFormat(item.addTime * 1000)
        })
        return data
      }}
      scroll={{ x: 'max-content', scrollToFirstRowOnChange: true, }}
      request={hotSearchList}
      search={{
        labelWidth: 'auto',
      }}
      pagination={{
        pageSize: 10,
      }}
      dateFormatter="string"
      toolBarRender={(_) => [
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


export default HotSearch