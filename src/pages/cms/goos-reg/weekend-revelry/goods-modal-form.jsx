import React, { useRef, useState, useEffect  } from 'react';
import { message, Space } from 'antd';
import ProTable from '@ant-design/pro-table';
import { ModalForm } from '@ant-design/pro-form';
import {  todayAllGoodsList } from '@/services/cms/member/member';
import { cmsWeekGoodsSub } from '@/services/cms/member/weekend-revelry';


export default (props) => {
  const { detailData, setVisible, visible, setFlag, verifyVersionId } = props;
  const [arr, setArr] = useState(null)
  const formRef = useRef();

  const waitTime = () => {
    const spuids = arr.map(item=>item.spuId)
    const { id, channel } = detailData
    const param = {
      cmsWeekId: id,
      spuIds: spuids.toString(),
    }
    if (channel) {
      param.goodsType = channel
    }
    if (verifyVersionId) {
      param.verifyVersionId = verifyVersionId
    }
    return new Promise((resolve, reject) => {
      cmsWeekGoodsSub(param).then((res) => {
        if (res.code === 0) {
          setFlag(true)
          resolve(true);
        } else {
          reject(false)
        }
      })
    });
  };

  const columns = [
    {
      title: 'SPUID',
      dataIndex: 'spuId',
      valueType: 'text',
    },
    {
      title: '图片',
      dataIndex: 'goodsImageUrl',
      render: (text) => <img src={text} width={50} height={50} />,
      search: false,
    },
    {
      title: '商品名称',
      dataIndex: 'goodsName',
      valueType: 'text',
      width: 180,
      ellipsis: true,
    },
    {
      title: '商家名称',
      dataIndex: 'supplierName',
      valueType: 'text',
      search: false,
      width: 120,
      ellipsis: true,
    },
    {
      title: '供货类型',
      dataIndex: 'goodsSaleTypeDisplay',
      valueType: 'text',
      search: false,
    },
    {
      title: '销售价',
      dataIndex: 'goodsSalePrice',
      valueType: 'money',
      search: false,
    },
    {
      title: '可用库存',
      dataIndex: 'stockNum',
      valueType: 'number',
      search: false,
    },
    {
      title: '销量',
      dataIndex: 'goodsSaleNum',
      valueType: 'number',
      search: false,
    },
  ];

  return (
    <ModalForm
      key="adda"
      width={1300}
      title='添加'
      onVisibleChange={setVisible}
      formRef={formRef}
      visible={visible}
      submitter={{
        searchConfig: {
          submitText: '确认添加',
          resetText: '取消',
        },
      }}
      onFinish={async (values, detailData) => {
        await waitTime(values, detailData);
        message.success('提交成功');
        // 不返回不会关闭弹框
        return true;
      }}
    >
<ProTable
      rowKey="id"
      options={false}
      columns={columns}
      postData={(data) => {
        data.forEach(item => {
          item.goodsSalePrice = item.goodsSalePrice/100
        })
        return data
      }}
      request={todayAllGoodsList}
      rowSelection={{
        preserveSelectedRowKeys: true,
        onChange: (_, val) => {
          setArr(val)
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
          {/* <span>{`待发布: ${selectedRows?.reduce(
            (pre, item) => pre + item.containers,
            0,
          )} 个`}</span>
          <span>{`已发布: ${selectedRows?.reduce(
            (pre, item) => pre + item.callNumber,
            0,
          )} 个`}</span> */}
        </Space>
      )}
      search={{
        labelWidth: 'auto',
      }}
      pagination={{
        pageSize: 10,
      }}
      dateFormatter="string"
    />
    </ModalForm>
  );
};