import React, { useState, useRef,useEffect } from 'react';
import { Button } from 'antd';
import ProTable from '@ant-design/pro-table';
import {ProFormSwitch} from '@ant-design/pro-form';
import { PageContainer } from '@/components/PageContainer';
import { couponCrowdList,couponCrowdStatusSub,couponCrowdDel } from '@/services/crowd-management/coupon-crowd';
import { history} from 'umi';
import SubTable from '@/pages/coupon-management/coupon-construction/coupon-subtable'
import AddCrowd from './add-crowd'



export default (props) =>{
  const ref=useRef()
  const [visible,setVisible]=useState(false)
  const [pennyId,setPennyId]=useState()
  const columns= [
    {
      title: '群体名称',
      dataIndex: 'name',
      valueType: 'text',
    },
    {
        title: '状态',
        dataIndex: 'status',
        valueType: 'select',
        valueEnum: {
          1: '关闭',
          2: '开启',
        },
    },
    {
      title: '操作',
      key: 'option',
      width: 200,
      valueType: 'option',
      render: (_, data) => [
      <ProFormSwitch key='switch' name="Switch"
        fieldProps={{
          checked: data.status==2?true:false,
          onChange:(bol)=>{
            if(bol){
              couponCrowdStatusSub({id:data.id,status:2}).then(res=>{
                if(res.code==0){
                  ref.current.reload();
                }
              })
            }else{
              couponCrowdStatusSub({id:data.id,status:1}).then(res=>{
                if(res.code==0){
                  ref.current.reload();
                }
              })
            }
          }
        }
      }
      />,
      <a
          key="edit"
          onClick={()=>{
            Examine(data.id)
          }}
        >
          编辑
      </a>,
       <a
          key="dele"
          onClick={()=>{
            couponCrowdDel({id:data.id}).then(res=>{
              if(res.code==0){
                ref.current.reload();
              }
            })
          }}
        >
          删除
      </a>,
      ],
    },
    
  ];
 
  //编辑
  const Examine=(id)=>{
    setPennyId(id)
    setVisible(true)
  }
  //新建
  const addcoupon=()=>{
    setVisible(true)
  }
  return (
    <PageContainer>
     
      <ProTable
          scroll={{ x: 'max-content', scrollToFirstRowOnChange: true, }}
          actionRef={ref}
          rowKey="id"
          options={false}
          expandable={{ expandedRowRender: (_) => <SubTable name={_.name}/> }}
          request={couponCrowdList}
          search={{
          defaultCollapsed: true,
          labelWidth: 100,
          optionRender: (searchConfig, formProps, dom) => [                                                   
              ...dom.reverse(),
          ],
          }}
          columns={columns}
          toolBarRender={() => [
            <Button
              key="primary"
              type="primary"
              style={{marginBottom:'20px'}}
              onClick={addcoupon}
            >
                新建
            </Button>
          ]}
      />
      {visible&& <AddCrowd
        visible={visible}
        setVisible={setVisible}
        id={pennyId} 
        callback={() => { ref.current.reload(); setPennyId(null);}}
        onClose={() => { ref.current.reload(); setPennyId(null);}}
      />}
    </PageContainer>
  )
}
