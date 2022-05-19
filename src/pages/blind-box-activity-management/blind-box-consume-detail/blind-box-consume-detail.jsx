import React, { useState, useRef,useEffect } from 'react';
import { Button,Tabs,Image,Form,Modal,Select,Descriptions,Space} from 'antd';
import ProTable from '@ant-design/pro-table';
import { PageContainer } from '@/components/PageContainer';
import { getBlindboxUseList } from '@/services/blind-box-activity-management/blindbox-get-use-list';
import { history, connect } from 'umi';
import AuditModel from '../blind-box-employ-detail/audit-detail-model'
import Detail from '@/pages/order-management/normal-order/detail';
import Export from '@/pages/export-excel/export'
import ExportHistory from '@/pages/export-excel/export-history'



export default () => {
    const ref=useRef()
    const [detailList,setDetailList]=useState()
    const [detailVisible, setDetailVisible] = useState(false);
    const [orderId,setOrderId]=useState()
    const [visit, setVisit] = useState(false)
    const columns= [
      {
        title: '序号',
        dataIndex:'id',
        valueType: 'borderIndex',
        hideInSearch: true,
        valueType: 'indexBorder'
      },
      {
        title: '活动名称',
        dataIndex: 'name',
        valueType: 'text',
      },
      {
        title: '活动时间',
        dataIndex: 'activityStartTime',
        valueType: 'text',
        hideInSearch:true,
        render:(_,data)=>{
          return <p>{data.activityStartTime} 至 {data.activityEndTime}</p>
        }
      },
      {
        title: '用户手机号',
        dataIndex: 'memberMobile',
        valueType: 'text',
      },
      {
        title: '用户名',
        dataIndex: 'memberNicheng',
        valueType: 'text',
      },
      {
        title: '使用时间',
        key: 'dateTimeRange',
        dataIndex: 'createTime',
        valueType: 'dateTimeRange',
        hideInTable: true,
      },
      {
        title: '使用时间',
        dataIndex: 'createTime',  
        hideInSearch:true
      },
      {
        title: '使用次数',
        dataIndex: 'num',
        valueType: 'text',
        hideInSearch:true
      },
      {
        title: '使用类型',
        dataIndex: 'type',
        valueType: 'text',
        hideInSearch:true,
        render:(_,data)=>{
          if(data.type==4){
            return <p>开盲盒</p>
          }else if(data.type==5){
            return <p>机会过期</p>
          }else if(data.type==6){
            return  <AuditModel
                      data={data}
                      title={'回收原因'}
                    />
          }
          }
      },
      {
        title: '机会编号',
        dataIndex: 'code',
        valueType: 'text',
      },
      {
        title: '筛选',
        dataIndex: 'expenditureType',
        valueType: 'select',
        valueEnum: {
          0: '全部',
          1: '获奖已兑换',
          2: '获奖未兑换',
          3: '已获奖',
          4: '未获奖',
          5: '机会过期',
          6: '官方回收',
          7: '已失效'
        },
        hideInTable:true
      },
      {
        title: '获得奖品',
        dataIndex: 'prizeInfo',
        valueType: 'text',
        hideInSearch: true,
        render: (_, data)=>{
          if(data.type==5||data.type==6){
            return null
          }
          if(data.prizeInfo?.prizeStatus==0){
            return <p>未抽中</p>
          }
          if(data.prizeInfo?.goodsType==2){
            return <div style={{display:'flex'}}>
                    <Image src={data.prizeInfo.imageUrl} alt="" width='50px' height='50px' />
                    <div style={{marginLeft:'10px'}}>
                      <h5>{data.prizeInfo.goodsName}</h5>
                      <span style={{color:'red',fontSize:'10px'}}>面额：{data.prizeInfo.salePrice/100}元</span>
                    </div>
                  </div>
          }
          return <div style={{display:'flex'}}>
                    <Image src={data.prizeInfo.imageUrl} alt="" width='50px' height='50px' />
                    <div style={{marginLeft:'10px'}}>
                      <h5>{data.prizeInfo.goodsName}</h5>
                      <span style={{color:'red',fontSize:'10px'}}>销售价¥{data.prizeInfo.salePrice/100}</span>
                      <p style={{fontSize:'12px'}}>SKU  {data.prizeInfo.skuId}</p>
                    </div>
                 </div>
        },
      },
      {
        title: '兑换详情',
        dataIndex: 'orderInfo',
        valueType: 'text',
        hideInSearch: true,
        render: (_, data)=>{
          if(data.orderInfo.orderStatus==0){
            return <>
                    <p>未兑换</p>
                    <p>过期时间：{data.orderInfo.expireTime}</p>
                  </>
          }else if(data.orderInfo.orderStatus==1){
            return <p>兑换中</p>
          }else if(data.prizeInfo?.goodsType==2){
            return  <>
                    <p>已提现</p>
                    <p>提现单号：</p>
                    <a onClick={() => {  history.push('/blind-box-activity-management/blind-box-withdraw-deposit-detail?sn='+data.orderInfo.orderSn) }}>{data.orderInfo.orderSn}</a>
                    </>
          }else if(data.prizeInfo.goodsType==1&&data.orderInfo.orderStatus==2){
            return  <>
                    <p>已兑换</p>
                    <p>订单号：</p>
                    <a onClick={() => {  setDetailVisible(true);setOrderId(data.orderInfo?.orderId) }}>{data.orderInfo.orderSn}</a>
                    </>
          }else if(data.orderInfo.orderStatus==3){
            return  <>
                    <p>已失效</p>
                    <p>过期时间：{data.orderInfo.expireTime}</p>
                    </>
          }
        } 
      },
      {
        title: '操作',
        key: 'option',
        valueType: 'option',
        render:(text, record, _, action)=>[
          <a key='detail' onClick={()=>history.push('/blind-box-activity-management/blind-box-employ-detail?memberId='+record.memberId)}>查看此用户明细</a>
        ],
      }, 
    ];
    const postData=(data)=>{
      setDetailList(data)
      return data.records
    }
    const getFieldValue = (searchConfig) => {
      const {dateTimeRange,...rest}=searchConfig.form.getFieldsValue()
      return {
        startTime1:dateTimeRange&&dateTimeRange[0],
        startTime2:dateTimeRange&&dateTimeRange[1],
        ...rest,
      }
    }
    return (
      <PageContainer>
         <div style={{backgroundColor:'#fff',marginBottom:'20px'}}>
         <Descriptions labelStyle={{fontWeight:'bold'}} column={7} layout="vertical" bordered>
            <Descriptions.Item  label="参与总人数">{detailList?.totalMemberNum}  </Descriptions.Item>
            <Descriptions.Item  label="已发放次数">{detailList?.totalNum}  </Descriptions.Item>
            <Descriptions.Item  label="未使用次数">{detailList?.restNum}  </Descriptions.Item>
            <Descriptions.Item  label="已使用次数">{detailList?.useNum}  </Descriptions.Item>
            <Descriptions.Item  label="已回收">{detailList?.reclaimNum}  </Descriptions.Item>
            <Descriptions.Item  label="已兑奖数">{detailList?.prizeNum}  </Descriptions.Item>
            <Descriptions.Item  label="未兑奖数">{detailList?.noPrizeNum}  </Descriptions.Item>
        </Descriptions>
         </div>
        <ProTable
          actionRef={ref}
          rowKey="id"
          scroll={{ x: 'max-content', scrollToFirstRowOnChange: true, }}
          headerTitle={`使用明细     剩余开盒总次数：${detailList?.restNum}        已开盒总次数：${detailList?.useNum}`}
          options={false}
          request={getBlindboxUseList}
          postData={postData}
          search={{
            defaultCollapsed: true,
            labelWidth: 100,
            optionRender: (searchConfig, formProps, dom) => [
               ...dom.reverse(),
               <Export
                key='export'
                change={(e) => { setVisit(e) }}
                type={'bind-box-use-detail-export'}
                conditions={()=>{return getFieldValue(searchConfig)}}
              />,
              <ExportHistory key='task' show={visit} setShow={setVisit} type={'bind-box-use-detail-export'}/>,
            ],
          }}
          pagination={{
            pageSize: 10,
            showQuickJumper: true,
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
        <Button style={{float:'right',margin:'20px 20px 0 0'}} type="default" onClick={() => history.push('/blind-box-activity-management/blind-box-grant-detail')}>
           返回
        </Button>
        </PageContainer>
    );
  };