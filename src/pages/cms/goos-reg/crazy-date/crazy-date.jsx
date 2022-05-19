import React, { useRef, useEffect, useState } from 'react';
import { PlusOutlined, MinusOutlined, PlayCircleOutlined, PauseCircleOutlined } from '@ant-design/icons';
import { Button, Space, message } from 'antd';
import ProTable from '@ant-design/pro-table';
import { PageContainer } from '@/components/PageContainer';
import Edit from './form';
import DetailList from './activity-form';
import { crazyDateList, crazyActivityDel } from '@/services/cms/member/member';
import { ACTION_TYPE } from '@/utils/text';

const CrazyDate = () => {
  const actionRef = useRef();
  const [formVisible, setFormVisible] = useState(false);
  const [detailData, setDetailData] = useState(false);
  const [flag, setFlag] = useState(false);
  const [act, setAct] = useState(false);
  const [acid, setAcId] = useState({cmsId: 0});

  const getDetail = (data) => {
    data?setDetailData(data):setDetailData(false);
    setFormVisible(true);
  }

  const formControl = (data,type) => {
    crazyActivityDel({ids: data,status: type}).then((res) => {
      if (res.code === 0) {
        message.success(`${ACTION_TYPE[type]}成功`);
        actionRef.current.reset();
      }
    })
  }

  useEffect(() => {
    if(flag) {
      actionRef.current.reset();
      setFlag(false)
    }
  }, [flag])

  const columns = [
    {
      title: '活动序号',
      dataIndex: 'index',
      valueType: 'indexBorder',
      search: false
    },
    {
      title: '活动标题',
      dataIndex: 'title',
      valueType: 'text',
    },
    {
      title: '状态',
      dataIndex: 'status',
      filters: true,
      onFilter: true,
      hideInTable: true,
      valueType: 'select',
      valueEnum: {
        0: { text: '全部', status: 'Default' },
        1: {
          text: '待发布',
          status: '1',
        },
        2: {
          text: '已发布',
          status: '2',
        },
      }
    },
    {
      title: '活动状态',
      dataIndex: 'status',
      valueType: 'text',
      hideInSearch: true,
      valueEnum: {
        1: '未发布',
        2: '已发布',
      }
    },
    {
      title: '位置',
      dataIndex: 'cmsClassName',
      valueType: 'text',
      search: false,
    },
    {
      title: '操作',
      valueType: 'option',
      dataIndex: 'option',
      render: (text, record, _,) => {
        return (
          <>
            <a key="editable" onClick={() => {getDetail(record)}}>编辑</a>
            &nbsp;&nbsp;<a key="pz" onClick={() => {goDetail(record)}}>配置</a>
          </>
        )
      }
    },
  ];

  const goDetail = (record) => {
    setAcId(record.id)
    setAct(true)
  }

  return (
    <PageContainer>
      <ProTable
        rowKey="id"
        postData={(data) => {
          data.forEach((item) => 
            item.title = item.title + item.subtitle
          )
          return data
        }}
        options={false}
        columns={columns}
        actionRef={actionRef}
        request={crazyDateList}
        scroll={{ x: 'max-content', scrollToFirstRowOnChange: true, }}
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
                  if (item.status === 1) {
                    return pre += 1
                  }
                  return pre
                },
                0,
              )} 个`}</span>
              <span>{`已发布: ${selectedRows?.reduce(
                (pre, item) => {
                  if(item.status === 2) {
                    return pre += 1
                  }
                  return pre
                },
                0,
              )} 个`}</span>
          </Space>
        )}
        pagination={{
          pageSize: 10,
        }}
        dateFormatter="string"
        toolBarRender={(_,record) => [
          <Button key="button" icon={<PlayCircleOutlined />} type="primary" onClick={() => { formControl(record.selectedRowKeys.toString(), 2) }}>
            批量发布
          </Button>,
          <Button key="button" icon={<PauseCircleOutlined />} type="primary" onClick={() => { formControl(record.selectedRowKeys.toString(), 1) }}>
            批量下线
          </Button>,
          <Button key="button" icon={<MinusOutlined />} type="primary" onClick={() => { formControl(record.selectedRowKeys.toString(), 4) }}>
            批量删除
          </Button>,
          <Button key="button" icon={<PlusOutlined />} type="primary" onClick={() => { getDetail() }}>
            新建
          </Button>,
        ]}
      />
      {formVisible && <Edit
        visible={formVisible}
        setVisible={setFormVisible}
        detailData={detailData}
        setFlag={setFlag}
      />}
      {act && <DetailList
        visible={act}
        setVisible={setAct}
        acid={acid}
      />}
    </PageContainer>
  );
};

export default CrazyDate;