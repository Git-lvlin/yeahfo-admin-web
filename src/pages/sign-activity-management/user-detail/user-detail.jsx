import React, { useState, useRef,useEffect } from 'react';
import { Button,Tabs,Image,Form,Modal,Select} from 'antd';
import ProTable from '@ant-design/pro-table';
import ProForm,{ ModalForm,ProFormRadio,ProFormSwitch,DrawerForm} from '@ant-design/pro-form';
import { PageContainer } from '@/components/PageContainer';
import { history, connect } from 'umi';
import { queryUserRecordList } from '@/services/sign-activity-management/packet-record-query-user-record-list';
import Export from '@/pages/export-excel/export'
import ExportHistory from '@/pages/export-excel/export-history'
import Detail from '@/pages/order-management/normal-order/detail';

const formItemLayout = {
  labelCol: { span: 2 },
  wrapperCol: { span: 14 },
  layout: {
    labelCol: {
      span: 10,
    },
    wrapperCol: {
      span: 14,
    },
  }
};


export default (props) => {
    const ref=useRef()
    const [detailList,setDetailList]=useState()
    const [visit, setVisit] = useState(false)
    const [detailVisible, setDetailVisible] = useState(false);
    const [orderId,setOrderId]=useState()
    const id=props.location.query.memberId
    const columns= [
      {
        title: '序号',
        dataIndex:'id',
        valueType: 'borderIndex',
        hideInSearch: true,
        valueType: 'indexBorder'
      },
      {
        title: '红包名称',
        dataIndex: 'channelName',
        valueType: 'text',
        hideInSearch: true,
      },
      {
        title: '筛选',
        dataIndex: 'channelId',
        valueType: 'select',
        valueEnum: {
          0: '全部',
          1: '签到红包',
          2: '连签额外奖励',
          3: '订单抵扣',
          4: '签到红包过期',
          100: '仅看获得',
          101: '仅看使用'
        },
        hideInTable:true
      },
      {
        title: '时间',
        key: 'dateTimeRange',
        dataIndex: 'createTime',
        valueType: 'dateTimeRange', 
        hideInTable:true  
      },
      {
        title: '时间',
        dataIndex: 'createTime',  
        hideInSearch:true
      },
      {
        title: '明细类型',
        dataIndex: 'recordType',
        valueType: 'select',
        valueEnum: {
          1: '获得',
          2: '使用',
        },
        hideInSearch: true,
      },
      {
        title: '金额',
        dataIndex: 'redPacketAmount',
        valueType: 'text',
        hideInSearch:true,
        render: (_,data)=> {
          if(data.recordType==1){
            return <p style={{color:'red',fontWeight:'bold'}}>+￥{_/100}</p>
          }else{
            return <p style={{color:'red',fontWeight:'bold'}}>-￥{_/100}</p>
          }

        }
      },
      {
        title: '连签天数',
        dataIndex: 'signInDay',
        valueType: 'text',
        hideInSearch:true,
        render: (_,data)=> {
          if(_>=15){
            return null
          }
          return <p>第{_+1}天</p>
        }
      },
      {
        title: '订单',
        dataIndex: 'goodsInfo',
        valueType: 'text',
        hideInSearch: true,
        render: (_, data)=>{
          if(!data?.goodsInfo){
            return null
          }
          return <div style={{display:'flex',alignItems:'center'}}>
                    <Image src={data.goodsInfo?.goodsImageUrl} alt="" width='80px' height='80px' />
                    <div style={{marginLeft:'10px'}}>
                      <h4>{data.goodsInfo?.goodsName}</h4>
                      <span style={{color:'red',fontSize:'10px'}}>¥{data.goodsInfo?.salePrice/100}</span>
                      <p style={{fontSize:'10px'}}>SKU  {data.goodsInfo?.skuId}</p>
                      <p style={{fontSize:'10px'}}>订单号：<a onClick={() => {  setDetailVisible(true);setOrderId(data.goodsInfo?.orderId) }}>{data.goodsInfo?.orderId}</a></p>
                    </div>
                 </div>
        },
      }
    ];
    const postData=(data)=>{
      setDetailList(data)
      return data.records
    }
  const getFieldValue = (searchConfig) => {
    return {
      ...searchConfig.form.getFieldsValue(),
      memberId:id 
    }
  }
    return (
      <PageContainer>
        <ProTable
          actionRef={ref}
          rowKey="id"
          headerTitle={`用户手机号：${detailList?.phoneNum}    用户名：${detailList?.userName}         签到总天数：${detailList?.signInDays}        签到红包余额：￥${detailList?.userAmount/100}`}
          options={false}
          request={queryUserRecordList}
          params={{
            memberId:id
          }}
          postData={postData}
          search={{
            defaultCollapsed: true,
            labelWidth: 100,
            optionRender: (searchConfig, formProps, dom) => [
               ...dom.reverse(),
               <Export
               change={(e) => { setVisit(e) }}
               type={'red-packet-user-detail-export'}
               conditions={()=>{return getFieldValue(searchConfig)}}
             />,
             <ExportHistory show={visit} setShow={setVisit} type={'red-packet-user-detail-export'} />,
            ],
          }}
          toolBarRender={(_,record) => [
            <Button key='goback' type="default" onClick={() => {history.goBack()}}>返回</Button>
          ]}
          columns={columns}
        />
         {
          detailVisible && <Detail
          id={orderId}
          visible={detailVisible}
          setVisible={setDetailVisible}
        />
        }
        </PageContainer>
    );
  };