import React, { useState, useRef,useEffect } from 'react';
import { Button,Tabs,Image,Form,Modal,Select,Descriptions,Space} from 'antd';
import ProTable from '@ant-design/pro-table';
import { PageContainer } from '@/components/PageContainer';
import { getBuildhouseUseList } from '@/services/activity-management/spring-festival-build-building-activity';
import { history, connect } from 'umi';
import CancelModel from './cancel-model'
import RecordModel from './record-model' 
import Export from '@/pages/export-excel/export'
import ExportHistory from '@/pages/export-excel/export-history'



export default () => {
    const actionRef=useRef()
    const [detailList,setDetailList]=useState()
    const [visible, setVisible] = useState(false);
    const [listVisible, setListVisible] = useState(false);
    const [storeNoId,setStoreNoId]=useState()
    const [recordId,setRecordId]=useState()
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
        title: '用户名',
        dataIndex: 'memberNicheng',
        valueType: 'text',
      },
      {
        title: '用户手机号',
        dataIndex: 'memberMobile',
        valueType: 'text',
      },
      {
        title: '使用时间',
        key: 'dateTimeRange',
        dataIndex: 'activityStartTime',
        valueType: 'dateTimeRange',
        hideInTable: true,
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
        title: '活动名称',
        dataIndex: 'name',
        valueType: 'text',
        ellipsis:'true'
      },
      {
        title: '使用时间',
        dataIndex: 'createTime',  
        hideInSearch:true
      },
      {
        title: '使用总次数',
        dataIndex: 'num',
        valueType: 'text',
        hideInSearch:true
      },
      {
        title: '盖楼楼层',
        dataIndex: 'floor',
        valueType: 'text',
        hideInSearch:true
      },
      {
        title: '使用原因',
        dataIndex: 'typeDisplay',
        valueType: 'text',
        hideInSearch:true,
      },
      {
        title: '筛选',
        dataIndex: 'expenditureType',
        valueType: 'select',
        valueEnum: {
          0: '全部',
          1: '未获奖',
          2: '已获奖',
          3: '机会过期',
          6: '活动结束'
        },
        hideInTable:true
      },
      {
        title: '机会编号',
        dataIndex: 'code',
        valueType: 'text',
      },
      {
        title: '是否参与抽奖',
        dataIndex: 'draw',
        valueType: 'text',
        hideInSearch:true,
      },
      {
        title: '获得奖品',
        dataIndex: 'prizeDisplay',
        valueType: 'text',
        hideInSearch: true,
      },
      {
        title: '提现记录',
        valueType: 'option',
        render:(text, record, _, action)=>[
          <a key="detail" onClick={()=>{setListVisible(true);setRecordId(record)}}>查看</a>
        ],
      }, 
      {
        title: '操作',
        key: 'option',
        valueType: 'option',
        render:(text, record, _, action)=>[
          <a key='detail' onClick={()=>history.push('/activity-management/spring-festival-build-building-activity/employ-detail?memberId='+record.memberId)}>查看此用户明细</a>,
          <a key='unfreeze' onClick={()=>{setVisible(true);setStoreNoId(record)}}>{record?.isFreeze?'解冻该奖励':'冻结该奖励'}</a>
        ],
      }, 
    ];
    const postData=(data)=>{
      setDetailList(data)
      return data
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
        <ProTable
          actionRef={actionRef}
          rowKey="id"
          options={false}
          request={getBuildhouseUseList}
          postData={postData}
          search={{
            defaultCollapsed: true,
            labelWidth: 100,
            optionRender: (searchConfig, formProps, dom) => [
               ...dom.reverse(),
               <Export
                key='export'
                change={(e) => { setVisit(e) }}
                type={'build-floor-use-list-export'}
                conditions={()=>{return getFieldValue(searchConfig)}}
              />,
              <ExportHistory key='task' show={visit} setShow={setVisit} type={'build-floor-use-list-export'}/>,
            ],
          }}
          pagination={{
            pageSize: 10,
            showQuickJumper: true,
          }}
          columns={columns}
          scroll={{ x: 'max-content', scrollToFirstRowOnChange: true, }}
        />
        {visible && <CancelModel
          visible={visible}
          setVisible={setVisible}
          storeNoId={storeNoId}
          onClose={() => { actionRef.current.reload();  setStoreNoId(null) }}
          callback={() => { actionRef.current.reload(); setStoreNoId(null) }}
        />}
        {listVisible && <RecordModel
          visible={listVisible}
          setVisible={setListVisible}
          recordId={recordId}
          onClose={() => { actionRef.current.reload();  setRecordId(null) }}
          callback={() => { actionRef.current.reload(); setRecordId(null) }}
        />}
        </PageContainer>
    );
  };