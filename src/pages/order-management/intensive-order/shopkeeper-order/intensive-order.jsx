import React, { useState, useEffect } from 'react';
import { PageContainer } from '@/components/PageContainer';
import ProForm, { ProFormText, ProFormDateTimeRangePicker, ProFormSelect } from '@ant-design/pro-form';
import { Button, Space, Radio, Descriptions, Pagination, Spin, Empty, Form, Tag } from 'antd';
import { history, useLocation } from 'umi';
import moment from 'moment';
import styles from './style.less';
import { orderList } from '@/services/order-management/shopkeeper-order';
import { amountTransform } from '@/utils/utils'
import Export from '@/pages/export-excel/export'
import ExportHistory from '@/pages/export-excel/export-history'
import Detail from './detail';

const TableList = () => {
  const [data, setData] = useState([])
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState(0)
  const [pageSize, setPageSize] = useState(10)
  const [pageTotal, setPageTotal] = useState(0)
  const [orderType, setOrderType] = useState('')
  const [loading, setLoading] = useState(false)
  const [form] = Form.useForm()
  const [visit, setVisit] = useState(false)
  const [detailVisible, setDetailVisible] = useState(false);
  const [selectItem, setSelectItem] = useState({});
  const location = useLocation();

  const pageChange = (a, b) => {
    setPage(a)
    setPageSize(b)
  }

  const orderTypeChange = (e) => {
    setOrderType(e.target.value)
    setPage(1)
  }

  const getFieldValue = () => {
    const { time, ...rest } = form.getFieldsValue();

    return {
      status: orderType,
      orderType: 15,
      startTime: time?.[0]?.format('YYYY-MM-DD HH:mm:ss'),
      endTime: time?.[1]?.format('YYYY-MM-DD HH:mm:ss'),
      ...rest,
    }
  }

  const getConditions = () => {
    const { endTime, nickName, phoneNumber, startTime, subOrderSn, ...rest } = getFieldValue();

    const obj = {
      endCreateTime: endTime,
      buyerNickname: nickName,
      phone: phoneNumber,
      startCreateTime: startTime,
      orderSn: subOrderSn,
      orderStatus: rest.status,
      ...rest
    }
    return obj;
  }

  useEffect(() => {
    form.setFieldsValue({
      ...location?.query,
    })
  }, [])

  useEffect(() => {
    setLoading(true);

    const { time, ...rest } = form.getFieldsValue();
    orderList({
      page,
      size: pageSize,
      status: orderType,
      startTime: time?.[0]?.format('YYYY-MM-DD HH:mm:ss'),
      endTime: time?.[1]?.format('YYYY-MM-DD HH:mm:ss'),
      ...rest,
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
              <div style={{marginBottom: 20}}>
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
                    }}
                  >
                    ??????
                  </Button>
                  <Export
                    change={(e) => { setVisit(e) }}
                    type={`intensive-retail-user-order-export`}
                    conditions={getConditions}
                  />
                  <ExportHistory show={visit} setShow={setVisit} type={`intensive-retail-user-order-export`} />
                </Space>
              </div>
            );
          },
        }}
      >
        <ProFormText
          label="?????????"
          name="subOrderSn"
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
          name="buyerId"
          fieldProps={{
            style: {
              marginBottom: 20
            }
          }}
        />
        <ProFormText
          name="storeName"
          label="????????????"
          fieldProps={{
            style: {
              marginBottom: 20
            }
          }}
        />
        <ProFormText
          name="objectId"
          label="?????????????????????"
          fieldProps={{
            style: {
              marginBottom: 20
            }
          }}
        />
        <ProFormSelect
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
        {/* <ProFormSelect
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
        /> */}
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
        <ProFormSelect
          label="????????????"
          name="subType"
          options={[
            {
              value: 0,
              label: '?????????'
            },
            {
              value: 1,
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
        ]}
      />
      <Spin
        spinning={loading}
      >
        <div className={styles.list_header_wrap}>
          <div className={styles.list_header}>
            <div>????????????</div>
            <div>??????</div>
            {/* <div>????????????</div> */}
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
               <Tag style={{ borderRadius: 2, position: 'absolute', marginLeft: 10, marginTop: 12 }} color='#58B138'>{item?.subType === 1 ? '????????????' : '?????????'}</Tag>
                <div className={styles.store_name}>???????????????{item.storeName}</div>
                <div className={styles.second}>
                  <Space size="large">
                    <span>???????????????{moment(item.createTime).format('YYYY-MM-DD HH:mm:ss')}</span>
                    <span>????????????{item.orderSn}</span>
                    <span>???????????????{item.buyerName}</span>
                    <span>??????????????????{item.buyerPhone}</span>
                    <span>????????????????????????ID???{item.orderItemList[0].wsId}</span>
                  </Space>
                </div>

                <div className={styles.body}>
                  <div className={styles.goods_info}>
                    {
                      item.orderItemList.map(it => (
                        <div key={it.id}>
                          <img width="100" height="100" src={it.skuImageUrl} />
                          <div className={styles.info}>
                            <div>{it.goodsName}</div>
                            <div>????????????{amountTransform(it.skuSalePrice, '/')}???{!!it.wholesaleFreight && `????????????????????${amountTransform(it.wholesaleFreight, '/')}/${it.unit}???`}<time style={{ marginLeft: 20 }}>?????????{it.skuName}</time></div>
                            <div>????????? <span>{it.skuNum}{it.unit}</span></div>
                            <div>????????? <span>{amountTransform(it.totalAmount, '/')}</span>???</div>
                          </div>
                        </div>
                      ))
                    }
                  </div>
                  <div>
                    <Descriptions column={1} labelStyle={{ width: 100, justifyContent: 'flex-end' }}>
                      <Descriptions.Item label="???????????????">{amountTransform(item.totalAmount, '/')}??????????????????</Descriptions.Item>
                      {/* <Descriptions.Item label="??????">+{amountTransform(item.sumOrder?.shippingFeeAmount, '/')}???</Descriptions.Item> */}
                      <Descriptions.Item label="??????">-{amountTransform(item.sumOrder?.couponAmount, '/')}???</Descriptions.Item>
                      <Descriptions.Item label="????????????">{amountTransform(item.payAmount, '/')}???</Descriptions.Item>
                    </Descriptions>
                  </div>
                  {/* <div style={{ textAlign: 'center' }}>{amountTransform(item.actualAmount, '/')}???</div> */}
                  <div style={{ textAlign: 'center' }}>{{ 1: '?????????', 2: '?????????', 3: '?????????', 4: '?????????', 5: '?????????', 6: '????????????', 7: '?????????' }[item.status]}</div>
                  <div style={{ textAlign: 'center' }}>
                    {/* <a onClick={() => { history.push(`/order-management/intensive-order/shopkeeper-order-detail/${item.id}`) }}>??????</a> */}
                    <a onClick={() => { setSelectItem(item); setDetailVisible(true); }}>??????</a>
                  </div>
                </div>

                <div className={styles.footer}>
                  <Space size="large">
                    <span>????????????{item.sumOrder?.consignee}</span>
                    <span>?????????{item.sumOrder?.phone}</span>
                    <span>?????????{item.sumOrder?.address}</span>
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
