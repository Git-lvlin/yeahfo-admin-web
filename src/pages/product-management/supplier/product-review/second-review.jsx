import React, { useState, useRef } from 'react';
import { Drawer, Button, Image, Space } from 'antd';
import ProTable from '@ant-design/pro-table';
import Overrule from './overrule';
import * as api from '@/services/product-management/product-review'

import ProductDetailDrawer from '@/components/product-detail-drawer'

// import Edit from '../product-list/edit';


const UserDetail = (props) => {
  const { visible, setVisible, record, operateRole, overrule, check } = props;
  const [overruleVisible, setOverruleVisible] = useState(false);
  const [productDetailDrawerVisible, setProductDetailDrawerVisible] = useState(false);

  // const [hasChange, setHasChange] = useState(false);
  // const [formVisible, setFormVisible] = useState(false);
  const [detailData, setDetailData] = useState(null);
  const actionRef = useRef();

  const getDetail = (id) => {
    api.getDetail({
      spuId: id
    }).then(res => {
      if (res.code === 0) {
        setDetailData({
          ...res.data,
          settleType: 2,
        });
        setProductDetailDrawerVisible(true)
      }
    })
  }


  const columns = [
    {
      title: '序号',
      dataIndex: 'id',
      valueType: 'text',
      hideInSearch: true,
    },
    {
      title: '操作角色',
      dataIndex: 'operateRole',
      onFilter: true,
      valueType: 'select',
      valueEnum: operateRole,
      hideInTable: true,
    },
    {
      title: '操作角色',
      dataIndex: 'operatorTypeDisplay',
      valueType: 'text',
      hideInSearch: true,
    },
    {
      title: '操作对象',
      dataIndex: 'operatorName',
      valueType: 'text',
      fieldProps: {
        placeholder: '请输入操作对象'
      }
    },
    {
      title: '操作项',
      dataIndex: 'actionTypeDisplay',
      valueType: 'text',
      fieldProps: {
        placeholder: '请输入操作项'
      }
    },
    {
      title: '原值',
      dataIndex: 'actionBefore',
      valueType: 'text',
      hideInSearch: true,
      render: (text) => {
        if (/https?/.test(text)) {
          const imgArr = text.split(';');
          imgArr.length -= 1;
          return imgArr.map(item => (<div key={item} style={{ marginRight: 10, display: 'inline-block' }}><Image style={{ width: 50, height: 50 }} src={item} /></div>))
        }
        return text;
      }
    },
    {
      title: '操作后新值',
      dataIndex: 'actionAfter',
      valueType: 'text',
      hideInSearch: true,
      render: (text) => {
        if (/https?/.test(text)) {
          const imgArr = text.split(';');
          imgArr.length -= 1;
          return imgArr.map(item => (<div key={item} style={{ marginRight: 10, display: 'inline-block' }}><Image style={{ width: 50, height: 50 }} src={item} /></div>))
        }
        return text;
      }
    },
    {
      title: '说明',
      dataIndex: 'actionRemark',
      valueType: 'text',
      hideInSearch: true,
    },
    {
      title: '操作时间',
      dataIndex: 'updateTime',
      valueType: 'text',
      hideInSearch: true,
    },
  ];

  const getNoFirstCheckList = async (params) => {
    const res = await api.noFirstCheckList({
      ...params,
    })
    return {
      data: res.data?.length ? res.data : [],
      success: true,
    }
  }

  const postData = (data) => {
    // if (data?.length) {
    //   setHasChange(data[0]?.priceChange === 1)
    // }
    return data;
  }


  return (
    <Drawer
      title="审核详情"
      width={1200}
      placement="right"
      onClose={() => { setVisible(false) }}
      visible={visible}
      footer={
        <div
          style={{
            textAlign: 'right',
          }}
        >
          {/* {hasChange && <div style={{ color: 'red', marginBottom: 10 }}>必须先修改商品秒约价或秒约上浮比才能进行审核!</div>} */}
          <Space>
            <Button key="1" type="primary" onClick={() => { check(record.spuId) }}>
              审核通过
            </Button>
            <Button type="danger" key="3" danger onClick={() => { setOverruleVisible(true) }}>
              审核驳回
            </Button>
            <Button key="4" onClick={() => { setVisible(false) }}>
              返回
            </Button>
            {/* <Button disabled={hasChange} key="1" type="primary" onClick={() => { check(1, 1, record.spuId) }}>
              通过并上架
            </Button>
            <Button disabled={hasChange} key="2" onClick={() => { check(2, 1, record.spuId) }}>
              通过但不上架
            </Button>
            {hasChange && <Button type="primary" onClick={() => { getDetail() }}>编辑商品</Button>}
            <Button type="primary" key="3" danger onClick={() => { setOverruleVisible(true) }}>
              驳回
            </Button>
            <Button key="4" onClick={() => { setVisible(false) }}>
              返回
            </Button> */}
          </Space>
        </div>
      }
    >
      <ProTable
        rowKey="id"
        options={false}
        request={getNoFirstCheckList}
        params={{
          spuId: record.id
        }}
        postData={postData}
        search={{
          defaultCollapsed: true,
          optionRender: ({ searchText, resetText }, { form }) => [
            <Button
              key="search"
              type="primary"
              onClick={() => {
                form?.submit();
              }}
            >
              {searchText}
            </Button>,
            <Button
              key="rest"
              onClick={() => {
                form?.resetFields();
              }}
            >
              {resetText}
            </Button>,
            <Button key="out" type="primary" onClick={() => { getDetail(record.spuId) }}>查看商品全部信息</Button>,
          ],
        }}
        columns={columns}
        actionRef={actionRef}
      />
      {overruleVisible && <Overrule
        visible={overruleVisible}
        setVisible={setOverruleVisible}
        callback={(text) => { overrule([record.spuId].join(','), text) }}
      />}
      {
        productDetailDrawerVisible &&
        <ProductDetailDrawer
          visible={productDetailDrawerVisible}
          setVisible={setProductDetailDrawerVisible}
          spuId={record.spuId}
        />
      }
    </Drawer>
  )
}

export default UserDetail;
