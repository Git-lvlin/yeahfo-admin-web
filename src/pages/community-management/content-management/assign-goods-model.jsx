import React, { useState } from 'react';
import ProTable from '@ant-design/pro-table';
import GcCascader from '@/components/gc-cascader'
import { message,Button,Modal,Space,Image } from 'antd';
import * as api from '@/services/product-management/product-list';

export default (props) => {
  const { isModalVisible,setIsModalVisible,actionRef,callback,loading,setLoading} = props;
  const [spuIdsArr,setSpuIdsArr]=useState([])


  const onIpute=(res)=>{
    if(res.selectedRows.length>=2){
      message.error('只能选择一个商品');
      return
    }
    if(spuIdsArr==res.selectedRows){
      return
    }
    callback(res.selectedRows)
    setSpuIdsArr(res.selectedRows)
  }
  const handleOk = () => {
    setIsModalVisible(false);
    setLoading(false)
  };
  const handleCancel = () => {
      setIsModalVisible(false);
  };
  const specification=(specName,specValue)=>{
    var arr1=[]
    var arr2=[]
    for(let k in specName){
      arr1.push(specName[k])
    }
    for(let key in specValue){
      arr2.push(specValue[key])
    }
    return <>
    {
      arr1.map((ele,inx)=>(
        <p>
        {
          ele+':'+  arr2.map((item,dex)=>{
          if(inx==dex){
            return Object.values(item)
          }
          })
        }
        </p>
      ))
    }
    </>
  }


  const columns = [
    {
      title: 'spuID',
      dataIndex: 'spuId',
      valueType: 'text',
      hideInSearch: true,
    },
    {
      title: '图片',
      dataIndex: 'goodsImageUrl',
      render: (text) => <Image src={text} width={50} height={50} />,
      hideInSearch: true,
    },
    {
      title: '商品名称',
      dataIndex: 'goodsName',
      valueType: 'text',
      fieldProps: {
        placeholder: '请输入商品名称'
      }
    },
    {
      title: '商品分类',
      dataIndex: 'gcId',
      renderFormItem: () => (<GcCascader />),
      hideInTable: true,
    },
    {
      title: '商家ID',
      dataIndex: 'supplierId',
      valueType: 'text',
      hideInSearch: true,
    },
    {
      title: '秒约价',
      dataIndex: 'goodsSaleMinPrice',
      valueType: 'text',
      hideInSearch: true,
    },
    {
      title: '可用库存',
      dataIndex: 'stockNum',
      valueType: 'text',
      hideInSearch: true,
    }
  ];

  return (
      <>
    <Modal key="id" width={1200}  visible={isModalVisible}  onCancel={handleCancel} footer={null}>
        <ProTable
            rowKey="id"
            options={false}
            params={{
            selectType: 1,
            goodsState:1,
            pageSize:10
            }}
            style={{display:loading?'block':'none'}}
            request={api.productList}
            actionRef={actionRef}
            search={{
                defaultCollapsed: true,
                labelWidth: 100,
                optionRender: (searchConfig, formProps, dom) => [
                    ...dom.reverse(),
                ],
            }}
            toolBarRender={() => [
            <Button type="primary" style={{marginLeft:'-1100px'}} disabled={spuIdsArr&&spuIdsArr.length>0?false:true}  onClick={handleOk}>
                确定
            </Button>
            ]}
            columns={columns}
            rowSelection={{
              hideSelectAll:true,
              preserveSelectedRowKeys: true
            }}
            tableAlertOptionRender={onIpute}
        />
    </Modal>
    <div style={{background:'#F2F2F2',padding:'20px',marginTop:'20px', display:loading?'none':'block'}}>
        <Space>
            <Image width={100} src={spuIdsArr&&spuIdsArr[0]?.goodsImageUrl} />
            <div>
            <p>{spuIdsArr&&spuIdsArr[0]?.goodsName}</p>
            <p>{specification(spuIdsArr&&spuIdsArr[0]?.specName,spuIdsArr&&spuIdsArr[0]?.specValue)}</p>
            <p>￥ {spuIdsArr&&spuIdsArr[0]?.goodsSaleMinPrice}</p>
            </div>
        </Space>
    </div>
    </>
  );
};