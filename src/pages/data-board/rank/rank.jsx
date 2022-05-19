import React, { useState, useEffect } from 'react'
import { PageContainer } from '@/components/PageContainer';
import ProTable from '@ant-design/pro-table'
import { history, useLocation } from 'umi'
import { Button, Spin } from 'antd'

import {
  bSupGmvRanking,
  bMemberGmvRanking,
  saleSupplierMember,
  saleMemberRanking,
  cMemberGmvRanking,
  memberSalesRanking,
  cSupGmvRanking,
  supSalesRanking,
  gmvAgentMonRanking,
  saleAgentMonRanking
} from '@/services/data-board/ranking'
import { amountTransform } from '@/utils/utils'

const Ranking = () => {
  const { query } = useLocation()
  const [rankList, setRankList] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(()=>{
    setLoading(true)
    switch(query.type){
      case '1':
        bSupGmvRanking().then(res=> {
          if(res.success) {
            setRankList(res.data)
          } else {
            setRankList([])
          }
        }).finally(()=> {
          setLoading(false)
        })
      break
      case '2':
        bMemberGmvRanking().then(res=> {
          if(res.success) {
            setRankList(res.data)
          } else {
            setRankList([])
          }
        }).finally(()=> {
          setLoading(false)
        })
      break
      case '3':
        cMemberGmvRanking().then(res=> {
          if(res.success) {
            setRankList(res.data)
          } else {
            setRankList([])
          }
        }).finally(()=> {
          setLoading(false)
        })
      break
      case '4':
        cSupGmvRanking().then(res=> {
          if(res.success) {
            setRankList(res.data)
          } else {
            setRankList([])
          }
        }).finally(()=> {
          setLoading(false)
        })
      break
      case '5':
        gmvAgentMonRanking().then(res=> {
          if(res.success) {
            setRankList(res.data)
          } else {
            setRankList([])
          }
        }).finally(()=> {
          setLoading(false)
        })
      break
      case '6':
        saleSupplierMember().then(res=> {
          if(res.success) {
            setRankList(res.data)
          } else {
            setRankList([])
          }
        }).finally(()=> {
          setLoading(false)
        })
      break
      case '7':
        saleMemberRanking().then(res=> {
          if(res.success) {
            setRankList(res.data)
          } else {
            setRankList([])
          }
        }).finally(()=> {
          setLoading(false)
        })
      break
      case '8':
        memberSalesRanking().then(res=> {
          if(res.success) {
            setRankList(res.data)
          } else {
            setRankList([])
          }
        }).finally(()=> {
          setLoading(false)
        })
      break
      case '9':
        supSalesRanking().then(res=> {
          if(res.success) {
            setRankList(res.data)
          } else {
            setRankList([])
          }
        }).finally(()=> {
          setLoading(false)
        })
      break
      case '10':
        saleAgentMonRanking().then(res=> {
          if(res.success) {
            setRankList(res.data)
          } else {
            setRankList([])
          }
        }).finally(()=> {
          setLoading(false)
        })
      break
    }
    return ()=> {
      setRankList([])
    }
  },[query.type])

  const rankType = (e) => {
    switch(query.type) {
      case '1':
        return {
          id: 'supplierId',
          name: 'companyName',
          url: ()=>(
            history.push(`/data-board/order/${e?.supplierId}?orderType=${e&&Object.keys(e)[2]}&no=${query.type}&type=1`
          ))
        }
      case '4':
        return {
          id: 'supplierId',
          name: 'companyName',
          url: ()=>(
            history.push(`/data-board/order/${e?.supplierId}?orderType=${e&&Object.keys(e)[2]}&no=${query.type}&type=3`
          ))
        }
      case '6':
        return {
          id: 'supplierId',
          name: 'companyName',
          url: ()=>(
            history.push(`/data-board/order/${e?.supplierId}?orderType=${e&&Object.keys(e)[2]}&no=${query.type}&type=1`
          ))
        }
      case '9':
        return {
          id: 'supplierId',
          name: 'companyName',
          url: ()=>(
            history.push(`/data-board/order/${e?.supplierId}?orderType=${e&&Object.keys(e)[2]}&no=${query.type}&type=3`
          ))
        }
      case '2':
        return {
          id: 'storeId',
          name: 'storeName',
          url: ()=>(
            history.push(`/data-board/order/${e?.storeId}?orderType=${e&&Object.keys(e)[1]}&no=${query.type}&type=1`)
          )
        }
      case '3':
        return {
          id: 'storeId',
          name: 'storeName',
          url: ()=>(
            history.push(`/data-board/order/${e?.storeId}?orderType=${e&&Object.keys(e)[1]}&no=${query.type}&type=2`)
          )
        }
      case '5':
        return {
          id: 'storeId',
          name: 'storeName',
          url: ()=>(
            history.push(`/data-board/order/${e?.storeId}?orderType=${e&&Object.keys(e)[1]}&no=${query.type}&type=4`)
          )
        }
      case '7':
        return {
          id: 'storeId',
          name: 'storeName',
          url: ()=>(
            history.push(`/data-board/order/${e?.storeId}?orderType=${e&&Object.keys(e)[1]}&no=${query.type}&type=1`)
          )
        }
      case '8':
        return {
          id: 'storeId',
          name: 'storeName',
          url: ()=>(
            history.push(`/data-board/order/${e?.storeId}?orderType=${e&&Object.keys(e)[1]}&no=${query.type}&type=2`)
          )
        }
      case '10':
        return {
          id: 'storeId',
          name: 'storeName',
          url: ()=>(
            history.push(`/data-board/order/${e?.storeId}?orderType=${e&&Object.keys(e)[1]}&no=${query.type}&type=4`)
          )
        }
    }
  }
  const columns = [
    {
      title: '序号',
      dataIndex: 'serialNum',
      valueType: 'indexBorder'
    },
    {
      title: '编号',
      dataIndex: rankType().id,
      align: 'center'
    },
    {
      title: '名称',
      dataIndex: rankType().name,
      align: 'center'
    },
    {
      title: '金额（￥/元）',
      dataIndex: 'sales',
      align: 'center',
      render: (_)=> amountTransform(_, '/')
    },
    {
      title: '详情',
      dataIndex: 'option',
      align: 'center',
      render: (_, records)=> <a onClick={rankType(records).url}>查看</a>
    }

  ]

  return (
    <PageContainer title={false}>
      <Spin spinning={loading}>
        <ProTable
          rowKey={rankType().id}
          columns={columns}
          search={false}
          toolBarRender={false}
          toolbar={false}
          dataSource={rankList}
          pagination={{
            hideOnSinglePage: true,
            pageSize: 10,
            showQuickJumper: true
          }}
        />
      </Spin>
      <Button
        type='primary'
        onClick={
          () => { window.history.back(); setTimeout(() => { window.location.reload(); }, 200) }
        }
      >
        返回
      </Button>
    </PageContainer>
  )
}

export default Ranking
