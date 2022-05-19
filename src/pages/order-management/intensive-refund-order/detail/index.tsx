import React, { useState, useEffect, useRef } from 'react'
import { Form,Button,Descriptions,Typography,Divider,Image } from 'antd'
import { DrawerForm,ProFormRadio,ProFormTextArea} from '@ant-design/pro-form';
import ProTable from '@ant-design/pro-table';
import type { ProColumns } from '@ant-design/pro-table';
import { getAuditInfo,operationRefundAudit } from '@/services/order-management/intensive-refund-order'
import styles from './styles.less'
import { amountTransform } from '@/utils/utils'
const { Title } = Typography;


type OperationRefundDetail={
  storeNo: string;
  orderId: string;
  totalNum: number;
  returnNum: number;
  storeName: string;
  shopMemberAccount: string;
  fullAddress: string;
  leftNum: string;
}

type AuditRecord={
  operateId: string;
  operateName: string;
  createTime: string;
  auditStatus: number;
  suggestion: string;
}


  export default props => {
  const {setVisible,visible,onClose,callback,orSn,storeType}=props
  const [orderDetail, setOrderDetail] = useState()
  const [form] = Form.useForm()
  const ref=useRef()
  let sum=0
  orderDetail?.operationRefundDetails?.map(ele=>{
    sum=amountTransform(amountTransform(sum, '*')+amountTransform(ele.returnNum, '*'),'/')
  })
  useEffect(()=>{
    getAuditInfo({orSn}).then(res => {
      if(res.code==0){
        setOrderDetail(res?.data)
      }
    })
  }, [])
  const columns:ProColumns<OperationRefundDetail>[]= [
    {
      title: '店铺编号',
      dataIndex: 'storeNo',
      valueType: 'text',
    },
    {
      title: '社区店名称',
      dataIndex: 'storeName',
      valueType: 'text',
      hideInSearch: true,
    },
    {
      title: '配送点地址',
      dataIndex: 'fullAddress',
      valueType: 'text',
    },
    {
      title: '店主订单号',
      dataIndex: 'shopMemberAccount',
      valueType: 'text',
    },
    {
      title: '采购数量',
      dataIndex: 'totalNum',
      valueType: 'text',
    },
    {
      title: '退款数量',
      dataIndex: 'returnNum',
      valueType: 'text',
    }
  ];

  const columns2:ProColumns<AuditRecord>[]= [
    {
      title: '审核人员账号',
      dataIndex: 'operateId',
      valueType: 'text',
    },
    {
      title: '审核人员名称',
      dataIndex: 'operateName',
      valueType: 'text',
      hideInSearch: true,
    },
    {
      title: '审核时间',
      dataIndex: 'createTime',
      valueType: 'text',
    },
    {
      title: '审核动作',
      dataIndex: 'auditStatus',
      valueType: 'select',
      valueEnum:{
        1:'待审核',
        2:'审核通过',
        3:'审核拒绝',
        4:'撤销'
      }
    },
    {
      title: '审核意见',
      dataIndex: 'suggestion',
      valueType: 'text',
    }
  ];

  return (
    <DrawerForm
      title={storeType==2?'缺货单详情':'集约缺货处理单'}
      onVisibleChange={setVisible}
      visible={visible}
      form={form}
      formRef={ref}
      width={1500}
      drawerProps={{
        forceRender: true,
        destroyOnClose: true,
        onClose: () => {
          onClose();
        }
      }}
      submitter={
        {
          render: (props, defaultDoms) => {
            return [];
          }
        }
      }
      onFinish={async (values) => {
        operationRefundAudit({...values,orSn:orSn}).then(res=>{
          if(res.code==0){
            callback()
            setVisible(false)
          }
        })
      }
      }
      className={styles.list_details}
  >
    <Title style={{ marginTop: '10px' }} level={5}>基础信息</Title>
    <Divider />
    <Descriptions labelStyle={{fontWeight:'bold'}} column={2} bordered>
        <Descriptions.Item  label="缺货退款单号">{orderDetail?.baseInfo?.orSn}  </Descriptions.Item>
        <Descriptions.Item  label="申请时间">{orderDetail?.baseInfo?.createTime}  </Descriptions.Item>
        <Descriptions.Item  label="关联集约采购单号">{orderDetail?.baseInfo?.poNo}  </Descriptions.Item>
        <Descriptions.Item  label="集约活动ID">{orderDetail?.baseInfo?.wsId}  </Descriptions.Item>
        <Descriptions.Item  label="供应商ID">{orderDetail?.baseInfo?.supplierId}  </Descriptions.Item>
        <Descriptions.Item  label="供应商名称">{orderDetail?.baseInfo?.supplierName}  </Descriptions.Item>
        <Descriptions.Item  label="采购商品">
         <div style={{display:'flex',alignItems:'center'}}>
          <Image src={orderDetail?.baseInfo?.imageUrl} width={50} height={50}/>
          <p style={{marginLeft:'10px'}}>{orderDetail?.baseInfo?.goodsName} </p>
         </div> 
        </Descriptions.Item>
        <Descriptions.Item  label="库存单位">{orderDetail?.baseInfo?.unit}  </Descriptions.Item>
        <Descriptions.Item  label="采购数量">{orderDetail?.baseInfo?.totalNum}  </Descriptions.Item>
        <Descriptions.Item  label="缺货数量"><span style={{color:'red'}}>{orderDetail?.baseInfo?.returnNum}</span></Descriptions.Item>
        <Descriptions.Item  label="审核状态">{{1:'无需审核（运营中心没有提交）',2:'待审核',3:'审核通过',4:'审核拒绝'}[orderDetail?.baseInfo?.operationAuditStatus]}  </Descriptions.Item>
    </Descriptions>

    <Title style={{ marginTop: '50px' }} level={5}>店主退款订单数量（合计：{sum}）</Title>
    <Divider />
    <ProTable<OperationRefundDetail>
      rowKey="orderId"
      options={false}
      search={false}
      columns={columns}
      pagination={false}
      dataSource={orderDetail?.operationRefundDetails}
    />
     <>
       {
         storeType=='2'&&<>
           <Title style={{ marginTop: '50px' }} level={5}>审核动作</Title>
            <Divider />
            <ProFormRadio.Group
              name="auditStatus"
              options={[
                {
                    label:'同意',
                    value: 2,
                },
                {
                    label: '拒绝',
                    value: 3,
                }
              ]}
            />
            <ProFormTextArea
              name="suggestion"
              placeholder='请输入审核意见'
            />
            <Button type="primary" onClick={()=>{
              ref?.current?.submit()
            }}>
              确定
            </Button>
         </>
       }
     </>
    

    <Title style={{ marginTop: '50px' }} level={5}>审核记录</Title>
    <Divider />
    <ProTable<AuditRecord>
      rowKey="operateId"
      options={false}
      search={false}
      columns={columns2}
      pagination={false}
      dataSource={orderDetail?.auditRecords}
    />
  </DrawerForm>
  )
}