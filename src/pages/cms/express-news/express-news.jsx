
import React, { useEffect, useRef, useState } from 'react';
import { PlusOutlined, MinusOutlined } from '@ant-design/icons';
import { Button, Space, message } from 'antd';
import ProTable from '@ant-design/pro-table';
import { PageContainer } from '@/components/PageContainer';
import Edit from './form';
import { expressNewsList, expressNewsDel, expressNewsDown, expressNewsTop } from '@/services/cms/member/member';

const ExpressNews = () => {
  const actionRef = useRef();
  const [formVisible, setFormVisible] = useState(false);
  const [detailData, setDetailData] = useState(null);
  const [flag, setFlag] = useState(false);

  useEffect(() => {
    if (flag) {
      actionRef.current.reset()
      setFlag(false)
    }
  }, [flag])

  const getDetail = (data) => {
    setDetailData(data);
    setFormVisible(true);
  }

  const formControl = (record) => {
    let data = [{'id':record}]
    if (record.selectedRows) {
      data = record.selectedRows.map((item) =>{ return {id:item['id']}})
    }
    expressNewsDel({deleteIdLists: data}).then((res) => {
      if (res.code === 0) {
        message.success(`删除成功`);
        actionRef.current.reset();
      }
    })
  }

  const down = (record) => {
    record.state = 0
    expressNewsDown(record).then((res) => {
      if (res.code === 0) {
        message.success(`下线成功`);
        actionRef.current.reset();
      }
    })
  }

  const top = (id) => {
    expressNewsTop({id:id}).then((res) => {
      if (res.code === 0) {
        message.success(`置顶成功`);
        actionRef.current.reset();
      }
    })
  }

  const columns = [
    {
      title: '序号',
      dataIndex: 'sort',
      valueType: 'text',
      search: false
    },
    {
      title: '消息标题',
      dataIndex: 'title',
    },
    {
      title: '跳转链接',
      dataIndex: 'actionUrl',
      valueType: 'text',
      width: 400,
      ellipsis: true,
      search: false,
    },
    {
      title: '发布时间',
      dataIndex: 'createTime',
      valueType: 'text',
      search: false,
    },
    {
      title: '发布人员',
      dataIndex: 'createUserName',
      valueType: 'text',
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
      title: '发布状态',
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
            {record.state===1&&<Button key="top" onClick={() => {top(record.id)}}>置顶</Button>}
            {record.state===1&&<Button key="down" onClick={() => {down(record)}}>下线</Button>}
            {record.state===0&&<Button key="editable" onClick={() => {getDetail(record)}}>编辑</Button>}
            {record.state===0&&<Button key="d" onClick={() => {formControl(record.id)}}>删除</Button>}
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
      request={expressNewsList}
      rowSelection={{
        // 自定义选择项参考: https://ant.design/components/table-cn/#components-table-demo-row-selection-custom
        // 注释该行则默认不显示下拉选项
        // selections: [Table.SELECTION_ALL, Table.SELECTION_INVERT],
      }}
      scroll={{ x: 'max-content', scrollToFirstRowOnChange: true, }}
      tableAlertRender={({ selectedRowKeys, selectedRows, onCleanSelected }) => (
        <Space size={24}>
          <span>
            已选 {selectedRowKeys.length} 项
            <a style={{ marginLeft: 8 }} onClick={onCleanSelected}>
              取消选择
            </a>
          </span>
          <span>{`待发布: ${selectedRows?.reduce(
            (pre, item) => {
              item.state === 0
              if (item.state === 0) {
                return pre += 1
              }
              return pre
            },0,)} 个`}</span>
          <span>{`已发布: ${selectedRows?.reduce(
            (pre, item) => item.state && pre + 1,
            0,
          )} 个`}</span>
        </Space>
      )}
      search={{
        labelWidth: 'auto',
      }}
      pagination={{
        pageSize: 10,
      }}
      dateFormatter="string"
      headerTitle="约购快报"
      toolBarRender={(_,record) => [
        <Button key="button" icon={<MinusOutlined />} type="primary" onClick={() => { formControl(record) }}>
          批量删除
        </Button>,
        <Button key="button" icon={<PlusOutlined />} type="primary" onClick={() => { getDetail({_,record}) }}>
          新增消息
        </Button>,
      ]}
    />
    {formVisible && <Edit
      visible={formVisible}
      setVisible={setFormVisible}
      detailData={detailData}
      getContainer={false}
      setFlag={setFlag}
    />}
    </PageContainer>
  );
};


export default ExpressNews