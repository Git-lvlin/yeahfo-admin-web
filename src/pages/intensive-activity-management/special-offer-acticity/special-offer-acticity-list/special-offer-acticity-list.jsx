import React, { useState, useRef,useEffect } from 'react';
import { Button,Tabs,Image,Form,Modal,Select} from 'antd';
import ProTable from '@ant-design/pro-table';
import { PlusOutlined, MinusOutlined } from '@ant-design/icons';
import { getActiveConfigList } from '@/services/intensive-activity-management/special-offer-acticity';
import ProForm,{ ModalForm,ProFormRadio,ProFormSwitch} from '@ant-design/pro-form';
import { PageContainer } from '@/components/PageContainer';
import { history,connect } from 'umi';
import moment from 'moment'
import EndModel from './end-model'
import AddActivity from '../add-activity'
import ActivityDetail from '../activity-detail'
import ActivityData from './activity-data'


export default () => {
    const ref=useRef()
    const [visible, setVisible] = useState(false);
    const [formVisible, setFormVisible] = useState(false);
    const [detailVisible,setDetailVisible]=useState(false)
    const [dataVisible,setDatalVisible]=useState(false)
    const [pennyId,setPennyId]=useState()
    const columns= [
      {
        title: '活动编号',
        dataIndex: 'id',
        valueType: 'text',
        hideInSearch: true,
      },
      {
        title: '活动名称',
        dataIndex: 'name',
        valueType: 'text',
      },
      {
        title: '活动时段',
        dataIndex: 'startTime',
        valueType: 'text',
        render:(_,data)=>{
          return <p>{moment(data.startTime*1000).format('YYYY-MM-DD HH:mm:ss')} 至 {moment(data.endTime*1000).format('YYYY-MM-DD HH:mm:ss')}</p>
        },
        hideInSearch: true,
      },
      {
        title: 'C端可购买数量（每人/每天）',
        dataIndex: 'buyerLimit',
        valueType: 'text',
        hideInSearch: true,
        render:(_,data)=>{
          return <p>{_==999999?'不限':_}</p>
        }
      },
      {
        title: 'C端可购买时间（每天）',
        dataIndex: 'buyerStartTime',
        valueType: 'text',
        hideInSearch: true,
        render:(_,data)=>{
          return <p>{data.buyerStartTime} ~ {data.buyerEndTime}</p>
        },
      },
      {
        title: '参与活动的商品',
        dataIndex: 'goodsCount',
        valueType: 'text',
        hideInSearch: true,
      },
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
            <a key='detail' onClick={()=>{setDetailVisible(true);setPennyId(record.id)}}>详情</a>,
            <div key='editor'>
            {
              record.statusDisplay=='未开始'||record.statusDisplay=='进行中'?
              <a  onClick={()=>{setPennyId(record.id);setFormVisible(true)}}>编辑</a>:null
            }
           </div>,
            <div key='stop' style={{display:record.statusDisplay=='已结束'?'none':'block'}}>
              {
                record.status!=0&&
                <a key='detail' onClick={()=>{setPennyId(record.id);setVisible(true)}}>终止</a>
              }
            </div>,
            <a key='data' onClick={()=>{setDatalVisible(true);setPennyId(record)}}>查看数据</a>
        ],
      }, 
    ];
    const postData=(data)=>{
      const arr=data.map(ele=>({
        buyerLimit:ele.content?.buyerLimit,
        goodsCount:ele.content?.goodsCount,
        buyerStartTime:ele.content?.buyerStartTime,
        buyerEndTime:ele.content?.buyerEndTime,
        ...ele
      }))
      return arr
    }
    return (
      <PageContainer title=" ">
        <ProTable
          actionRef={ref}
          rowKey="id"
          options={false}
          params={{
            actCode:'wsCentActiveCode'
          }}
          request={getActiveConfigList}
          postData={postData}
          toolBarRender={()=>[
            <Button key='add' icon={<PlusOutlined />}  onClick={()=>setFormVisible(true)} type="primary">
                新建
            </Button>
        ]}
        search={false}
          columns={columns}
          pagination={{
            pageSize: 10,
            showQuickJumper: true,
          }}
        />
        {formVisible&& <AddActivity
          formVisible={formVisible}
          setFormVisible={setFormVisible}
          id={pennyId} 
          callback={() => { ref.current.reload(); setPennyId(null) }}
          onClose={() => { ref.current.reload(); setPennyId(null) }}
        />}
         {
          visible&&<EndModel 
          visible={visible} 
          setVisible={setVisible}  
          pennyId={pennyId} 
          canBlack={()=>{ref.current.reload();setPennyId(null)}}
          onClose={()=>{ref.current.reload();setPennyId(null)}}
          />
        }
        {detailVisible&& <ActivityDetail
          visible={detailVisible}
          setVisible={setDetailVisible}
          id={pennyId} 
          callback={() => { ref.current.reload(); setPennyId(null) }}
          onClose={() => { ref.current.reload(); setPennyId(null) }}
        />}
        {dataVisible&& <ActivityData
          visible={dataVisible}
          setVisible={setDatalVisible}
          record={pennyId} 
          callback={() => { ref.current.reload(); setPennyId(null) }}
          onClose={() => { ref.current.reload(); setPennyId(null) }}
        />}
        </PageContainer>
    );
  };