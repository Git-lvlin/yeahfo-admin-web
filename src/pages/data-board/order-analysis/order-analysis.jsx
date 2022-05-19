import React, { useState, useEffect } from 'react'
import { PageContainer } from '@/components/PageContainer';

import ProTable from '@ant-design/pro-table'
import { Space, Radio, DatePicker, Tooltip,Button } from 'antd'
import moment from 'moment'

import Yuan from '../components/Yuan'
import LineChart from './line-chart'
import RegionalOrderAnalysis from './regional-order-analysis'
import styles from './styles.less'
import { getTimeDistance } from '@/utils/utils'
import { orderAnalysis, orderStatistical,wholeSaleOrderDetail,wholeSaleOrderDetailSummary,wholeSaleOrderSubCompany } from '@/services/data-board/order-analysis'
import { QuestionCircleOutlined } from '@ant-design/icons'
import Export from '@/pages/export-excel/export'
import ExportHistory from '@/pages/export-excel/export-history'

const { RangePicker } = DatePicker

const SelectDate = ({
  selectDate,
  rangePickerValue,
  handleRangePickerChange
}) => {
  
  const handleChange = (v)=> {
    switch(v.target.value) {
      case 7:
        selectDate('nearly-7-days')
      break
      case 30:
        selectDate('nearly-a-month')
      break
      case 90:
        selectDate('nearly-3-month')
      break
      case 180:
        selectDate('nearly-6-month')
      break
    }
  }
  return (
    <div className={styles.selectDate}>
      <Space size={20}>
        <Radio.Group
          defaultValue={7}
          buttonStyle="solid"
          onChange= {
            (e) => {
              handleChange(e)
            }
          }
        >
          <Radio.Button value={7}>近7天</Radio.Button>
          <Radio.Button value={30}>近30天</Radio.Button>
          <Radio.Button value={90}>近3个月</Radio.Button>
          <Radio.Button value={180}>近6个月</Radio.Button>
        </Radio.Group>
        <RangePicker
          value={rangePickerValue}
          onChange={handleRangePickerChange}
          style={{
            width: 256,
          }}
          allowClear={false}
        />
      </Space>
    </div>
  )
}

const OrderAnalysis = () => {
  const [value, setValue] = useState(1)
  const [data, setData] = useState([])
  const [tableData, setTableData] = useState([])
  const [totalOrder, setTotalOrder] = useState(0)
  const [totalAmount, setTotalAmount] = useState(0)
  const [unit, setUnit] = useState('单位：单')
  const [rangePickerValue, setRangePickerValue] = useState(getTimeDistance('nearly-7-days'))
  const [visit, setVisit] = useState(false)
  const [amount,setAmount]= useState()
  const [company,setCompany]= useState()


  const onChange = e => {
    setValue(e.target.value)
    if(e.target.value === 1) {
      setUnit('单位：单')
    } else {
      setUnit('单位：元')
    }
  }

  useEffect(() => {
    orderAnalysis({
      startTime: moment(rangePickerValue?.[0]).format("YYYY-MM-DD"), 
      endTime: moment(rangePickerValue?.[1]).format("YYYY-MM-DD")
    }).then(res => {
      if(res.success)  {
        setTableData(res.data)
        setTotalAmount(res?.data?.reduce((acc, curr) => (
          acc + Number(curr.totalPay)
        ), 0))
        setTotalOrder(res?.data?.reduce((acc, curr) => (
          acc + Number(curr.payOrdersNum)
        ), 0))
      }
    })
    return () => {
      setTotalOrder(0)
      setTotalAmount(0)
    }
  }, [rangePickerValue])

  useEffect(() => {
    orderStatistical({
      startTime: moment(rangePickerValue?.[0]).format("YYYY-MM-DD"), 
      endTime: moment(rangePickerValue?.[1]).format("YYYY-MM-DD"),
      type: value
    }).then(res=> {
      const arr = res?.data?.map(item=> {
        if(item) {
          return {reportName: item?.reportName, dateTime: item?.dateTime, value: Number(item?.value)}
        } else {
          return false
        }
      })
      setData(arr)
    })
    return () => {
      setData([])
    }
  }, [rangePickerValue, value])
  
  const scale = {
    value: { 
      min: 0,
      alias: unit
    },
    reportName: {
      formatter: v => {
        return {
          1688: '1688订单',
          C端集约订单: 'C端集约订单',
          秒约订单: '秒约订单',
          B端集约订单: 'B端集约订单'
        }[v]
      }
    }
  }

  const selectDate = (type) => {
    setRangePickerValue(getTimeDistance(type))
  }

  const handleRangePickerChange = (value) => {
    setRangePickerValue(value)
  }

  const columns = [
    {
      title: '订单类型',
      dataIndex: 'orderType',
      valueType: 'select',
      valueEnum: {
        2:'秒约订单',
        11: '1688订单',
        15: 'C端集约订单',
        99: 'B端集约订单'
      },
      align: 'center'
    },
    {
      title: ()=>(
        <Space>
          <span>总订单数</span>
          <Tooltip title="包含未支付订单，不含售后订单">
            <QuestionCircleOutlined/>
          </Tooltip>
        </Space>
      ),
      dataIndex: 'totalOrdersNum',
      align: 'center'
    },
    {
      title: '支付订单数',
      dataIndex: 'payOrdersNum',
      align: 'center'
    },
    {
      title:  ()=>(
        <Space>
          <span>交易总额</span>
          <Tooltip title="包含未支付订单，不含售后订单">
            <QuestionCircleOutlined/>
          </Tooltip>
        </Space>
      ),
      dataIndex: 'totalAmount',
      align: 'center'
    },
    {
      title:  ()=>(
        <Space>
          <span>成交总额</span>
          <Tooltip title="不含未支付订单，只统计已支付的">
            <QuestionCircleOutlined/>
          </Tooltip>
        </Space>
      ),
      dataIndex: 'totalPay',
      align: 'center'
    },
    {
      title:  ()=>(
        <Space>
          <span>下单总人数</span>
          <Tooltip title="含未支付订单">
            <QuestionCircleOutlined/>
          </Tooltip>
        </Space>
      ),
      dataIndex: 'orderUserNum',
      align: 'center'
    },
    {
      title: '下单支付总人数',
      dataIndex: 'orderPayUserNum',
      align: 'center'
    },
    {
      title:  ()=>(
        <Space>
          <span>成交平均单价</span>
          <Tooltip title="成交总额/支付订单数">
            <QuestionCircleOutlined/>
          </Tooltip>
        </Space>
      ),
      dataIndex: 'averagePrice',
      align: 'center'
    },
    {
      title: '退款笔数',
      dataIndex: 'refundNum',
      align: 'center'
    },
    {
      title: '退款总额',
      dataIndex: 'refundAmount',
      align: 'center'
    }
  ]
  const detailColumns=[
    {
      title: '订单支付时间',
      dataIndex: 'orderPaytime',
      align: 'center',
      hideInSearch:true,
      render:(_,data)=>{
        return moment(Number(_)).format('YYYY-MM-DD HH:mm:ss')
      }
    },
    {
      title: '订单支付时间',
      key: 'dateTimeRange',
      dataIndex: 'orderPaytime',
      valueType: 'dateTimeRange',
      hideInTable: true,
    },
    {
      title: '订单ID',
      dataIndex: 'orderID',
      align: 'center',
      hideInSearch:true
    },
    {
      title: '订单金额',
      dataIndex: 'orderAmount',
      align: 'center',
      hideInSearch:true
    },
    {
      title: '批发量',
      dataIndex: 'wholesaleNum',
      align: 'center',
      hideInSearch:true
    },
    {
      title: 'C端集约交易金额',
      dataIndex: 'cWholeTransactionAmount',
      align: 'center',
      hideInSearch:true
    },
    {
      title: 'C端订单售出件量',
      dataIndex: 'cWholeSoldNum',
      align: 'center',
      hideInSearch:true
    },
    {
      title: '商品SKU ID',
      dataIndex: 'skuID',
      align: 'center',
      hideInTable:true
    },
    {
      title: '商品SKU',
      dataIndex: 'goodsSku',
      align: 'center',
      hideInSearch:true
    },
    {
      title: '商品名称',
      dataIndex: 'goodsName',
      align: 'center',
    },
    {
      title: '社区店铺号',
      dataIndex: 'communityStoreNo',
      align: 'center',
      hideInSearch:true
    },
    {
      title: '社区店ID',
      dataIndex: 'storeID',
      align: 'center',
      hideInTable:true
    },
    {
      title: '社区店名称',
      dataIndex: 'storeName',
      align: 'center',
      hideInTable:true
    },
    {
      title: '社区店名称',
      dataIndex: 'communityStoreName',
      align: 'center',
      hideInSearch:true
    },
    {
      title: '运营中心ID',
      dataIndex: 'operationsID',
      align: 'center',
      hideInTable:true
    },
    {
      title: '订单运营中心ID',
      dataIndex: 'orderOperationsID',
      align: 'center',
      hideInSearch:true
    },
    {
      title: '运营中心名称',
      dataIndex: 'operationsName',
      align: 'center',
      hideInTable:true
    },
    {
      title: '订单运营中心名称',
      dataIndex: 'orderOperationsName',
      align: 'center',
      hideInSearch:true
    },
    {
      title: '订单区域名称',
      dataIndex: 'orderOreaName',
      align: 'center',
      hideInSearch:true
    },
    {
      title: '集约活动编号',
      dataIndex: 'wsID',
      align: 'center',
    },
    {
      title: '集约活动名称',
      dataIndex: 'wsName',
      align: 'center',
    },
    {
      title: '运营中心归属子公司',
      dataIndex: 'operationsSubCompanyName',
      align: 'center',
      hideInSearch:true,
    },
    {
      title: '归属子公司',
      dataIndex: 'operationsSubCompanyName',
      align: 'center',
      valueType:'select',
      valueEnum: company,
      hideInTable:true,
    },
  ]
  const getFieldValue = (form) => {
    const {dateTimeRange,...rest}=form.getFieldsValue()
    return {
      startTime:dateTimeRange&&moment(dateTimeRange[0]).format('YYYY-MM-DD HH:mm:ss'),
      endTime:dateTimeRange&&moment(dateTimeRange[1]).format('YYYY-MM-DD HH:mm:ss'),
      ...rest,
    }
  }
  useEffect(()=>{
    wholeSaleOrderDetailSummary({}).then(res=>{
      if(res.code==0){
        setAmount(res.data)
      }
    })
    wholeSaleOrderSubCompany({}).then(res=>{
      if(res.code==0){
        const obj={}
        res.data.map(ele=>{
          obj[ele.operationsSubCompanyName]=ele.operationsSubCompanyName
        })
        setCompany(obj)
      }
      
    })
  },[])
  return (
    <PageContainer title={false}>
      <ProTable
        rowKey="orderType"
        columns={columns}
        dataSource={tableData}
        bordered
        search={false}
        toolbar={{
          title: '订单趋势分析',
          settings: false,
          subTitle: (
            <SelectDate
              selectDate={selectDate}
              rangePickerValue={rangePickerValue}
              handleRangePickerChange={handleRangePickerChange}
            />
          )
        }}
        tableRender={(_, dom) => (
          <>
            { dom }
            <div className={styles.summary}>
              <span>支付订单数：<Yuan>{totalOrder}</Yuan></span>
              <span>成交总额：<Yuan>{totalAmount}</Yuan></span>
              <Tooltip title="4种订单类型的成交额总和">
                <QuestionCircleOutlined />
              </Tooltip>
            </div>
          </>
        )}
      />
      <div className={styles.radioArea}>
        <Radio.Group 
          onChange={onChange}
          value={value}
          size="large"
        >
          <Radio value={1}>订单数</Radio>
          <Radio value={2}>成交额</Radio>
        </Radio.Group>
        <LineChart 
          data={data}
          scale={scale}
        />
      </div>
      <RegionalOrderAnalysis/>
      <ProTable
        headerTitle="集约订单明细查询"
        rowKey="orderType"
        columns={detailColumns}
        options={false}
        bordered
        request={wholeSaleOrderDetail}
        search={{
          defaultCollapsed: true,
          labelWidth: 100,
          optionRender: ({searchText, resetText}, {form}) => [
            <Button
              key="search"
              type="primary"
              onClick={() => {
                form?.submit()
                wholeSaleOrderDetailSummary(form.getFieldsValue()).then(res=>{
                  if(res.code==0){
                    setAmount(res.data)
                  }
                })
              }}
            >
              {searchText}
            </Button>,
            <Button
              key="rest"
              onClick={() => {
                form?.resetFields()
                form?.submit()
              }}
            >
              {resetText}
            </Button>,
             <Export
              change={(e) => { setVisit(e) }}
              type={'data-board-order-analyis-wholesale-deatail-export'}
              conditions={()=>getFieldValue(form)}
              key="export"
            />,
            <ExportHistory key="history" show={visit} setShow={setVisit} type='data-board-order-analyis-wholesale-deatail-export'/>,
          ],
        }}
        pagination={{
          pageSize: 10,
        }}
        style={{marginTop:'20px',background:'#fff'}}
        tableRender={(_, dom) => (
          <>
            { dom }
            <div className={styles.intensive}>
              <div>
                <span>订单总金额：<Yuan>{amount?.[0]?.orderAmount}</Yuan></span>
                <span>总批发量：<Yuan>{amount?.[0]?.wholesaleNum}</Yuan></span>
              </div>
              <div>
                <span>C端集约交易总金额：<Yuan>{amount?.[0]?.cWholeTransactionAmount}</Yuan></span>
                <span>C端订单售总出件量：<Yuan>{amount?.[0]?.cWholeSoldNum}</Yuan></span>
              </div>
            </div>
          </>
        )}
      />
    </PageContainer>
  )
}

export default OrderAnalysis
