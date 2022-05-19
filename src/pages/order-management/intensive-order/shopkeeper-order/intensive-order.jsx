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
                    查询
                  </Button>
                  <Button
                    onClick={() => {
                      form?.resetFields();
                      form?.submit();
                    }}
                  >
                    重置
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
          label="订单号"
          name="subOrderSn"
          fieldProps={{
            style: {
              marginBottom: 20,
            }
          }}
        />
        <ProFormText
          label="商品名称"
          name="goodsName"
          fieldProps={{
            style: {
              marginBottom: 20
            }
          }}
        />
        <ProFormText
          name="nickName"
          label="下单用户"
          fieldProps={{
            style: {
              marginBottom: 20
            }
          }}
        />
        <ProFormText
          label="下单手机号"
          name="phoneNumber"
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
        <ProFormText
          name="storeName"
          label="所属商家"
          fieldProps={{
            style: {
              marginBottom: 20
            }
          }}
        />
        <ProFormText
          name="objectId"
          label="关联采购订单号"
          fieldProps={{
            style: {
              marginBottom: 20
            }
          }}
        />
        <ProFormSelect
          label="活动订单"
          name="activityCode"
          options={[
            {
              value: '',
              label: '请选择'
            },
            {
              value: 'wsCentActiveCode',
              label: '一分钱领菜活动'
            },
            {
              value: 'wsDiscountActiveCode',
              label: '特价生鲜活动'
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
          label="尾款类型"
          name="isMerge"
          options={[
            {
              value: 1,
              label: '拼约尾款'
            },
            {
              value: 0,
              label: '直接尾款'
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
        <ProFormSelect
          label="订单类别"
          name="subType"
          options={[
            {
              value: 0,
              label: '普适品'
            },
            {
              value: 1,
              label: '精装生鲜'
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
          label="集约活动ID"
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
            label: '全部订单',
            value: ''
          },
          {
            label: '待付款',
            value: 1
          },
          {
            label: '待发货',
            value: 2
          },
          {
            label: '待收货',
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
        ]}
      />
      <Spin
        spinning={loading}
      >
        <div className={styles.list_header_wrap}>
          <div className={styles.list_header}>
            <div>商品信息</div>
            <div>金额</div>
            {/* <div>商家实收</div> */}
            <div>订单状态</div>
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
               <Tag style={{ borderRadius: 2, position: 'absolute', marginLeft: 10, marginTop: 12 }} color='#58B138'>{item?.subType === 1 ? '精装生鲜' : '普适品'}</Tag>
                <div className={styles.store_name}>所属商家：{item.storeName}</div>
                <div className={styles.second}>
                  <Space size="large">
                    <span>下单时间：{moment(item.createTime).format('YYYY-MM-DD HH:mm:ss')}</span>
                    <span>订单号：{item.orderSn}</span>
                    <span>下单用户：{item.buyerName}</span>
                    <span>用户手机号：{item.buyerPhone}</span>
                    <span>商品归属集约活动ID：{item.orderItemList[0].wsId}</span>
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
                            <div>集约价：{amountTransform(it.skuSalePrice, '/')}元{!!it.wholesaleFreight && `（含平均运费¥${amountTransform(it.wholesaleFreight, '/')}/${it.unit}）`}<time style={{ marginLeft: 20 }}>规格：{it.skuName}</time></div>
                            <div>数量： <span>{it.skuNum}{it.unit}</span></div>
                            <div>小计： <span>{amountTransform(it.totalAmount, '/')}</span>元</div>
                          </div>
                        </div>
                      ))
                    }
                  </div>
                  <div>
                    <Descriptions column={1} labelStyle={{ width: 100, justifyContent: 'flex-end' }}>
                      <Descriptions.Item label="商品总金额">{amountTransform(item.totalAmount, '/')}元（含运费）</Descriptions.Item>
                      {/* <Descriptions.Item label="运费">+{amountTransform(item.sumOrder?.shippingFeeAmount, '/')}元</Descriptions.Item> */}
                      <Descriptions.Item label="红包">-{amountTransform(item.sumOrder?.couponAmount, '/')}元</Descriptions.Item>
                      <Descriptions.Item label="用户实付">{amountTransform(item.payAmount, '/')}元</Descriptions.Item>
                    </Descriptions>
                  </div>
                  {/* <div style={{ textAlign: 'center' }}>{amountTransform(item.actualAmount, '/')}元</div> */}
                  <div style={{ textAlign: 'center' }}>{{ 1: '待付款', 2: '待发货', 3: '已发货', 4: '已完成', 5: '已关闭', 6: '无效订单', 7: '待分享' }[item.status]}</div>
                  <div style={{ textAlign: 'center' }}>
                    {/* <a onClick={() => { history.push(`/order-management/intensive-order/shopkeeper-order-detail/${item.id}`) }}>详情</a> */}
                    <a onClick={() => { setSelectItem(item); setDetailVisible(true); }}>详情</a>
                  </div>
                </div>

                <div className={styles.footer}>
                  <Space size="large">
                    <span>收货人：{item.sumOrder?.consignee}</span>
                    <span>电话：{item.sumOrder?.phone}</span>
                    <span>地址：{item.sumOrder?.address}</span>
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
