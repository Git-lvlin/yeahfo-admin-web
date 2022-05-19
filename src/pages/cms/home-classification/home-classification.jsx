
import React, { useRef, useState, useEffect } from 'react';
import { message, Button } from 'antd';
import ProTable from '@ant-design/pro-table';
import ProForm, { ProFormSwitch } from '@ant-design/pro-form';
import ProCard from '@ant-design/pro-card';
import { PageContainer } from '@/components/PageContainer';
import { dateFormat } from '@/utils/utils';
import Edit from './form';
import ClassSort from './sort';
import ContentVersionTab from '@/components/content-version-tab';
import { homeClassificationList, homeClassificationSortTop, homeClassificationStatus, homeClassificationSetSort } from '@/services/cms/member/member';

const HomeClassification = () => {
  const actionRef = useRef();
  const [formVisible, setFormVisible] = useState(false);
  const [detailData, setDetailData] = useState(null);
  const [listData, setListData] = useState(null);
  const [verifyVersionId, setVerifyVersionId] = useState(1);
  const getDetail = (data) => {
    setDetailData(data);
    setFormVisible(true);
  }

  const top = ({homeStatus, id}) => {
    if (!homeStatus) {
      message.error('关闭状态无法置顶')
      return
    }
    homeClassificationSortTop({id:id, verifyVersionId: verifyVersionId}).then((res) => {
      if (res.code === 0) {
        message.success(`置顶成功`);
        actionRef.current.reset();
      }
    })
  }

  const onChangeSwitch = (indexStatus, item) => {
    const param = {
      id: item.id,
      status: indexStatus?1:0,
      verifyVersionId: verifyVersionId
    }
    homeClassificationStatus(param).then((res) => {
      if (res.code === 0) {
        message.success(`切换状态成功`);
        actionRef.current.reset();
      }
    })
    
  }

  const setSort = (v) => {
    const param = {}
    v.map((item, index) => {
      param[item.id]=index+1
    })
    homeClassificationSetSort({sortList:param, verifyVersionId: verifyVersionId}).then((res) => {
      if (res.code === 0) {
        message.success(`编辑排序成功`);
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
      dataIndex: 'homeSort',
      valueType: 'text',
      search: false,
    },
    {
      title: '分类名称',
      dataIndex: 'gcName',
    },
    {
      title: '操作人',
      dataIndex: 'lastEditor',
      hideInTable: true,
    },
    {
      title: '编辑时间',
      dataIndex: 'homeLastEditTime',
      valueType: 'text',
      search: false,
      render:(time) => {
        return dateFormat(time*1000)
      }
    },
    {
      title: '操作人',
      dataIndex: 'homeLastEditor',
      valueType: 'text',
      search: false,
    },
    {
      title: '状态',
      dataIndex: 'homeStatus',
      filters: true,
      onFilter: true,
      hideInTable: true,
      valueType: 'select',
      valueEnum: {
        0: {
          text: '已下线',
          homeStatus: 0,
        },
        1: {
          text: '已上线',
          homeStatus: 1,
        },
      }
    },
    {
      title: '状态',
      dataIndex: 'homeStatus',
      valueType: 'text',
      search: false,
      render: (_,item) => {
        return (
          <ProFormSwitch
            name="homeStatus"
            fieldProps={{
              style: {marginTop: 24},
              checked:_,
              onChange: (indexData) => {
                onChangeSwitch(indexData, item)
              },
            }}
          />
        )
      }
    },
    {
      title: '操作',
      valueType: 'option',
      dataIndex: 'option',
      render: (text, record, _) => {
        return (
          <>
            <a key="top" onClick={() => {top(record)}}>置顶</a>
            &nbsp;&nbsp;<a key="editable" onClick={() => {getDetail(record)}}>编辑</a>
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
      params={{verifyVersionId: verifyVersionId}}
      request={homeClassificationList}
      scroll={{ x: 'max-content', scrollToFirstRowOnChange: true, }}
      postData={(data) => {
        setListData(data)
        data.map(item=>{
          return item.switchLoading = 0
        })
        return data
      }}
      search={{
        labelWidth: 'auto',
      }}
      pagination={{
        pageSize: 5,
      }}
      dateFormatter="string"
      headerTitle="首页分类配置"
      toolBarRender={() => [
        <ClassSort data={listData} callback={(v) => { setSort(v) }} />
      ]}
    />
    {formVisible && <Edit
      visible={formVisible}
      setVisible={setFormVisible}
      onChangeSwitch={onChangeSwitch}
      verifyVersionId={verifyVersionId}
      detailData={detailData}
      callback={() => { actionRef.current.reload(); setDetailData(null) }}
      onClose={() => { actionRef.current.reload(); setDetailData(null) }}
    />}
    </PageContainer>
  );
};


export default HomeClassification;