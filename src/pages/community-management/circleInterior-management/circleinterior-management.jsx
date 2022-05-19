import React, { useState, useRef,useEffect } from 'react';
import ProTable from '@ant-design/pro-table';
import { adminList } from '@/services/community-management/dynamic-admin-list';
import { banDynamicComment } from '@/services/community-management/dynamic-ban-dynamic-comment';
import { banShare } from '@/services/community-management/dynamic-ban-share';
import { dynamicDelete } from '@/services/community-management/dynamic-delete';
import { dynamicTop } from '@/services/community-management/dynamic-top';
import { cancelBanDynamicComment } from '@/services/community-management/dynamic-cancel-ban-dynamic-comment';
import { cancelBanShare } from '@/services/community-management/dynamic-cancel-ban-share';
import { ProFormSwitch} from '@ant-design/pro-form';
import DeleteModal from '@/components/DeleteModal'
import { Button,Image} from 'antd';
import { history } from 'umi';

export default props => {
    const ref=useRef()
    let id = props.location.query.id
    let name=props.location.query.name
    const onTop=(bol,off)=>{
        dynamicTop({id:off}).then(res=>{
                ref.current.reload()
            }) 
    }
    const columns = [
        {
            title: '帖子ID：',
            dataIndex: 'dynamicId',
            hideInTable: true,
        },
        {
            title: '帖子ID：',
            dataIndex: 'id',
            hideInSearch:true,
            render:(text, record, _, action)=>[
                <a key='id' onClick={()=>history.push('/community-management/invitation-detail?id='+record.id+'&byid='+id+'&name='+name)}>{record.id}</a>
            ],
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
            title: '会员ID',
            dataIndex: 'userId',
            valueType: 'text',
        },
        {
            title: '会员昵称',
            dataIndex: 'userName',
            valueType: 'text',
        },
        {
            title: '置顶',
            dataIndex: 'topNum',
            valueType: 'text',
            render:(_,r) => {
                return <ProFormSwitch name="Switch"
                  fieldProps={{
                    checked: r.topNum,
                    onChange:(bol)=>{onTop(bol,r.id)
                  }}
                }
                />
            },
            hideInSearch: true,
        },
        {
            title: '操作',
            render: (text, record, _, action) => [
                <Button key='eart' style={{marginRight:'10px'}} onClick={()=>{
                    if(record.banComment){
                        cancelBanDynamicComment({id:record.id}).then(res=>{
                            ref.current.reload()
                        })  
                    }else{
                        banDynamicComment({id:record.id}).then(res=>{
                            ref.current.reload()
                        }) 
                    }
                }}>{record.banComment?'取消禁评':'禁评'}</Button>,
                <Button key='turn' style={{marginRight:'10px'}} onClick={()=>{
                    if(record.banShare){
                        cancelBanShare({id:record.id}).then(res=>{
                            ref.current.reload()
                        }) 
                    }else{
                        banShare({id:record.id}).then(res=>{
                            ref.current.reload()
                        }) 
                    }
                    
                }}>{record.banShare?'取消禁转':'禁转'}</Button>,
                <DeleteModal 
                    record={record} 
                    boxref={ref} 
                    text={'确认要删除所选内容吗？'} 
                    InterFace={dynamicDelete} 
                    title={'操作确认'}
                    key='delete'
                />
            ],
            hideInSearch: true,
        },
    ];
  return (
      <>
      <h1>圈子名称：{name}</h1>
        <ProTable
            actionRef={ref}
            rowKey="id"
            options={false}
            params={{
                circleId:id
            }}
            request={adminList}
            
            search={{
                defaultCollapsed: true,
                labelWidth: 100,
                optionRender: (searchConfig, formProps, dom) => [
                    ...dom.reverse(),
                ],
            }}
            columns={columns}
        />
    </>
  );
};
