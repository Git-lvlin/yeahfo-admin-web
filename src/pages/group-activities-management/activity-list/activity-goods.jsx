import React, { useState, useRef } from 'react'
import ProTable from '@ant-design/pro-table'
import { PageContainer } from '@ant-design/pro-layout'
import { ruleGoodsList, ruleStatInfo, ruleGoodsSortTop } from '@/services/single-contract-activity-management/activity-product'
import { Drawer, Space } from 'antd'
import { dateFormat, amountTransform } from '@/utils/utils'
import ProductDetailDrawer from '@/components/product-detail-drawer'
import EditStock from './edit-stock'
import GroupDetail from './group-detail'

const TableList = ({onClose, visible, id}) => {

  const [info, setInfo] = useState({})
  const [productDetailDrawerVisible, setProductDetailDrawerVisible] = useState(false)
  const [editStockVisible, setEditStockVisible] = useState(false)
  const [spuId, setSpuId] = useState(0)
  const [stockData, setStockData] = useState(null)
  const [groupDetailVisible, setGroupDetailVisible] = useState(false)
  const [groupState, setGroupState] = useState(1)

  const actionRef = useRef() 
  
  const toTop = (ruleGoodsId, actionRef) => {
    ruleGoodsSortTop({ruleGoodsId},{ showSuccess: true }).then(res=> {
      if(res.code === 0) {
        actionRef.current?.reload()
      }
    })
  }

  const statInfo = [
    {
      title: '活动商品SKU',
      dataIndex: 'activitySkuNum',
      align: 'center'
    },
    {
      title: '活动商品总库存',
      dataIndex: 'activitySkuStockNum',
      align: 'center'
    },
    {
      title: '已拼商品SKU',
      dataIndex: 'activitySkuSuc',
      align: 'center'
    },
    {
      title: '已拼商品件数',
      dataIndex: 'activitySkuSucNum',
      align: 'center'
    },
    {
      title: '拼团转化率',
      dataIndex: 'groupIngRate',
      align: 'center',
      render: (_) => `${_}%`
    },
    {
      title: '开团总数',
      dataIndex: 'totalGroupNum',
      align: 'center'
    }, {
      title: '成团数量',
      dataIndex: 'successGroupNum',
      align: 'center'
    },

     {
      title: '成团转化率',
      dataIndex: 'groupSucRate',
      align: 'center',
      render: (_) => `${_}%`
    },
  ]

  const columns = [
    {
      title: 'spuID',
      dataIndex: 'spuId',
      valueType: 'text',
      fieldProps: {
        placeholder: '请输入spuID'
      }
    },
    {
      title: 'skuID',
      dataIndex: 'skuId',
      valueType: 'text',
      fieldProps: {
        placeholder: '请输入skuID'
      }
    },
    {
      title: '商品名称',
      dataIndex: 'goodsName',
      valueType: 'text',
      width: '15%',
      render: (_, r)=> <a onClick={()=> {setProductDetailDrawerVisible(true); setSpuId(r.spuId)}}>{_}</a>
    },
    {
      title: '规格',
      dataIndex: 'skuName',
      valueType: 'text',
      hideInSearch: true,
    },
    {
      title: '供应商ID',
      dataIndex: 'supplierId',
      valueType: 'text',
      hideInSearch: true,
    },
    {
      title: '秒约价（元）',
      dataIndex: 'salePrice',
      valueType: 'text',
      hideInSearch: true,
      render: (_) => amountTransform(_, '/')
    },
    {
      title: '拼团价（元）',
      dataIndex: 'activityPrice',
      valueType: 'text',
      hideInSearch: true,
      render: (_) => amountTransform(_, '/')
    },
    {
      title: '成团人数',
      dataIndex: 'defaultGroupNum',
      hideInSearch: true,
    },
    {
      title: '拼团库存',
      dataIndex: 'activityStockNum',
      valueType: 'text',
      hideInSearch: true,
    },
    {
      title: '已拼数量',
      dataIndex: 'skuGroupNum',
      valueType: 'text',
      hideInSearch: true
    },
    {
      title: '拼团中团数',
      dataIndex: 'groupIngNum',
      valueType: 'text',
      hideInSearch: true,
      render: (_, record) => {
        if(_ > 0) {
          return <a onClick={()=>{setGroupDetailVisible(true); setStockData(record); setGroupState(2)}}>{_}</a>
        } else {
          return <span>{_}</span>
        }
      }
    },
    {
      title: '成功团数',
      dataIndex: 'groupSucNum',
      valueType: 'text',
      hideInSearch: true,
      render: (_, record) => {
        if(_ > 0) {
          return <a onClick={()=>{setGroupDetailVisible(true); setStockData(record); setGroupState(1)}}>{_}</a>
        } else {
          return <span>{_}</span>
        }
      }
    },
    {
      title: '失败团数',
      dataIndex: 'groupFailNum',
      valueType: 'text',
      hideInSearch: true,
      render: (_, record) => {
        if(_ > 0) {
          return <a onClick={()=>{setGroupDetailVisible(true); setStockData(record); setGroupState(3)}}>{_}</a>
        } else {
          return <span>{_}</span>
        }
      }
    },
    {
      title: '操作',
      valueType: 'option',
      render: (_, record)=> [
        <a key="1" onClick={()=> {toTop(record.ruleGoodsId, actionRef)}}>置顶</a>,
        <a key="2" onClick={() => {setEditStockVisible(true); setStockData(record)}}>编辑库存</a>
      ],
      fixed: 'right',
      hideInTable: info.activityStatus === 3 || info.activityStatus === 4
    }
  ]

  return (
    <Drawer
      title={false}
      onClose={onClose} 
      visible={visible}
      width={1200}
    >
      <div style={{ marginBottom: 10, background: '#fff', padding: 10 }}>
        <Space size="middle">
          <span>{info.activityName}</span>
          <span>{info.activityStartTime}~{info.activityEndTime}</span>
          {info.virtualType === 2 && <span>虚拟成团</span>}
          <span>{{
            1: '待开始',
            2: '进行中',
            3: '已结束',
            4: '已终止'
          }[info.activityStatus]}</span>
        </Space>
      </div>
      <ProTable
        rowKey="activitySkuNum"
        options={false}
        search={false}
        pagination={false}
        postData={(data)=> [data]}
        bordered
        request={ruleStatInfo}
        params={{id}}
        columns={statInfo}
        actionRef={actionRef}
      />
      <ProTable
        rowKey="skuId"
        options={false}
        params={{ id }}
        postData={(data) => {
          setInfo({
            activityName: data.activityName,
            activityStartTime: dateFormat(data.activityStartTime * 1000),
            activityEndTime: dateFormat(data.activityEndTime * 1000),
            groupNum: data.groupNum,
            virtualType: data.virtualType,
            activityStatus: data.activityStatus,
          });
          return data.goodsList.records;
        }}
        request={ruleGoodsList}
        search={{
          defaultCollapsed: false,
          labelWidth: 100,
          optionRender: (searchConfig, formProps, dom) => [
            ...dom.reverse(),
          ],
        }}
        actionRef={actionRef}
        columns={columns}
        pagination={{
          pageSize: 10,
        }}
        scroll={{x: 'max-content'}}
      />
      {
        productDetailDrawerVisible&&
        <ProductDetailDrawer
          visible={productDetailDrawerVisible}
          setVisible={setProductDetailDrawerVisible}
          spuId={spuId}
        />
      }
      {
        editStockVisible&&
        <EditStock
          visible={editStockVisible}
          onClose={setEditStockVisible}
          data={stockData}
          callback={() => { actionRef.current?.reload() }}
          id={id}
        />
      }
      {
        groupDetailVisible&&
        <GroupDetail
          visible={groupDetailVisible}
          onClose={()=>setGroupDetailVisible(false)}
          data={stockData}
          id={id}
          groupState={groupState}
          info={info}
        />
      }
    </Drawer>

  );
};

export default TableList
