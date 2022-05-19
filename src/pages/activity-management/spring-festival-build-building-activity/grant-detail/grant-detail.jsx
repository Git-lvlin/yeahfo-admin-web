import React, { useState, useRef,useEffect } from 'react';
import { Button,Tabs,Image,Form,Modal,Select} from 'antd';
import ProTable from '@ant-design/pro-table';
import { getBuildhouseIncomeList } from '@/services/activity-management/spring-festival-build-building-activity';
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
        ellipsis:'true'
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
          1:'初始机会',
          2:'邀请好友注册', 
          3:'邀请好友注册且游戏',
          4:'随机奖励'
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
            <a key='detail' onClick={()=>history.push('/activity-management/spring-festival-build-building-activity/employ-detail?memberId='+record.memberId)}>查看此用户明细</a>
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
      <PageContainer title="机会发放明细">
        <ProTable
          actionRef={ref}
          rowKey="id"
          options={false}
          request={getBuildhouseIncomeList}
          search={{
            defaultCollapsed: true,
            labelWidth: 100,
            optionRender: (searchConfig, formProps, dom) => [
               ...dom.reverse(),
               <Export
                key='export'
                change={(e) => { setVisit(e) }}
                type={'build-floor-give-list-export'}
                conditions={()=>{return getFieldValue(searchConfig)}}
              />,
              <ExportHistory key='task' show={visit} setShow={setVisit} type={'build-floor-give-list-export'}/>
            ],
          }}
          scroll={{ x: 'max-content', scrollToFirstRowOnChange: true, }}
          pagination={{
            pageSize: 10,
            showQuickJumper: true,
          }}
          columns={columns}
        />
        </PageContainer>
    );
  };