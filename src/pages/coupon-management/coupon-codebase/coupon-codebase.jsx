import React, { useState, useRef,useEffect } from 'react';
import { Button} from 'antd';
import ProTable from '@ant-design/pro-table';
import { couponCcodebase,couponCodebaseEnd } from '@/services/coupon-management/coupon-codebase';
import { DrawerForm} from '@ant-design/pro-form';
import XLSX from 'xlsx'

const formItemLayout = {
  labelCol: { span: 2 },
  wrapperCol: { span: 14 },
  layout: {
    labelCol: {
      span: 10,
    },
    wrapperCol: {
      span: 14,
    },
  }
};


export default props => {
  const {setCodeVisible,codeVisible,onClose,callback,id}=props
  const ref=useRef()
  const [couponInfo,setCouponInfo]=useState([])
  const [libraryId,setLibraryId]=useState(1)
  const [byid,setByid]=useState()

  const columns=[
    {
      title: '红包名称',
      dataIndex: 'couponName',
      valueType: 'text',
    },
    {
      title: '红包类型',
      dataIndex: 'couponType',
      valueType: 'select',
      valueEnum: {
        1: '满减红包',
        2: '折扣红包',
        3: '立减红包'
      }
    },
    {
      title: '使用范围',
      dataIndex: 'useType',
      valueType: 'select',
      valueEnum: {
        1: '秒约商品',
        2: '集约商品',
      }
    },
    {
      title: '有效期',
      dataIndex: 'activityTimeDisplay',
      valueType: 'text',
      ellipsis:true
    },
    {
      title: '状态',
      dataIndex: 'couponStatus',
      valueType: 'select',
      valueEnum: {
        1: '未开始',
        2: '进行中',
        3: '已结束',
        4: '已终止'
      },
    },
    {
      title: '发行量',
      dataIndex: 'issueQuantity',
      valueType: 'text',
      render:(_)=>{
        if(_==-1){
          return <p>不限量</p>
        }else{
          return _
        }
      }
    },
    {
      title: '已领取',
      dataIndex: 'lqCouponQuantity',
      valueType: 'text',
    },
    {
      title: '待领取',
      dataIndex: 'unLqCouponQuantity',
      valueType: 'text',
      render:(_)=>{
        if(parseInt(_)<0){
          return <p>不限量</p>
        }else{
          return _
        }
      }
    },
    {
      title: '已使用',
      dataIndex: 'useCouponQuantity',
      valueType: 'text',
    },
    {
      title: '未使用',
      dataIndex: 'unUseCouponQuantity',
      valueType: 'text',
    },
  ]
  const columns2 = [
    {
        title: '红包码',
        dataIndex: 'memberCouponCode',
        valueType: 'text',
    },
    {
        title: '领取会员昵称',
        dataIndex: 'memberNicheng',
        valueType: 'text',
        fieldProps: {
            placeholder: '请输入会员昵称'
        }
    },
    {
        title: '会员手机号',
        dataIndex: 'memberMobile',
        valueType: 'text'
    },
    {
        title: '领取时间',
        dataIndex: 'createTime',
        valueType: 'text',
        hideInSearch: true,
    },
    {
        title: '面值',
        dataIndex: 'couponAmountDisplay',
        valueType: 'text',
        hideInSearch: true,
    },
    {
        title: '使用时间',
        dataIndex: 'actTime',
        valueType: 'text',
        hideInSearch: true,
    },
    {
        title: '订单编号',
        dataIndex: 'orderSn',
        render:(_,data)=>{
          return <>
           <p>子订单：{data.orderSnSon}</p>
           <p>父订单：{data.orderSn}</p>
          </>
        }
    },
    {
        title: '红包状态',
        dataIndex: 'status',
        valueType: 'select',
        valueEnum: {
          1: '未使用',
          2: '已使用',
          3: '已过期',
          4: '已作废'
        },
        hideInTable:true
    },
    {
        title: '红包状态',
        dataIndex: 'status',
        valueType: 'text',
        valueEnum: {
          1: '未使用',
          2: '已使用',
          3: '已过期',
          4: '已作废'
        },
        hideInSearch: true
    },
    {
        title: '领红包时间',
        key: 'dateRange',
        dataIndex: 'createdAtRange',
        valueType: 'dateRange',
        hideInTable:true
    }
    
  ];
 useEffect(()=>{
  setLibraryId(parseInt(id))
 },[id])
//导出数据
// const exportExcel = (searchConfig) => {
//   couponCcodebase({id:libraryId,...searchConfig.form.getFieldsValue()}).then(res => {
//     if (res.code === 0) {
//       const data = res.data.memberCouponList.records.map(item => {
//         const { ...rest } = item;
//         return {
//           ...rest,
//         }
//       });
//       const wb = XLSX.utils.book_new();
//       const ws = XLSX.utils.json_to_sheet([
//         {
//           memberCouponCode: '红包码',
//           memberNicheng: '领取会员昵称',
//           memberMobile: '会员手机号',
//           createTime: '领取时间',
//           actTime: '使用时间',
//           orderSn: '订单编号',
//           status: '红包状态',
//         },
//         ...data
//       ], {
//         header: [
//           'memberCouponCode',
//           'memberNicheng',
//           'memberMobile',
//           'createTime',
//           'actTime',
//           'orderSn',
//           'status'
//         ],
//         skipHeader: true
//       });
//       XLSX.utils.book_append_sheet(wb, ws, "file");
//       XLSX.writeFile(wb, `${+new Date()}.xlsx`)

//     }
//   })
// }
const filterData=(res)=>{
  setCouponInfo([res.couponInfo])
  return res.memberCouponList.records
  }
const onIpute=(res)=>{
  setByid(res.selectedRowKeys.toString())
}

  return (
    <>
     <DrawerForm
        title='码库'
        onVisibleChange={setCodeVisible}
        visible={codeVisible}
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
              return [
                <Button style={{marginLeft:'250px'}} type="primary" key="submit" onClick={() => {
                  props.form?.submit?.()
                }}>
                  确定
                </Button>,
                 <Button key='goback' type="default" onClick={() => {onClose();setCodeVisible(false)}}>返回</Button>
              ];
            }
          }
        }
        onFinish={async (values) => {
          onClose()
          setCodeVisible(false)
        }
        }
        {...formItemLayout}
    >
     <ProTable
        toolBarRender={false}
        search={false}
        rowKey="couponName"
        columns={columns}
        dataSource={couponInfo}
        style={{margin:'40px 0'}}
      />
      <ProTable
        rowKey="id"
        options={false}
        actionRef={ref}
        params={{
          id:libraryId
        }}
        postData={filterData}
        request={couponCcodebase}
        search={{
          defaultCollapsed: true,
          labelWidth: 100,
          optionRender: (searchConfig, formProps, dom) => [
            ...dom.reverse(),
            <Button key='cancellation'  onClick={()=>{
              couponCodebaseEnd({ids:byid}).then(res=>{
                if(res.code==0){
                  ref.current.reload();
                  return true;
                }
              })
            }}>作废</Button>,
            // <Button onClick={()=>{exportExcel(searchConfig)}} key="out">
            //   导出数据
            // </Button>
          ],
        }}
        columns={columns2}
        rowSelection={{}}
        tableAlertOptionRender={onIpute}
      />
      </DrawerForm>
      </>
  );
};
