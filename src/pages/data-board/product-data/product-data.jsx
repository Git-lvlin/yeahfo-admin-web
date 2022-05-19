import React, { useState, useEffect, useRef } from 'react'
import { PageContainer } from '@/components/PageContainer';
import ProTable from '@ant-design/pro-table'
import ProCard from '@ant-design/pro-card'
import moment from 'moment'
import { QuestionCircleOutlined } from '@ant-design/icons'
import { Space, Tooltip } from 'antd'

import PieChart from './pie-chart'
import TableSearch from './table-search'
import { getTimeDistance } from '@/utils/utils'
import styles from './styles.less'
import GcCascader from '@/components/gc-cascader'
import { timeGoodType, goodDetail, goodsRateData, bJoinRate } from '@/services/data-board/product-data'
import { amountTransform } from '@/utils/utils'
import Export from '@/pages/export-excel/export'
import ExportHistory from '@/pages/export-excel/export-history'

const ProductData = () => {
  const [rangePickerValue, setRangePickerValue] = useState(getTimeDistance('yesterday'))
  const [goodsData, setGoodsData] = useState([])
  const [pieData, setPieData] = useState([])
  const [orderType, setOrderType] = useState("1")
  const [loading, setLoading] = useState(false)
  const [visit, setVisit] = useState(false)
  const [value, setValue] = useState('1')
  const [state, setState] = useState(0)
  const [shopkeeper, setShopkeeper] = useState(0)
  const [ratio, setRatio] = useState('0')
  const [goodsTotal, setGoodsTotal] = useState(0)
  const form = useRef()

  const type = form.current?.getFieldsValue().orderType === '15'?'data-board-goods-detail-bc-export': 'data-board-goods-detail-c-export'

  useEffect(()=> {
    setLoading(true)
    timeGoodType({
      startTime: moment(rangePickerValue?.[0]).format("YYYY-MM-DD"),
      endTime: moment(rangePickerValue?.[1]).format("YYYY-MM-DD"),
      orderType
    }).then(res=> {
      setGoodsData(res?.data?.detailList)
    }).finally(()=> {
      setLoading(false)
    })
    return ()=> {
      setGoodsData([])
    }
  }, [rangePickerValue, orderType])

  useEffect(() => {
    goodsRateData({
      startTime: moment(rangePickerValue?.[0]).format("YYYY-MM-DD"),
      endTime: moment(rangePickerValue?.[1]).format("YYYY-MM-DD"),
      type: value,
      orderType
    }).then(res=>{
      setPieData(res?.data)
    })
    return () => {
      setPieData([])
    }
  }, [value, orderType, rangePickerValue])

  useEffect(()=>{
    const { date, gcId, ...rest } = form.current.getFieldsValue()
    bJoinRate({
      startTime: date?.[0].format("YYYY-MM-DD"),
      endTime: date?.[1].format("YYYY-MM-DD"),
      gcId1: gcId?.[0],
      gcId2: gcId?.[1],
      ...rest
    }).then(res=>{
      setShopkeeper(res?.data?.count?.sumbPayNum || 0)
      setRatio(res?.data?.count?.allRatio || '0%')
    })
  }, [form?.current?.getFieldsValue()])

  const isActive = (type) => {
    if (!rangePickerValue) {
      return ''
    }

    const value = getTimeDistance(type)

    if (!value) {
      return ''
    }

    if (!rangePickerValue[0] || !rangePickerValue[1]) {
      return ''
    }

    if (
      rangePickerValue[0].isSame(value[0], 'day') &&
      rangePickerValue[1].isSame(value[1], 'day')
    ) {
      return styles.currentDate
    }

    return ''
  }

  const handleRangePickerChange = (value) => {
    setRangePickerValue(value)
  }

  const selectDate = (type) => {
    setRangePickerValue(getTimeDistance(type))
  }

  const goodsCategory = [
    {
      title: '分类名称',
      dataIndex: 'gcName',
      align: 'center'
    },
    {
      title: 'SPU数量',
      dataIndex: 'spuCount',
      align: 'center'
    },
    {
      title: 'SKU数量',
      dataIndex: 'skuCount',
      align: 'center'
    },
    {
      title: '各品类SKU占比',
      dataIndex: 'skuRate',
      align: 'center'
    },
    {
      title: '成交SKU数',
      dataIndex: 'paySkuCount',
      align: 'center'
    },
    {
      title: '成交SKU占比',
      dataIndex: 'paySkuRatio',
      align: 'center'
    },
    {
      title: ()=> (
        <Space>
          <span>商品销售额</span>
          <Tooltip title="当前分类下的商品，已支付商品金额总和">
            <QuestionCircleOutlined/>
          </Tooltip>
        </Space>
      ),
      dataIndex: 'payAmount',
      align: 'center',
      hideInTable: orderType === '15',
      render: (_) => amountTransform(Number(_), '/')
    },
    {
      title: ()=> (
        <Space>
          <span>商品销售额</span>
          <Tooltip title="当前分类下的商品，已支付商品金额总和">
            <QuestionCircleOutlined/>
          </Tooltip>
        </Space>
      ),
      align: 'center',
      hideInTable: orderType !== '15',
      children: [
        {
          title: 'B端销售额',
          dataIndex: 'bPayAmount',
          align: 'center',
          render: (_) => amountTransform(Number(_), '/')
        },
        {
          title: 'C端销售额',
          dataIndex: 'cPayAmount',
          align: 'center',
          render: (_) => amountTransform(Number(_), '/')
        }
      ]
    },
    {
      title: '各品类销售额占比',
      align: 'center',
      dataIndex: 'bPayRate',
      hideInTable: orderType !== '15'
    },
    {
      title: '退款商品金额',
      dataIndex: 'refundAmount',
      render: (_) => amountTransform(Number(_), '/'),
      align: 'center'
    },
    {
      title: '退款率',
      dataIndex: 'refundRate',
      align: 'center'
    }
  ]

  const goodsDetail = [
    {
      title: 'id',
      dataIndex: 'id',
      hideInSearch: true,
      hideInTable: true
    },
    {
      title: '商品编码',
      dataIndex: 'spuId',
      align: 'center',
      hideInSearch: true
    },
    {
      title: '商品编码',
      dataIndex: 'spuId',
      align: 'center',
      valueType: 'digit',
      hideInTable: true
    },
    {
      title: '商品名称',
      dataIndex: 'goodsName',
      align: 'center',
      width: '15%'
    },
    {
      title: ()=>(
        <Space>
          <span>复购率（重复购买的用户数占总购买人数）</span>
          <Tooltip title="当前商品有没有人重复购买复购率=重复下单的人数/下单的总人数">
            <QuestionCircleOutlined/>
          </Tooltip>
        </Space>
      ),
      dataIndex: 'exportRepeatRatio',
      align: 'center',
      hideInTable: form.current?.getFieldsValue().orderType === "15",
      hideInSearch: true
    },
    {
      title: '购买用户数',
      dataIndex: 'payMemberNum',
      align: 'center',
      hideInTable: form.current?.getFieldsValue().orderType === "15",
      hideInSearch: true
    },
    {
      title: '支付订单数',
      dataIndex: 'payNum',
      align: 'center',
      hideInTable: form.current?.getFieldsValue().orderType === "15",
      hideInSearch: true
    },
    {
      title: '销售量',
      dataIndex: 'goodsSumNum',
      align: 'center',
      hideInTable: form.current?.getFieldsValue().orderType === "15",
      hideInSearch: true
    },
    {
      title: '销售额',
      dataIndex: 'exportPayAmount',
      align: 'center',
      hideInSearch: true,
      hideInTable: form.current?.getFieldsValue().orderType === "15",
    },
    {
      title: '商品退款总金额',
      dataIndex: 'exportRefundAmount',
      align: 'center',
      hideInSearch: true,
      hideInTable: form.current?.getFieldsValue().orderType === "15",
    },
    {
      title: '商品退款率',
      dataIndex: 'exportRefundRatio',
      align: 'center',
      hideInTable: form.current?.getFieldsValue().orderType === "15",
      hideInSearch: true
    },
    {
      title: 'b端集采下单人数',
      dataIndex: 'bPayMemberNum',
      align: 'center',
      hideInTable: form.current?.getFieldsValue().orderType !== "15",
      hideInSearch: true
    },
    {
      title: '单品集约参与率',
      dataIndex: 'bJoinRatio',
      align: 'center',
      hideInTable: form.current?.getFieldsValue().orderType !== "15",
      hideInSearch: true
    },
    {
      title: 'b端集采订单数',
      dataIndex: 'bPayNum',
      align: 'center',
      hideInTable: form.current?.getFieldsValue().orderType !== "15",
      hideInSearch: true
    },
    {
      title: 'b端集采总金额',
      dataIndex: 'bExportPayAmount',
      align: 'center',
      hideInTable: form.current?.getFieldsValue().orderType !== "15",
      hideInSearch: true
    },
    {
      title: 'b端复购率',
      dataIndex: 'bExportRepeatRatio',
      align: 'center',
      hideInTable: form.current?.getFieldsValue().orderType !== "15",
      hideInSearch: true
    },
    {
      title: 'C端下单支付人数',
      dataIndex: 'cPayMemberNum',
      align: 'center',
      hideInTable: form.current?.getFieldsValue().orderType !== "15",
      hideInSearch: true
    },
    {
      title: 'C端支付订单数',
      dataIndex: 'cPayNum',
      align: 'center',
      hideInTable: form.current?.getFieldsValue().orderType !== "15",
      hideInSearch: true
    },
    {
      title: 'C端支付总金额',
      dataIndex: 'cExportPayAmount',
      align: 'center',
      hideInTable: form.current?.getFieldsValue().orderType !== "15",
      hideInSearch: true
    },
    {
      title: 'C端复购率',
      dataIndex: 'cExportRepeatRatio',
      align: 'center',
      hideInTable: form.current?.getFieldsValue().orderType !== "15",
      hideInSearch: true
    },
    {
      title: '商品类型',
      dataIndex: 'orderType',
      valueType: 'select',
      valueEnum: {
        "2": '秒约商品',
        "15": '集约商品'
      },
      align: 'center',
      initialValue: "2",
      fieldProps:{
        allowClear: false
      },
      hideInTable: true
    },
    {
      title: '统计时间范围',
      dataIndex: 'date',
      valueType: 'dateRange',
      align: 'center',
      hideInTable: true
    },
    {
      title: '商品分类',
      dataIndex: 'gcId',
      renderFormItem: () => (<GcCascader />),
      align: 'center',
      hideInTable: true
    }
  ]

  const getFieldValue = () => {
    const { date, gcId, ...rest } = form.current.getFieldsValue()
    return {
      startTime: date?.[0]?.format('YYYY-MM-DD'),
      endTime: date?.[1]?.format('YYYY-MM-DD'),
      gcId1: gcId?.[0],
      gcId2: gcId?.[1],
      ...rest
    }
  }

  const change = (e) => {
    setValue(e.target.value)
  }

  return (
    <PageContainer title={false}>
      <TableSearch 
        rangePickerValue={rangePickerValue}
        isActive={isActive}
        handleRangePickerChange={handleRangePickerChange}
        selectDate={selectDate}
        selectType={setOrderType}
      />
      <ProCard split="vertical" loading={loading}>
        <ProCard colSpan="70%" ghost>
          <ProTable
            rowKey="gcName"
            columns={goodsCategory}
            dataSource={goodsData}
            bordered
            pagination={false}
            search={false}
            toolBarRender={false}
          />
        </ProCard>
        <ProCard colSpan="30%">
          <PieChart
            data={pieData}
            value={value}
            onChange={change}
          />
        </ProCard>
      </ProCard>
      <div className={styles.goodsTable}>
        <ProTable
          rowKey="id"
          columns={goodsDetail}
          formRef={form}
          params={{}}
          postData={
            v => {
              setGoodsTotal(v.total || 0)
              return v.records?.map((item, idx) => {
                return {id: idx, ...item}
              })
            }
          }
          request={goodDetail}
          pagination={{
            total: goodsTotal,
            pageSize: 10
          }}

          onSubmit= {()=>setState(state+1)}
          onReset={()=>setState(state+1)}
          search={{
            labelWidth: 120,
            optionRender: (searchConfig, formProps, dom) => [
              ...dom.reverse(),
              <Export
                change={(e)=> {setVisit(e)}}
                key="export" 
                type={type}
                conditions={getFieldValue}
              />,
              <ExportHistory 
                key="export-history" 
                show={visit} setShow={setVisit}
                type={type}
              />
            ]
          }}
          headerTitle="商品销售榜"
          toolbar={{
            settings: false
          }}
          tableRender={(_, dom) => {
            return <>
              { dom }
              {
                _.formRef?.current?.getFieldsValue()?.orderType === '15'&&
                <div className={styles.summary}>
                  <div>共<span>{shopkeeper}名</span>店主参与了集约</div>
                  <div>共<span>{goodsTotal}款</span>商品</div>
                  <div>集约总参与率为<span>{ratio}</span></div>
                </div>
              }
            </>
          }}
        />
      </div>
    </PageContainer>
  )
}

export default ProductData
