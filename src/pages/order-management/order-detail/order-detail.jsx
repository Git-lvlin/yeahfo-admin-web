import React from 'react'
import { PageContainer } from '@/components/PageContainer';
import { Steps, Descriptions, Table } from 'antd';
import styles from './style.less';

const { Step } = Steps;

const columns = [
  {
    dataIndex: 'a',
    render: (text, row, index) => {
      if (index === 0) {
        return {
          children: text,
          props: {
            colSpan: 3,
          },
        };
      }

      if ((index - 1) % 5 === 0) {
        return {
          children: text,
          props: {
            rowSpan: 5,
          },
        };
      }

      if (index % 6) {
        return {
          children: text,
          props: {
            rowSpan: 0,
          },
        };
      }

      return text;

    },
  },
  {
    dataIndex: 'b',
    render: (text, row, index) => {
      if (index === 0) {
        return {
          props: {
            rowSpan: 0
          }
        }
      }

      return text;
    }
  },
  {
    dataIndex: 'c',
    render: (text, row, index) => {
      if (index === 0) {
        return {
          props: {
            rowSpan: 0
          }
        }
      }

      return text;
    }
  }
];

const data = [
  {
    key: '1',
    a: '商品信息'
  },
  {
    key: '2',
    a: '商品1',
    b: '商品名称',
    c: '爱卤爱鲜鸭脖香辣味三盒'
  },
  {
    key: '3',
    a: '商品1',
    b: '规格',
    c: '黑色  S码'
  },
  {
    key: '4',
    a: '商品1',
    b: '集约价',
    c: '49.00元'
  },
  {
    key: '5',
    a: '商品1',
    b: '购买数量',
    c: '1件'
  },
  {
    key: '6',
    a: '商品1',
    b: '小计',
    c: '49.00元'
  },

  {
    key: '7',
    a: '商品2',
    b: '商品名称',
    c: '爱卤爱鲜鸭脖香辣味三盒'
  },
  {
    key: '8',
    a: '商品2',
    b: '规格',
    c: '黑色  S码'
  },
  {
    key: '9',
    a: '商品2',
    b: '集约价',
    c: '49.00元'
  },
  {
    key: '10',
    a: '商品2',
    b: '购买数量',
    c: '1件'
  },
  {
    key: '11',
    a: '商品2',
    b: '小计',
    c: '49.00元'
  },
];

const OrderDetail = props => {
  return (
    <PageContainer style={{ backgroundColor: '#fff', height: '100%' }}>
      <div className={styles.order_detail}>
        <Steps progressDot current={1}>
          <Step title="订单提交" description={<><div style={{ whiteSpace: 'nowrap' }}>LUCAS（13800138000）</div><div>2020-12-18 15:05:16</div></>} />
          <Step title="订单支付" />
          <Step title="订单发货" />
          <Step title="订单收货" />
          <Step title="订单完成" />
        </Steps>
        <div>
          <Table
            columns={columns}
            dataSource={data}
            bordered
            pagination={false}
            showHeader={false}
          />
        </div>
      </div>
    </PageContainer>
  )
}


export default OrderDetail
