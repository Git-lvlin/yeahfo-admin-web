import { useState, useRef, useEffect } from 'react';
import ProTable from '@ant-design/pro-table';
import { feedbackList,selAllVersion} from '@/services/user-management/user-feedback';
import { PageContainer } from '@ant-design/pro-layout';
import { Image,Space } from 'antd';
import DetailModel from './detail-model'
import type { ProColumns,ActionType } from '@ant-design/pro-table';

type activityItem={
  createName:string;
  createIcon:string;
  mobile:number;
  parentType:string;
  content:string;
  model:string;
  system:string;
  status:number;
}

// interface ItemProps {
//   createName:string;
//   createIcon:string;
// }

export default () => {
    const ref=useRef<ActionType>()
    const [visible, setVisible] = useState<boolean>(false);
    const [detailId,setDetailId]=useState<number>()
    const [onselect,setOnselect]=useState<{}>([])
    useEffect(()=>{
      selAllVersion({})?.then(res=>{
        if(res.code==0){
          const obj={}
          res.data.map((ele:any,index:number)=>{
            if(ele.name!=='0.0.0'){
              obj[ele.name]=`V${ele.name}`
            }
          })
          setOnselect(obj)
        }
      })
    },[])
    const columns:ProColumns<activityItem>[]= [
      {
        title: '反馈用户',
        dataIndex: 'createName',
        valueType: 'text',
        render:(_,data)=>{
          return <Space style={{display:'flex'}}>
                  <Image src={data?.createIcon} height={50} width={50} />
                  <p>{_}</p>
                </Space>
        },
        hideInSearch: true
      },
      {
        title: '手机号',
        dataIndex: 'mobile',
        valueType: 'text',
        hideInTable: true,
        fieldProps:{
          placeholder: '输入手机号'
        }
      },
      {
        title: '联系手机',
        dataIndex: 'mobile',
        valueType: 'text',
        hideInSearch: true,
      },
      {
        title: '类型',
        dataIndex: 'parentType',
        valueType: 'text',
        valueEnum: {
          '': '全部类型',
          '功能异常': '功能异常',
          '客户投诉': '客户投诉',
          '使用建议': '使用建议'
        },
        hideInTable: true,
      },
      {
        title: '类型',
        dataIndex: 'parentType',
        valueType: 'text',
        hideInSearch: true,
        render:(_,data)=>{
          return <>
            <p>{_}</p>
            <p style={{color:'red'}}>[{data['type']}]</p>
          </>
        }
      },
      {
        title: '内容',
        dataIndex: 'content',
        valueType: 'text',
        hideInTable: true,
        fieldProps:{
          placeholder: '输入关键字'
        }
      },
      {
        title: '反馈内容',
        dataIndex: 'content',
        valueType: 'text',
        hideInSearch: true,
        ellipsis:true
      },
      {
        title: '系统',
        dataIndex: 'platform',
        valueType: 'select',
        valueEnum: {
          '': '所有系统',
          'IOS': 'IOS',
          'ANDROID': '安卓',
        },
        hideInTable: true,
      },
      {
        title: '系统和型号',
        dataIndex: 'system',
        valueType: 'text',
        hideInSearch: true,
        render:(_,data)=>{
          return <>
            <p>{_}</p>
            <p>{data.model}</p>
          </>
        }
      },
      {
        title: 'APP版本',
        dataIndex: 'version',
        valueType: 'text',
        hideInSearch: true,
        render:(_)=>{
          return <p>V{_}</p>
        }
      },
      {
        title: 'APP版本',
        dataIndex: 'version',
        valueType: 'select',
        valueEnum: onselect,
        hideInTable: true,
      },
      {
        title: ' 状态',
        dataIndex: 'status',
        valueType: 'select',
        valueEnum: {
          '': '全部状态',
          0: '进行中',
          1: '已处理',
        },
        hideInTable: true,
      },
      {
        title: ' 状态',
        dataIndex: 'status',
        valueType: 'text',
        hideInSearch: true,
        render:(_)=>{
           if(_==0){
             return <p style={{color:'red'}}>进行中</p>
           }else if(_==1){
             return <p style={{color:'#999999'}}>已处理</p>
           }
        }
      },
      {
        title: '操作',
        key: 'option',
        valueType: 'option',
        render:(text, record:any, _, action)=>[
            <a key='detail' onClick={()=>{setVisible(true);setDetailId(record.id)}}>查看详情</a>,
        ],
      }, 
    ];
    return (
      <PageContainer>
        <ProTable<activityItem>
          actionRef={ref}
          rowKey="id"
          options={false}
          request={feedbackList}
          search={{
          defaultCollapsed: false,
          labelWidth: 100,
          optionRender: (searchConfig, formProps, dom) => [
           ...dom.reverse(),
          ],
          }}
          columns={columns}
          pagination={{
            pageSize: 10,
            showQuickJumper: true,
          }}
        />
        {
          visible&&<DetailModel
          visible={visible} 
          setVisible={setVisible}  
          detailId={detailId} 
          canBlack={()=>{ref.current&&ref.current.reload();setDetailId(NaN)}}
          onClose={()=>{ref.current&&ref.current.reload();setDetailId(NaN)}}
          />
        }
        </PageContainer>
    );
  };