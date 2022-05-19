import React, { useState, useRef } from 'react';
import { Button,Tabs} from 'antd';
import ProTable from '@ant-design/pro-table';
import { PageContainer } from '@/components/PageContainer';
import { couponList } from '@/services/coupon-management/coupon-list';
import styles from './style.less'
import { history} from 'umi';
import ListDetails from '../list-details'
import AuditDetails from '../audit-details'
const { TabPane } = Tabs


const Message = (props) => {
  const { type }=props
  const ref=useRef()
  const [detailsVisible, setDetailVisible] = useState(false);
  const [auditVisible, setAuditVisible] = useState(false);
  const [pennyId,setPennyId]=useState()
  const columns= [
    {
      title: '红包名称',
      dataIndex: 'couponName',
      valueType: 'text',
      fieldProps: {
        placeholder: '请输入红包名称'
      },
      render:(text, record, _, action)=>[
        <a key='likeName' onClick={()=>{setPennyId(record?.id);setDetailVisible(true)}}>{record.couponName}</a>
    ],
    },
    {
      title: '红包类型',
      dataIndex: 'couponType',
      valueType: 'select',
      valueEnum: {
        1: '满减红包',
        2: '折扣红包',
        3: '立减红包'
      }
    },
    {
      title: '发行总金额（元）',
      dataIndex: 'issueAmount',
      hideInSearch: true,
      render:(_,data)=>{
        return <p>{!isNaN(_)?Number(_).toFixed(2):_}</p>
      }
    },
    {
      title: '发行总数量（张）',
      dataIndex: 'issueQuantity',
      valueType: 'text',
      hideInSearch: true,
      render:(_, data)=>{
        return <p>{data.issueQuantity==-1?'不限量':data.issueQuantity}</p>
      }
    },
    {
      title: '面额（元）',
      dataIndex: 'couponAmountDisplay',
      hideInSearch: true,
      render:(_,data)=>{
        return <p>{!isNaN(_)?Number(_).toFixed(2):_}</p>
      }
    },
    {
      title: '可领取时间',
      dataIndex: 'dateRange',
      valueType: 'text',
      render:(_, data)=>{
        return data.limitStartTime&&<p>{data.limitStartTime} 至 {data.limitEndTime}</p>
      },
      hideInSearch: true,
      ellipsis:true
    },
    {
      title: '有效期',
      dataIndex: 'activityTimeDisplay',
      valueType: 'text',
      hideInSearch: true,
      ellipsis:true
    },
    {
      title: '审核状态',
      dataIndex: 'couponVerifyStatus',
      valueType: 'select',
      valueEnum: {
        1: '待提交',
        2: '审核驳回',
        3: '审核中',
        4: '已通过'
      },
      hideInSearch: true
    },
    {
      title: '操作',
      key: 'option',
      width: 120,
      valueType: 'option',
      render: (_, data) => [
      <a
        key="audit"
        onClick={()=>{
          Examine(data.id)
        }}
        >
        {
          type==3?
          '审核'
          :null
        }
      </a>,
      <a
        key="detail"
        onClick={()=>Examine(data.id)}
      >
        {
          type==4?
          '查看'
          :null
        }
      </a>
      ],
    },
    
  ];

  const Examine=(id)=>{
    setPennyId(id)
    setAuditVisible(true)
  }

  return (
    <>
      <ProTable
        actionRef={ref}
        rowKey="id"
        options={false}
        params={{
          couponVerifyStatus: type,
        }}
        scroll={{ x: 'max-content', scrollToFirstRowOnChange: true, }}
        request={couponList}
        search={{
          defaultCollapsed: true,
          labelWidth: 100,
          optionRender: (searchConfig, formProps, dom) => [
            ...dom.reverse(),
          <Button  onClick={()=>{ref.current.reload()}} key="refresh">
            刷新
          </Button>
          ],
        }}
        columns={columns}
      />
      {detailsVisible&& <ListDetails
        detailsVisible={detailsVisible}
        setDetailVisible={setDetailVisible}
        id={pennyId} 
        callback={() => { ref.current.reload(); setPennyId(null);}}
        onClose={() => { ref.current.reload(); setPennyId(null);}}
      />}
      {auditVisible&& <AuditDetails
        auditVisible={auditVisible}
        setAuditVisible={setAuditVisible}
        id={pennyId} 
        callback={() => { ref.current.reload(); setPennyId(null);}}
        onClose={() => { ref.current.reload(); setPennyId(null);}}
    />}
  </>
  );
};

export default (props) =>{
  const [seleType,setSeleType]=useState(3)
  return (
    <PageContainer>
      <Tabs
        centered
        defaultActiveKey="1"
        className={styles.auditTabs}
        onChange={(val)=>{
          setSeleType(val)
        }}
      >
        <TabPane tab="待审核" key="3">
          {
            seleType==3&&<Message type={3}/>
          }
        </TabPane>
        <TabPane tab="审核通过" key="4">
          {
            seleType==4&&<Message type={4}/>
          }
        </TabPane>
      </Tabs>
    </PageContainer>
  )
}
