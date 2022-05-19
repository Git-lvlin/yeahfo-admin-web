import React, { useState, useRef } from 'react';
import { Space } from 'antd';
import ProTable from '@ant-design/pro-table';
import { PageContainer } from '@/components/PageContainer';
import { ruleGoodsList } from '@/services/single-contract-activity-management/activity-product';
import { useParams, history } from 'umi';
import { dateFormat, amountTransform } from '@/utils/utils';


const TableList = () => {
  const [info, setInfo] = useState({});
  const params = useParams();
  const columns = [
    {
      title: 'skuID',
      dataIndex: 'skuId',
      valueType: 'text',
      fieldProps: {
        placeholder: '请输入skuID'
      }
    },
    {
      title: '商品名称',
      dataIndex: 'goodsName',
      valueType: 'text',
      fieldProps: {
        placeholder: '请输入商品名称'
      },
    },
    // {
    //   title: '图片',
    //   dataIndex: 'skuImageUrl',
    //   valueType: 'text',
    //   render: (_) => <img src={_} width="50" height="50" />,
    //   hideInSearch: true,
    // },
    {
      title: '规格',
      dataIndex: 'skuName',
      valueType: 'text',
      hideInSearch: true,
    },
    {
      title: '商家ID',
      dataIndex: 'supplierId',
      valueType: 'text',
      hideInSearch: true,
    },
    {
      title: '秒约价',
      dataIndex: 'salePrice',
      valueType: 'text',
      hideInSearch: true,
      render: (_) => amountTransform(_, '/')
    },
    {
      title: '团约价',
      dataIndex: 'activityPrice',
      valueType: 'text',
      hideInSearch: true,
      render: (_) => amountTransform(_, '/')
    },
    {
      title: '团约库存',
      dataIndex: 'activityStockNum',
      valueType: 'text',
      hideInSearch: true,
    },
    {
      title: '默认开团人数',
      dataIndex: 'defaultGroupNum',
      valueType: 'text',
      hideInSearch: true,
    },
    {
      title: '开团数量',
      dataIndex: 'skuGroupNum',
      valueType: 'text',
      hideInSearch: true,
      render: (_, data) => {
        return _ > 0
          ?
          <a
            onClick={() => {
              history.push({
                pathname: `/group-contract-activity-management/group-detail/${data.ruleId}`,
                query: {
                  ...info,
                  skuId: data.skuId,
                  goodsName: data.goodsName,
                }
              })
            }}>
            {_}
          </a>
          :
          0
      }
    },
  ];

  return (
    <PageContainer>
      <div style={{ marginBottom: 10, background: '#fff', padding: 10 }}>
        <Space size="large">
          <span>{info.activityName}</span>
          <span>{info.activityStartTime}~{info.activityEndTime}</span>
          <span>团约{info.groupNum}人团</span>
          <span>{{
            1: '待开始',
            2: '进行中',
            3: '已结束',
            4: '已中止'
          }[info.activityStatus]}</span>
        </Space>
      </div>
      <ProTable
        rowKey="skuId"
        options={false}
        params={{
          id: params.id
        }}
        postData={(data) => {
          setInfo({
            activityName: data.activityName,
            activityStartTime: dateFormat(data.activityStartTime * 1000),
            activityEndTime: dateFormat(data.activityEndTime * 1000),
            groupNum: data.groupNum,
            activityStatus: data.activityStatus,
          });
          return data.goodsList.records;
        }}
        request={ruleGoodsList}
        search={{
          defaultCollapsed: true,
          labelWidth: 100,
          optionRender: (searchConfig, formProps, dom) => [
            ...dom.reverse(),
          ],
        }}
        columns={columns}
        pagination={{
          pageSize: 10,
        }}
      />
    </PageContainer>

  );
};

export default TableList;
