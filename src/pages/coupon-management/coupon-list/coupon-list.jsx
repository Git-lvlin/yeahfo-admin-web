import React, { useState, useRef } from 'react';
import { Button,Tabs} from 'antd';
import ProTable from '@ant-design/pro-table';
import { ModalForm,ProFormRadio} from '@ant-design/pro-form';
import { PageContainer } from '@/components/PageContainer';
import XLSX from 'xlsx'
import { couponList } from '@/services/coupon-management/coupon-list';
import { couponDelSub,couponStatusSub } from '@/services/coupon-management/coupon-delsub';
import DeleteModal from '@/components/DeleteModal'
import EndModel from './end-model'
import TurnDownModel from './turn-down-model'
import styles from './style.less'
import { history,connect } from 'umi';
import Export from '@/pages/export-excel/export'
import ExportHistory from '@/pages/export-excel/export-history'
import CouponConstruction from '../coupon-construction'
import ListDetails from '../list-details'
import CouponCodebase from '../coupon-codebase'
const { TabPane } = Tabs


const Message = (props) => {
  const {type,dispatch}=props
  const [turnId,setTurnId]=useState()
  const [turnVisible, setTurnVisible] = useState(false);
  const [visit, setVisit] = useState(false)
  const [visible, setVisible] = useState(false);
  const [addType,setAddType]=useState()
  const [pennyId,setPennyId]=useState()
  const [formVisible, setFormVisible] = useState(false);
  const [detailsVisible, setDetailVisible] = useState(false);
  const [codeVisible, setCodeVisible] = useState(false);
  const ref=useRef()
  const columns= [
    {
      title: '红包名称',
      dataIndex: 'couponName',
      valueType: 'text',
      fieldProps: {
        placeholder: '请输入红包名称'
      },
    },
    {
      title: '红包类型',
      dataIndex: 'couponType',
      valueType: 'select',
      valueEnum: {
        1: '满减红包',
        2: '折扣红包',
        3: '立减红包'
      }
    },
    {
      title: '面值',
      dataIndex: 'couponAmountDisplay',
      hideInSearch: true,
      render:(_,data)=>{
        return <p>{!isNaN(_)?Number(_).toFixed(2):_}</p>
      }
    },
    {
      title: '发行方式',
      dataIndex: 'issueType',
      valueEnum: {
        1: '会员领取红包',
        2: '系统发放红包',
        3: '每日红包',
        4: '邀请好友红包'
      },
    },
    {
      title: '发行总金额（元）',
      dataIndex: 'issueAmount',
      valueType:'text',
      hideInSearch: true,
      render:(_,data)=>{
        return <p>{!isNaN(_)?Number(_).toFixed(2):_}</p>
      }
    },
    {
      title: '发行总数量（张）',
      dataIndex: 'issueQuantity',
      valueType: 'text',
      hideInSearch: true,
      render:(_, data)=>{
        return <p>{data.issueQuantity==-1?'不限量':data.issueQuantity}</p>
      }
    },
    {
      title: '可领取时间',
      dataIndex: 'dateRange',
      valueType: 'text',
      render:(_, data)=>{
        return <p>{data.limitStartTime} 至 {data.limitEndTime}</p>
      },
      hideInSearch: true,
      ellipsis:true
    },
    {
      title: '有效期',
      dataIndex: 'activityTimeDisplay',
      valueType: 'text',
      hideInSearch: true,
      ellipsis:true
    },
    {
      title: '审核状态',
      dataIndex: 'couponVerifyStatus',
      valueType: 'text',
      render: (_, data)=>{
        if(data.couponVerifyStatus==1){
          return <p>待提交</p>
        }else if(data.couponVerifyStatus==2){
          return <>
            <p>审核驳回</p>
            <a onClick={()=>{setTurnId(data.id);setTurnVisible(true)}}>驳回详情</a>
          </>
        }else if(data.couponVerifyStatus==3){
          return <p>审核中</p>
        }else if(data.couponVerifyStatus==4){
          return <p>已通过</p>
        }
      },
      hideInSearch:true
    },
    {
      title: '红包状态',
      dataIndex: 'couponStatus',
      valueType: 'select',
      valueEnum: {
        1: '未开始',
        2: '进行中',
        3: '已结束',
        4: '已终止'
      },
      hideInSearch:type!=4,
      hideInTable:type!=4
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      valueType: 'text',
      hideInSearch: true,
    },
    {
      title: '操作',
      key: 'option',
      valueType: 'option',
      width:200,
      render: (_, data) => [
      <a key="edit" onClick={()=>{ Examine(data.id) }}>
        {
          type==1?
          '编辑'
          :null
        }
      </a>,
      <DeleteModal
        key='dele'
        record={data} 
        boxref={ref} 
        label1={'删除'}
        text={'确定要删除所选红包吗？'} 
        InterFace={couponDelSub}
        blok={type}
        title={'操作确认'}
      />,
      <a key="detail" onClick={()=>{ look(data.id)}}>
        {
          type==3||type==4?
          '查看'
          :null
        } 
      </a>,
       <DeleteModal
        key='withdraw'
        record={data}
        label2={'撤回'}
        status={1}
        boxref={ref} 
        text={'确定要撤回吗？'} 
        InterFace={couponStatusSub}
        blok={type}
        title={'操作确认'}
      />,
      <EndModel key='end' type={type} boxref={ref} data={data}/>,
      <a key="code" onClick={()=>CodeLibrary(data.id)}>
        {
           type==4?
           '码库'
           :null
        }
      </a>
      ],
    },
    
  ];
 
  //编辑
  const Examine=(id)=>{
    setPennyId(id)
    setFormVisible(true)
    dispatch({
      type:'DetailList/fetchLookDetail',
      payload:{id:id}
    })
  }
  //查看
  const look=(id)=>{
    setPennyId(id)
    setDetailVisible(true)
  }
 
  // 跳转到码库
  const CodeLibrary=(id)=>{
    setPennyId(id)
    setCodeVisible(true)
  }

  const getFieldValue = (searchConfig) => {
    const {...rest}=searchConfig.form.getFieldsValue()
    return {
      ...rest,
    }
  }

return(
  <>
    <ModalForm
      title="新建红包"
      onVisibleChange={setVisible}
      visible={visible}
      trigger={ <Button
        key="primary"
        type="primary"
        className={styles.addCouponBtn}
        onClick={() =>{
          setVisible(true)
        }}
      >
        新建红包
      </Button>}
      submitter={{
      render: (props, defaultDoms) => {
          return [
          ...defaultDoms
          ];
      },
      }}
      onFinish={async (values) => {
        setAddType(values.activityTimeType)
        setFormVisible(true)
        setVisible(false)
      }}  
    >
      <ProFormRadio.Group
        name="activityTimeType"
        options={[
          {
            label: '会员领取红包',
            value: 1,
          },
          {
            label: '系统发放红包',
            value: 2,
          },
          {
            label: '每日红包',
            value: 3,
          },
          {
            label: '邀请好友红包',
            value: 4,
          },
          // {
          //   label: '生鲜板块新人红包',
          //   value: 5,
          // }
        ]}
      />
    </ModalForm>
    <ProTable
      actionRef={ref}
      rowKey="id"
      options={false}
      params={{
        couponVerifyStatus: type,
      }}
      scroll={{ x: 'max-content', scrollToFirstRowOnChange: true, }}
      request={couponList}
      search={{
        defaultCollapsed: true,
        labelWidth: 100,
        optionRender: (searchConfig, formProps, dom) => [
          ...dom.reverse(),
        <Button  onClick={()=>{ref.current.reload()}} key="refresh">
          刷新
        </Button>,
        <Export
          key='export'
          change={(e) => { setVisit(e) }}
          type={'red-packet-list-export'}
          conditions={()=>{return getFieldValue(searchConfig)}}
        />,
        <ExportHistory key='task' show={visit} setShow={setVisit} type='red-packet-list-export'/>,
        ],
      }}
      columns={columns}
    />
    {
      turnVisible&&<TurnDownModel 
      turnVisible={turnVisible} 
      setTurnVisible={setTurnVisible} 
      id={turnId}
    />
    }
    {formVisible&& <CouponConstruction
      formVisible={formVisible}
      setFormVisible={setFormVisible}
      id={pennyId} 
      callback={() => { ref.current.reload(); setPennyId(null);setVisible(false);setAddType(null) }}
      onClose={() => { ref.current.reload(); setPennyId(null);setVisible(false);setAddType(null) }}
      type={addType}
    />}
    {detailsVisible&& <ListDetails
      detailsVisible={detailsVisible}
      setDetailVisible={setDetailVisible}
      id={pennyId} 
      callback={() => { ref.current.reload(); setPennyId(null);}}
      onClose={() => { ref.current.reload(); setPennyId(null);}}
    />}
    {codeVisible&& <CouponCodebase
      codeVisible={codeVisible}
      setCodeVisible={setCodeVisible}
      id={pennyId} 
      callback={() => { ref.current.reload(); setPennyId(null);}}
      onClose={() => { ref.current.reload(); setPennyId(null);}}
    />}
  </>
  );
};

const TableList= (props) =>{
  const { dispatch }=props
  const [seleType,setSeleType]=useState(1)
  return (
      <PageContainer>
        <Tabs
          centered
          defaultActiveKey="1"
          className={styles.cuoponTabs}
          onChange={(val)=>{
            setSeleType(val)
          }}
        >
          <TabPane tab="待提交" key="1">
            {
              seleType==1&&<Message type={1} dispatch={dispatch}/>
            }
          </TabPane>
          <TabPane tab="审核中" key="3">
            {
              seleType==3&&<Message type={3} dispatch={dispatch}/>
            }
          </TabPane>
          <TabPane tab="已通过" key="4">
            { 
              seleType==4&&<Message type={4} dispatch={dispatch}/>
            }
          </TabPane>
        </Tabs>
      </PageContainer>
  )
}

export default connect(({ DetailList}) => ({
  DetailList
}))(TableList);
