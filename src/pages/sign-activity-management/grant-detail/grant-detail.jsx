import React, { useState, useRef,useEffect } from 'react';
import { Button,Tabs,Image,Form,Modal,Select} from 'antd';
import ProTable from '@ant-design/pro-table';
import { PageContainer } from '@/components/PageContainer';
import { history, connect } from 'umi';
import { queryIssuanceList } from '@/services/sign-activity-management/packet-record-query-issuance-list';
import Export from '@/pages/export-excel/export'
import ExportHistory from '@/pages/export-excel/export-history'
import moment from 'moment';



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
        title: '用户手机号',
        dataIndex: 'phoneNum',
        valueType: 'text',
      },
      {
        title: '用户名',
        dataIndex: 'userName',
        valueType: 'text',
      },
      {
        title: '修改版本',
        dataIndex: 'signInVersion',
        valueType: 'text',
        hideInSearch:true
      },
      {
        title: '发放方式',
        dataIndex: 'channelName',
        valueType: 'text',
        hideInSearch:true,
        ellipsis:true
      },
      {
        title: '签到时间',
        key: 'dateTimeRange',
        dataIndex: 'createTime',
        valueType: 'dateTimeRange', 
        hideInTable:true  
      },
      {
        title: '签到时间',
        dataIndex: 'createTime',  
        hideInSearch:true
      },
      {
        title: '领取金额',
        dataIndex: 'changeValue',
        hideInSearch:true,
        render: (_,data)=> {
          return <p>￥{_/100}</p>
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
        title: '操作',
        key: 'option',
        valueType: 'option',
        render:(text, record, _, action)=>[
            <a key='detail' onClick={()=>{history.push('/sign-activity-management/user-detail?memberId='+record.memberId)}}>查看此用户明细</a>
        ],
      }, 
    ];
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
        <ProTable
          actionRef={ref}
          rowKey="id"
          headerTitle="签到红包发放明细"
          options={false}
          request={queryIssuanceList}
          scroll={{ x: 'max-content', scrollToFirstRowOnChange: true, }}
          search={{
            defaultCollapsed: true,
            labelWidth: 100,
            optionRender: (searchConfig, formProps, dom) => [
               ...dom.reverse(),
               <Export
               key='export'
               change={(e) => { setVisit(e) }}
               type={'red-packet-give-detail-export'}
               conditions={()=>{return getFieldValue(searchConfig)}}
             />,
             <ExportHistory key='task' show={visit} setShow={setVisit} type={'red-packet-give-detail-export'} />,
            ],
          }}
          columns={columns}
        />
      </PageContainer>
    );
  };