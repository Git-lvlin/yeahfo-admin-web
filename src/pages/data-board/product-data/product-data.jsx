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
      title: '????????????',
      dataIndex: 'gcName',
      align: 'center'
    },
    {
      title: 'SPU??????',
      dataIndex: 'spuCount',
      align: 'center'
    },
    {
      title: 'SKU??????',
      dataIndex: 'skuCount',
      align: 'center'
    },
    {
      title: '?????????SKU??????',
      dataIndex: 'skuRate',
      align: 'center'
    },
    {
      title: '??????SKU???',
      dataIndex: 'paySkuCount',
      align: 'center'
    },
    {
      title: '??????SKU??????',
      dataIndex: 'paySkuRatio',
      align: 'center'
    },
    {
      title: ()=> (
        <Space>
          <span>???????????????</span>
          <Tooltip title="??????????????????????????????????????????????????????">
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
          <span>???????????????</span>
          <Tooltip title="??????????????????????????????????????????????????????">
            <QuestionCircleOutlined/>
          </Tooltip>
        </Space>
      ),
      align: 'center',
      hideInTable: orderType !== '15',
      children: [
        {
          title: 'B????????????',
          dataIndex: 'bPayAmount',
          align: 'center',
          render: (_) => amountTransform(Number(_), '/')
        },
        {
          title: 'C????????????',
          dataIndex: 'cPayAmount',
          align: 'center',
          render: (_) => amountTransform(Number(_), '/')
        }
      ]
    },
    {
      title: '????????????????????????',
      align: 'center',
      dataIndex: 'bPayRate',
      hideInTable: orderType !== '15'
    },
    {
      title: '??????????????????',
      dataIndex: 'refundAmount',
      render: (_) => amountTransform(Number(_), '/'),
      align: 'center'
    },
    {
      title: '?????????',
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
      title: '????????????',
      dataIndex: 'spuId',
      align: 'center',
      hideInSearch: true
    },
    {
      title: '????????????',
      dataIndex: 'spuId',
      align: 'center',
      valueType: 'digit',
      hideInTable: true
    },
    {
      title: '????????????',
      dataIndex: 'goodsName',
      align: 'center',
      width: '15%'
    },
    {
      title: ()=>(
        <Space>
          <span>?????????????????????????????????????????????????????????</span>
          <Tooltip title="?????????????????????????????????????????????=?????????????????????/??????????????????">
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
      title: '???????????????',
      dataIndex: 'payMemberNum',
      align: 'center',
      hideInTable: form.current?.getFieldsValue().orderType === "15",
      hideInSearch: true
    },
    {
      title: '???????????????',
      dataIndex: 'payNum',
      align: 'center',
      hideInTable: form.current?.getFieldsValue().orderType === "15",
      hideInSearch: true
    },
    {
      title: '?????????',
      dataIndex: 'goodsSumNum',
      align: 'center',
      hideInTable: form.current?.getFieldsValue().orderType === "15",
      hideInSearch: true
    },
    {
      title: '?????????',
      dataIndex: 'exportPayAmount',
      align: 'center',
      hideInSearch: true,
      hideInTable: form.current?.getFieldsValue().orderType === "15",
    },
    {
      title: '?????????????????????',
      dataIndex: 'exportRefundAmount',
      align: 'center',
      hideInSearch: true,
      hideInTable: form.current?.getFieldsValue().orderType === "15",
    },
    {
      title: '???????????????',
      dataIndex: 'exportRefundRatio',
      align: 'center',
      hideInTable: form.current?.getFieldsValue().orderType === "15",
      hideInSearch: true
    },
    {
      title: 'b?????????????????????',
      dataIndex: 'bPayMemberNum',
      align: 'center',
      hideInTable: form.current?.getFieldsValue().orderType !== "15",
      hideInSearch: true
    },
    {
      title: '?????????????????????',
      dataIndex: 'bJoinRatio',
      align: 'center',
      hideInTable: form.current?.getFieldsValue().orderType !== "15",
      hideInSearch: true
    },
    {
      title: 'b??????????????????',
      dataIndex: 'bPayNum',
      align: 'center',
      hideInTable: form.current?.getFieldsValue().orderType !== "15",
      hideInSearch: true
    },
    {
      title: 'b??????????????????',
      dataIndex: 'bExportPayAmount',
      align: 'center',
      hideInTable: form.current?.getFieldsValue().orderType !== "15",
      hideInSearch: true
    },
    {
      title: 'b????????????',
      dataIndex: 'bExportRepeatRatio',
      align: 'center',
      hideInTable: form.current?.getFieldsValue().orderType !== "15",
      hideInSearch: true
    },
    {
      title: 'C?????????????????????',
      dataIndex: 'cPayMemberNum',
      align: 'center',
      hideInTable: form.current?.getFieldsValue().orderType !== "15",
      hideInSearch: true
    },
    {
      title: 'C??????????????????',
      dataIndex: 'cPayNum',
      align: 'center',
      hideInTable: form.current?.getFieldsValue().orderType !== "15",
      hideInSearch: true
    },
    {
      title: 'C??????????????????',
      dataIndex: 'cExportPayAmount',
      align: 'center',
      hideInTable: form.current?.getFieldsValue().orderType !== "15",
      hideInSearch: true
    },
    {
      title: 'C????????????',
      dataIndex: 'cExportRepeatRatio',
      align: 'center',
      hideInTable: form.current?.getFieldsValue().orderType !== "15",
      hideInSearch: true
    },
    {
      title: '????????????',
      dataIndex: 'orderType',
      valueType: 'select',
      valueEnum: {
        "2": '????????????',
        "15": '????????????'
      },
      align: 'center',
      initialValue: "2",
      fieldProps:{
        allowClear: false
      },
      hideInTable: true
    },
    {
      title: '??????????????????',
      dataIndex: 'date',
      valueType: 'dateRange',
      align: 'center',
      hideInTable: true
    },
    {
      title: '????????????',
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
          headerTitle="???????????????"
          toolbar={{
            settings: false
          }}
          tableRender={(_, dom) => {
            return <>
              { dom }
              {
                _.formRef?.current?.getFieldsValue()?.orderType === '15'&&
                <div className={styles.summary}>
                  <div>???<span>{shopkeeper}???</span>?????????????????????</div>
                  <div>???<span>{goodsTotal}???</span>??????</div>
                  <div>?????????????????????<span>{ratio}</span></div>
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
