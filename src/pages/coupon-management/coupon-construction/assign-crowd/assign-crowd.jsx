import React,{useEffect,useRef,useState} from 'react';
import {Form,Button,Modal,message} from 'antd';
import {connect} from 'umi';
import ProTable from '@ant-design/pro-table';
import { couponCrowdList } from '@/services/crowd-management/coupon-crowd';
import ProForm, { ProFormText, ProFormRadio, ProFormDateTimeRangePicker,ProFormTextArea,ProFormDependency } from '@ant-design/pro-form';
import SubTable from '@/pages/coupon-management/coupon-construction/coupon-subtable'
import styles from '../style.less'


const validity=(props)=>{
    let {id,DetailList,dispatch,UseScopeList,callback,type}=props
    const DetaiIssueType=DetailList.data?.issueType
    const actionRef = useRef();
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [loading,setLoading]=useState(true)
    const [CrowdIdsArr,setCrowdIdsArr]=useState([])
    const [CrowdIds,setCrowdIds]=useState('')
    const columns = [
        {
            title: '群体名称',
            dataIndex: 'name',
            valueType: 'text',
        }
    ];
    const columns2= [
        {
            title: '群体名称',
            dataIndex: 'name',
            valueType: 'text',
        },
        {
            title: '操作',
            valueType: 'text',
            render:(text, record, _, action)=>[
                <a onClick={()=>delGoods(record.id)}>删除</a>
            ]
         }
    ];
    useEffect(()=>{
       
        setTimeout(()=>{
            if(id){
                dispatch({
                    type:'UseScopeList/fetchCrowdIds',
                    payload:{
                        CrowdIds:DetailList.data&&DetailList.data?.crowdList?.id
                    }
                })
                dispatch({
                    type:'UseScopeList/fetchCrowdIdsArr',
                    payload:{
                        CrowdIdsArr:DetailList.data&&DetailList.data?.crowdList?.length==0?[]:[DetailList.data?.crowdList]
                    }
                })
            }
        },1000) 
    },[])
     // 删除商品
     const  delGoods=val=>{
        dispatch({
            type:'UseScopeList/fetchCrowdIds',
            payload:{
                CrowdIds:''
            }
        })
        dispatch({
            type:'UseScopeList/fetchCrowdIdsArr',
            payload:{
                CrowdIdsArr:[]
            }
        })
       
    }
    const showModal = () => {
        setIsModalVisible(true);
        setLoading(true)
    };
    const handleOk = () => {
        setIsModalVisible(false);
        setLoading(false)
        dispatch({
            type:'UseScopeList/fetchCrowdIds',
            payload:{
                CrowdIds
            }
        })
        dispatch({
            type:'UseScopeList/fetchCrowdIdsArr',
            payload:{
                CrowdIdsArr
            }
        })
    };
    const handleCancel = () => {
        setIsModalVisible(false);
    };
     const onIpute=(res)=>{
       setCrowdIds(res.selectedRowKeys.toString())
       setCrowdIdsArr(res.selectedRows)
       if(res.selectedRows?.length>1){
        message.error('只能选择一个商品');
       }
    }
    const options=type==2||DetaiIssueType == 2 && id?[
        {
          label: '全部用户',
          value: 1,
        },
        {
          label: '指定群体用户',
          value: 2,
        },
        {
          label: '新用户（未下过订单的用户）',
          value: 4,
        },
        {
          label: '全部社区店主',
          value: 5,
        },
      ]:[
        {
          label: '全部用户',
          value: 1,
        },
        {
          label: '指定群体用户',
          value: 2,
        },
        {
          label: '新用户（未下过订单的用户）',
          value: 4,
        }
      ]
    const options2=[
    {
        label: '全部用户',
        value: 1,
    }
    ]
    return (
        <>
         <ProFormRadio.Group
          name="memberType"
          label={type == 2||DetaiIssueType == 2 && id ? '发红包群体':'可领红包群体'}
          rules={[{ required: true, message: '请选择群体' }]}
          options={type==3||DetaiIssueType == 3 && id||type==4||DetaiIssueType == 4 && id ?options2:options}
          fieldProps={{
            onChange:(current)=>callback(current.target.value)
          }}
        />
        <ProFormDependency name={['memberType']}>
            {({ memberType }) => {
                if(!memberType||memberType==1||memberType==4) return null
                if(memberType==2){
                    return <div className={styles.unfold}>
                            <Button type="primary" style={{margin:"0 0 20px 20px"}} onClick={showModal}>
                                选择群体
                            </Button>
                            <Modal key="id" width={1200}  visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
                                <ProTable
                                    rowKey="id"
                                    options={false}
                                    hideAll={true}
                                    style={{display:loading?'block':'none'}}
                                    request={couponCrowdList}
                                    actionRef={actionRef}
                                    expandable={{ expandedRowRender: (_) => <SubTable name={_?.name}/> }}
                                    search={{
                                        defaultCollapsed: true,
                                        labelWidth: 100,
                                        optionRender: (searchConfig, formProps, dom) => [
                                            ...dom.reverse(),
                                        ],
                                    }}
                                    columns={columns}
                                    rowSelection={{}}
                                    tableAlertOptionRender={onIpute}
                                />
                            </Modal>
                            <ProTable
                                toolBarRender={false}
                                expandable={{ expandedRowRender: (_) => <SubTable name={_?.name}/> }}
                                search={false}
                                rowKey="spuId"
                                columns={columns2}
                                dataSource={UseScopeList?.UseScopeObje?.CrowdIdsArr}
                                style={{display:isModalVisible?'none':'block'}}
                            />
                        </div>
                }
            }}
         </ProFormDependency>
        </>
    )
}
export default connect(({ UseScopeList,DetailList}) => ({
    UseScopeList,
    DetailList,
  }))(validity);