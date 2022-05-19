import React, { useState, useRef } from 'react';
import ProTable from '@ant-design/pro-table';
import { Button, Space } from 'antd';
import { PageContainer } from '@/components/PageContainer';
import { storeList, storeDetail } from '@/services/daifa-store-management/list'
import { history } from 'umi';
import ExcelModel from '@/components/ExcelModel'
import Edit from './edit';
import CancelModel from './cancel-model'
import ListDetail from './list-detail'
import BankEdit from './bank-edit'

const TableList = () => {
  const [formVisible, setFormVisible] = useState(false);
  const [detailData, setDetailData] = useState(null);
  const [visible, setVisible] = useState(false);
  const [detailVisible, setDetailVisible] = useState(false);
  const [storeNo,setStoreNo]=useState()
  const [bankVisible,setBankVisible]=useState()
  const actionRef = useRef();
  const [storeNoId,setStoreNoId]=useState()
  

  const switchStatus = (data, type) => {
    const params={
      data,
      type
    }
    setStoreNoId(params)
    setVisible(true)
  }

  const getDetail = (id) => {
    storeDetail({
      storeNo: id
    }).then(res => {
      if (res.code === 0) {
        setDetailData(res.data)
        setFormVisible(true)
      }
    })
  }

  const columns = [
    {
      title: '店铺名称',
      dataIndex: 'storeName',
      valueType: 'text',
      fieldProps: {
        placeholder: '请输入店铺名称',
        maxLength:30
      },
    },
    {
      title: '店主姓名',
      dataIndex: 'realname',
      valueType: 'text',
      fieldProps: {
        placeholder: '请输入店主姓名',
        maxLength:30
      }
    },
    {
      title: '手机号码',
      dataIndex: 'mobile',
      valueType: 'text',
      fieldProps: {
        placeholder: '请输入手机号码',
        maxLength:11
      }
    },
    {
      title: '微信号',
      dataIndex: 'wechatNo',
      valueType: 'text',
      hideInSearch: true,
    },
    {
      title: '岗位或角色',
      dataIndex: 'station',
      valueType: 'text',
      hideInSearch: true,
    },
    {
      title: '状态',
      dataIndex: 'status',
      valueType: 'select',
      valueEnum: {
        0:'全部',
        1: '已启用',
        2: '已禁用',
        3: '已注销'
      }
    },
    {
      title: '商品数',
      dataIndex: 'goodsTotal',
      valueType: 'text',
      hideInSearch: true,
      render: (_, data) => {
        if (_ === 0) {
          return _;
        }
        return <a key='2' onClick={() => { 
          history.push(`/daifa-store-management/list/consultant-product-list?spuId=${data.id}&storeNo=${data.storeNo}&storeName=${data.storeName}&wechatNo=${data.wechatNo}`) 
        }}>{_}</a>
      }
    },
    {
      title: '创建人',
      dataIndex: 'adminName',
      valueType: 'text',
      hideInSearch: true,
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      valueType: 'text',
      hideInSearch: true,
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, data) => (
        <Space>
          {
            data.status==3?
            <>
             <a onClick={() => { setDetailVisible(true);setStoreNo(data.storeNo)}}>详情</a>
             <a onClick={() => { history.push(`/daifa-store-management/list/agent-shop-money?storeNo=${data.storeNo}&storeName=${data.storeName}&realname=${data.realname}&mobile=${data.mobile}`) }}>佣金明细</a>
            </>
            :
            <>
              <a onClick={() => { setBankVisible(true);setStoreNo(data.storeNo)}}>再次认证</a>
              <a onClick={() => { setDetailVisible(true);setStoreNo(data.storeNo)}}>详情</a>
              <a onClick={() => { getDetail(data.storeNo) }}>编辑</a>
              <a onClick={() => { history.push(`/daifa-store-management/list/agent-shop-money?storeNo=${data.storeNo}&storeName=${data.storeName}&realname=${data.realname}&mobile=${data.mobile}`) }}>佣金明细</a>
              <a onClick={() => { switchStatus(data, 1) }}>强制注销店铺</a>
              <a onClick={() => { switchStatus(data, 2) }}>注销店铺</a>
            </>
          }

        </Space>
      ),
    },
  ];

  return (
    <PageContainer>
      <ProTable
        rowKey="id"
        options={false}
        request={storeList}
        scroll={{ x: 'max-content', scrollToFirstRowOnChange: true, }}
        search={{
          defaultCollapsed: true,
          labelWidth: 100,
          optionRender: (searchConfig, formProps, dom) => [
            ...dom.reverse(),
            <Button key="out" type="primary" onClick={() => { setFormVisible(true) }}>新建</Button>,
            <ExcelModel key="dao"
              callback={() => { actionRef.current.reload()}}
            />
          ]
        }}
        columns={columns}
        actionRef={actionRef}
      />
      {formVisible && <Edit
        visible={formVisible}
        setVisible={setFormVisible}
        detailData={detailData}
        callback={() => { actionRef.current.reload(); setDetailData(null) }}
        onClose={() => { actionRef.current.reload();  setDetailData(null) }}
      />}
      {visible && <CancelModel
        visible={visible}
        setVisible={setVisible}
        storeNoId={storeNoId}
        onClose={() => { actionRef.current.reload();  setStoreNoId(null) }}
        callback={() => { actionRef.current.reload(); setStoreNoId(null) }}
      />}
      {detailVisible && <ListDetail
        visible={detailVisible}
        setVisible={setDetailVisible}
        storeNo={storeNo}
        onClose={() => { actionRef.current.reload(); setStoreNo(null) }}
      />}
      {bankVisible && <BankEdit
        visible={bankVisible}
        setVisible={setBankVisible}
        storeNo={storeNo}
        onClose={() => { actionRef.current.reload(); setStoreNo(null) }}
      />}
      
    </PageContainer>

  );
};

export default TableList;
