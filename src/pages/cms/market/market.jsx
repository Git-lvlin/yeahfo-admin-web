
import React, { useRef, useState, useEffect } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import { Button, message } from 'antd';
import ProTable from '@ant-design/pro-table';
import { PageContainer } from '@/components/PageContainer';
import Edit from './form';
import Look from './look';
import { marketList, marketDel } from '@/services/cms/member/member';

const BannerAdmin = () => {
  const actionRef = useRef();
  const [formVisible, setFormVisible] = useState(false);
  const [formVisibles, setFormVisibles] = useState(false);
  const [detailData, setDetailData] = useState(null);

  const getDetail = (data) => {
    data && setDetailData(data);
    setFormVisible(true);
  }

  const look = (data) => {
    data && setDetailData(data);
    setFormVisibles(true);
  }

  const formControl = (id) => {
    marketDel({id: id}).then((res) => {
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
      title: '营销活动名称',
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
      title: '操作',
      valueType: 'option',
      dataIndex: 'option',
      render: (text, record, _) => {
        return (
          <>
            {<a key="editable" onClick={() => {getDetail(record)}}>编辑</a>}
            &nbsp;&nbsp;{<a key="look" onClick={() => {look(record)}}>查看</a>}
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
      request={marketList}
      // rowSelection={{
      //   // 自定义选择项参考: https://ant.design/components/table-cn/#components-table-demo-row-selection-custom
      //   // 注释该行则默认不显示下拉选项
      //   // selections: [Table.SELECTION_ALL, Table.SELECTION_INVERT],
      // }}
      // tableAlertRender={({ selectedRowKeys, selectedRows, onCleanSelected }) => (
      //   <Space size={24}>
      //     <span>
      //       已选 {selectedRowKeys.length} 项
      //       <a style={{ marginLeft: 8 }} onClick={onCleanSelected}>
      //         取消选择
      //       </a>
      //     </span>
      //     <span>{`待发布: ${selectedRows?.reduce(
      //       (pre, item) => {
      //         item.state === 0
      //         if (item.state === 0) {
      //           return pre += 1
      //         }
      //         return pre
      //       },0,)} 个`}</span>
      //     <span>{`已发布: ${selectedRows?.reduce(
      //       (pre, item) => item.state && pre + 1,
      //       0,
      //     )} 个`}</span>
      //   </Space>
      // )}
      search={{
        labelWidth: 'auto',
      }}
      pagination={{
        pageSize: 5,
      }}
      scroll={{ x: 'max-content', scrollToFirstRowOnChange: true, }}
      dateFormatter="string"
      headerTitle="营销落地页资源配置管理"
      toolBarRender={(_,record) => [
        // <Button key="button" icon={<MinusOutlined />} type="primary" onClick={() => { formControl(record.selectedRowKeys, record) }}>
        //   批量删除
        // </Button>,
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
    {formVisibles && <Look
      visible={formVisibles}
      setVisible={setFormVisibles}
      detailData={detailData}
      callback={() => { actionRef.current.reload(); setDetailData(null) }}
      onClose={() => { actionRef.current.reload(); setDetailData(null) }}
    />}
    </PageContainer>
  );
};


export default BannerAdmin