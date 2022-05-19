import React, { useState } from 'react'
import { Space, Button } from 'antd';
import { PageContainer } from '@/components/PageContainer';
import ProCard from '@ant-design/pro-card';
import ProTable from '@ant-design/pro-table';
import { orderPage } from '@/services/intensive-store-management/intensive-task';
import { useParams, useLocation, history } from 'umi';
import { amountTransform } from '@/utils/utils'
import ProductDetailDrawer from '@/components/product-detail-drawer'


const IntensiveTask = props => {
  const params = useParams();
  const location = useLocation();
  const [count, setCount] = useState(0)
  const [productDetailDrawerVisible, setProductDetailDrawerVisible] = useState(false);
  const [selectItem, setSelectItem] = useState(null);

  const columns = [
    {
      title: '活动编号',
      dataIndex: 'wsId',
      valueType: 'text',
    },
    {
      title: '活动名称',
      dataIndex: 'wsName',
      valueType: 'text',
      render: (_, data) => <a onClick={() => { history.push(`/intensive-activity-management/intensive-activity-detail/${data.wsId}`) }}>{data.wsName}</a>

    },
    {
      title: '集约量',
      dataIndex: 'totalNum',
      valueType: 'text',
    },
    {
      title: '集约金额',
      dataIndex: 'totalAmount',
      valueType: 'text',
      render: (_) => amountTransform(_, '/')
    },
    {
      title: '活动商品名称',
      dataIndex: 'goodsName',
      valueType: 'text',
      render: (_, record) => {
        return <a onClick={() => { setSelectItem(record); setProductDetailDrawerVisible(true); }}>{_}</a>
      },

    },
    {
      title: '活动商品skuID',
      dataIndex: 'skuId',
      valueType: 'text',
    },
    {
      title: '活动时段',
      dataIndex: 'wholesaleTime',
      valueType: 'text',
      render: (_, data) => (
        <>
          {data.wholesaleStartTime}<br />
          {data.wholesaleEndTime}
        </>
      )
    },
    {
      title: '活动状态',
      dataIndex: 'wsStatus',
      valueType: 'text',
    },
    {
      title: '活动采购单数',
      dataIndex: 'total',
      valueType: 'text',
      render: (_, data) => <a onClick={() => {
        history.push({
          pathname: `/order-management/intensive-order/supplier-order`,
          query: {
            memberId: location?.query?.memberId,
            wsId: data?.wsId,
          }
        })
      }}>{_}</a>
    },
  ];
  return (
    <PageContainer>
      <div style={{ marginBottom: 10, background: '#fff', padding: 10 }}>
        <Space size="large">
          <span>{location?.query?.storeName}</span>
          <span>({location?.query?.linkman} {location?.query?.phone})</span>
        </Space>
      </div>
      <ProCard
        tabs={{
          type: 'card',
          activeKey: '1',
        }}
      >
        <ProCard.TabPane key="1" tab={`指令集约任务（${count}）`}>
          <ProTable
            rowKey="wsId"
            options={false}
            postData={(data) => {
              setCount(data.total)
              return data.records;
            }}
            params={{
              storeNo: params.id
            }}
            request={orderPage}
            search={false}
            columns={columns}
            pagination={{
              pageSize: 10,
            }}
          />
        </ProCard.TabPane>
      </ProCard>
      <div style={{ textAlign: 'center', marginTop: 30 }}>
        <Button onClick={() => { window.history.back(); setTimeout(() => { window.location.reload(); }, 200) }}>返回</Button>
      </div>
      {
        productDetailDrawerVisible &&
        <ProductDetailDrawer
          visible={productDetailDrawerVisible}
          setVisible={setProductDetailDrawerVisible}
          spuId={selectItem?.spuId}
        />
      }
    </PageContainer>
  )
}


export default IntensiveTask;
