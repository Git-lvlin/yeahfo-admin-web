
import React, { useRef, useState, useEffect } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import { Button, message } from 'antd';
import ProTable from '@ant-design/pro-table';
import { PageContainer } from '@/components/PageContainer';
import Edit from './form';
import { couponList, couponDel, couponCmsSortTop } from '@/services/cms/member/member';

const Coupon = () => {
  const actionRef = useRef();
  const [formVisible, setFormVisible] = useState(false);
  const [flag, setFlag] = useState(false);

  const top = (data) => {
    couponCmsSortTop({id: data}).then((res) => {
      if (res.code === 0) {
        message.success(`置顶成功`);
        actionRef.current.reset();
      }
    })
  }

  const formControl = (ids, record) => {
    couponDel({ids: ids}).then((res) => {
      if (res.code === 0) {
        message.success(`删除成功`);
        actionRef.current.reset();
      }
    })
  }

  useEffect(() => {
    if (flag) {
      actionRef.current.reset();
      setFlag(false)
    }
  }, [flag])

  const columns = [
    {
      title: '位置',
      dataIndex: 'couponSpaceDisplay',
      valueType: 'text',
      search: false,
    },
    {
      title: '优惠券名称',
      dataIndex: 'couponName',
    },
    {
      title: '面额',
      dataIndex: 'freeAmount',
      valueType: 'text',
      hideInTable: true,
    },
    {
      title: '面额',
      dataIndex: 'freeAmount',
      valueType: 'money',
      search: false,
    },
    {
      title: '折扣',
      dataIndex: 'freeDiscount',
      valueType: 'text',
    },
    {
      title: '开始领取时间',
      key: 'start',
      dataIndex: 'addTime',
      valueType: 'dateRange',
      hideInTable: true,
      search: {
        transform: (value) => {
          return {
            lqStartTime1: value[0],
            lqStartTime2: value[1],
          };
        },
      },
    },
    {
      title: '截止领取时间',
      key: 'end',
      dataIndex: 'addTime',
      valueType: 'dateRange',
      hideInTable: true,
      search: {
        transform: (value) => {
          return {
            lqEndTime1: value[0],
            lqEndTime2: value[1],
          };
        },
      },
    },
    {
      title: '开始领取时间',
      dataIndex: 'limitStartTime',
      valueType: 'text',
      search: false,
    },
    {
      title: '截止领取时间',
      dataIndex: 'limitEndTime',
      valueType: 'text',
      search: false,
    },
    {
      title: '排序序号',
      dataIndex: 'sort',
      search: false
    },
    {
      title: '状态',
      dataIndex: 'couponStatus',
      hideInTable: true,
      valueEnum: {
        1: '未开始',
        2: '进行中',
        3: '已结束',
        4: '已终止',
      }
    },
    {
      title: '状态',
      dataIndex: 'couponStatus',
      search: false,
      valueEnum: {
        1: '未开始',
        2: '进行中',
        3: '已结束',
        4: '已终止',
      }
    },
    {
      title: '操作',
      valueType: 'option',
      dataIndex: 'option',
      render: (text, record, _) => {
        return (
          <>
            {record.couponStatus===2&&<Button size="small" key="top" onClick={() => {top(record.id)}}>置顶</Button>}
            {/* {<Button size="small" key="editable" onClick={() => {getDetail(record)}}>编辑</Button>} */}
            {record.couponStatus!==2&&<Button size="small" key="d" onClick={() => {formControl(record.id,record)}}>删除</Button>}
          </>
        )
      }
    },
  ];

  return (
    <PageContainer>
    <ProTable
      rowKey="id"
      columns={columns}
      actionRef={actionRef}
      scroll={{ x: 'max-content', scrollToFirstRowOnChange: true, }}
      postData={(data) => {
        data.forEach(item => {
          item.freeAmount = item.freeAmount/100
          if (item.freeAmount === 0) {
            item.freeAmount = ''
          }
          if (item.freeDiscount === 0) {
            item.freeDiscount = ''
          }
          
        })
        return data
      }}
      request={couponList}
      search={{
        labelWidth: 'auto',
      }}
      pagination={{
        pageSize: 10,
      }}
      dateFormatter="string"
      toolBarRender={(_,record) => [
        <Button key="button" icon={<PlusOutlined />} type="primary" onClick={() => { setFormVisible(true); }}>
          新增
        </Button>,
      ]}
    />
    {formVisible && <Edit
      visible={formVisible}
      setVisible={setFormVisible}
      setFlag={setFlag}
    />}
    </PageContainer>
  );
};


export default Coupon