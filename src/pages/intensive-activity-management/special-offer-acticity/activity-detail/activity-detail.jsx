import React, { useState, useEffect, useRef } from 'react';
import { getActiveConfigById } from '@/services/intensive-activity-management/special-offer-acticity';
import { Divider, Form, Spin, Button,Image,InputNumber,Row,Col,Descriptions,Typography } from 'antd';
import ProForm,{ DrawerForm,ProFormRadio,ProFormText,ProFormDateTimeRangePicker,ProFormTextArea,ProFormCheckbox} from '@ant-design/pro-form';
import ProTable from '@ant-design/pro-table';
import { amountTransform } from '@/utils/utils'
import { PageContainer } from '@/components/PageContainer';
import moment from 'moment'
import styles from './style.less'
const { Title } = Typography;


export default props => {
  const { visible, setVisible, callback,id,onClose} = props;
  const ref = useRef()
  const [form] = Form.useForm()
  const [detailData, setDetailData] = useState([])

  useEffect(() => {
    if (id) {
      getActiveConfigById({id}).then(res=>{
          setDetailData(res.data)
      })
    }
  }, [])

  const columns= [
    {
      title: 'spuID',
      dataIndex: 'spuId',
    },
    {
      title: 'skuID',
      dataIndex: 'skuId',
    },
    {
      title: '商品分类',
      dataIndex: 'gcName1',
      valueType: 'text',
      ellipsis:true,
      hideInSearch:true,
      render:(_,data)=>{
        return <p>{_}-{data?.gcName2}</p>
      }
    },
    {
      title: '商品主图',
      dataIndex: 'imageUrl',
      valueType: 'image',
      hideInSearch:true
    },
    {
      title: '商品名称',
      dataIndex: 'goodsName',
      valueType: 'text',
      ellipsis:true,
      hideInSearch:true
    },
    {
      title: '商品规格',
      dataIndex: 'gcName',
      valueType: 'text',
      ellipsis:true,
      hideInSearch:true
    },
    {
      title: '批发供货价',
      dataIndex: 'wholesaleSupplyPrice',
      hideInSearch: true,
      render:(_,data)=>{
        return <p>{amountTransform(_, '/')}元/{data?.unit}</p>
      }
    },
    {
      title: '平均运费',
      dataIndex: 'wholesaleFreight',
      hideInSearch: true,
      editable:false,
      render:(_,data)=>{
        return <p>{amountTransform(_, '/')}元/{data?.unit}</p>
      }
    },
    {
      title: '集约活动名称',
      dataIndex: 'name',
      valueType: 'text',
      ellipsis:true,
      hideInSearch:true
    },
    {
      title: '集约活动ID',
      dataIndex: 'wsId',
      valueType: 'text',
      hideInSearch:true
    },
    {
      title: '集约活动状态',
      dataIndex: 'wholesaleStatusDesc',
      valueType: 'text',
      hideInSearch: true,
    },
    {
      title: '集约活动开始时间',
      dataIndex: 'wholesaleStartTime',
      valueType: 'text',
      hideInSearch:true,
      editable:false,
      render:(_)=>{return <p>{moment(_*1000).format('YYYY-MM-DD HH:mm:ss')}</p>}
    },
    {
      title: '采购单下单截止时间',
      dataIndex: 'endTimeAdvancePayment',
      valueType: 'text',
      hideInSearch:true,
      editable:false,
      render:(_)=>{return <p>{moment(_*1000).format('YYYY-MM-DD HH:mm:ss')}</p>}
    },
    {
      title: '活动状态',
      dataIndex: 'wholesaleStatus',
      valueType: 'select',
      hideInTable:true,
      valueEnum: {
          1: '待开始',
          2: '进行中',
      },
    },
    {
      title: '集约库存',
      dataIndex: 'totalStockNum',
      hideInSearch: true,
      render: (_,data)=> {
        return <p>{_}{data?.unit}</p>
      },
    },
    {
      title: '活动库存',
      dataIndex: 'actStockNum',
      hideInSearch: true,
      editable:false,
      render: (_,data)=> {
        return <p>{_}{data?.unit}</p>
      },
    },
    {
      title: '集采箱规单位量',
      dataIndex: 'batchNumber',
      hideInSearch: true,
      render:(_,data)=>{
        return <p>{_}{data?.unit}/{data?.wsUnit}</p>
      }
    },
    {
      title: '单次起订量',
      dataIndex: 'minNum',
      hideInSearch: true,
      render:(_,data)=>{
        return <p>{_}{data?.unit}</p>
      }
    },
    {
      title: '最大限购量',
      dataIndex: 'buyLimit',
      hideInSearch: true,
    },
    {
      title: '活动价',
      dataIndex: 'price',
      hideInSearch: true,
      render: (_,data) =>{
        return <p>{amountTransform(_, '/')}元/{data?.unit}</p>
    }
    }
  ]; 
  
  return (
    <DrawerForm
      onVisibleChange={setVisible}
      title='活动详情'
      visible={visible}
      width={1500}
      drawerProps={{
        forceRender: true,
        destroyOnClose: true,
        onClose: () => {
          onClose();
        }
      }}
      submitter={{
        render: (props, defaultDoms) => {
          return [
            ...defaultDoms
          ];
        },
        }}
        onFinish={async (values) => {
          await setVisible(false);callback(true)
        }}
      className={styles?.activity_detail}
    >
      <Row style={{ marginTop: 50 }}>
          <Title style={{ marginBottom: -10 }} level={5}>活动商品</Title>
          <Divider />
          <ProTable
            actionRef={ref}
            rowKey="spuId"
            options={false}
            dataSource={detailData.content?.goods}
            search={false}
            columns={columns}
            scroll={{x: 'max-content'}}
            />
      </Row>
      <Title style={{ marginBottom: -10 }} level={5}>活动参数</Title>
          <Divider />
          <Descriptions style={{ flex: 1 }} labelStyle={{ textAlign: 'right', width: 200, display: 'inline-block' }}>
            <Descriptions.Item label="活动名称">{detailData?.name}</Descriptions.Item>
            <Descriptions.Item label="活动时间">
                {moment(detailData?.startTime*1000).format('YYYY-MM-DD HH:mm:ss')} 至 {moment(detailData?.endTime*1000).format('YYYY-MM-DD HH:mm:ss')}
            </Descriptions.Item>
            <Descriptions.Item label="C端可购买数量">
             {
               detailData?.content?.buyerType==0?
               <p>不限</p>
               :
               <p>{detailData?.content?.buyerLimit}{detailData?.content?.unit} 每人/每天</p>
             } 
            </Descriptions.Item>
            <Descriptions.Item label="C端可购买时间">
            {
               detailData?.content?.buyerTimeType==0?
               <p>{detailData?.content?.buyerStartTime}~{detailData?.content?.buyerEndTime}</p>
               :
               <p>{detailData?.content?.buyerStartTime}~{detailData?.content?.buyerEndTime}（每天）</p>
             } 
            </Descriptions.Item>
            <Descriptions.Item label="参与活动的店铺">
            {{1:"生鲜店铺"}[detailData?.content?.joinShopType]}
            </Descriptions.Item>
            <Descriptions.Item label="活动最近一次操作人">
            {detailData?.lastEditor}
            </Descriptions.Item>
            <Descriptions.Item label="活动最近一次操作时间">
            {moment(detailData?.updateTime*1000).format('YYYY-MM-DD HH:mm:ss')}
            </Descriptions.Item>
          </Descriptions>
          <Descriptions style={{ flex: 1 }} labelStyle={{ textAlign: 'right', width: 200, display: 'inline-block' }}>
            <Descriptions.Item label="店主活动规则">
              <pre className={styles.line_feed}>{detailData?.content?.ruleText}</pre>
            </Descriptions.Item>
          </Descriptions>
          <Descriptions style={{ flex: 1 }} labelStyle={{ textAlign: 'right', width: 200, display: 'inline-block' }}>
            <Descriptions.Item label="消费者活动规则">
              <pre className={styles.line_feed}>{detailData?.content?.ruleTextC}</pre>
            </Descriptions.Item>
          </Descriptions>
    </DrawerForm>
  );
};
