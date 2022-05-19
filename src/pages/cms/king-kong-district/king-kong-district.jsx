
import React, { useEffect, useRef, useState } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import { Button, Space, message } from 'antd';
import ProTable from '@ant-design/pro-table';
import ProForm from '@ant-design/pro-form';
import { PageContainer } from '@/components/PageContainer';
import Edit from './form';
import ContentVersionTab from '@/components/content-version-tab';
import { kingKongDistrictList, kongKongDistrictDel, kongKongModifyType, kingKongTop } from '@/services/cms/member/member';

const KingKongDistrict = () => {
  const actionRef = useRef();
  const [formVisible, setFormVisible] = useState(false);
  const [detailData, setDetailData] = useState(null);
  const [verifyVersionId, setVerifyVersionId] = useState(1);
  const [flag, setFlag] = useState(false)

  useEffect(() => {
    if (flag) {
      actionRef.current.reset();
      setFlag(false)
    }
  }, [flag])

  const getDetail = (data) => {
    if (data) {
      setDetailData(data)
    } else {
      setDetailData(null)
    }
    setFormVisible(true);
  }

  const formControl = (data) => {
    kongKongDistrictDel({id: data, verifyVersionId:verifyVersionId}).then((res) => {
      if (res.code === 0) {
        message.success(`删除成功`);
        actionRef.current.reset();
      }
    })
  }

  const modifyType = (data, type) => {
    const selectedRowKeys = data.selectedRowKeys
    let goodsTypeUpdateStateRequestList = [];
    let len = selectedRowKeys.length
    for (let index = 0; index < len; index++) {
      goodsTypeUpdateStateRequestList.push({
        id:selectedRowKeys[index],
        state: type
      })
    }
    kongKongModifyType({goodsTypeUpdateStateRequestList:goodsTypeUpdateStateRequestList, verifyVersionId:verifyVersionId}).then((res) => {
      if (res.code === 0) {
        message.success(`操作成功`);
        actionRef.current.reset();
      }
    })
  }

  const top = (id) => {
    kingKongTop({id:id, verifyVersionId:verifyVersionId}).then((res) => {
      if (res.code === 0) {
        message.success(`置顶成功`);
        actionRef.current.reset();
      }
    })
  }

  const columns = [
    {
      title: '排序序号',
      dataIndex: 'sort',
      valueType: 'text',
      search: false,
    },
    {
      title: '商品分类标题',
      dataIndex: 'title',
    },
    {
      title: '商品分类图片',
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
      dataIndex: 'updateUserName',
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
            {record.state===1&&<a key="top" onClick={() => {top(record.id)}}>置顶</a>}
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
      request={kingKongDistrictList}
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
                if (item.state === 0) {
                  return pre += 1
                }
                return pre
              },
              0,
            )} 个`}</span>
            <span>{`已发布: ${selectedRows?.reduce(
              (pre, item) => {
                if(item.state === 1) {
                  return pre += 1
                }
                return pre
              },
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
      headerTitle="金刚区"
      toolBarRender={(_,record) => [
        <Button key="button" type="primary" onClick={() => { modifyType(record, 1) }}>
          批量发布
        </Button>,
        <Button key="button" type="primary" onClick={() => { modifyType(record, 0) }}>
          批量下线
        </Button>,
        <Button key="button" icon={<PlusOutlined />} type="primary" onClick={() => { getDetail() }}>
          新增
        </Button>,
      ]}
    />
    {formVisible && <Edit
      visible={formVisible}
      setVisible={setFormVisible}
      detailData={detailData}
      verifyVersionId={verifyVersionId}
      change={setFlag}
    />}
    </PageContainer>
  );
};


export default KingKongDistrict