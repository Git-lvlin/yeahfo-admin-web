import React, { useRef, useState } from 'react';
import { message, Space } from 'antd';
import ProTable from '@ant-design/pro-table';
import ProForm, { ModalForm, ProFormSelect } from '@ant-design/pro-form';
import { couponAddList, couponAdd } from '@/services/cms/member/member';

export default (props) => {
  const { setVisible, setFlag, visible } = props;
  const [arr, setArr] = useState(null)
  const formRef = useRef();
  const columns = [
    {
      title: '优惠券名称',
      dataIndex: 'couponName',
      valueType: 'text',
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
  ];

  const waitTime = (values) => {
    let couponInfo = []
    const len = arr.length
    for (let i = 0; i < len; i++) {
      couponInfo.push({
        couponId: arr[i],
        sort: 100
      })
    }
    const param = {
      couponSpaceId: values.couponSpaceId,
      couponInfo
    }
    return new Promise((resolve, reject) => {
      couponAdd(param).then((res) => {
        if (res.code === 0) {
          setFlag(true)
          resolve(true)
        } else {
          reject(false)
        }
      })

    });
  };

  return (
    <ModalForm
      key="form"
      width={1100}
      title={`新增`}
      onVisibleChange={setVisible}
      formRef={formRef}
      visible={visible}
      submitter={{
        searchConfig: {
          submitText: '确认添加',
          resetText: '取消',
        },
      }}
      drawerprops={{
        forceRender: true,
        destroyOnClose: true,
      }}
      onFinish={async (values) => {
        await waitTime(values);
        message.success('提交成功');
        // 不返回不会关闭弹框
        return true;
      }}
    >
      <ProForm.Group
        style={{
          paddingLeft: 24
        }}>
        <ProFormSelect

          name="couponSpaceId"
          label="位置"
          valueEnum={{
            1: '首页新人专享',
            2: '领劵中心限时领劵',
          }}
          placeholder="选择位置"
          rules={[{ required: true, message: '请选择位置!' }]}
        />
      </ProForm.Group>
      <ProTable
        rowKey="id"
        options={false}
        columns={columns}
        postData={(data) => {
          data.forEach(item => {
            item.freeAmount = item.freeAmount / 100
            if (item.freeAmount === 0) {
              item.freeAmount = ''
            }
            if (item.freeDiscount === 0) {
              item.freeDiscount = ''
            }
          })
          return data
        }}
        params={{
          couponStatus: 2,
          couponVerifyStatus: 4,
          issueType: 1,
        }}
        request={couponAddList}
        rowSelection={{
          onChange: (selectedRowKeys) => {
            setArr(selectedRowKeys)
          }
        }}
        tableAlertRender={({ selectedRowKeys, selectedRows, onCleanSelected }) => (
          <Space size={24}>
            <span>
              已选 {selectedRowKeys.length} 项
              <a style={{ marginLeft: 8 }} onClick={onCleanSelected}>
                取消选择
              </a>
            </span>
          </Space>
        )}
        // tableAlertOptionRender={(a) => {
        //   console.log('a', a)
        //   if (!arr) {
        //     setArr(a.selectedRowKeys)
        //   }
        // }}
        search={{
          labelWidth: 'auto',
        }}
        pagination={{
          pageSize: 10,
        }}
      />
    </ModalForm>
  );
};