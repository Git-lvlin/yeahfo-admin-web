import React, { useState, useRef,useEffect } from 'react';
import { Button,Tabs,Image,Form,Modal,Select} from 'antd';
import ProTable from '@ant-design/pro-table';
import { PlusOutlined, MinusOutlined } from '@ant-design/icons';
import { findByPage,removeById } from '@/services/resource'
import ProForm,{ ModalForm,ProFormRadio,ProFormSwitch} from '@ant-design/pro-form';
import { PageContainer } from '@/components/PageContainer';
import { history,connect } from 'umi';
import DeleteModal from './delete-modal'
import Configuration from './data-board-configuration'



export default () => {
    const ref=useRef()
    const [visible, setVisible] = useState(false);
    const [userId, setUserId] = useState(false);
    const [edtil,setEdtil]=useState(false)
    const [edit,setEdit]=useState(false)
    const columns= [
      {
        title: '接口编码',
        dataIndex: 'reportCode',
        valueType: 'text',
      },
      {
        title: '接口说明',
        dataIndex: 'remark',
        valueType: 'text',
      },
      {
        title: '操作',
        key: 'option',
        valueType: 'option',
        render:(text, record, _, action)=>[
            // <DeleteModal 
            //     boxref={ref} 
            //     text={'确认要删除该条数据吗？'} 
            //     InterFace={removeById}
            //     id={record.id} 
            //     title={'操作确认'}
            // />,
            <a key='detail' onClick={()=>{setVisible(true);setUserId(record.id);setEdtil(true);}}>查看详情</a>,
            <a key='edit' onClick={()=>{setVisible(true);setUserId(record.id);setEdit(true);}}>编辑</a>,
        ],
      }, 
    ];
    return (
      <PageContainer>
        <ProTable
          actionRef={ref}
          rowKey="id"
          headerTitle="数据报表"
          options={false}
          request={findByPage}
          toolBarRender={()=>[
            <Button key='add' icon={<PlusOutlined />}  onClick={()=>setVisible(true)} type="primary">
                添加数据
            </Button>
        ]}
          columns={columns}
        />
        {visible&&<Configuration
          visible={visible}
          setVisible={setVisible}
          id={userId}
          edit={edit}
          edtil={edtil} 
          callback={() => { ref.current.reload(); setUserId(null);setEdit(null);setEdtil(null)}}
          onClose={() => { ref.current.reload(); setUserId(null);setEdit(null);setEdtil(null)}}
        />}
        </PageContainer>
    );
  };