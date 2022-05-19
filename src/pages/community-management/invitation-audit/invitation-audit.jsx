import React, { useState, useRef,useEffect } from 'react';
import { Button,Tabs,Image,Form} from 'antd';
import ProTable from '@ant-design/pro-table';
import ProForm,{ ModalForm,ProFormRadio,ProFormSwitch} from '@ant-design/pro-form';
import { PageContainer } from '@/components/PageContainer';
import { adminList } from '@/services/community-management/dynamic-admin-list';
import { auditDynamic } from '@/services/community-management/dynamic-audit-dynamic';
import { checkAuditDynamicSwitch,updateAuditDynamicSwitch } from '@/services/community-management/dynamic-audit-switch';
import AuditModel from './audit-model'
import { history,connect } from 'umi';
import { Space,Switch } from 'antd';
const { TabPane } = Tabs


const Message = (props) => {
  const { type }=props
  const ref=useRef()
  const [arrId,setArrId]=useState([])
  const [check,setCheck]=useState()
  const columns= [
    {
      title: '帖子ID',
      dataIndex: 'dynamicId',
      valueType: 'text',
      hideInTable:true
    },
    {
      title: '帖子ID',
      dataIndex: 'id',
      valueType: 'text',
      hideInSearch:true,
      render:(text, record, _, action)=>[
        <a key='id' onClick={()=>history.push('/community-management/invitation-detail?id='+record.id)}>{record.id}</a>
    ],
    },
    {
      title: '用户',
      dataIndex: 'userName',
      valueType: 'text',
      hideInSearch:true,
    },
    {
      title: '内容',
      dataIndex: 'content',
      valueType: 'text',
      hideInSearch:true,
      ellipsis:true
    },
    {
      title: '图片',
      dataIndex: 'images',
      valueType: 'image',
      hideInSearch:true,
      render:(_,data)=>{
        return <Image src={data.images[0]} alt="" width='50px' height='50px' />
      }
    },
    {
      title: '发布时间',
      key: 'dateRange',
      dataIndex: 'createTime',
      valueType: 'dateRange',
      hideInTable: true,
    },
    {
      title: '发布时间',
      dataIndex: 'createTime',
      valueType: 'text',
      hideInSearch:true
    },
    {
      title: '状态',
      dataIndex: 'state',
      hideInSearch: true,
      valueEnum: {
        0:'未审核',
        1:'已审核',
        2:'审核拒绝'
    },
    },
    {
      title: '审核时间',
      dataIndex: 'createTime',
      valueType: 'text',
      hideInSearch: true,
      hideInTable:type==0?true:false
    },
    {
      title: '审核人员',
      dataIndex: 'reviewer',
      valueType: 'text',
      hideInSearch: true,
      hideInTable:type==0?true:false
    },
    {
      title: '操作',
      key: 'option',
      valueType: 'option',
      render: (_, data) => [
          <AuditModel 
            record={data}
            type={type} 
            state={1}  
            label={'通过'}  
            text={'确认要通过该帖子的发布吗？'} 
            InterFace={auditDynamic} 
            title={'审核确认'}
            boxref={ref}
            key='pass'
          />,
          <AuditModel 
            record={data}
            type={type} 
            state={2}  
            label={'拒绝'}  
            text={'确认要拒绝该帖子的通过吗？'} 
            InterFace={auditDynamic} 
            title={'审核确认'}
            boxref={ref}
            key='refuse'
          />,
      ],
      hideInTable:type==0?false:true
    },
    
  ];
 const onIpute=(res)=>{
      setArrId(res.selectedRowKeys)
  }
 useEffect(()=>{
  if(type==0){
    checkAuditDynamicSwitch({}).then(res=>{
      setCheck(res.data)
    })
  }
 },[]) 
 const auditSwitch=(off)=>{
  setCheck(off)
   updateAuditDynamicSwitch({}).then(res=>{
   })
 }
  return (
      <ProTable
        actionRef={ref}
        rowKey="id"
        options={false}
        params={{
          auditStatus:type,
          status:type==0?4:0
        }}
        scroll={{ y: window.innerHeight - 650, scrollToFirstRowOnChange: true, }}
        request={adminList}
        rowSelection={type==0?true:false}
        tableAlertOptionRender={onIpute}
        search={{
          defaultCollapsed: true,
          labelWidth: 100,
          optionRender: (searchConfig, formProps, dom) => [
           <div key='switch'> 
             {
               type==0?
               <Form.Item
                label="审核功能开关"
              >
                <Switch  checked={check} onChange={(bol)=>{auditSwitch(bol) }}/>
              </Form.Item>
              :null
             }
           </div>,
             ...dom.reverse(),
          ],
        }}
        toolBarRender={()=>[
          <Space>
          <AuditModel 
            state={1}  
            label={'全部通过'}  
            text={'确认要通过该帖子的发布吗？'} 
            InterFace={auditDynamic} 
            title={'审核确认'}
            type={type}
            arrId={arrId}
            boxref={ref}
            key='pass'
          />
          <AuditModel 
            type={type} 
            state={2}  
            label={'全部拒绝'}  
            text={'确认要拒绝该帖子的通过吗？'} 
            InterFace={auditDynamic} 
            title={'审核确认'}
            arrId={arrId}
            boxref={ref}
            key='refuse'
          />
          </Space>
        ]}
        columns={columns}
      />
  );
};

export default (props) =>{
  const [seleType,setSeleType]=useState(0)
  return (
    <PageContainer>
      <Tabs
        centered
        defaultActiveKey="0"
        style={{
          background: '#fff',
          padding: 25
        }}
        onChange={(val)=>{
          setSeleType(val)
        }}
      >
        <TabPane tab="待审核" key="0">
          {
            seleType==0&&<Message type={0}/>
          }
        </TabPane>
        <TabPane tab="审核通过" key="1">
          {
            seleType==1&&<Message type={1}/>
          }
        </TabPane>
        <TabPane tab="审核拒绝" key="2">
          { 
            seleType==2&&<Message type={2}/> 
          }
        </TabPane>
      </Tabs>
    </PageContainer>
  )
}
