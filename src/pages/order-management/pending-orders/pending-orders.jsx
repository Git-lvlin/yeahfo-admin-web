import React, { useState } from 'react';
import { PageContainer } from '@/components/PageContainer';
import ProForm, { ProFormText, ProFormDateRangePicker, ProFormSelect } from '@ant-design/pro-form';
import { Button, Space, Radio, Descriptions, Pagination } from 'antd';
import styles from './style.less';

const TableList = () => {
  return (
    <PageContainer>
      <ProForm
        style={{ backgroundColor: '#fff', padding: 10, paddingBottom: '0px' }}
        layout="inline"
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
                    查询
                  </Button>
                  <Button
                    onClick={() => {
                      form?.resetFields();
                    }}
                  >
                    重置
                  </Button>
                  <Button onClick={() => { exportExcel(form) }}>导出</Button>
                </Space>
              </div>
            );
          },
        }}
      >
        <ProFormText
          width="md"
          label="订单号"
          fieldProps={{
            style: {
              marginBottom: 20
            }
          }}
        />
        <ProFormText
          width="md"
          label="商品名称"
          fieldProps={{
            style: {
              marginBottom: 20
            }
          }}
        />
        <ProFormText
          width="md"
          label="下单用户"
          fieldProps={{
            style: {
              marginBottom: 20
            }
          }}
        />
        <ProFormText
          width="md"
          label="下单手机号"
          fieldProps={{
            style: {
              marginBottom: 20
            }
          }}
        />
        <ProFormText
          width="md"
          label="所属商家"
          fieldProps={{
            style: {
              marginBottom: 20
            }
          }}
        />
        <ProFormSelect
          width="md"
          label="尾款类型"
          options={[
            {
              value: 1,
              label: '拼约尾款订单'
            },
            {
              value: 2,
              label: '直接尾款订单'
            }
          ]}
        />
        <ProFormDateRangePicker
          width="md"
          label="下单时间"
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
      <div className={styles.list_header_wrap}>
        <div className={styles.list_header}>
          <div>商品信息</div>
          <div>定金</div>
          <div>尾款</div>
          <div>合计实收</div>
          <div>订单状态</div>
          <div>操作</div>
        </div>
      </div>
      <div className={styles.list}>
        <div className={styles.store_name}>所属商家：A店主</div>
        <div className={styles.second}>
          <Space size="large">
            <span>下单时间：2020-12-18 15:05:16</span>
            <span>订单号：20201218150516546531</span>
            <span>下单用户：LUCAS</span>
            <span>用户手机号：18588292706</span>
          </Space>
        </div>

        <div className={styles.body}>
          <div className={styles.goods_info}>
            <div>
              <img width="100" height="100" />
              <div className={styles.info}>
                <div>爱卤爱鲜鸭脖香辣味三盒</div>
                <div>集约价：5.00元    规格：黑色  S码</div>
                <div>数量： <span>1件</span></div>
                <div>小计： <span>49.00</span>元</div>
              </div>
            </div>
            <div>
              <img width="100" height="100" />
              <div className={styles.info}>
                <div>爱卤爱鲜鸭脖香辣味三盒</div>
                <div>集约价：5.00元    规格：黑色  S码</div>
                <div>数量： <span>1件</span></div>
                <div>小计： <span>49.00</span>元</div>
              </div>
            </div>
          </div>
          <div>
            <Descriptions column={1} labelStyle={{ width: 100, justifyContent: 'flex-end' }}>
              <Descriptions.Item label="应付金额">100.00元</Descriptions.Item>
              <Descriptions.Item label="运费">+20.00元</Descriptions.Item>
              <Descriptions.Item label="用户实付">120.00元</Descriptions.Item>
            </Descriptions>
          </div>
          <div>
            <Descriptions column={1} labelStyle={{ width: 100, justifyContent: 'flex-end' }}>
              <Descriptions.Item label="应付金额">100.00元</Descriptions.Item>
              <Descriptions.Item label="运费">+20.00元</Descriptions.Item>
              <Descriptions.Item label="用户实付">120.00元</Descriptions.Item>
            </Descriptions>
          </div>
          <div>128.00元</div>
          <div>待付款</div>
          <div><a>详情</a></div>
        </div>

        <div className={styles.footer}>
          <Space size="large">
            <span>收货人：111</span>
            <span>电话：15019218770</span>
            <span>地址：西藏自治区拉萨市城关区就扣了我默默</span>
          </Space>
        </div>
      </div>
      <div
        className={styles.pagination}
      >
        <Pagination
          total={85}
          showTotal={(total, range) => `第 ${range[0]}-${range[1]} 条/总共 ${total} 条`}
          defaultPageSize={20}
          defaultCurrent={1}
        />
      </div>
    </PageContainer>
  );
};

export default TableList;
