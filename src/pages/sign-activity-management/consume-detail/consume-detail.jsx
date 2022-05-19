import React, { useState, useRef,useEffect } from 'react';
import { Button,Tabs,Image,Form,Modal,Select,Descriptions} from 'antd';
import ProTable from '@ant-design/pro-table';
import { history, connect } from 'umi';
import { PageContainer } from '@/components/PageContainer';
import { queryConsumeList,getConsumeData } from '@/services/sign-activity-management/packet-record-query-consume-list';
import Export from '@/pages/export-excel/export'
import ExportHistory from '@/pages/export-excel/export-history'
import Detail from '@/pages/order-management/normal-order/detail';
import moment from 'moment';



export default () => {
    const ref=useRef()
    const [detailList,setDetailList]=useState()
    const [visit, setVisit] = useState(false)
    const [detailVisible, setDetailVisible] = useState(false);
    const [orderId,setOrderId]=useState()
    const columns= [
      {
        title: '序号',
        dataIndex:'id',
        valueType: 'borderIndex',
        hideInSearch: true,
        valueType: 'indexBorder'
      },
      {
        title: '用户手机号',
        dataIndex: 'phoneNum',
        valueType: 'text',
      },
      {
        title: '用户名',
        dataIndex: 'userName',
        valueType: 'text',
        hideInSearch:true
      },
      {
        title: '使用时间',
        key: 'dateTimeRange',
        dataIndex: 'usedTime',
        valueType: 'dateTimeRange', 
        hideInTable:true  
      },
      {
        title: '使用时间',
        dataIndex: 'usedTime',  
        hideInSearch:true
      },
      {
        title: '使用金额',
        dataIndex: 'usedAmount',
        valueType: 'text',
        hideInSearch:true,
        render: (_,data)=> {
          return <p>￥{_/100}</p>
        }
      },
      {
        title: '订单号',
        dataIndex: 'orderId',
        valueType: 'text',
        hideInTable:true 
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
                      <h5>{data.goodsInfo?.goodsName}</h5>
                      <span style={{color:'red',fontSize:'10px'}}>¥{data.goodsInfo?.salePrice/100}</span>
                      <p style={{fontSize:'10px'}}>SKU  {data.goodsInfo?.skuId}</p>
                      <p style={{fontSize:'10px'}}>订单号：<a onClick={() => {  setDetailVisible(true);setOrderId(data.goodsInfo?.orderId) }}>{data.goodsInfo?.orderId}</a></p>
                    </div>
                 </div>
        },
      },
      {
        title: '类型',
        dataIndex: 'channelName',
        hideInSearch:true
      },
      {
        title: '操作',
        key: 'option',
        valueType: 'option',
        render:(text, record, _, action)=>[
            <a key='detail' onClick={()=>{history.push('/sign-activity-management/user-detail?memberId='+record.memberId)}}>查看此用户明细</a>
        ],
      }, 
    ];
    useEffect(()=>{
      getConsumeData({}).then(res=>{
        setDetailList(res.data)
      })
    },[])
    const getFieldValue = (searchConfig) => {
      const {dateTimeRange,...rest}=searchConfig.form.getFieldsValue()
      return {
        beginTime:dateTimeRange&&moment(dateTimeRange[0]).format('YYYY-MM-DD HH:mm:ss'),
        endTime:dateTimeRange&&moment(dateTimeRange[1]).format('YYYY-MM-DD HH:mm:ss'),
        ...rest,
      }
    }
    return (
      <PageContainer>
         <div style={{backgroundColor:'#fff',marginBottom:'20px'}}>
         <Descriptions labelStyle={{fontWeight:'bold'}} column={7} layout="vertical" bordered>
            <Descriptions.Item  label="签到总人数">{detailList?.signInMembers}</Descriptions.Item>
            <Descriptions.Item  label="已领取金额">{detailList?.receivedAmount/100}</Descriptions.Item>
            <Descriptions.Item  label="已使用金额">{detailList?.usedAmount/100}</Descriptions.Item>
            <Descriptions.Item  label="已过期金额">{detailList?.expireAmount/100}</Descriptions.Item>
            <Descriptions.Item  label="连签3日人数">{detailList?.signThreeNum}</Descriptions.Item>
            <Descriptions.Item  label="连签7日人数">{detailList?.signSevenNum}</Descriptions.Item>
            <Descriptions.Item  label="连签15日人数">{detailList?.signFifteenNum}</Descriptions.Item>
        </Descriptions>
         </div>
        <ProTable
          actionRef={ref}
          rowKey="id"
          headerTitle="签到红包消耗明细"
          options={false}
          request={queryConsumeList}
          scroll={{ x: 'max-content', scrollToFirstRowOnChange: true, }}
          search={{
            defaultCollapsed: true,
            labelWidth: 100,
            optionRender: (searchConfig, formProps, dom) => [
               ...dom.reverse(),
               <Export
               key='export'
               change={(e) => { setVisit(e) }}
               type={'red-packet-consume-detail-export'}
               conditions={()=>{return getFieldValue(searchConfig)}}
             />,
             <ExportHistory key='task' show={visit} setShow={setVisit} type={'red-packet-consume-detail-export'} />,
            ],
          }}
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