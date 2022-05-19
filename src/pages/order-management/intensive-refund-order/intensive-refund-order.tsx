import { useState, useRef } from 'react';
import ProTable from '@ant-design/pro-table';
import { getAuditList} from '@/services/order-management/intensive-refund-order';
import { PageContainer } from '@ant-design/pro-layout';
// import moment from 'moment'
import type { ProColumns,ActionType } from '@ant-design/pro-table';
import DrawerDetail from './detail'
// import Export from '@/pages/export-excel/export'
// import ExportHistory from '@/pages/export-excel/export-history'
import ProCard from '@ant-design/pro-card';
import { Button,Popconfirm } from 'antd';
import OpinionReason from './opinion-reason'
import { amountTransform } from '@/utils/utils'


type activityItem={
  unit: string;
  orSn: string;
  poNo: string;
  wsId: number;
  goodsName: string;
  totalNum: number;
  returnNum: number;
  createTime: string;
  imageUrl: string;
  operationRefundStatus: string;
  supplierId: number;
  supplierName: string;
  operationName: string;
  refundMoney: number;
  operationAuditStatus: number;
}

interface propertys{
  storeType:string
}

  const RefundOrderList=(props:propertys) => {
    const { storeType }=props
    const ref=useRef<ActionType>()
    const [detailVisible,setDetailVisible]=useState<boolean>(false)
    const [pennyId,setPennyId]=useState<number>()
    const [visit, setVisit] = useState<boolean>(false)
    const [visible, setVisible] = useState<boolean>(false)
    const [reasonVisible, setReasonVisible] = useState<boolean>(false)
    const [auditType,setAuditType]=useState<number>()
    const columns:ProColumns<activityItem>[]= [
      {
        title: '缺货单编号',
        dataIndex: 'orSn',
        valueType: 'text',
      },
      {
        title: '集约采购单号',
        dataIndex: 'poNo',
        valueType: 'text',
      },
      {
        title: '供应商名称',
        dataIndex: 'supplierName',
        valueType: 'text',
      },
      {
        title: '运营中心名称',
        dataIndex: 'operationName',
        valueType: 'text',
        hideInSearch: true,
      },
      {
        title: '商品名称',
        dataIndex: 'goodsName',
        valueType: 'text',
      },
      {
        title: '库存单位',
        dataIndex: 'unit',
        valueType: 'text',
        hideInSearch: true,
      },
      {
        title: '采购数量',
        dataIndex: 'totalNum',
        valueType: 'text',
        hideInSearch: true,
      },
      {
        title: '缺货数量',
        dataIndex: 'returnNum',
        valueType: 'text',
        hideInSearch: true,
      },
      {
        title: '退款金额',
        dataIndex: 'refundMoney',
        valueType: 'text',
        hideInSearch: true,
        render:(_)=>{
          return <p>{amountTransform(_,'/').toFixed(2)}</p>
        }
      },
      {
        title: '创建时间',
        dataIndex: 'dateTimeRange',
        valueType: 'dateTimeRange',
        hideInTable: true,
      },
      {
        title: '创建时间',
        dataIndex: 'createTime',
        valueType: 'text',
        hideInSearch: true,
      },
      {
        title: '审核状态',
        dataIndex: 'operationAuditStatus',
        valueType: 'select',
        hideInSearch: true,
        valueEnum:{
          1:'无需审核（运营中心没有提交）',
          2:'待审核',
          3:'审核通过',
          4:'审核拒绝'
        }
      },
      {
        title: '操作',
        key: 'option',
        valueType: 'option',
        render:(text, record:any, _, action)=>[
            <a key='detail' onClick={()=>{setDetailVisible(true);setPennyId(record.orSn)}}>详情</a>,
        ],
      }, 
    ];
    // const getFieldValue = (searchConfig) => {
    //   const {dateTimeRange,...rest}=searchConfig.form.getFieldsValue()
    //   return {
    //     createTimeBegin:dateTimeRange&&moment(dateTimeRange[0]).format('YYYY-MM-DD HH:mm:ss'),
    //     createTimeEnd:dateTimeRange&&moment(dateTimeRange[1]).format('YYYY-MM-DD HH:mm:ss'),
    //     ...rest,
    //   }
    // }
    return (
      <>
        <ProTable<activityItem>
          actionRef={ref}
          rowKey="poNo"
          options={false}
          headerTitle="数据列表"
          request={getAuditList}
          params={{
            operationAuditStatus:parseInt(storeType)
          }}
          search={{
          defaultCollapsed: false,
          labelWidth: 100,
          optionRender: (searchConfig, formProps, dom) => [
            ...dom.reverse(),
            // <Export
            //     key='export'
            //     change={(e) => { setVisit(e) }}
            //     type={'day-red-detail-export'}
            //     conditions={()=>{return getFieldValue(searchConfig)}}
            //   />,
            //   <ExportHistory key='task' show={visit} setShow={setVisit} type='day-red-detail-export'/>,
          ],
          }}
          toolBarRender={() => [
          <Popconfirm
            title=""
            icon=''
            onConfirm={()=>{setReasonVisible(true);setAuditType(1)}}
            onCancel={()=>{setReasonVisible(true);setAuditType(0)}}
            okText="同意"
            cancelText="拒绝"
            cancelButtonProps={{
              type:"primary"
            }}
          >
            {
              storeType=='1'&&<Button onClick={()=>{}} key="button" type="primary">一键审核</Button>
            }
          </Popconfirm>
          ]}
          columns={columns}
          pagination={{
            pageSize: 10,
            showQuickJumper: true,
          }}
        />
        {detailVisible&& <DrawerDetail
          visible={detailVisible}
          setVisible={setDetailVisible}
          orSn={pennyId}
          storeType={storeType} 
          callback={() => { ref.current&&ref.current.reload(); setPennyId(NaN) }}
          onClose={() => { ref.current&&ref.current.reload(); setPennyId(NaN) }}
        />}
        {reasonVisible&& <OpinionReason
          visible={reasonVisible}
          setVisible={setReasonVisible}
          type={auditType} 
          callback={() => { ref.current&&ref.current.reload(); setPennyId(NaN) }}
          onClose={() => { ref.current&&ref.current.reload(); setPennyId(NaN) }}
        />}
        </>
    );
  };



    export default ()=>{
      const [activeKey, setActiveKey] = useState<string>('2')
      return (
        <PageContainer title=" ">
        <ProCard
          tabs={{
            type: 'card',
            activeKey,
            onChange: setActiveKey
          }}
        >
          <ProCard.TabPane key="2" tab="待审核">
            {
              activeKey == '2' && <RefundOrderList storeType={activeKey} />
            }
          </ProCard.TabPane>
          <ProCard.TabPane key="3" tab="已同意">
            {
              activeKey == '3' && <RefundOrderList storeType={activeKey} />
            }
          </ProCard.TabPane>
          <ProCard.TabPane key="4" tab="已拒绝">
            {
              activeKey == '4' && <RefundOrderList storeType={activeKey} />
            }
          </ProCard.TabPane>
        </ProCard>
      </PageContainer>
      )
  } 
