
import React, { useRef, useState, useEffect } from 'react';
import { PlusOutlined, MinusOutlined } from '@ant-design/icons';
import { Button, Space, message } from 'antd';
import ProTable from '@ant-design/pro-table';
import ProForm from '@ant-design/pro-form';
import { PageContainer } from '@/components/PageContainer';
import Edit from './form';
import ContentVersionTab from '@/components/content-version-tab';
import { homeBannerList, homeBannerDel, bannerSortTop } from '@/services/cms/member/member';

const BannerAdmin = () => {
  const actionRef = useRef();
  const [formVisible, setFormVisible] = useState(false);
  const [detailData, setDetailData] = useState(null);
  const [verifyVersionId, setVerifyVersionId] = useState(1);
  const getDetail = (data) => {
    if (data) {
      setDetailData(data);
    } else {
      setDetailData(null);
    }
    setFormVisible(true);
  }

  const top = (data) => {
    bannerSortTop({id: data}).then((res) => {
      if (res.code === 0) {
        message.success(`置顶成功`);
        actionRef.current.reset();
      }
    })
  }

  const formControl = (ids, record) => {
    if (record.selectedRows) {
      let type = false
      record.selectedRows.map((item) => {
        if (!item.state) {
          type=true
        }
      })
      if (!type) {
        message.error(`上线中无法删除！`);
        return
      }
    }

    homeBannerDel({ids: ids}).then((res) => {
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
      title: 'banner名称',
      dataIndex: 'title',
    },
    {
      title: '跳转链接',
      dataIndex: 'actionUrl',
      valueType: 'text',
      search: false,
      width: 500,
      ellipsis: true,
    },
    {
      title: '添加时间',
      dataIndex: 'createTime',
      valueType: 'text',
      search: false,
    },
    {
      title: '位置',
      dataIndex: 'location',
      valueType: 'text',
      search: false,
      valueEnum: {
        1: '首页',
        2: '集约',
        3: '个人中心',
        4: '社区店',
        6: '秒约爆品',
        7: '周末狂欢',
        9: '拼团',
      }
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
    // {
    //   title: '类型',
    //   dataIndex: 'showType',
    //   valueType: 'text',
    //   search: false,
    //   valueEnum: {
    //     1: '固定展示',
    //     2: '有集约内容才展示',
    //   }
    // },
    {
      title: '操作',
      valueType: 'option',
      dataIndex: 'option',
      render: (text, record, _) => {
        return (
          <Space>
            {record.state===1&&<a key="top" onClick={() => {top(record.id)}}>置顶</a>}
            {<a key="editable" onClick={() => {getDetail(record)}}>编辑</a>}
            {record.state===0&&<a key="d" onClick={() => {formControl([record.id],record)}}>删除</a>}
          </Space>
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
      scroll={{ x: 'max-content', scrollToFirstRowOnChange: true, }}
      params={{verifyVersionId: verifyVersionId}}
      request={homeBannerList}
      rowSelection={{
        // 自定义选择项参考: https://ant.design/components/table-cn/#components-table-demo-row-selection-custom
        // 注释该行则默认不显示下拉选项
        // selections: [Table.SELECTION_ALL, Table.SELECTION_INVERT],
      }}
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
        pageSize: 5,
      }}
      dateFormatter="string"
      headerTitle="banner管理"
      toolBarRender={(_,record) => [
        <Button key="button" icon={<MinusOutlined />} type="primary" onClick={() => { formControl(record.selectedRowKeys, record) }}>
          批量删除
        </Button>,
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
      callback={() => { actionRef.current.reload(); setDetailData(null) }}
      onClose={() => { actionRef.current.reload(); setDetailData(null) }}
    />}
    </PageContainer>
  );
};


export default BannerAdmin