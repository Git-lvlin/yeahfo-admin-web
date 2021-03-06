import React, { useState, useEffect } from 'react';
import { PageContainer } from '@/components/PageContainer';
import ProForm, { ProFormText, ProFormDateTimeRangePicker, ProFormSelect,ProFormCheckbox } from '@ant-design/pro-form';
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
  const [orderStatusType,setOrderStatusType]=useState()
  const [addressVisible, setAddressVisible] = useState(false)
  const [subOrderId, setSubOrderId] = useState(null)


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
    const { time,orderStatusSet, ...rest } = form.getFieldsValue();

    return {
      orderStatus: orderType === 0 ? '' : orderType,
      startCreateTime: time?.[0]?.format('YYYY-MM-DD HH:mm:ss'),
      endCreateTime: time?.[1]?.format('YYYY-MM-DD HH:mm:ss'),
      orderStatusSet:orderType !== 0 ?[]:orderStatusSet,
      orderType:22,
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
              <div>
                <Space>
                  <Button
                    type="primary"
                    onClick={() => {
                      form?.submit();
                    }}
                  >
                    ??????
                  </Button>
                  <Button
                    onClick={() => {
                      form?.resetFields();
                      form?.submit();
                      setOrderStatusType([])
                    }}
                  >
                    ??????
                  </Button>
                  <Export
                    change={(e) => { setVisit(e) }}
                    type={`${isPurchase ? 'purchase-order-simple-export' : 'order-simple-export'}`}
                    conditions={getFieldValue}
                  />
                  <ExportHistory show={visit} setShow={setVisit} type={`${isPurchase ? 'purchase-order-simple-export' : 'order-simple-export'}`} />
                  {
                    isPurchase
                    &&
                    <>
                      <Import
                        change={(e) => { setImportVisit(e) }}
                        code="order_simple_send_goods_import"
                        conditions={getFieldValue}
                      />
                      <ImportHistory show={importVisit} setShow={setImportVisit} type="order_simple_send_goods_import" />
                    </>
                  }
                </Space>
              </div>
            );
          },
        }}
      >
        <ProFormText
          label="?????????"
          name="orderSn"
          fieldProps={{
            style: {
              marginBottom: 20,
            }
          }}
        />
        <ProFormText
          name="goodsName"
          label="????????????"
          fieldProps={{
            style: {
              marginBottom: 20
            }
          }}
        />
        <ProFormText
          name="buyerNickname"
          label="????????????"
          fieldProps={{
            style: {
              marginBottom: 20
            }
          }}
        />
        <ProFormText
          name="phone"
          label="???????????????"
          fieldProps={{
            style: {
              marginBottom: 20
            }
          }}
        />
        {/* <ProFormText
          label="????????????"
          fieldProps={{
            style: {
              marginBottom: 20
            }
          }}
        /> */}
        {isPurchase && <ProFormSelect
          label="????????????"
          name="businessType"
          options={[
            {
              value: 1,
              label: '??????????????????'
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
          label="????????????"
          fieldProps={{
            style: {
              marginBottom: 20
            },
            showTime: true,
          }}
        />
        <ProFormText
          name="consignee"
          label="?????????"
          fieldProps={{
            style: {
              marginBottom: 20
            }
          }}
        />
        <ProFormText
          name="shippingCode"
          label="????????????"
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
              label="????????????ID"
              fieldProps={{
                style: {
                  marginBottom: 20
                }
              }}
            />
            <ProFormText
              name="supplierName"
              label="??????????????????"
              fieldProps={{
                style: {
                  marginBottom: 20
                }
              }}
            />
            <ProFormCheckbox.Group
              name="orderStatusSet"
              label="????????????"
              fieldProps={{
                onChange:(val)=>{
                  setOrderType(0)
                  setOrderStatusType(val)
                },
                value:orderStatusType
              }}
              options={[
                {
                  label: '?????????',
                  value: 2
                },
                {
                  label: '?????????',
                  value: 3
                },
                {
                  label: '?????????',
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
            label: '????????????',
            value: 0
          },
          {
            label: '?????????',
            value: 1
          },
          {
            label: '?????????',
            value: 2
          },
          {
            label: '?????????',
            value: 3
          },
          {
            label: '?????????',
            value: 4
          },
          {
            label: '?????????',
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
            <div>????????????</div>
            <div>??????</div>
            {/* <div>??????</div> */}
            <div>????????????</div>
            <div>????????????</div>
            <div>??????</div>
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
                  <div className={styles.store_name}>?????????????????????{item.supplierName}???ID:{item.supplierId} ??????????????????{item.orderCount}??????{(item.supplierHelper === 1 && isPurchase) && <Tag style={{ borderRadius: 10, marginLeft: 10 }} color="#f59a23">?????????</Tag>}</div>
                  :
                  <div className={styles.store_name}>????????????ID???{item.supplierId}</div>
              }
              <div className={styles.second}>
                <Space size="large">
                  <span>???????????????{item.createTime.replace('T', ' ')}</span>
                  <span>????????????{item.orderSn}</span>
                  <span>???????????????{item.buyerNickname}</span>
                  <span>??????????????????{item.buyerPhone}</span>
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
                          <div>????????????{amountTransform(it.skuSalePrice, '/')}???    ?????????{it.skuName}</div>
                          <div>????????? <span>{it.skuNum}{it.unit}</span></div>
                          <div>????????? <span>{amountTransform(it.totalAmount, '/')}</span>???</div>
                          {isPurchase && <div>?????????????????? ??{amountTransform(it.retailSupplyPrice, '/')}</div>}
                          {it.afterSalesStatus !== 0 && <Tag style={{ borderRadius: 10 }} color="#f59a23"><span style={{ color: '#fff' }}>{it.afterSalesStatusStr}</span></Tag>}
                        </div>
                      </div>
                    ))
                  }
                </div>
                <div>
                  <Descriptions column={1} labelStyle={{ width: 100, justifyContent: 'flex-end' }}>
                    <Descriptions.Item label="???????????????">{amountTransform(item.goodsTotalAmount, '/')}???</Descriptions.Item>
                    <Descriptions.Item label="??????">+{amountTransform(item.shippingFeeAmount, '/')}???</Descriptions.Item>
                    <Descriptions.Item label="??????">
                      {
                        item?.orderType === 17
                          ? '??????????????????'
                          : `-${amountTransform(item.couponAmount, '/')}???${item?.orderType === 18 ? '??????????????????' : ''}`
                      }
                    </Descriptions.Item>
                    <Descriptions.Item label="????????????">{amountTransform(item.payAmount, '/')}???</Descriptions.Item>
                  </Descriptions>
                </div>
                {/* <div style={{ textAlign: 'center' }}>
                  {item.status === 5 ? 0 : amountTransform(item.incomeAmount, '/')}???
                </div> */}
                <div style={{ textAlign: 'center' }}>
                  {{ 1: '?????????', 2: '?????????', 3: '?????????', 4: '?????????', 5: '?????????', 6: '????????????' }[item.status]}
                </div>
                <div style={{ textAlign: 'center' }}>
                  <Tag style={{ borderRadius: 10 }} color="#FB1C1C">????????????</Tag>
                  {
                    item.relevant1688OrderId && <div>??????1688?????????{item.relevant1688OrderId}</div>
                  }
                </div>
                <div style={{ textAlign: 'center' }}>
                  {/* <a onClick={() => { history.push(`/order-management/normal-order-detail${isPurchase ? '-purchase' : ''}/${item.id}`) }}>??????</a> */}
                  <a onClick={() => { setSelectItem(item); setDetailVisible(true); }}>??????</a>
                </div>
              </div>

              <div className={styles.footer}>
                <Space size="large">
                  <span>????????????{item.consignee}</span>
                  <span>?????????{item.phone}</span>
                  <span>?????????{item.address}</span>
                  {
                    (orderType === 1 || orderType === 2)&&
                    <Button onClick={() => { setSubOrderId(item.id); setAddressVisible(true)}}>????????????</Button>
                  }
                </Space>
              </div>
            </div>
          ))
        }
        </div>
        
      </Spin>
      {
        addressVisible&&
        <EditAddress
          subOrderId={subOrderId}
          setVisible={setAddressVisible}
          visible={addressVisible}
          setChange={setSearch}
          change={search}
        />
      }
      {
        detailVisible &&
        <Detail
          id={selectItem?.id}
          visible={detailVisible}
          setVisible={setDetailVisible}
          isPurchase={isPurchase}
        />
      }

      <div
        className={styles.pagination}
      >
        <Pagination
          total={pageTotal}
          showTotal={(total, range) => `??? ${range[0]}-${range[1]} ???/?????? ${total} ???`}
          pageSize={pageSize}
          current={page}
          onChange={pageChange}
        />
      </div>
    </PageContainer>
  );
};

export default TableList;
