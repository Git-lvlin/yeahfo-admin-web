import { useState, useRef } from 'react';
import ProTable from '@ant-design/pro-table';
import { exportList} from '@/services/intensive-activity-management/intensive-activity-profit-detail';
import { PageContainer } from '@ant-design/pro-layout';
import moment from 'moment'
import type { ProColumns,ActionType } from '@ant-design/pro-table';
import Export from '@/pages/export-excel/export'
import ExportHistory from '@/pages/export-excel/export-history'
import ProCard from '@ant-design/pro-card';

type activityItem={
  wholesaleStartTime:number;
  spuid:number;
  skuid:number;
  goodsName:string;
  typeName:string;
  skuName:number;
  unit:string;
  portion:number;
  totalNum:number;
  wholesaleSupplyPrice:number;
  price:number;
  beforeProfit:number;
  agentCompanyCommission:number;
  profit:number;
}

const IntensiveActivityProfitDetail=(props:{type:string}) => {
    const { type }=props 
    const ref=useRef<ActionType>()
    const [visit, setVisit] = useState<boolean>(false)
    const columns:ProColumns<activityItem>[]= [
      {
        title: '日期',
        dataIndex: 'wholesaleStartTime',
        valueType: 'dateTimeRange',
        hideInTable:true
      },
      {
        title: '集约活动编号',
        dataIndex: 'wsId',
        valueType: 'text',
        hideInSearch: true,
      },
      {
        title: '集约开始时间',
        dataIndex: 'wholesaleStartTime',
        valueType: 'text',
        hideInSearch: true,
      },
      {
        title: '店主截止下单时间',
        dataIndex: 'endTimeAdvancePayment',
        valueType: 'text',
        hideInSearch: true,
      },
      {
        title: 'spuid',
        dataIndex: 'spuId',
        valueType: 'text',
        hideInSearch: true,
      },
      {
        title: 'skuid',
        dataIndex: 'skuId',
        valueType: 'text',
        hideInSearch: true,
      },
      {
        title: '商品名称',
        dataIndex: 'goodsName',
        valueType: 'text',
        hideInSearch: true,
      },
      {
        title: '分类',
        dataIndex: 'gcName',
        valueType: 'text',
        hideInSearch: true,
      },
      {
        title: '类型',
        dataIndex: 'typeName',
        valueType: 'text',
        hideInSearch: true,
      },
      {
        title: '规格/箱规',
        dataIndex: 'skuName',
        valueType: 'text',
        hideInSearch: true,
      },
      {
        title: '单位',
        dataIndex: 'unit',
        valueType: 'text',
        hideInSearch: true,
      },
      // {
      //   title: '份数',
      //   dataIndex: 'portion',
      //   valueType: 'text',
      //   hideInSearch: true,
      // },
      // {
      //   title: '总数量',
      //   dataIndex: 'totalNum',
      //   valueType: 'text',
      //   hideInSearch: true,
      // },
      {
        title: '供货价',
        dataIndex: 'wholesaleSupplyPrice',
        valueType: 'text',
        hideInSearch: true,
      },
      {
        title: '集约价',
        dataIndex: 'price',
        valueType: 'text',
        hideInSearch: true,
      },
      {
        title: '店主起订量',
        dataIndex: 'minNum',
        valueType: 'text',
        hideInSearch: true,
      },
      {
        title: '定价盈亏（元）',
        dataIndex: 'beforeProfit',
        valueType: 'text',
        hideInSearch: true,
      },
      {
        title: '运营中心提成（元）',
        dataIndex: 'agentCompanyCommission',
        valueType: 'text',
        hideInSearch: true,
      },
      {
        title: '平台净利润（元）',
        dataIndex: 'profit',
        valueType: 'text',
        hideInSearch: true,
      },
      {
        title: '集约商品库存',
        dataIndex: 'totalStockNum',
        valueType: 'text',
        hideInSearch: true,
      },
    ];
    const getFieldValue = (searchConfig) => {
        const {wholesaleStartTime,...rest}=searchConfig.form.getFieldsValue()
        return {
          ...rest,
          type:parseInt(type),
          wholesaleStartTime:{
            start:wholesaleStartTime&&moment(wholesaleStartTime[0]).format('YYYY-MM-DD HH:mm:ss'),
            end:wholesaleStartTime&&moment(wholesaleStartTime[1]).format('YYYY-MM-DD HH:mm:ss'),
          }
        }
      }
    return (
        <ProTable<activityItem>
          actionRef={ref}
          rowKey="wsId"
          options={false}
          request={exportList}
          params={{
            type:parseInt(type)
          }}
          search={{
          defaultCollapsed: false,
          labelWidth: 100,
          optionRender: (searchConfig, formProps, dom) => [
            ...dom.reverse(),
            <Export
                key='export'
                change={(e) => { setVisit(e) }}
                type={'intensive-activity-profit-detail-list-export'}
                conditions={()=>{return getFieldValue(searchConfig)}}
            />,
            <ExportHistory key='task' show={visit} setShow={setVisit} type={'intensive-activity-profit-detail-list-export'}/>
        ],
        }}
          columns={columns}
          pagination={{
            pageSize: 10,
            showQuickJumper: true,
          }}
        />
    );
  };


  export default ()=>{
    const [activeKey, setActiveKey] = useState<string>('1')
    return (
      <PageContainer title=" ">
      <ProCard
        tabs={{
          type: 'card',
          activeKey,
          onChange: setActiveKey
        }}
      >
        <ProCard.TabPane key="1" tab="生鲜商品">
          {
            activeKey == '1' && <IntensiveActivityProfitDetail type={activeKey}/>
          }
        </ProCard.TabPane>
        <ProCard.TabPane key="0" tab="非生鲜商品">
          {
            activeKey == '0' && <IntensiveActivityProfitDetail type={activeKey}/>
          }
        </ProCard.TabPane>
      </ProCard>
    </PageContainer>
    )
  }
