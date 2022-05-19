import { useState } from "react"
import { 
  DrawerForm,
} from '@ant-design/pro-form'
import { Button } from 'antd';
import { amountTransform } from '@/utils/utils'
import ProTable,{ ProColumns } from '@ant-design/pro-table';
import type{ FC } from "react"
import type { ModalFormProps,SubsidyOrderItem } from "./data"
import { storeShareCommissionItem } from '@/services/intensive-store-management/share-the-subsidy'
import Detail from '@/pages/order-management/normal-order/detail';
import { useLocation } from 'umi';
import ProductDetailDrawer from '@/components/product-detail-drawer'
import UserDetail from '@/pages/user-management/user-list/detail';


const formItemLayout = {
    labelCol: { span: 7 },
    wrapperCol: { span: 14 }
  };

const ShareTheSubsidyOrder: FC<ModalFormProps> = (props) => {
  const { visible, setVisible, orderDetail, onClose } = props
  const [subOrderId, setSubOrderId] = useState(null)
  const [orderVisible, setOrderVisible] = useState(false)
  const [productDetailDrawerVisible, setProductDetailDrawerVisible] = useState(false);
  const [selectItem, setSelectItem] = useState<SubsidyOrderItem>();
  const [detailVisible, setDetailVisible] = useState(false);
  const [buyerMobileItem, setBuyerMobileItem] = useState<SubsidyOrderItem>();
  const isPurchase = useLocation().pathname.includes('purchase') 
  const columns:ProColumns<SubsidyOrderItem>[]= [
    {
      title: '订单编号',
      dataIndex: 'orderNo',
      valueType: 'text',
      fieldProps:{
        placeholder:'请输入订单编号'
      }, 
      order:6,
      render:(_,data)=>{
        return <a onClick={()=>{setOrderVisible(true);setSubOrderId(data?.orderId)}}>{_}</a>
      }
    },
    {
      title: '商品名称',
      dataIndex: 'goodsName',
      valueType: 'text',
      order:4,
      render:(_,data)=>{
          return <a onClick={() => { setSelectItem(data); setProductDetailDrawerVisible(true); }}>{_}</a>
      }
    },
    {
      title: 'skuID',
      dataIndex: 'skuId',
      valueType: 'text',
      hideInTable :true,
      fieldProps:{
        placeholder:'请输入商品skuID'
      },
      order:5
    },
    {
      title: 'skuID',
      dataIndex: 'skuId',
      valueType: 'text',
      hideInSearch: true,
    },
    {
      title: '数量',
      dataIndex: 'quantity',
      valueType: 'text',
      hideInSearch : true,
    },
    {
      title: '订单金额',
      dataIndex: 'orderAmount',
      valueType: 'text',
      hideInSearch: true,
      render:(_,data)=>{
        return amountTransform(_,'/').toFixed(2)
      }
    },
    {
      title: '下单手机号',
      dataIndex: 'buyerMobile',
      valueType: 'text',
      fieldProps:{
        placeholder:'请输入会员手机号'
      }, 
      hideInTable: true,
      order:1
    },
    {
      title: '买家手机号',
      dataIndex: 'buyerMobile',
      valueType: 'text',
      hideInSearch: true,
      render:(_,data)=>{
        return <a onClick={() => { setBuyerMobileItem(data); setDetailVisible(true) }}>{_}</a>
      }
    },
    {
      title: '下单时间',
      dataIndex: 'dateTimeRange',
      valueType: 'dateTimeRange',
      hideInTable: true,
      order:2
    },
    {
      title: '下单时间',
      dataIndex: 'orderTime',
      valueType: 'text',
      hideInSearch: true
    },
    {
      title: '补贴状态',
      dataIndex: 'status',
      valueType: 'text',
      hideInTable: true,
      valueEnum:{
          0: '全部',
          1: '待结算',
          2: '已结算',
          3: '失效'
      },
      order:3
    },
    {
      title: '补贴状态',
      dataIndex: 'statusDesc',
      valueType: 'text',
      hideInSearch: true,
      render:(_,data)=>{
        if(data?.refundDesc){
          return <>
                  <p>{_}</p>
                  <span style={{color:'#F0924F'}}>{data?.refundDesc}</span>
                 </>
        }else{
          return <p>{_}</p>
        }
      }
    },
    {
      title: '补贴金额',
      dataIndex: 'commission',
      valueType: 'text',
      hideInSearch: true,
      render:(_)=>{
          return amountTransform(_,'/').toFixed(2)
      }
    },
    {
      title: '支付时间',
      dataIndex: 'payTime',
      valueType: 'text',
      hideInSearch: true
    }
  ];

  return (
    <DrawerForm
      visible={visible}
      onFinish={async (values) => {
      }}
      layout='horizontal'
      onVisibleChange={setVisible}
      drawerProps={{
        forceRender: true,
        destroyOnClose: true,
        onClose: () => {
          onClose();
        }
      }}
      title={<p>{orderDetail?.storeName}   总补贴{amountTransform(orderDetail?.totalShareCommission,'/')}元（分享订单：{orderDetail?.sumOrderCount}单   分享订单金额：{amountTransform(orderDetail?.totalShareOrderAmount,'/')}元   分享用户：{orderDetail?.buyerCount}名）</p>}
      {...formItemLayout}
      width={1400}
      submitter={
        {
          render: (props, defaultDoms) => {
            return [
              <Button key='GoBack' type="default" onClick={() => {setVisible(false);onClose()}}>
                返回
              </Button>
            ];
          }
        }
      }
    >
      <ProTable<SubsidyOrderItem>
        rowKey="orderId"
        options={false}
        params={{
          storeNo:orderDetail?.storeNo
        }}
        request={storeShareCommissionItem}
        search={{
        defaultCollapsed: false,
        labelWidth: 100,
        optionRender: (searchConfig, formProps, dom) => [
          ...dom.reverse()
        ],
        }}
        scroll={{ x: 'max-content', scrollToFirstRowOnChange: true, }}
        columns={columns}
        pagination={{
          pageSize: 10,
          showQuickJumper: true,
        }}
      />
      {
        orderVisible &&
        <Detail
          id={subOrderId}
          visible={orderVisible}
          setVisible={setOrderVisible}
          isPurchase={isPurchase}
        />
      }
      {
        productDetailDrawerVisible &&
        <ProductDetailDrawer
          visible={productDetailDrawerVisible}
          setVisible={setProductDetailDrawerVisible}
          spuId={selectItem?.spuId}
        />
      }
       {
        detailVisible &&
        <UserDetail
          id={buyerMobileItem?.memberId}
          visible={detailVisible}
          setVisible={setDetailVisible}
        />
      }
    </DrawerForm>
  )
}

export default ShareTheSubsidyOrder