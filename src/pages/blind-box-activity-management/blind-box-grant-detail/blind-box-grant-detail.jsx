import React, { useState, useRef,useEffect } from 'react';
import { Button,Tabs,Image,Form,Modal,Select} from 'antd';
import ProTable from '@ant-design/pro-table';
import { getBlindboxIncomeList } from '@/services/blind-box-activity-management/blindbox-blindbox-get-lncome';
import { PageContainer } from '@/components/PageContainer';
import { history,connect } from 'umi';
import Export from '@/pages/export-excel/export'
import ExportHistory from '@/pages/export-excel/export-history'



export default () => {
    const ref=useRef()
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
        title: '发放原因',
        dataIndex: 'type',
        valueType: 'text',
        valueEnum: {
          1:'连续签到',
          2:'邀请好友', 
          3:'订单消费',
          7:'集约采购获得机会'
        },
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
        key: 'option',
        valueType: 'option',
        render:(text, record, _, action)=>[
            <a key='detail' onClick={()=>history.push('/blind-box-activity-management/blind-box-employ-detail?memberId='+record.memberId)}>查看此用户明细</a>
        ],
      }, 
    ];
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
        <ProTable
          actionRef={ref}
          rowKey="id"
          headerTitle="盲盒机会发放明细"
          options={false}
          request={getBlindboxIncomeList}
          scroll={{ x: 'max-content', scrollToFirstRowOnChange: true, }}
          search={{
            defaultCollapsed: true,
            labelWidth: 100,
            optionRender: (searchConfig, formProps, dom) => [
               ...dom.reverse(),
               <Export
                key='export'
                change={(e) => { setVisit(e) }}
                type={'bind-box-give-detail-export'}
                conditions={()=>{return getFieldValue(searchConfig)}}
              />,
              <ExportHistory key='task' show={visit} setShow={setVisit} type={'bind-box-give-detail-export'}/>
            ],
          }}
          pagination={{
            pageSize: 10,
            showQuickJumper: true,
          }}
          columns={columns}
        />
        </PageContainer>
    );
  };