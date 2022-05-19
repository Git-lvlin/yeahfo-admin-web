import React, { useRef, useState } from 'react'
import { PageContainer } from '@/components/PageContainer';
import ProTable from '@ant-design/pro-table'
import { 
  Button,
  Image 
} from 'antd'
import { history, useLocation } from 'umi'

import { 
  supplierGoodsData,
  supplierSecondSaleData,
  supplierSaleGoodsData,
  supplierWholesaleData
} from '@/services/data-board/supplier-data'
import styles from './styles.less'
import { amountTransform } from '@/utils/utils'
import Export from '@/pages/export-excel/export'
import ExportHistory from '@/pages/export-excel/export-history'

const Detail = () => {
  const { query } = useLocation()
  const [visit, setVisit] = useState(false)
  const form = useRef()

  const getFieldValue = () => {
    const value = form?.current?.getFieldsValue()

    return {
      supplierId: query.id,
      startTime: query?.startTime,
      endTime: query?.endTime,
      ...value
    }
  }

  const columns = [
    {
      title: 'spuID',
      dataIndex: 'spuId',
      hideInSearch: true,
      align: 'center'
    },
    {
      title: 'skuID',
      dataIndex: 'skuId',
      hideInSearch: true,
      align: 'center'
    },
    {
      title: '图片',
      dataIndex: 'imageUrl',
      render: (_) => <Image width={80} height={80} src={_}/>,
      hideInSearch: true,
      align: 'center'
    },
    {
      title: '商品名称',
      dataIndex: 'goodsName',
      hideInSearch: (query.type !== 'second'&&query.type !== 'intensive'),
      width: '15%',
      align: 'center'
    },
    {
      title: '可用库存',
      dataIndex: 'stockNum',
      hideInSearch: true,
      align: 'center'
    },
    {
      title: '上架状态',
      dataIndex: 'goodsState',
      hideInSearch: true,
      render:(_) => {
        return _ === 0 ? '下架' : '上架'
      },
      align: 'center',
      hideInTable: !(query.type !== 'second'&&query.type !== 'intensive')
    },
    {
      title: '订单总数（秒约）',
      dataIndex: 'orderCount',
      hideInSearch: true,
      align: 'center',
      hideInTable: (query.type !== 'second')
    },
    {
      title: '订单总数（集约）',
      dataIndex: 'orderCount',
      hideInSearch: true,
      align: 'center',
      hideInTable: (query.type !== 'intensive')
    },
    {
      title: '销量（秒约）',
      dataIndex: 'saleNum',
      hideInSearch: true,
      align: 'center',
      hideInTable: (query.type !== 'second')
    },
    {
      title: '销量（集约）',
      dataIndex: 'saleNum',
      hideInSearch: true,
      align: 'center',
      hideInTable: (query.type !== 'intensive')
    },
    {
      title: '销售总额（秒约）',
      dataIndex: 'totalAmount',
      hideInSearch: true,
      render: (_) => amountTransform(Number(_), '/'),
      align: 'center',
      hideInTable: (query.type !== 'second')
    },
    {
      title: '销售总额（集约）',
      dataIndex: 'totalAmount',
      hideInSearch: true,
      render: (_) => amountTransform(Number(_), '/'),
      align: 'center',
      hideInTable: (query.type !== 'intensive')
    }
  ]

  const dataRequest = () => {
    switch(query.type) {
      case 'amount':
        return supplierGoodsData
      case 'sales':
        return supplierSaleGoodsData
      case 'second':
        return supplierSecondSaleData
      case 'intensive':
        return supplierWholesaleData
    }
  }

  const type = () => {
    switch(query.type) {
      case 'amount':
        return 'supplier-goods-data-statistics-export'
      case 'sales':
        return 'supplier-sale-goods-data-statistics-export'
      case 'second':
        return 'supplier-secondsale-data-statistics-export'
      case 'intensive':
        return 'supplier-wholesale-data-statistics-export'
    }
  }

  return (
    <PageContainer title={false}>
      <div className={styles.tableDetail}> 
        <span>商家名称：{query.storeName}</span>
        <Button onClick={() => { window.history.back(); setTimeout(() => { window.location.reload(); }, 200) }}>返回</Button>
      </div>
      <ProTable
        rowKey='skuID'
        formRef={form}
        request={dataRequest()}
        params={{
          supplierId: query.id,
          startTime: query?.startTime,
          endTime: query?.endTime,
          type: query?.state
        }}
        pagination={{
          showQuickJumper: true,
          pageSize: 10
        }}
        toolbar={{
          settings: false
        }}
        toolBarRender={
          ()=> (query.type !== 'second'&&query.type !== 'intensive')&&
          [
            <Export
              change={(e)=> {setVisit(e)}}
              key="export" 
              type={type()}
              conditions={getFieldValue}
            />,
            <ExportHistory
              key="export-history" 
              show={visit} setShow={setVisit}
              type={type()}
            />
          ]
        }
        columns={columns}
        search={
          !(query.type !== 'second'&&query.type !== 'intensive')&&
          {
            optionRender: (searchConfig, formProps, dom)=> {
              return !(query.type !== 'second'&&query.type !== 'intensive')?
              [
                ...dom.reverse(),
                <Export
                  change={(e)=> {setVisit(e)}}
                  key="export" 
                  type={type()}
                  conditions={getFieldValue}
                />,
                <ExportHistory
                  key="export-history" 
                  show={visit} setShow={setVisit}
                  type={type()}
                />
              ]:
              ''
            }
          }
        }
      />
    </PageContainer>
  )
}

export default Detail
