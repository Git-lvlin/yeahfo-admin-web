import React, { useState, useEffect } from 'react';
import { PageContainer } from '@/components/PageContainer';
import ProForm, { ProFormText, ProFormDateTimeRangePicker, ProFormSelect,ProFormCheckbox } from '@ant-design/pro-form';
import { Button, Space, Radio, Descriptions, Pagination, Spin, Empty, Form, Modal, Tag, Popconfirm } from 'antd';
import { history, useLocation } from 'umi';
import { ExclamationCircleOutlined } from '@ant-design/icons'
import moment from 'moment';
import styles from './style.less';
import { orderList, refundAllRetailOrders, getPurchaseOrderList, refundOrder } from '@/services/order-management/supplier-order';
import { amountTransform } from '@/utils/utils'
import Export from '@/pages/export-excel/export'
import ExportHistory from '@/pages/export-excel/export-history'
import ImportHistory from '@/components/ImportFile/import-history'
import Import from '@/components/ImportFile/import'
import Detail from './detail';
import Auth from '@/components/auth';
import EditAddress from './edit-address'

const { confirm } = Modal;


const TableList = () => {
  const [data, setData] = useState([])
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState(0)
  const [pageSize, setPageSize] = useState(10)
  const [pageTotal, setPageTotal] = useState(0)
  const [orderType, setOrderType] = useState('')
  const [loading, setLoading] = useState(false)
  const [deliveryVisible, setDeliveryVisible] = useState(false)
  const [form] = Form.useForm()
  const location = useLocation();
  const [visit, setVisit] = useState(false)
  const [importVisit, setImportVisit] = useState(false)
  const isPurchase = location.pathname.includes('purchase')
  const [detailVisible, setDetailVisible] = useState(false);
  const [selectItem, setSelectItem] = useState({});
  const [orderStatusType,setOrderStatusType]=useState()
  const [subOrderId, setSubOrderId] = useState(null)
  const [addressVisible, setAddressVisible] = useState(false)

  const pageChange = (a, b) => {
    setPage(a)
    setPageSize(b)
  }

  const orderTypeChange = (e) => {
    setOrderStatusType([])
    setOrderType(e.target.value)
    setPage(1)
  }

  const refund = (orderId) => {
    confirm({
      title: '?????????????????????C??????????????????????????????????????????????????????',
      icon: <ExclamationCircleOutlined />,
      onOk() {
        refundAllRetailOrders({
          orderId
        }, { showSuccess: true })
          .then(res => {
            if (res.code === 0) {
              setSearch(search + 1)
            }
          })
      },
    });
  }

  const getFieldValue = () => {
    const { time,statusArr, ...rest } = form.getFieldsValue();

    return {
      status: orderType,
      startTime: time?.[0]?.format('YYYY-MM-DD HH:mm:ss'),
      endTime: time?.[1]?.format('YYYY-MM-DD HH:mm:ss'),
      memberId: location?.query?.memberId,
      wsId: location?.query?.wsId,
      operatorSource: 2,
      statusArr:orderType!==''?[]:statusArr,
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
    const apiMethod = isPurchase ? getPurchaseOrderList : orderList;
    apiMethod({
      page,
      size: pageSize,
      ...getFieldValue()
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
        onFinish={() => {
          setPage(1)
          setSearch(search + 1)
        }}
        layout="inline"
        submitter={{
          render: ({ form }, doms) => {
            return (
              <div style={{ marginBottom: 20}}>
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
                    type={`${isPurchase ? 'purchase-order-intensive-export' : 'order-intensive-export'}`}
                    conditions={getFieldValue}
                  />
                  <ExportHistory show={visit} setShow={setVisit} type={`${isPurchase ? 'purchase-order-intensive-export' : 'order-intensive-export'}`} />
                  {
                    isPurchase
                    &&
                    <>
                      <Import
                        change={(e) => { setImportVisit(e) }}
                        code="order_intensive_send_goods_import"
                        conditions={getFieldValue}
                      />
                      <ImportHistory show={importVisit} setShow={setImportVisit} type="order_intensive_send_goods_import" />
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
          name="orderId"
          fieldProps={{
            style: {
              marginBottom: 20,
            }
          }}
        />
        <ProFormText
          label="????????????"
          name="goodsName"
          fieldProps={{
            style: {
              marginBottom: 20
            }
          }}
        />
        <ProFormText
          name="nickName"
          label="????????????"
          fieldProps={{
            style: {
              marginBottom: 20
            }
          }}
        />
        <ProFormText
          label="???????????????"
          name="phoneNumber"
          fieldProps={{
            style: {
              marginBottom: 20
            }
          }}
        />
        <ProFormText
          label="??????ID"
          name="memberId"
          fieldProps={{
            style: {
              marginBottom: 20
            }
          }}
        />
        {isPurchase && <ProFormSelect
          label="????????????"
          name="supplierType"
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
        <ProFormSelect
          label="????????????"
          name="isMerge"
          options={[
            {
              value: 1,
              label: '????????????'
            },
            {
              value: 0,
              label: '????????????'
            }
          ]}
          fieldProps={{
            style: {
              marginBottom: 20,
              width: 180,
            }
          }}
        />
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
        {
          !isPurchase&&<ProFormSelect
          label="????????????"
          name="activityCode"
          options={[
            {
              value: '',
              label: '?????????'
            },
            {
              value: 'wsCentActiveCode',
              label: '?????????????????????'
            },
            {
              value: 'wsDiscountActiveCode',
              label: '??????????????????'
            },
          ]}
          fieldProps={{
            style: {
              marginBottom: 20,
              width: 180,
            }
          }}
        />
        }
        
        <ProFormText
          name="receiptUser"
          label="?????????"
          fieldProps={{
            style: {
              marginBottom: 20
            }
          }}
        />
        <ProFormText
          name="expressNo"
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
              name="statusArr"
              label="????????????"
              fieldProps={{
                onChange:(val)=>{
                  setOrderType('')
                  setOrderStatusType(val)
                },
                value:orderStatusType
              }}
              options={[
                {
                  label: '????????????',
                  value: 2
                },
                {
                  label: '?????????',
                  value: 3
                },
                {
                  label: '?????????',
                  value: 5
                },
              ]}
            />
          </>
        }
        <ProFormSelect
          label="????????????"
          name="businessType"
          options={[
            {
              value: 1,
              label: '?????????'
            },
            {
              value: 2,
              label: '????????????'
            },
            {
              value: 3,
              label: '????????????'
            }
          ]}
          fieldProps={{
            style: {
              marginBottom: 20,
              width: 180,
            }
          }}
        />
        <ProFormText
          name="wsId"
          label="????????????ID"
          fieldProps={{
            style: {
              marginBottom: 20
            }
          }}
        />
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
            value: ''
          },
          {
            label: '?????????',
            value: 0
          },
          {
            label: '????????????',
            value: 1
          },
          {
            label: '????????????',
            value: 2
          },
          {
            label: '?????????',
            value: 3
          },
          {
            label: '?????????',
            value: 5
          },
          {
            label: '?????????',
            value: 6
          },
        ]}
      />
      <Spin
        spinning={loading}
      >
        <div className={styles.list_header_wrap}>
          <div className={styles.list_header}>
            <div>????????????</div>
            <div>??????</div>
            <div>??????</div>
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
                <Tag style={{ borderRadius: 2, position: 'absolute', marginLeft: 10, marginTop: 10 }} color="#f59a23">{item.wholesaleFlowType === 1 ? '????????????' : '??????????????????'}</Tag>
                <Tag style={{ borderRadius: 2, position: 'absolute', marginLeft: item.wholesaleFlowType === 1 ? 80 : 110, marginTop: 10 }} color='#58B138'>{item?.businessType !== 1 ? (item?.businessType === 2 ? '????????????' : '????????????'): '?????????'}</Tag>
                {
                  item.isRefund&&<Tag style={{ borderRadius: 2, position: 'absolute', marginLeft: 185, marginTop: 10 }} color="#7FA1FD">{item.isRefund}</Tag>
                }
                {
                  isPurchase
                    ?
                    <div className={styles.store_name}>?????????????????????{item.supplier.companyName}???ID:{item.supplierId} ??????????????????{item.supplierOrderNums}??????{(item.isAgent === 1 && isPurchase) && <Tag style={{ borderRadius: 10, marginLeft: 10 }} color="#f59a23">?????????</Tag>}</div>
                    :
                    <div className={styles.store_name}>????????????ID???{item.supplier.supplierId}</div>
                }
                <div className={styles.second}>
                  <Space size="large">
                    <span>???????????????{moment(item.createTime * 1000).format('YYYY-MM-DD HH:mm:ss')}</span>
                    <span>????????????{item.orderId}</span>
                    <span>???????????????{item.store.linkman}</span>
                    <span>??????????????????{item.store.phone}</span>
                    <span>????????????ID???{item.storeNo}</span>
                    <span>????????????????????????ID???{item.wsId}</span>
                  </Space>
                </div>

                <div className={styles.body}>
                  <div className={styles.goods_info}>
                    <div>
                      <img width="100" height="100" src={item.sku.skuImageUrl} />
                      <div className={styles.info}>
                        <div>{item.sku.goodsName}</div>
                        <div>????????????{amountTransform(item.sku.price, '/')}???{item?.sku?.wholesaleFreight > 0 ? `????????????????????${amountTransform(item?.sku?.wholesaleFreight, '/')}/??????` : ''}<time style={{ marginLeft: 20 }}>?????????{item.sku.skuName}</time></div>
                        <div>????????? <span>{item.sku.totalNum}{item.sku.unit}</span></div>
                        <div>????????? <span>{amountTransform(item.sku.totalAmount, '/')}</span>???</div>
                        {isPurchase && <div>?????????????????? ??{amountTransform(item.sku.wholesaleSupplyPrice, '/')}</div>}
                      </div>
                    </div>
                  </div>
                  <div>
                    <Descriptions column={1} labelStyle={{ width: 100, justifyContent: 'flex-end' }}>
                      <Descriptions.Item label="????????????">{amountTransform(item.advance.amount, '/')}???</Descriptions.Item>
                      <Descriptions.Item label="??????">-{amountTransform(item.advance.couponAmount, '/')}???</Descriptions.Item>
                      <Descriptions.Item label="????????????">{amountTransform(item.advance.actualAmount, '/')}???</Descriptions.Item>
                    </Descriptions>
                  </div>
                  <div>
                    {item.final &&
                      <Descriptions column={1} labelStyle={{ width: 100, justifyContent: 'flex-end' }}>
                        <Descriptions.Item label="????????????">{amountTransform(item.final.amount, '/')}??????????????????</Descriptions.Item>
                        {/* <Descriptions.Item label="??????">+{amountTransform(item.final.shippingAmount, '/')}???</Descriptions.Item> */}
                        <Descriptions.Item label="????????????">{amountTransform(item.final.actualAmount, '/')}???</Descriptions.Item>
                      </Descriptions>}
                  </div>
                  <div style={{ textAlign: 'center' }}>{amountTransform(item.actualAmount, '/')}???</div>
                  <div style={{ textAlign: 'center' }}>
                    {item.statusDesc}
                    {item.refundAllRetailStatus === 1 && <div style={{ color: 'red' }}>?????????C?????????</div>}
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    {item.isRefundable === 1 && <div><a onClick={() => { refund(item.orderId) }}>??????C?????????</a></div>}
                    {/* <a onClick={() => { history.push(`/order-management/intensive-order/supplier-order-detail${isPurchase ? '-purchase' : ''}/${item.orderId}`) }}>??????</a> */}
                    <a onClick={() => { setSelectItem(item); setDetailVisible(true); }}>??????</a>
                    <div><a target="_blank" href={`/order-management/intensive-order/shopkeeper-order?objectId=${item.orderId}`}>??????????????????</a></div>
                    {orderType === 2 && <Auth name="wholesale/storeOrder/refundOrder">
                      <Popconfirm
                        title="?????????????"
                        onConfirm={() => {
                          refundOrder({
                            orderId: item.orderId
                          }, { showSuccess: true })
                            .then(res => {
                              if (res.code === 0) {
                                setSearch(search + 1)
                              }
                            })
                        }}
                      >
                        <a>??????</a>
                      </Popconfirm>
                    </Auth>}
                  </div>
                </div>

                <div className={styles.footer}>
                  <Space size="large">
                    <span>????????????{item.receivingInfo.receiptUser}</span>
                    <span>?????????{item.receivingInfo.receiptPhone}</span>
                    <span>?????????{item.receivingInfo.receiptAddress}</span>
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
        detailVisible &&
        <Detail
          id={selectItem?.orderId}
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
