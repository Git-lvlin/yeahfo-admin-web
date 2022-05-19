
import React, { useRef, useState } from 'react';
import { Button, Space, message } from 'antd';
import ProTable from '@ant-design/pro-table';
import { PageContainer } from '@/components/PageContainer';
import Edit from './form';
import { history,connect } from 'umi';
import { findAdminArticleTypeList} from '@/services/cms/member/member';
import CloseModel from './close-model' 

const ArticleCategoryList = () => {
  const actionRef = useRef();
  const [formVisible, setFormVisible] = useState(false);
  const [detailData, setDetailData] = useState(false);
  const [formControl,setFormControl]=useState()
  const [visible, setVisible] = useState(false);

  const columns = [
    {
      title: '编号',
      dataIndex: 'id',
      valueType: 'text',
    },
    {
      title: '分类名称',
      dataIndex: 'typeName',
      valueType: 'text',
    },
    {
      title: '分类描述',
      dataIndex: 'typeDesc',
      valueType: 'text',
    },
    {
      title: '展示序号',
      dataIndex: 'sortNum',
      valueType: 'number',
    },
    {
      title: '置顶',
      dataIndex: 'isTop',
      valueType: 'select',
      valueEnum: {
        0: '未置顶',
        1: '已置顶',
      },
      width:80
    },
    {
      title: '创建信息',
      dataIndex: 'authorName',
      valueType: 'text',
      render:(_,data)=>{
        return <>
               <p>{data?.authorName}</p>
               <p>{data?.createTime}</p>
              </>
      },
      width:150,
    },
    {
      title: '状态',
      dataIndex: 'isShow',
      valueType: 'select',
      valueEnum: {
        0: '已关闭',
        1: '已启用',
      },
      width:80
    },
    {
      title: '文章数量',
      dataIndex: 'articleNum',
      valueType: 'number',
      render:(text, record, _, action)=>[
        <a key='num' onClick={()=>history.push(`/business-school/article-list?articleTypeId=${record?.id}`)}>{record?.articleNum}</a>
      ],
    },
    {
      title: '操作',
      valueType: 'option',
      dataIndex: 'option',
      render: (text, record, _) => {
        return (
          <>
            {<a key="down" onClick={() => {
              setFormControl({id:record?.id,isShow:record?.isShow,hide:true})
              setVisible(true)
              }}>{record?.isShow?'关闭':'启用'}</a>}
            &nbsp;&nbsp;{<a key="editable" onClick={() => {
              setFormVisible(true)
              setDetailData(record)
              }}>编辑</a>}
            &nbsp;&nbsp;{<a key="top" onClick={() => {
              setFormControl({id:record?.id,isTop:record?.isTop,top:true})
              setVisible(true)
              }}>{record?.isTop?'取消置顶':'置顶'}</a>}
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
        request={findAdminArticleTypeList}
        pagination={false}
        dateFormatter="string"
        search={false}
        toolBarRender={(_,record) => [
          <Button key="new" type="primary" onClick={() => { 
            setFormVisible(true) 
            setDetailData() 
          }}>
            新建
          </Button>,
        ]}
      />
      {formVisible && <Edit
        visible={formVisible}
        setVisible={setFormVisible}
        detailData={detailData}
        callback={() => { actionRef.current.reload() }}
        onClose={() => { actionRef.current.reload() }}
      />}
      {
      formControl&&<CloseModel 
        boxref={actionRef} 
        formControl={formControl}
        setVisible={setVisible}
        visible={visible}
      />
      }
    </PageContainer>
  );
};


export default ArticleCategoryList