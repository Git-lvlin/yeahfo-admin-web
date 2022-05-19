import React, { useEffect, useState,useRef } from 'react'
import { Spin, Empty, Switch,Form,InputNumber,Tooltip } from 'antd'
import { PageContainer } from '@/components/PageContainer';
import { categoryList,updateCategoryPercent } from '@/services/intensive-activity-management/platfor-bonus-percentage'
import Journal from './journal';
import styles from './style.less'
import { EditableProTable } from '@ant-design/pro-table';
import { amountTransform } from '@/utils/utils'


const Category = (props) => {
  const { parentId = 0, onClick = () => { }} = props;
  const actionRef=useRef()
  const [dataSource, setDataSource] = useState([]);
  const [editableKeys, setEditableRowKeys] = useState([]);
  const [visible, setVisible] = useState(false);
  const [logId, setLogId] = useState()
  const [form] = Form.useForm();
  const [rowKeys,setRowKeys]=useState()
  const FromWrap = ({ value, onChange, content, right }) => (
    <div>
      <div>{content(value, onChange)}</div>
      <div>{right(value)}</div>
    </div>
  )
  const columns = [
    {
      title: 'id',
      dataIndex: 'id',
      editable:false,
      hideInTable:true
    },
    {
      title: '分类图片',
      dataIndex: 'gcIcon',
      valueType: 'image',
      editable:false,
    },
    {
      title: '分类名称',
      dataIndex: 'gcName',
      editable:false,
    },
    {
      title: '店主额外奖励占总额外奖励比例',
      dataIndex: 'storePercent',
      valueType: 'text',
      renderFormItem: (data,r) => {
        return <FromWrap
                content={
                  (value, onChange) => 
                  <InputNumber
                    min="0"
                    max="100"
                    precision='2'
                    value={value}
                    onChange={onChange}
                    stringMode
                  />
                 }
                right={(value) => {
                  return (
                    <p>运营中心：{data.entry?.operationPercent}%</p>
                  )
                }}
              />
        },
      render: (_,r) =>{
        return <p>{_}%</p>
      }
    },
    {
      title: '额外奖励说明',
      dataIndex: 'percentAuditStatusDesc',
      valueType: 'text',
      editable:false,
      render:(_,r)=>{
        return <>
                <p>店主：{r?.storePercent}%</p>
                <p>运营中心：{r?.operationPercent}%</p>
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
                  <Tooltip  placement="leftTop" title={`（店主占${r?.storeAuditPercent}%）`}>
                    {r?.percentAuditStatus==3&&`待审核（店主占${r?.storeAuditPercent}%）`}
                  </Tooltip>
                </p>
               </>
      },
      editable:false,
      ellipsis:true
    },
    {
      title: '操作',
      valueType: 'option',
      width:'25%',
      render: (text, record, _, action) => [
        <a
          key="editable"
          onClick={() => {
            action?.startEditable?.(record.id);
          }}
        >
          更新比例
        </a>,
        <a key="log" onClick={()=>{
          setLogId(record.id)
          setVisible(true)
        }}>日志</a>
      ],
    },
  ];
  return (
    <>
        <EditableProTable
          rowKey="id"
          actionRef={actionRef}
          headerTitle={`${parentId?'二':'一'}级分类`}
          maxLength={5}
          recordCreatorProps={false}
          columns={columns}
          params={{
            isPercentAudit:1,
            gcParentId:parentId?parentId:0
          }}
          postData={(data)=>{
            const arr=data.map(ele=>(
              {
                ...ele,
                storePercent:amountTransform(parseFloat(ele.storePercent), '*'),
                storeAuditPercent:amountTransform(parseFloat(ele.storeAuditPercent), '*'),
                operationPercent:amountTransform(parseFloat(ele.operationPercent), '*')
              }
              ))
            return arr
          }}
          request={categoryList}
          value={dataSource}
          onChange={setDataSource}
          editable={{
            form,
            editableKeys,
            onSave: async (rowKey, data, row) => {
            },
            onCancel:async (rowKey, data, row) => {
              setEditableRowKeys([])
            },
            onChange: setEditableRowKeys,
            actionRender: (row, config, dom) => [
              <a 
                key='sub' 
                onClick={()=>{
                  const obj={
                    ...row,
                  }
                  config?.onSave(row.id,obj,row)
                  const Percent=amountTransform(parseFloat(config?.form?.getFieldValue()[row.id].storePercent), '/')
                  updateCategoryPercent({id:row.id,storeAuditPercent:Percent}).then(res=>{
                    if(res.code==0){
                      actionRef?.current.reload()
                    }
                  })
                }}
              >提交审核</a>,
              <a key='cancel' 
                onClick={()=>{
                  const obj={
                    ...row,
                    storePercent:config?.form?.getFieldValue()[row.id].storePercent,
                  }
                  config?.onCancel(row.id,obj,row)
                }}
              >取消更新</a>
            ],
          }}
          style={{width:'900px',height:'600px',overflowY:'scroll',background:'#fff'}}
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
        onClose={()=>{actionRef?.current.reload();setLogId(null)}}
      />}
    </>
  )
}

const PlatforBonusPercentage = () => {
  const [selectId, setSelectId] = useState(null);

  return (
    <PageContainer>
      <div className={styles.header}>
        <p>* 平台总额外奖励占商品盈利比例：90%</p>
      </div>
      <div style={{ display: 'flex', width: '100%' }}>
        <Category onClick={(id) => { setSelectId(id)}}/>
        {selectId && <Category parentId={selectId}/>}
      </div>
    </PageContainer>
  )
}

export default PlatforBonusPercentage;

