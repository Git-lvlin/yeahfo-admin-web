import React, { useRef, useState, useEffect  } from 'react';
import { message } from 'antd';
import ProTable from '@ant-design/pro-table';
import { ModalForm } from '@ant-design/pro-form';
import { priceListAdd } from '@/services/cms/member/member';
import { goodsAllList } from '@/services/cms/member/member';
import GcCascader from '@/components/gc-cascader'

export default (props) => {
  const { setVisible, setFlag, visible } = props;
  const [arr, setArr] = useState(null)
  const columns = [
    {
      title: 'skuid',
      dataIndex: 'skuId',
      valueType: 'text',
      width: 60,
    },
    {
      title: '商品名称',
      dataIndex: 'goodsName',
      valueType: 'text',
      search: false,
      width: 130,
      ellipsis: true,
    },
    // {
    //   title: '商家名称',
    //   dataIndex: 'supplierName',
    //   valueType: 'text',
    //   search: false,
    //   width: 90,
    //   ellipsis: true,
    // },
    {
      title: '商品分类',
      dataIndex: 'gcId',
      renderFormItem: () => (<GcCascader />),
      hideInTable: true,
    },
    {
      title: '结算类型',
      dataIndex: 'settleType',
      valueType: 'text',
      search: false,
      valueEnum: {
        1: '佣金模式',
        2: '底价模式',
      }
    },
    {
      title: '秒约价',
      dataIndex: 'salePrice',
      valueType: 'money',
      search: false,
    },
    {
      title: '市场价',
      dataIndex: 'marketPrice',
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
      dataIndex: 'saleNum',
      valueType: 'number',
      search: false,
    },
  ];

  const waitTime = () => {
    const param = {
      ids: arr.toString(),
    }
    return new Promise((resolve, reject) => {
      priceListAdd(param).then((res) => {
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
      title={'新建'}
      onVisibleChange={setVisible}
      visible={visible}
      submitter={{
        searchConfig: {
          submitText: '添加商品',
          resetText: '取消',
        },
      }}
      drawerProps={{
        forceRender: true,
        destroyOnClose: true,
      }}
      onFinish={async (values) => {
        await waitTime(values);
        message.success('提交成功');
        // 不返回不会关闭弹框
        return true;
      }}
      style={{
        overflow: 'hidden'
      }}
    >
<ProTable
      style={{
        height: 600,
        overflowY: "auto"
      }}
      rowKey="skuId"
      options={false}
      columns={columns}
      postData={(data) => {
        data.forEach(item => {
          item.salePrice = item.salePrice/100
          item.marketPrice = item.marketPrice/100
        })
        return data
      }}
      params={{goodsState: 1}}
      request={goodsAllList}
      rowSelection={{
        // 自定义选择项参考: https://ant.design/components/table-cn/#components-table-demo-row-selection-custom
        // 注释该行则默认不显示下拉选项
        // selections: [Table.SELECTION_ALL, Table.SELECTION_INVERT],
      }}
      tableAlertOptionRender={(a) => {
        setArr(a.selectedRowKeys.toString())
      }}
      search={{
        labelWidth: 'auto',
      }}
      pagination={{
        pageSize: 10,
      }}
      dateFormatter="string"
      headerTitle="添加比价商品"
    />
    </ModalForm>
  );
};