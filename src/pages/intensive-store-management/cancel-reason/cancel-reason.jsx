
import React, { useRef, useState } from 'react';
import { Button, Space, message } from 'antd';
import ProTable from '@ant-design/pro-table';
import { pageForAdmin,cancelReasonUpdate} from '@/services/intensive-store-management/cancel-reason';
import { PageContainer } from '@/components/PageContainer';
import CancelModel from './cancel-model'
import StopModel from './stop-model'
import { useEffect } from 'react';

export default () => {
  const actionRef = useRef();
  const [visible, setVisible] = useState(false);
  const [formDetail , setFormDetail ] = useState()
  const [stopVisible,setStopVisible]=useState(false)

  const columns = [
    {
      title: '序号',
      dataIndex: 'id',
      hideInSearch: true,
      valueType: 'indexBorder'
    },
    {
      title: '注销原因',
      dataIndex: 'reason',
      valueType: 'text',
      hideInSearch: true,
    },
    {
      title: '状态',
      dataIndex: 'status',
      valueType: 'text',
      hideInSearch: true,
      render:(_,data)=>{
        return {1:'已启用',2:'已禁用'}[_.code]
      }
    },
    {
      title: '操作',
      valueType: 'option',
      dataIndex: 'option',
      render: (text, record, _) => [
        <a
        key="edit"
        onClick={() => {
          setVisible(true)
          setFormDetail(record)
        }}
      >
        编辑
      </a>,
        <a 
        key='stop'
        onClick={()=>{
          setStopVisible(true)
          setFormDetail(record)
        }}>
          {record?.status?.code==1?'禁用':'启用'}
        </a>
      ]
    },
  ];

  return (
    <PageContainer>
      <ProTable
        rowKey="id"
        options={false}
        columns={columns}
        actionRef={actionRef}
        request={pageForAdmin}
        scroll={{ x: 'max-content', scrollToFirstRowOnChange: true, }}
        search={{
            defaultCollapsed: true,
            labelWidth: 100,
            optionRender: (searchConfig, formProps, dom) => [
            <Button type="primary"  onClick={()=>setVisible(true)} key="add">
              添加
            </Button>
            ],
          }}
        toolBarRender={false}
        pagination={{
          pageSize: 10,
        }}
      />
      {visible && <CancelModel
        visible={visible}
        setVisible={setVisible}
        formDetail={formDetail}
        callback={()=>{ actionRef.current.reload(); setFormDetail(null)}}
        onClose={() => { actionRef.current.reload(); setFormDetail(null) }}
      />}
      {stopVisible && <StopModel
        visible={stopVisible}
        setVisible={setStopVisible}
        formDetail={formDetail}
        callback={()=>{ actionRef.current.reload(); setFormDetail(null)}}
        onClose={() => { actionRef.current.reload(); setFormDetail(null) }}
      />}
    </PageContainer>
  );
};