import React, { useState, useEffect,useRef } from 'react';
import ProTable from '@ant-design/pro-table';
import EcxelUpload from '@/components/EcxelUpload';
import ProForm,{
    DrawerForm,
  } from '@ant-design/pro-form';
import {findPage,createImportTask,file_tpl_url } from '@/services/daifa-store-management/list';
import {  Button,message } from 'antd';


export default props=>{
    const actionRef = useRef();
    const {callback = () => { }}=props 
    const [visible, setVisible] = useState(false);
    const [falg,setFalg]=useState(false)
    const [baseUrl,setBaseUrl]=useState()
    const Termination=()=>{
        setVisible(true)
        file_tpl_url({}).then(res=>{
          setBaseUrl(res.data.filePath)
        })
    }
    useEffect(()=>{
      var user=window.localStorage.getItem('user')
    },[])
    const fileUrl=async (e)=>{
        if(window.localStorage.getItem('user')){
          await createImportTask({fileUrl:e,param:window.localStorage.getItem('user')}).then(res=>{
            if(res.code==0){
                message.success('创建导入任务成功');
                setFalg(true)
            }
        })
        }
    }
    const columns = [
        {
          title: '任务id',
          dataIndex: 'id',
          valueType: 'text',
          ellipsis:true,
        },
        {
          title: '导入文件',
          dataIndex: 'fileUrl',
          valueType: 'text',
          ellipsis:true
        },
        {
          title: '开始时间',
          dataIndex: 'createTime',
          valueType: 'text',
        },
        {
          title: '结束时间',
          dataIndex: 'endTime',
          valueType: 'text',
          hideInSearch: true,
        },
        {
          title: '状态',
          dataIndex: 'state',
          valueType: 'select',
          valueEnum: {
            0:'未开始',
            1: '处理中',
            2: '导入成功',
            3: '导入失败',
            4: '用户取消'
          }
        },
        {
          title: '成功/失败详解',
          dataIndex: 'exceptionDes',
          valueType: 'text',
        },
        {
          title: '进度',
          dataIndex: 'process',
          valueType: 'text',
          hideInSearch: true,
        },
        {
          title: '总记录数',
          dataIndex: 'count',
          valueType: 'text',
          hideInSearch: true,
        },
        {
          title: '已导入',
          dataIndex: 'processCount',
          valueType: 'text',
          hideInSearch: true,
        }
      ];
    const submit = (values) => {
        callback()
        setFalg(false)
    }
    
    return (
        <DrawerForm
            key="1"
            title='批量新建'
            onVisibleChange={setVisible}
            visible={visible}
            trigger={<Button type="primary" onClick={()=>Termination()}>批量新建</Button>}
            onFinish={async (values) => {
              await submit(values);
              return true;
            }}
        >
        
        { 
          falg?
          <ProTable
            rowKey="id"
            options={false}
            request={findPage}
            search={false}
            actionRef={actionRef}
            columns={columns}
            toolBarRender={(_,record) => [
              <Button key="button"  type="primary" onClick={() => { actionRef.current.reload() }}>
                刷新
              </Button>
            ]}
        />
        :<>
           <a href={baseUrl}><Button type="primary" style={{margin:'20px 0 20px 0'}}>下载模板</Button></a>
           <EcxelUpload calback={fileUrl}  multiple maxCount={1} accept="image/*" size={5 * 1024} />
        </>
        }
       
        </DrawerForm>
    )
}

