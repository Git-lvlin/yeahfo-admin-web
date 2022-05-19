import React, { useState, useRef,useEffect } from 'react';
import { Button,Tabs,Image,Form,Modal,Select,Descriptions,Space} from 'antd';
import ProTable from '@ant-design/pro-table';
import { PageContainer } from '@/components/PageContainer';
import { couponEverydayLogList } from '@/services/activity-management/everyday-red-packet-activity';
import { history, connect } from 'umi';
import { amountTransform } from '@/utils/utils'
import Detail from '@/pages/order-management/normal-order/detail';
import Export from '@/pages/export-excel/export'
import ExportHistory from '@/pages/export-excel/export-history'
import moment from 'moment';
import EverydayRule from '../everyday-packet-rule'



export default () => {
    const ref=useRef()
    const [detailVisible, setDetailVisible] = useState(false);
    const [orderId,setOrderId]=useState()
    const [visit, setVisit] = useState(false)
    const [visible,setVisible]=useState(false)
    const [detailId,setDetailId]=useState()
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
        render:(text, record, _, action)=>[
          <a key='name' onClick={()=>{setVisible(true);setDetailId(record.couponEverydayId)}}>{record.name}</a>
        ]
      },
      {
        title: '活动时间',
        dataIndex: 'activityTimeDisplay',
        valueType: 'text',
        hideInSearch:true,
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
        hideInSearch:true,
      },
      {
        title: '领取时间',
        key: 'dateTimeRange',
        dataIndex: 'createTime',
        valueType: 'dateTimeRange',
        hideInTable: true,
      },
      {
        title: '领取时间',
        dataIndex: 'createTime',
        valueType: 'text',
        hideInSearch:true,
      },
      {
        title: '面值',
        dataIndex: 'freeAmount',
        valueType: 'text',
        hideInSearch:true,
        render: (_)=> amountTransform(parseInt(_), '/').toFixed(2)
      },
      {
        title: '使用时间',
        key: 'dateTimeRange2',
        dataIndex: 'actTime',
        valueType: 'dateTimeRange',
        hideInTable: true,
      },
      {
        title: '使用时间',
        dataIndex: 'actTime',  
        hideInSearch:true
      },
      {
        title: '红包码',
        dataIndex: 'memberCouponCode',
        valueType: 'text',
        hideInSearch:true
      },
      {
        title: '红包状态',
        dataIndex: 'status',
        valueType: 'text',
        valueEnum: {
          0: '全部',
          1: '未使用',
          2: '已使用',
          3: '已冻结',
          4: '已失效'
          },
      },
      {
        title: '来源订单',
        dataIndex: 'sourceOrderSnDisplay',
        valueType: 'text',
        hideInSearch: true,
        render: (_, data)=>{
          return <div style={{display:'flex',flexDirection:'column',alignItems:'center'}}>
                  <p style={{fontSize:'12px'}}>订单号: </p>
                  <p style={{fontSize:'12px'}}><a onClick={() => {  setDetailVisible(true);setOrderId(data?.sourceOrderSubId) }}>{data?.sourceOrderSn}</a></p>
                 </div>
        },
      },
      // {
      //   title: '来源订单',
      //   dataIndex: 'sourceOrderSn',
      //   valueType: 'text',
      //   hideInTable: true
      // },
      {
        title: '使用订单',
        dataIndex: 'orderGoods',
        valueType: 'text',
        hideInSearch: true,
        render: (_, data)=>{
          return <>
                  {
                    data.orderGoods.map((ele,index)=>(
                    <div key={index} style={{display:'flex',alignItems:'center'}}>
                      <Image src={ele.imageUrl} alt="" width='80px' height='80px' />
                      <div style={{marginLeft:'10px'}}>
                        <h5>{ele.goodsName}</h5>
                        <span style={{color:'red',fontSize:'10px'}}>销售价¥{ele.salePrice/100}</span>
                        <p style={{fontSize:'12px'}}>SKU  {ele.skuId}</p>
                        <p style={{fontSize:'12px'}}>订单号:<a onClick={() => {  setDetailVisible(true);setOrderId(ele?.subOrderId) }}>{ele.orderSn}</a></p>
                      </div>
                   </div>
                    ))
                  }
                 </>
        },
      }
    ];
    const getFieldValue = (searchConfig) => {
      const {dateTimeRange,dateTimeRange2,...rest}=searchConfig.form.getFieldsValue()
      return {
        lqStartTime1:dateTimeRange&&moment(dateTimeRange[0]).format('YYYY-MM-DD HH:mm:ss'),
        lqStartTime2:dateTimeRange&&moment(dateTimeRange[1]).format('YYYY-MM-DD HH:mm:ss'),
        useStartTime1:dateTimeRange2&&moment(dateTimeRange2[0]).format('YYYY-MM-DD HH:mm:ss'),
        useStartTime2:dateTimeRange2&&moment(dateTimeRange2[1]).format('YYYY-MM-DD HH:mm:ss'),
        ...rest,
      }
    }
    return (
      <PageContainer>
        <ProTable
          actionRef={ref}
          rowKey="id"
          headerTitle='每日红包明细'
          options={false}
          request={couponEverydayLogList}
          scroll={{ x: 'max-content', scrollToFirstRowOnChange: true, }}
          search={{
            defaultCollapsed: true,
            labelWidth: 100,
            optionRender: (searchConfig, formProps, dom) => [
               ...dom.reverse(),
               <Export
                key='export'
                change={(e) => { setVisit(e) }}
                type={'day-red-detail-export'}
                conditions={()=>{return getFieldValue(searchConfig)}}
              />,
              <ExportHistory key='task' show={visit} setShow={setVisit} type='day-red-detail-export'/>,
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
        {
          visible&&<EverydayRule
          setVisible={setVisible}
          visible={visible}
          id={detailId} 
          callback={() => { ref.current.reload(); setDetailId(null);}}
          onClose={() => { ref.current.reload(); setDetailId(null);}}
          />
        }
        </PageContainer>
    );
  };