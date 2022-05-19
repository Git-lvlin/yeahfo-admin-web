import React, { useState, useRef,useEffect } from 'react';
import { Button,Tabs,Image,Form,Modal,Select} from 'antd';
import ProTable from '@ant-design/pro-table';
import { findPage } from '@/services/activity-management/spring-festival-build-building-activity';
import { PageContainer } from '@/components/PageContainer';
import BindingModel from './binding-model'
import BindinglogModel from './bindinglog-model'




export default () => {
    const ref=useRef()
    const [visible, setVisible] = useState(false);
    const [logVisible, setLogVisible] = useState(false);
    const [formDetail, setFormDetail] = useState({})
    const columns= [
      {
        title: '序号',
        dataIndex:'id',
        valueType: 'borderIndex',
        hideInSearch: true,
        valueType: 'indexBorder'
      },
      {
        title: '用户名',
        dataIndex: 'withdrawRealname',
        valueType: 'text',
      },
      {
        title: '用户手机号',
        dataIndex: 'registMobile',
        valueType: 'text',
      },
      {
        title: '绑定支付宝账号',
        dataIndex: 'withdrawAccount',
        valueType: 'text',
        hideInSearch: true,
      },
      {
        title: '操作',
        key: 'option',
        valueType: 'option',
        render:(text, record, _, action)=>[
            <a key='detail' onClick={()=>{setVisible(true);setFormDetail(record)}}>编辑</a>,
            <a key="binding" onClick={()=>{setLogVisible(true);setFormDetail(record)}}>绑定记录</a>
        ],
      }, 
    ];
    return (
      <PageContainer>
        <ProTable
          actionRef={ref}
          rowKey="sn"
          options={false}
          request={findPage}
          search={{
            defaultCollapsed: true,
            labelWidth: 100,
            optionRender: (searchConfig, formProps, dom) => [
               ...dom.reverse()
            ],
          }}
          scroll={{ x: 'max-content', scrollToFirstRowOnChange: true, }}
          columns={columns}
          pagination={{
            pageSize: 10,
            showQuickJumper: true,
          }}
        />
        {visible && <BindingModel
          visible={visible}
          setVisible={setVisible}
          formDetail={formDetail}
          onClose={()=>{ref.current.reload();setFormDetail(null)}}
          callback={()=>{ref.current.reload();setFormDetail(null)}}
        />}
        {logVisible && <BindinglogModel
          visible={logVisible}
          setVisible={setLogVisible}
          formDetail={formDetail}
          onClose={()=>{ref.current.reload();setFormDetail(null)}}
          callback={()=>{ref.current.reload();setFormDetail(null)}}
        />}
        </PageContainer>
    );
  };