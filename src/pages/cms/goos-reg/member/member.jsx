
import React, { useRef, useState, useEffect } from 'react';
import { MinusOutlined, PlayCircleOutlined, PauseCircleOutlined } from '@ant-design/icons';
import { Button, Space, message } from 'antd';
import ProTable from '@ant-design/pro-table';
import ProForm from '@ant-design/pro-form';
import { PageContainer } from '@/components/PageContainer';
import Edit from './form';
import Modaledit from './modal';
import MemberReg from '@/components/member-reg';
import ContentVersionTab from '@/components/content-version-tab';
import { spaceInfoList, memberOperation, memberSortTop } from '@/services/cms/member/member';
import { ACTION_TYPE } from '@/utils/text';

const Member = () => {
  const [formVisible, setFormVisible] = useState(false);
  const [detailData, setDetailData] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalData, setModalData] = useState(null);
  const [verifyVersionId, setVerifyVersionId] = useState(1);
  const actionRef = useRef();

  const getDetail = (data) => {
    setModalData(data);
    setModalVisible(true);
  }

  const formControl = (data,type) => {
    console.log('data', data)
    console.log('type', type)
    if (!type && !data.length) {
      return message.error('未勾选批量操作对象!')
    }


    memberOperation({ids: data,status: type}).then((res) => {
      if (res.code === 0) {
        message.success(`${ACTION_TYPE[type]}成功`);
        actionRef.current.reset();
      }
    })
  }
  const sortTop = (data) => {
    memberSortTop({id:data}).then((res) => {
      if (res.code === 0) {
        message.success(`置顶成功`);
        actionRef.current.reset();
      }
    })
  }

  useEffect(() => {
    actionRef.current.reset();
  }, [modalVisible, formVisible])

  const columns = [
    {
      title: '区域',
      dataIndex: 'title',
      valueType: 'text',
      hideInSearch: true,
    },
    {
      title: '区域',
      dataIndex: 'spaceId',
      renderFormItem: () => (<MemberReg />),
      hideInTable: true,
    },
    {
      title: '商品描述',
      dataIndex: 'subtitle',
      hideInSearch: true,
    },
    {
      title: '图片',
      dataIndex: 'image',
      render: (text) => <img src={text} width={50} height={50} />,
      hideInSearch: true,
    },
    {
      title: '图片排序',
      dataIndex: 'sort',
      hideInSearch: true,
    },
    {
      title: '跳转链接',
      dataIndex: 'actionUrl',
      hideInSearch: true,
      width: 400,
      ellipsis: true,
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
      title: '状态',
      dataIndex: 'status',
      valueType: 'text',
      hideInSearch: true,
      valueEnum: {
        1: '待发布',
        2: '已发布',
        3: '下线',
        4: '删除',
      }
    },
    {
      title: '操作',
      valueType: 'option',
      render: (text, record, _) => {
        return (
          <>
            {record.status===2&&<a key="top" style={{marginRight:'10px'}} onClick={() => {sortTop(record.id)}}>置顶</a>}
            {record.status===2&&<a key="down" onClick={() => {formControl(record.id, 1)}}>下线</a>}
            {record.status===1&&<a key="view" onClick={() => {formControl(record.id,2)}}>发布</a>}
            &nbsp;&nbsp;{record.status===1&&<a key="editable" onClick={() => {getDetail(record)}}>编辑</a>}
            {/* &nbsp;&nbsp;{record.status===1&&<a key="d" onClick={() => {formControl(record.id,4)}}>删除</a>} */}
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
        actionRef={actionRef}
        params={{
          verifyVersionId: verifyVersionId
        }}
        scroll={{ x: 'max-content', scrollToFirstRowOnChange: true, }}
        request={spaceInfoList}
        rowSelection={{}}
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
        search={{
          labelWidth: 'auto',
        }}
        dateFormatter="string"
        toolBarRender={(_,record) => [
          <Button key="button" icon={<PlayCircleOutlined />} type="primary" onClick={() => { formControl(record.selectedRowKeys.toString(), 2) }}>
            批量发布
          </Button>,
          <Button key="button" icon={<PauseCircleOutlined />} type="primary" onClick={() => { formControl(record.selectedRowKeys.toString(), 1) }}>
            批量下线
          </Button>,
          // <Button key="button" icon={<MinusOutlined />} type="primary" onClick={() => { formControl(record.selectedRowKeys.toString(), 4) }}>
          //   批量删除
          // </Button>,
        ]}
        columns={columns}
      />
    {formVisible && <Edit
      visible={formVisible}
      setVisible={setFormVisible}
      detailData={detailData}
      callback={() => { actionRef.current.reload();setDetailData(null) }}
      onClose={() => { actionRef.current.reload();setDetailData(null) }}
    />}
    {modalVisible && <Modaledit
      visible={modalVisible}
      setVisible={setModalVisible}
      detailData={modalData}
    />}
    </PageContainer>
  );
};


export default Member