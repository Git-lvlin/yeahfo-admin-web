import React, { useState, useEffect, useRef } from 'react';
import { getActiveConfigById } from '@/services/intensive-activity-management/penny-activity';
import { Divider, Form, Spin, Button,Image,InputNumber,Row,Col,Descriptions,Typography } from 'antd';
import ProForm,{ ModalForm,ProFormRadio,ProFormText,ProFormDateTimeRangePicker,ProFormTextArea,ProFormCheckbox,DrawerForm} from '@ant-design/pro-form';
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
      title: 'skuID',
      dataIndex: 'skuId',
      valueType: 'text',
      editable:false
    },
    {
      title: '基本信息',
      dataIndex: 'goodsName',
      valueType: 'text',
      hideInSearch:true,
      editable:false,
      render:(_,data)=>{
        return <div style={{display:'flex'}}>
                <Image src={data.imageUrl} alt="" width='50px' height='50px' />
                <div style={{marginLeft:'10px'}}>
                  <p style={{fontSize:'14px'}}>{data.goodsName}</p>
                  <p style={{fontSize:'12px'}}>规格：{data.skuName}</p>
                </div>
            </div>
      }
    },
    {
      title: '集约活动名称',
      dataIndex: 'name',
      valueType: 'text',
      ellipsis:true,
      hideInSearch:true,
      editable:false
    },
    {
      title: '集约活动时段',
      dataIndex: 'wholesaleStartTime',
      valueType: 'text',
      hideInSearch:true,
      editable:false,
      render:(_,data)=>{
        return <p>{moment(data.wholesaleStartTime*1000).format('YYYY-MM-DD HH:mm:ss')}-{moment(data.endTimeAdvancePayment*1000).format('YYYY-MM-DD HH:mm:ss')}</p>
      }
    },
    {
      title: '集约活动状态',
      dataIndex: 'wholesaleStatusDesc',
      valueType: 'text',
      editable:false
    },
    {
      title: '集约单次限量',
      dataIndex: 'minNum',
      hideInSearch: true,
      editable:false,
      render: (_,data)=> {
        return <p>{data?.minNum} - {data?.maxNum}{data?.unit}</p>
      },
    },
    {
      title: '集约价',
      dataIndex: 'wholesaleSupplyPrice',
      hideInSearch: true,
      render: (_,data)=> {
        return <p>{amountTransform(_, '/').toFixed(2)}元/{data?.unit}</p>
      },
      editable:false
    },
    {
      title: '集约库存',
      dataIndex: 'totalStockNum',
      hideInSearch: true,
      editable:false,
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
      title: '状态',
      dataIndex: 'status',
      valueType: 'text',
      hideInSearch: true,
      editable:false,
      valueEnum: {
        0: '已禁用',
        1: '已启用',
      },
    },
    {
      title: '活动价',
      dataIndex: 'price',
      hideInSearch: true,
      render: (_,data)=> {
        return <p>{amountTransform(_, '/')}元/{data?.unit}</p>
      },
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
            pagination={{
              pageSize: 5,
              showQuickJumper: true,
            }}
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
            <Descriptions.Item label="每位店主总限量">
              {detailData?.content?.shoperLimitAll}
            </Descriptions.Item>
            <Descriptions.Item label="每位店主单次限量">{detailData?.content?.shoperLimitOnece}</Descriptions.Item>
            <Descriptions.Item label="每位消费者限量">
              {detailData?.content?.buyerLimit}
            </Descriptions.Item>
            <Descriptions.Item label="店主再次参与活动条件">
            需完成已有推广任务 {amountTransform(detailData?.content?.joinAgainPercent,'*')}%
            </Descriptions.Item>
            <Descriptions.Item label="参与活动的店铺">
              {{1:"生鲜店铺"}[detailData?.content?.joinShopType]}
            </Descriptions.Item>
            <Descriptions.Item label="参与活动的消费者">
              {{1:'全部消费者',2:'从未下过单的消费者（新人）'}[detailData?.content?.joinBuyerType]}
            </Descriptions.Item>
            <Descriptions.Item label="最近操作人">
              {detailData?.lastEditor}
            </Descriptions.Item>
            <Descriptions.Item label="最近操作时间">
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
