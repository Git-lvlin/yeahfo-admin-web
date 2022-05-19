import { PageContainer } from '@/components/PageContainer';
import ProTable from '@ant-design/pro-table'
import React, { useRef,useState } from 'react'
import { Button } from 'antd'
import moment from 'moment'
import { history } from 'umi'
import { amountTransform } from '@/utils/utils'
import { getRefundStoreOrderList } from '@/services/order-management/intensive-after-sale-orders'
import './styles.less'
import DrawerDetail from './detail'
import Export from '@/pages/export-excel/export'
import ExportHistory from '@/pages/export-excel/export-history'


const afterSalesOrder = () => {
  const actionRef = useRef()
  const [visible, setVisible] = useState(false)
  const [id, setId] = useState()
  const [visit, setVisit] = useState(false)
  const columns = [
    {
      title: '售后编号',
      dataIndex: 'trSn',
      align: 'center',
    },
    {
      title: '缺货单编号',
      dataIndex: 'orSn',
      align: 'center',
    },
    {
      title: '订单编号',
      dataIndex: 'orderId',
      align: 'center',
    },
    {
      title: '商家ID',
      dataIndex: 'supplierId',
      align: 'center',
      hideInSearch: true
    },
    {
      title: '商家名称',
      dataIndex: 'supplierName',
      align: 'center',
      hideInSearch: true
    },
    {
      title: '商家手机号',
      dataIndex: 'buyerNickname',
      align: 'center',
      render:(_,data)=>{
        return <p>-</p>
      },
      hideInSearch: true
    },
    {
      title: '买家',
      dataIndex: 'storeName',
      align: 'center',
      hideInSearch: true
    },
    {
      title: '买家手机号',
      dataIndex: 'memberPhone',
      align: 'center',
      hideInSearch: true
    },
    {
      title: '售后类型',
      dataIndex: 'refundType',
      align: 'center',
      order: 7,
      valueType: 'select',
      render:(_,data)=>{
        return <p>-</p>
      },
      hideInSearch: true
    },
    {
      title: '退款金额（元）',
      dataIndex: 'refundMoney',
      align: 'center',
      hideInSearch: true,
      render: (_) => amountTransform(_, '/').toFixed(2),
      hideInSearch: true
    },
    {
      title: '申请时间',
      dataIndex: 'createTime',
      valueType: 'text',
      align: 'center',
      hideInSearch: true
    },
    {
      title: '退款状态',
      dataIndex: 'status',
      align: 'center',
      order: 6,
      valueType: 'select',
      valueEnum: {
        1: '待退款',
        2: '退款中',
        3: '退款完成',
        4: '退款失败',
        6: '已取消',
      },
      hideInSearch: true
    },
    {
      title: '备注',
      dataIndex: 'refundMessage',
      valueType: 'text',
      align: 'center',
      hideInSearch: true
    },
    {
      title: '操作',
      dataIndex: 'operation',
      valueType: 'option',
      align: 'center',
      render: (_, record) => <a onClick={ () => {setVisible(true); setId(record.trSn)} }>查看详情</a>
    }
  ]
  const getFieldValue = (searchConfig) => {
    const {...rest}=searchConfig.form.getFieldsValue()
    return {
      ...rest,
    }
  }
  return (
    <PageContainer title={false}>
      <ProTable
        rowKey="refundId"
        options={false}
        params={{}}
        request={getRefundStoreOrderList}
        actionRef={actionRef}
        search={{
          optionRender: (searchConfig, formProps, dom) => [
            ...dom.reverse(),
            <Export
              key='export'
              change={(e) => { setVisit(e) }}
              type={'intensive_after_sales_order_export'}
              conditions={()=>{return getFieldValue(searchConfig)}}
            />,
            <ExportHistory key='task' show={visit} setShow={setVisit} type={'intensive_after_sales_order_export'}/>
          ]
        }}
        headerTitle="数据列表"
        columns={columns}
        pagination={{
          showQuickJumper: true,
          hideOnSinglePage: true,
          pageSize: 10
        }}
      />
       {visible&&<DrawerDetail
          visible={visible}
          setVisible={setVisible}
          id={id}
        />
      }
    </PageContainer>
  )
}

export default afterSalesOrder
