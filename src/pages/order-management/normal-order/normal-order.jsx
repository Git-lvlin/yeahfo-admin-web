import React, { useState, useEffect } from 'react';
import { PageContainer } from '@/components/PageContainer';
import ProForm, { ProFormText, ProFormDateTimeRangePicker, ProFormSelect, ProFormCheckbox } from '@ant-design/pro-form';
import { Button, Space, Radio, Descriptions, Pagination, Spin, Empty, Tag, Form } from 'antd';
import { history, useLocation } from 'umi';
import styles from './style.less';
import Delivery from '@/components/delivery'
import { amountTransform } from '@/utils/utils'
import { orderList, deliverGoods, orderList2 } from '@/services/order-management/normal-order';
import Export from '@/pages/export-excel/export'
import ExportHistory from '@/pages/export-excel/export-history'
import ImportHistory from '@/components/ImportFile/import-history'
import Import from '@/components/ImportFile/import'
import Detail from './detail';
import EditAddress from './edit-address'
import CloseOrder from './close-order'


const TableList = () => {
  const [data, setData] = useState([])
  const [page, setPage] = useState(1)
  const [visit, setVisit] = useState(false)
  const [pageSize, setPageSize] = useState(10)
  const [pageTotal, setPageTotal] = useState(0)
  const [orderType, setOrderType] = useState(0)
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState(0)
  // const [deliveryVisible, setDeliveryVisible] = useState(false)
  const [importVisit, setImportVisit] = useState(false)
  const isPurchase = useLocation().pathname.includes('purchase')
  const [detailVisible, setDetailVisible] = useState(false);
  const [selectItem, setSelectItem] = useState({});
  const location = useLocation();
  const [orderStatusType, setOrderStatusType] = useState()
  const [orderTypes, setOrderTypes] = useState(0)
  const [addressVisible, setAddressVisible] = useState(false)
  const [subOrderId, setSubOrderId] = useState(null)
  const [orderVisible, setOrderVisible] = useState(false)



  const [form] = Form.useForm()


  const pageChange = (a, b) => {
    setPage(a)
    setPageSize(b)
  }

  const orderTypeChange = (e) => {
    setOrderStatusType([])
    setOrderType(e.target.value)
    setPage(1)
  }

  const orderShipRequest = (values) => {
    deliverGoods({
      id: orderId,
      shippingCode: values.expressNo,
      expressType: values.expressId,
      expressName: values.expressName
    }, { showSuccess: true })
      .then(res => {
        if (res.code === 0) {
          setSearch(search + 1)
        }
      })
  }

  const getFieldValue = () => {
    const { time, orderStatusSet, ...rest } = form.getFieldsValue();

    return {
      orderStatus: orderType === 0 ? '' : orderType,
      startCreateTime: time?.[0]?.format('YYYY-MM-DD HH:mm:ss'),
      endCreateTime: time?.[1]?.format('YYYY-MM-DD HH:mm:ss'),
      orderStatusSet: orderType !== 0 ? [] : orderStatusSet,
      orderTypes: orderTypes == 0 ? [2, 3, 4, 11, 17, 18] : [orderTypes],
      ...rest,
    }
  }

  useEffect(() => {
    form.setFieldsValue({
      ...location?.query,
    })
  }, [])

  useEffect(() => {
    setLoading(true);
    const apiMethod = isPurchase ? orderList2 : orderList;
    apiMethod({
      page,
      size: pageSize,
      ...getFieldValue(),
    })
      .then(res => {
        if (res.code === 0) {
          setData(res.data.records)
          setPageTotal(res.data.total)
        }
      })
      .finally(() => {
        setLoading(false);
      })
  }, [page, pageSize, orderType, form, search])
  return (
    <PageContainer>
      <ProForm
        // {...formItemLayout}
        form={form}
        style={{ backgroundColor: '#fff', padding: 10, paddingBottom: '0px' }}
        layout="inline"
        onFinish={() => {
          setPage(1)
          setSearch(search + 1)
        }}
        submitter={{
          render: ({ form }, doms) => {
            return (
              <div style={{marginBottom: 20}}>
                <Space>
                  <Button
                    type="primary"
                    onClick={() => {
                      form?.submit();
                    }}
                  >
                    查询
                  </Button>
                  <Button
                    onClick={() => {
                      form?.resetFields();
                      form?.submit();
                      setOrderTypes(0)
                      setOrderStatusType([])
                    }}
                  >
                    重置
                  </Button>
                  <Export
                    change={(e) => { setVisit(e) }}
                    type={`${isPurchase ? 'purchase-order-common-export' : 'order-common-export'}`}
                    conditions={getFieldValue}
                  />
                  <ExportHistory show={visit} setShow={setVisit} type={`${isPurchase ? 'purchase-order-common-export' : 'order-common-export'}`} />
                  {
                    isPurchase
                    &&
                    <>
                      <Import
                        change={(e) => { setImportVisit(e) }}
                        code="order_common_send_goods_import"
                        conditions={getFieldValue}
                      />
                      <ImportHistory show={importVisit} setShow={setImportVisit} type="order_common_send_goods_import" />
                    </>
                  }
                </Space>
              </div>
            );
          },
        }}
      >
        <ProFormText
          label="订单号"
          name="orderSn"
          fieldProps={{
            style: {
              marginBottom: 20,
            }
          }}
        />
        <ProFormText
          name="goodsName"
          label="商品名称"
          fieldProps={{
            style: {
              marginBottom: 20
            }
          }}
        />
        <ProFormText
          name="buyerNickname"
          label="下单用户"
          fieldProps={{
            style: {
              marginBottom: 20
            }
          }}
        />
        <ProFormText
          name="phone"
          label="下单手机号"
          fieldProps={{
            style: {
              marginBottom: 20
            }
          }}
        />
        <ProFormText
          label="用户ID"
          name="buyerId"
          fieldProps={{
            style: {
              marginBottom: 20
            }
          }}
        />
        {/* <ProFormText
          label="所属商家"
          fieldProps={{
            style: {
              marginBottom: 20
            }
          }}
        /> */}
        <ProFormSelect
          name="orderType"
          label="订单类型"
          options={[
            { value: '2', label: '秒约订单' },
            { value: '3', label: '拼团订单' },
            // { value: '4', label: '团约订单' },
            { value: '11', label: '1688订单' },
            { value: '17', label: '盲盒活动订单' },
            { value: '18', label: '签到活动订单' },
            { value: '666', label: '氢原子购买订单' },
            { value: '888', label: '氢原子押金订单' },
            { value: '999', label: '氢原子启动订单' },
            { value: '205', label: '分享订单' },
          ]}
          fieldProps={{
            style: {
              marginBottom: 20,
              width: 180,
            },
            onChange: (val) => {
              setOrderTypes(val || 0)
            }
          }}
        />
        {isPurchase && <ProFormSelect
          label="商家类型"
          name="businessType"
          options={[
            {
              value: 1,
              label: '代理运营商家'
            }
          ]}
          fieldProps={{
            style: {
              marginBottom: 20,
              width: 180,
            }
          }}
        />}
        <ProFormDateTimeRangePicker
          name="time"
          label="下单时间"
          fieldProps={{
            style: {
              marginBottom: 20
            },
            showTime: true,
          }}
        />
        <ProFormText
          name="consignee"
          label="收件人"
          fieldProps={{
            style: {
              marginBottom: 20
            }
          }}
        />
        <ProFormText
          name="shippingCode"
          label="物流单号"
          fieldProps={{
            style: {
              marginBottom: 20
            }
          }}
        />
        {
          isPurchase &&
          <>
            <ProFormText
              name="supplierId"
              label="供应商家ID"
              fieldProps={{
                style: {
                  marginBottom: 20
                }
              }}
            />
            <ProFormText
              name="supplierName"
              label="供应商家名称"
              fieldProps={{
                style: {
                  marginBottom: 20
                }
              }}
            />
            <ProFormCheckbox.Group
              name="orderStatusSet"
              label="订单状态"
              fieldProps={{
                onChange: (val) => {
                  setOrderType(0)
                  setOrderStatusType(val)
                },
                value: orderStatusType
              }}
              options={[
                {
                  label: '待发货',
                  value: 2
                },
                {
                  label: '已发货',
                  value: 3
                },
                {
                  label: '已完成',
                  value: 4
                },
              ]}
            />
          </>
        }

      </ProForm>
      <Radio.Group
        style={{ marginTop: 20 }}
        buttonStyle="solid"
        optionType="button"
        size="large"
        value={orderType}
        onChange={orderTypeChange}
        options={[
          {
            label: '全部订单',
            value: 0
          },
          {
            label: '待付款',
            value: 1
          },
          {
            label: '拼团中',
            value: 7
          },
          {
            label: '待发货',
            value: 2
          },
          {
            label: '已发货',
            value: 3
          },
          {
            label: '已完成',
            value: 4
          },
          {
            label: '已关闭',
            value: 5
          },
        ]
        }
      />
      <Spin
        spinning={loading}
      >
        <div className={styles.list_header_wrap}>
          <div className={styles.list_header}>
            <div>商品信息</div>
            <div>金额</div>
            {/* <div>实收</div> */}
            <div>订单状态</div>
            <div>订单类型</div>
            <div>操作</div>
          </div>
        </div>
        {data.length === 0 &&
          <div>
            <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
          </div>
        }
        <div style={{ marginBottom: 10 }}>
          {
            data.map(item => (
              <div className={styles.list} key={item.id}>
                {
                  isPurchase
                    ?
                    <div className={styles.store_name}>供应商家名称：{item.supplierName}（ID:{item.supplierId} 总计出单数：{item.orderCount}单）{(item.supplierHelper === 1 && isPurchase) && <Tag style={{ borderRadius: 10, marginLeft: 10 }} color="#f59a23">代运营</Tag>}</div>
                    :
                    <div className={styles.store_name}>供应商家ID：{item.supplierId}</div>
                }
                <div className={styles.second}>
                  <Space size="large">
                    <span>下单时间：{item.createTime.replace('T', ' ')}</span>
                    <span>订单号：{item.orderSn}</span>
                    <span>下单用户：{item.buyerNickname}</span>
                    <span>用户手机号：{item.buyerPhone}</span>
                  </Space>
                </div>

                <div className={styles.body}>
                  <div className={styles.goods_info}>
                    {
                      item.orderItem.map(it => (
                        <div key={it.skuId}>
                          <img width="100" height="100" src={it.skuImageUrl} />
                          <div className={styles.info}>
                            <div>{it.goodsName}</div>
                            <div>{({ 2: '秒约', 3: '拼团', 4: '团约', 11: '1688' }[item.orderType] || '秒约')}价：{amountTransform(it.skuSalePrice, '/')}元    规格：{it.skuName}</div>
                            <div>数量： <span>{it.skuNum}{it.unit}</span></div>
                            <div>小计： <span>{amountTransform(it.totalAmount, '/')}</span>元</div>
                            {isPurchase && <div>零售供货价： ¥{amountTransform(it.retailSupplyPrice, '/')}</div>}
                            {it.afterSalesStatus !== 0 && <Tag style={{ borderRadius: 10 }} color="#f59a23"><span style={{ color: '#fff' }}>{it.afterSalesStatusStr}</span></Tag>}
                          </div>
                        </div>
                      ))
                    }
                  </div>
                  <div>
                    <Descriptions column={1} labelStyle={{ width: 100, justifyContent: 'flex-end' }}>
                      <Descriptions.Item label="商品总金额">{amountTransform(item.goodsTotalAmount, '/')}元</Descriptions.Item>
                      <Descriptions.Item label="运费">+{amountTransform(item.shippingFeeAmount, '/')}元</Descriptions.Item>
                      <Descriptions.Item label="红包">
                        {
                          item?.orderType === 17
                            ? '盲盒全额抵扣'
                            : `-${amountTransform(item.couponAmount, '/')}元${item?.orderType === 18 ? '（签到红包）' : ''}`
                        }
                      </Descriptions.Item>
                      <Descriptions.Item label="用户实付">{amountTransform(item.payAmount, '/')}元</Descriptions.Item>
                    </Descriptions>
                  </div>
                  {/* <div style={{ textAlign: 'center' }}>
                  {item.status === 5 ? 0 : amountTransform(item.incomeAmount, '/')}元
                </div> */}
                  <div style={{ textAlign: 'center' }}>
                    {{ 1: '待付款', 2: '待发货', 3: '已发货', 4: '已完成', 5: '已关闭', 6: '无效订单' }[item.status]}
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    {
                      item.subType?<Tag style={{ borderRadius: 10,marginTop:'10px' }} color="#f59a23">{({ 4:'氢原子购买',3:'氢原子押金',2:'氢原子启动',5:'分享' }[item.subType])}订单</Tag>
                      : <Tag style={{ borderRadius: 10 }} color="#f59a23">{({ 2: '秒约', 3: '拼团', 4: '团约', 11: '1688', 17: '盲盒活动', 18: '签到活动',666:'氢原子购买订单',888:'氢原子押金订单',999:'氢原子启动订单'}[item.orderType] || '秒约')}订单</Tag>
                    }
                    {
                      item.relevant1688OrderId && <div>关联1688单号：{item.relevant1688OrderId}</div>
                    }
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    {/* <a onClick={() => { history.push(`/order-management/normal-order-detail${isPurchase ? '-purchase' : ''}/${item.id}`) }}>详情</a> */}
                    <a onClick={() => { setSelectItem(item); setDetailVisible(true); }}>详情</a>
                  </div>
                </div>

                <div className={styles.footer}>
                  <Space size="large">
                    <span>收货人：{item.consignee}</span>
                    <span>电话：{item.phone}</span>
                    <span>地址：{item.address}</span>
                    {
                      (orderType === 1 || orderType === 2)&&
                      <Button onClick={() => { setSubOrderId(item.id); setAddressVisible(true)}}>修改地址</Button>
                    }
                    {
                      orderType === 2&&
                      <Button onClick={() =>{ setSubOrderId(item.id); setOrderVisible(true) }}>关闭订单</Button>
                    }
                  </Space>
                </div>
              </div>
            ))
          }
        </div>
      </Spin>
      {
        detailVisible &&
        <Detail
          id={selectItem?.id}
          visible={detailVisible}
          setVisible={setDetailVisible}
          isPurchase={isPurchase}
        />
      }
      {
        addressVisible &&
        <EditAddress
          subOrderId={subOrderId}
          setVisible={setAddressVisible}
          visible={addressVisible}
          setChange={setSearch}
          change={search}
        />
      }
      {
        orderVisible &&
        <CloseOrder
          subOrderId={subOrderId}
          setVisible={setOrderVisible}
          visible={orderVisible}
          setChange={setSearch}
          change={search}
        />
      }
      <div
        className={styles.pagination}
      >
        <Pagination
          total={pageTotal}
          showTotal={(total, range) => `第 ${range[0]}-${range[1]} 条/总共 ${total} 条`}
          pageSize={pageSize}
          current={page}
          onChange={pageChange}
        />
      </div>
    </PageContainer>
  );
};

export default TableList;
