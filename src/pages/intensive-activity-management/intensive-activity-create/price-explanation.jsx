import React, { useEffect, useState } from 'react';
import {
  ModalForm,
} from '@ant-design/pro-form';
import { Typography, Row, Col, Table } from 'antd';
import Big from 'big.js';

Big.RM = 0;

const { Title } = Typography;

const parseDot = (v) => {
  if (/\./.test(v)) {
    const arr = `${v}`.split('.');

    return `${arr[0]}.${arr[1].slice(0, 2)}`
  }
  return v;
}

const PriceExplanation = ({ skuData = {}, ladderData = [] }) => {
  const [dataSource, setDataSource] = useState([]);

  const columns = [
    {
      title: '阶梯最低量',
      dataIndex: 'a',
      key: 'a',
      align: 'center',
      render: (_, record) => {
        if (_ === '-0') {
          return '';
        }
        return <>
          <div>{record.wsStart}{skuData.unit}</div>
          {skuData.batchNumber > 1 && !!skuData.wsUnit && <div>({parseInt(record.wsStart / skuData.batchNumber, 10)}{skuData.wsUnit})</div>}
        </>
      }
    },
    {
      title: '阶梯供货价',
      dataIndex: 'b',
      key: 'b',
      align: 'center',
      render: (_, record) => {
        if (_ === '-0') {
          return '';
        }
        return <>
          <div>{record.wsSupplyPrice / 100}元/{skuData.unit}</div>
          {skuData.batchNumber > 1 && !!skuData.wsUnit && <div>({record.wsBatchSupplyPrice / 100}元/{skuData.wsUnit})</div>}
        </>
      }
    },
    {
      title: '集约订单金额(元)',
      dataIndex: 'c',
      key: 'c',
      align: 'center',
      render: (_) => {
        if (_ === '-0') {
          return '= 集约价 X 阶梯最低量';
        }
        return parseDot(_);
      }
    },
    {
      title: '固定供货价订单金额(元)',
      dataIndex: 'd',
      key: 'd',
      align: 'center',
      render: (_) => {
        if (_ === '-0') {
          return '= 固定集采供货价 X 阶梯最低量';
        }
        return parseDot(_);
      }
    },
    {
      title: '阶梯供货价订单金额(元)',
      dataIndex: 'e',
      key: 'e',
      align: 'center',
      render: (_) => {
        if (_ === '-0') {
          return '= 阶梯供货价 X 阶梯最低量';
        }
        return parseDot(_);
      }
    },
    {
      title: '固定供货价订单盈亏金额(元)',
      dataIndex: 'f',
      key: 'f',
      align: 'center',
      render: (_) => {
        if (_ === '-0') {
          return (
            <>
              <div>=  集约价 X 阶梯最低量</div>
              <div>—</div>
              <div>固定集采供货价 X 阶梯最低量</div>
            </>
          )
        }
        return parseDot(_);
      }
    },
    {
      title: '阶梯供货价订单盈亏金额(元)',
      dataIndex: 'g',
      key: 'g',
      align: 'center',
      render: (_) => {
        if (_ === '-0') {
          return (
            <>
              <div>=  集约价 X 阶梯最低量</div>
              <div>—</div>
              <div>阶梯供货价 X 阶梯最低量</div>
            </>
          )
        }
        return parseDot(_);
      }
    },
    {
      title: '阶梯比固定订单多盈利金额(元)',
      dataIndex: 'h',
      key: 'h',
      align: 'center',
      render: (_) => {
        if (_ === '-0') {
          return (
            <>
              <div>= （固定供货价 - 阶梯供货价）</div>
              <div>X</div>
              <div>阶梯最低量</div>
            </>
          )
        }
        return parseDot(_);
      }
    },
    {
      title: `阶梯盈亏金额(元) / ${skuData.unit}`,
      dataIndex: 'i',
      key: 'i',
      align: 'center',
      render: (_) => {
        if (_ === '-0') {
          return (
            <>
              <div>= 集约价 - 阶梯供货价</div>
            </>
          )
        }
        return parseDot(_);
      }
    },
    {
      title: `阶梯比固定多盈利金额(元) / ${skuData.unit}`,
      dataIndex: 'j',
      key: 'j',
      align: 'center',
      render: (_) => {
        if (_ === '-0') {
          return (
            <>
              <div>= 固定供货价 - 阶梯供货价</div>
            </>
          )
        }
        return parseDot(_);
      }
    },
  ]

  useEffect(() => {
    const arr = [1, ...ladderData];
    setDataSource(arr.map(item => {
      if (item === 1) {
        return {
          a: '-0',
          b: '-0',
          c: '-0',
          d: '-0',
          e: '-0',
          f: '-0',
          g: '-0',
          h: '-0',
          i: '-0',
          j: '-0',
        }
      }
      return {
        ...item,
        c: +new Big(item.wsStart).times(skuData.price).toFixed(2),
        d: +new Big(item.wsStart).times(skuData.wholesaleSupplyPrice).toFixed(2),
        e: +new Big(item.wsStart).times(item.wsSupplyPrice / 100).toFixed(2),
        f: +new Big(item.wsStart).times(skuData.price).minus(+new Big(item.wsStart).times(skuData.wholesaleSupplyPrice)).toFixed(2),
        g: +new Big(item.wsStart).times(skuData.price).minus(+new Big(item.wsStart).times(item.wsSupplyPrice / 100)).toFixed(2),
        h: +new Big(skuData.wholesaleSupplyPrice).minus(item.wsSupplyPrice / 100).times(item.wsStart).toFixed(2),
        i: +new Big(skuData.price).minus(item.wsSupplyPrice / 100).toFixed(2),
        j: +new Big(skuData.wholesaleSupplyPrice).minus(item.wsSupplyPrice / 100).toFixed(2),
      };
    }))

  }, [skuData, ladderData])

  return (
    <ModalForm
      title="阶梯订单金额信息说明"
      width={1200}
      trigger={
        <a>
          阶梯订单金额信息说明
        </a>
      }
      submitter={{
        searchConfig: {
          resetText: '关闭',
        },
        render: (props, defaultDoms) => {
          return [
            defaultDoms[0]
          ];
        },
      }}
    >
      <Title level={5}>现有单件盈利信息</Title>
      <Row gutter={100}>
        <Col>固定集采供货价：{skuData.wholesaleSupplyPrice} 元 / {skuData.unit}</Col>
        <Col>集约价：{skuData.price} 元 / {skuData.unit}</Col>
        <Col>盈利金额：{skuData.profit} 元 / {skuData.unit}</Col>
      </Row>
      <Title style={{ marginTop: 10 }} level={5}>阶梯供货优惠盈利信息</Title>
      <Table scroll={{ x: 'max-content' }} columns={columns} dataSource={dataSource} pagination={false} />
    </ModalForm>
  )
}

export default PriceExplanation;
