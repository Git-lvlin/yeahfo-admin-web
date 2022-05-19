import React, { useState, useRef,useEffect } from 'react';
import { Button,Tabs,Image,Form,Space} from 'antd';
import ProTable from '@ant-design/pro-table';
import ProForm,{ ModalForm,ProFormRadio,ProFormSwitch} from '@ant-design/pro-form';
import { PageContainer } from '@/components/PageContainer';
import { history,connect } from 'umi';
import { getBlindboxUseDetail } from '@/services/blind-box-activity-management/blindbox-get-use-list';
import { getBlindboxIncomeDetail,getBlindboxIncomeReclaim } from '@/services/blind-box-activity-management/blindbox-blindbox-get-lncome';
import AuditDetailModel from './audit-detail-model'
import AuditModel from './audit-model'
import Detail from '@/pages/order-management/normal-order/detail';
const { TabPane } = Tabs


const EmployDetail=(props) => {
    const { memberId }=props
    const ref=useRef()
    const [detailList,setDetailList]=useState()
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
          6: '官方回收'
        },
        hideInTable:true
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
            return  <AuditDetailModel
                      data={data}
                      title={'回收原因'}
                    />
          }
          }
      },
      {
        title: '机会编号',
        dataIndex: 'code',
        valueType: 'text'
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
          if(data.prizeInfo.goodsType==2){
            return <div style={{display:'flex'}}>
                    <Image src={data.prizeInfo.imageUrl} alt="" width='50px' height='50px' />
                    <div style={{marginLeft:'10px'}}>
                      <h5>{data.prizeInfo.goodsName}</h5>
                      <span style={{color:'red',fontSize:'10px'}}>面额：{data.prizeInfo.salePrice/100}元</span>
                    </div>
                  </div>
          }
          return <div style={{display:'flex'}}>
                    <Image src={data.prizeInfo?.imageUrl} alt="" width='50px' height='50px' />
                    <div style={{marginLeft:'10px'}}>
                      <h5>{data.prizeInfo?.goodsName}</h5>
                      <span style={{color:'red',fontSize:'10px'}}>销售价¥{data.prizeInfo?.salePrice/100}</span>
                      <p style={{fontSize:'10px'}}>SKU  {data.prizeInfo?.skuId}</p>
                    </div>
                 </div>
        },
      },
      {
        title: '兑换详情',
        dataIndex: 'createTime',
        valueType: 'text',
        hideInSearch: true,
        render: (_, data)=>{
          if(data.orderInfo.orderStatus==0){
            return <>
                    <p>未兑换</p>
                    <p>过期时间：{data.orderInfo?.expireTime}</p>
                  </>
          }else if(data.orderInfo?.orderStatus==1){
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
                    <a onClick={() => {  setDetailVisible(true);setOrderId(data.orderInfo?.orderId) }}>{data.orderInfo?.orderSn}</a>
                    </>
          }else if(data.orderInfo?.orderStatus==3){
            return  <>
                    <p>已失效</p>
                    <p>过期时间：{data.orderInfo?.expireTime}</p>
                    </>
          }
        } 
      },
    ];
    const postData=(data)=>{
      setDetailList(data)
      return data.records
    }
    return (
      <>
        <ProTable
          actionRef={ref}
          rowKey="id"
          headerTitle={`用户手机号:${detailList?.memberMobile}         用户名：${detailList?.memberNicheng}         剩余开盒次数：${detailList?.restNum}        已使用次数：${detailList?.useNum}`}
          options={false}
          request={getBlindboxUseDetail}
          postData={postData}
          params={{
            memberId:memberId
          }}
          search={{
            defaultCollapsed: true,
            labelWidth: 100,
            optionRender: (searchConfig, formProps, dom) => [
               ...dom.reverse(),
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
        <Button style={{ float: 'right', margin: '20px 20px 0 0' }} type="default" onClick={() => { window.history.back(); setTimeout(() => { window.location.reload(); }, 200) }}>
           返回
        </Button>
      </>
    );
};


const UserDetail=(props) => {
  const { memberId }=props
  const ref=useRef()
  const [detailList,setDetailList]=useState()
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
      title: '发放原因',
      dataIndex: 'type',
      valueType: 'select',
      hideInSearch:true,
      valueEnum: {
        1:'连续签到',
        2:'邀请好友', 
        3:'订单消费',
        7:'集约采购获得机会'
      },
    },
    {
      title: '筛选',
      dataIndex: 'type',
      valueType: 'select',
      valueEnum: {
        0: '全部',
        1: '连续签到获得',
        2: '邀请好友获得',
        3: '订单消费获得',
        7: '采购订单获得'
      },
      hideInTable:true
    },
    {
      title: '发放时间',
      key: 'dateTimeRange',
      dataIndex: 'usefulTime',
      valueType: 'dateTimeRange',
      hideInTable: true,
    },
    {
      title: '发放时间',
      dataIndex: 'usefulTime',
      valueType: 'text',
      hideInSearch:true   
    },
    {
      title: '过期时间',
      dataIndex: 'outUsefulTime',
      hideInSearch:true
    },
    {
      title: '发放次数',
      dataIndex: 'num',
      valueType: 'text',
      hideInSearch:true
    },
    {
      title: '机会编号',
      dataIndex: 'code',
      valueType: 'text',
    },
    {
      title: '操作',
      dataIndex: 'status',
      valueType: 'text',
      hideInSearch: true,
      render: (_, data)=>{
        if(data.status==1){
          return  <AuditModel
                    label={'回收'}
                    InterFace={getBlindboxIncomeReclaim}
                    id={data.id}
                    title={'填写回收原因'}
                    boxref={ref}
                  />
        }else if(data.status==2){
          return <p>已使用</p>
        }else if(data.status==3){
          return <p>已回收</p>
        }else if(data.status==4){
          return <p>已过期</p>
        }
        },
    },
  ];
  const postData=(data)=>{
    setDetailList(data)
    return data.records
  }
  return (
    <>
      <ProTable
        actionRef={ref}
        rowKey="id"
        options={false}
        headerTitle={`用户手机号:${detailList?.memberMobile}         用户名：${detailList?.memberNicheng}         剩余开盒次数：${detailList?.restNum}        已使用次数：${detailList?.useNum}`}
        params={{
          memberId:memberId
        }}
        postData={postData}
        request={getBlindboxIncomeDetail}
        search={{
          defaultCollapsed: true,
          labelWidth: 100,
          optionRender: (searchConfig, formProps, dom) => [
             ...dom.reverse(),
          ],
        }}
        columns={columns}
      />
      <Button style={{ float: 'right', margin: '20px 20px 0 0' }} type="default" onClick={() => { window.history.back(); setTimeout(() => { window.location.reload(); }, 200) }}>
        返回
      </Button>
    </>
  );
};



export default (props) =>{
    let memberId = props.location.query.memberId
    const [seleType,setSeleType]=useState(1)
    return (
        <PageContainer>
          <Tabs
            centered
            defaultActiveKey="1"
            style={{backgroundColor:"#fff",padding:'25px'}}
            onChange={(val)=>{
              setSeleType(val)
            }}
          >
            <TabPane tab="获取明细" key="1">
              {
                seleType==1&&<UserDetail memberId={memberId} />
              }
            </TabPane>
            <TabPane tab="使用明细" key="2">
              {
                seleType==2&&<EmployDetail memberId={memberId} />
              }
            </TabPane>
          </Tabs>
        </PageContainer>
    )
  }