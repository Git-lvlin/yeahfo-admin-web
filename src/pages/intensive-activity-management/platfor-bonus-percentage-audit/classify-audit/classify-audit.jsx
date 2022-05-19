import React, { useEffect, useState,useRef } from 'react'
import { Spin, Empty, Switch,Form,Tooltip } from 'antd'
import { categoryAuditList } from '@/services/intensive-activity-management/platfor-bonus-percentage-audit'
import { sortableContainer, sortableElement } from 'react-sortable-hoc';
import Journal from './journal';
import ProTable from '@ant-design/pro-table';
import AuditModel from './audit-model'
import { amountTransform } from '@/utils/utils'
import styles from './style.less'


const Category = (props) => {
  const { parentId = 0, onClick = () => { },Loading=()=>{},loading} = props;
  const [visible, setVisible] = useState(false);
  const [auditVisible, setAuditVisible] = useState(false);
  const [formDetail, setFormDetail] = useState({})
  const [logId, setLogId] = useState({})
  const actionRef=useRef()
  const [rowKeys,setRowKeys]=useState()
  const columns = [
    {
      title: 'id',
      dataIndex: 'id',
      hideInTable:true
    },
    {
      title: '分类图片',
      dataIndex: 'gcIcon',
      valueType: 'image',
    },
    {
      title: '分类名称',
      dataIndex: 'gcName',
    },
    {
      title: '店主额外奖励占总额外奖励比例',
      dataIndex: 'storePercent',
      valueType: 'text',
      render: (_,r) =>{
        return <p>{amountTransform(parseFloat(_), '*')}%</p>
      }
    },
    {
      title: '额外奖励说明',
      dataIndex: 'percentAuditStatusDesc',
      valueType: 'text',
      render:(_,r)=>{
        return <>
                <p>店主：{amountTransform(parseFloat(r?.storePercent), '*')}%</p>
                <p>运营中心：{amountTransform(parseFloat(r?.operationPercent), '*')}%</p>
               </>
      }
    },
    {
      title: '更新状态',
      dataIndex: 'percentAuditStatus',
      valueType: 'select',
      render: (_,r) =>{
        return <>
                <p>{r?.percentAuditStatus==0&&'未修改'}</p>
                <p>{r?.percentAuditStatus==1&&'审核通过'}</p>
                <p className={styles.line_feed}>
                  <Tooltip  placement="leftTop" title={r?.rejectionReason}>
                    {r?.percentAuditStatus==2&&`审核拒绝（${r?.rejectionReason}）`}
                  </Tooltip>
                </p>
                <p className={styles.line_feed}>
                  <Tooltip  placement="leftTop" title={`（店主占${amountTransform(parseFloat(r?.storeAuditPercent), '*')}%）`}>
                    {r?.percentAuditStatus==3&&`待审核（店主占${amountTransform(parseFloat(r?.storeAuditPercent), '*')}%）`}
                  </Tooltip>
                </p>
               </>
      },
      ellipsis:true
    },
    {
      title: '操作',
      valueType: 'option',
      render: (text, record, _, action) => [
        <div key="audit">
          {
             record?.percentAuditStatus==3&&<a
             key="editable"
             onClick={() => {
              setAuditVisible(true)
              setFormDetail(record)
             }}
           >
             审核
           </a>
          }
        </div>,
        <a key='log' onClick={()=>{
          setLogId(record.id)
          setVisible(true)
        }}>日志</a>
      ],
    },
  ];
  const postData=(data)=>{
  const obj=data.find(ele=>ele?.hasAuditChildren==1)
  if(obj){
      setRowKeys(obj.id)
      onClick(obj.id)
  }
    return data
  }
  return (
      <div style={{ marginRight: 50 }}>
        <ProTable
          rowKey="id"
          actionRef={actionRef}
          headerTitle={`${parentId?'二':'一'}级分类`}
          maxLength={5}
          columns={columns}
          params={{
            isPercentAudit:2,
            gcParentId:parentId?parentId:0,
            loading:loading
          }}
          request={categoryAuditList}
          postData={postData}
          options={false}
          search={false}
          style={{width:'850px',height:'600px',overflowY:'scroll',background:'#fff'}}
          pagination={false}
          rowSelection={{
            renderCell:()=>{
              return null
            },
            type:'radio',
            selectedRowKeys:[rowKeys],
            
          }}
          tableAlertRender={false}
          onRow={(record) => {
            return {  
              onClick: async () => {
                await onClick(record.id)
                setRowKeys(record.id)
              },
            };
          }}
      />
      {visible && <Journal
        visible={visible}
        setVisible={setVisible}
        logId={logId}
        onClose={()=>{actionRef.current.reload();setLogId(null)}}
      />}
      {auditVisible && <AuditModel
        visible={auditVisible}
        setVisible={setAuditVisible}
        formDetail={formDetail}
        onClose={()=>{actionRef.current.reload();setFormDetail(null)}}
        callback={()=>{actionRef.current.reload();setFormDetail(null);Loading(true)}}
      />}
      </div>
  )
}

export default () => {
  const [selectId, setSelectId] = useState(null);
  const [loading, setLoading] = useState(false);
  return (
    <>
      <div style={{ display: 'flex', width: '100%' }}>
        <Category onClick={(id) => { setSelectId(id)}} loading={loading}/>
        {selectId 
        && 
        <Category 
          parentId={selectId} 
          Loading={(val)=>{
            setLoading(val);
            }
          }/>
        }
      </div>
    </>
  )
}

