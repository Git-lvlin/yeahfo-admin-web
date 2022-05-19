import React, { useState, useRef,useEffect } from 'react';
import { Button,Tabs,Image,Form,Modal,Select} from 'antd';
import ProTable from '@ant-design/pro-table';
import { PlusOutlined, MinusOutlined } from '@ant-design/icons';
import { getActiveConfigList } from '@/services/blind-box-activity-management/blindbox-get-active-config-list';
import ProForm,{ ModalForm,ProFormRadio,ProFormSwitch} from '@ant-design/pro-form';
import { PageContainer } from '@/components/PageContainer';
import moment from 'moment';
import { history,connect } from 'umi';
import BindBoxSet from '../bind-box-rule-set'



export default () => {
    const ref=useRef()
    const [visible,setVisible]=useState(false)
    const [detailId,setDetailId]=useState()
    const columns= [
      // {
      //   title: 'id',
      //   dataIndex: 'id',
      //   valueType: 'text',
      //   hideInSearch:true
      // },
      {
        title: '活动名称',
        dataIndex: 'name',
        valueType: 'text',
        hideInSearch:true
      },
      {
        title: '活动时间',
        dataIndex: 'startTime',
        valueType: 'text',
        hideInSearch:true,
        render:(_,data)=>{
          return <p>{moment(data?.startTime*1000).format('YYYY-MM-DD HH:mm:ss')} 至 {moment(data?.endTime*1000).format('YYYY-MM-DD HH:mm:ss')}</p>
        }
      },
      {
        title: '每天最高中奖次数',
        dataIndex: 'maxPrizeNum',
        valueType: 'text',
        hideInSearch:true,
        render:(_,data)=>{
          return <p>{data?.content?.maxPrizeNum}</p>
        }
      },
      {
        title: '盲盒机会有效期',
        dataIndex: 'validiteHour',
        valueType: 'text',
        hideInSearch:true,
        render:(_,data)=>{
          return <p>{_}小时</p>
        }
      },
      // {
      //   title: '邀请好友',
      //   dataIndex: 'content',
      //   valueType: 'text',
      //   hideInSearch:true,
      //   render:(_,data)=>{
      //     return <p>
      //       每邀请{data?.content?.accessGain?.inviteFriends?.inviteNum}
      //       位新用户注册获得{data?.content?.accessGain?.inviteFriends?.prizeNum}次
      //       （概率{data?.content?.accessGain?.inviteFriends?.probability}%）
      //       </p>
      //   }
      // },
      // {
      //   title: '每日签到',
      //   key: 'dateRange',
      //   dataIndex: 'createTime',
      //   valueType: 'dateRange',
      //   hideInSearch:true,
      //   render:(_,data)=>{
      //     return <p>
      //       每连续签到{data?.content?.accessGain?.signIn?.signInNum}
      //       天获得{data?.content?.accessGain?.signIn?.prizeNum}次
      //       （概率{data?.content?.accessGain?.signIn?.probability}%）
      //       </p>
      //   }   
      // },
      // {
      //   title: '订单消费',
      //   key: 'dateRange',
      //   dataIndex: 'createTime',
      //   hideInSearch:true,
      //   render:(_,data)=>{
      //     return <p>
      //       每日首次消费{data?.content?.accessGain?.orderConsume?.consumeNum}
      //       笔获得{data?.content?.accessGain?.orderConsume?.prizeNum}次
      //       （概率{data?.content?.accessGain?.orderConsume?.probability}%）
      //       </p>
      //   }   
      // },
      // {
      //   title: '每天最高中奖次数',
      //   dataIndex: 'maxPrizeNum',
      //   valueType: 'text',
      //   hideInSearch:true,
      //   render:(_,data)=>{
      //     return <p>{data?.content?.maxPrizeNum}</p>
      //   }
      // },
      {
        title: '活动状态',
        dataIndex: 'statusDisplay',
        valueType: 'text',
        hideInSearch: true,
      },
      {
        title: '操作',
        key: 'option',
        valueType: 'option',
        render:(text, record, _, action)=>[
            <a key='detail' onClick={()=>{setVisible(true);setDetailId(record.id)}}>查看详情</a>
        ],
      }, 
    ];
    const postData=(data)=>{
      return data.map(ele=>({...ele,validiteHour:ele?.content?.validiteHour}))
    }
    return (
      <PageContainer>
        <ProTable
          actionRef={ref}
          rowKey="id"
          options={false}
          request={getActiveConfigList}
          scroll={{ x: 'max-content', scrollToFirstRowOnChange: true, }}
          toolBarRender={()=>[
            <Button key='add' icon={<PlusOutlined />}  onClick={()=>setVisible(true)} type="primary">
                添加活动
            </Button>
        ]}
          postData={postData}
          search={false}
          columns={columns}
        />
         {
          visible&&<BindBoxSet
          setVisible={setVisible}
          visible={visible}
          id={detailId} 
          callback={() => { ref.current.reload(); setDetailId(null);}}
          onClose={() => { ref.current.reload(); setDetailId(null);}}
          />
        }
        </PageContainer>
    );
  };