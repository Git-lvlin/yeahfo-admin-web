import React, { useState, useEffect,useRef } from 'react';
import { Input, Form, Divider, message, Button,Space,Descriptions,Image } from 'antd';
import { FormattedMessage, formatMessage } from 'umi';
import ProTable from '@ant-design/pro-table';
import ProForm, { ProFormText,ProFormDateTimeRangePicker,ProFormTextArea,ProFormCheckbox,ProFormRadio,DrawerForm } from '@ant-design/pro-form';
import { history, connect } from 'umi';
import { amountTransform } from '@/utils/utils'
import { activityData,activityGoods } from '@/services/intensive-activity-management/penny-activity';
import moment, { now } from 'moment';
import { PageContainer } from '@ant-design/pro-layout';

const formItemLayout = {
  labelCol: { span: 3 },
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

export default (props) => {
  const {setVisible,visible,onClose,callback,record}=props
  const [detailList,setDetailList]=useState()
  const [goosList,setGoosList]=useState()
  const [loading,setLoading]=useState(false)
  const [form] = Form.useForm()
  const [time,setTime]=useState()
  const ref=useRef()
  const columns= [
    {
      title: 'skuID',
      dataIndex: 'skuId',
      valueType: 'text',
      hideInSearch: true,
    },
    {
      title: '日期',
      dataIndex: 'wholesaleStartTime',
      valueType: 'dateRange',
      hideInTable:true,
    },
    {
      title: '基本信息',
      dataIndex: 'goodsName',
      valueType: 'text',
      hideInSearch: true,
      render:(_,data)=>{
        return <div style={{display:'flex'}}>
                <Image src={data.skuImageUrl} alt="" width='50px' height='50px' />
                <div style={{marginLeft:'10px'}}>
                  <p style={{fontSize:'14px'}}>{data.goodsName}</p>
                  <p style={{fontSize:'12px'}}>规格：{data.skuName}</p>
                </div>
            </div>
      }
    },
    {
      title: '采购店主数',
      dataIndex: 'procurementStorekeeperNum',
      valueType: 'text',
      hideInSearch: true,
    },
    {
      title: 'B端采购订单数',
      dataIndex: 'bProcurementOrderNum',
      valueType: 'text',
      hideInSearch: true,
    },
    {
      title: 'B端采购份数',
      dataIndex: 'bProcurementNum',
      valueType: 'text',
      hideInSearch: true,
    },
    {
      title: 'C端零售份数',
      dataIndex: 'cSaleNum',
      valueType: 'text',
      hideInSearch: true,
    },
    {
      title: 'C端转化率',
      dataIndex: 'cTranslateRate',
      valueType: 'text',
      hideInSearch: true,
      render:(_)=>{
        return `${amountTransform(parseFloat(_),'*').toFixed(2)}%`
      }
    }
  ];
  useEffect(() => {
    const params={
      activityId:`${record?.id}`,
      startTime:time?.wholesaleStartTime?.[0]?moment(time?.wholesaleStartTime?.[0]).format('YYYY-MM-DD'):moment(record?.startTime*1000).format('YYYY-MM-DD'),
      endTime:time?.wholesaleStartTime?.[1]?moment(time?.wholesaleStartTime?.[1]).format('YYYY-MM-DD'):moment(record?.endTime*1000).format('YYYY-MM-DD'),
    }
    activityData(params).then(res=>{
      if(res.code==0){
        setDetailList(res.data[0])
      }
    })

  }, [time])

  const onsubmit = (values) => {
    setVisible(false)
    callback(true)
  }


  return (
      <DrawerForm
        title={`活动编号：${record.id}`}
        onVisibleChange={setVisible}
        visible={visible}
        form={form}
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
              ];
            }
          }
        }
        onFinish={async (values) => {
            await onsubmit(values);
        }
        }
      {...formItemLayout}
    >
      <ProTable
        actionRef={ref}
        headerTitle="活动商品"
        rowKey="skuId"
        options={false}
        params={{
          activityId:`${record?.id}`
        }}
        request={activityGoods}
        search={{
          defaultCollapsed: false,
          labelWidth: 100,
          optionRender: (searchConfig, formProps, dom) => [
              ...dom.reverse()
          ],
        }}
        tableExtraRender={(_, data) => (
          <Descriptions title="活动数据" labelStyle={{fontWeight:'bold'}} column={9} layout="vertical" bordered>
            <Descriptions.Item  label="采购店主数">{detailList?.procurementStorekeeperNum}  </Descriptions.Item>
            <Descriptions.Item  label="B端采购订单数">{detailList?.bProcurementOrderNum}  </Descriptions.Item>
            <Descriptions.Item  label="B端采购份数">{detailList?.bProcurementNum}  </Descriptions.Item>
            <Descriptions.Item  label="C端零售份数">{detailList?.cSaleNum}  </Descriptions.Item>
            <Descriptions.Item  label="零售新用户数">{detailList?.cSaleNewUser}  </Descriptions.Item>
            <Descriptions.Item  label="C端转化率">{amountTransform(parseFloat(detailList?.cTranslateRate),'*').toFixed(2)}%</Descriptions.Item>
          </Descriptions>
        )}
        onSubmit={(val)=>{
          setTime(val)
        }}
        columns={columns}
        pagination={{
            pageSize: 10,
            showQuickJumper: true,
        }}
        />
    </DrawerForm>
  );
};
